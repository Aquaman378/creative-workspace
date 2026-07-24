/**
 * Firebase Admin Service
 * Handles all Firebase operations
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    serviceAccount = require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
  }
} catch (error) {
  console.warn('Firebase service account file not found, using environment variables');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: serviceAccount 
      ? admin.credential.cert(serviceAccount)
      : admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();
const auth = admin.auth();
const bucket = admin.storage().bucket();

/**
 * User Service
 */
const userService = {
  // Create new user
  async createUser(email, password, userData) {
    try {
      // Create auth user
      const authUser = await auth.createUser({
        email,
        password,
        displayName: userData.fullName,
      });

      // Create user document in Firestore
      const userRef = db.collection('users').doc(authUser.uid);
      await userRef.set({
        id: authUser.uid,
        email,
        fullName: userData.fullName,
        avatar: null,
        tier: 'free',
        stripeCustomerId: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName,
      };
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  },

  // Get user by UID
  async getUserById(uid) {
    try {
      const doc = await db.collection('users').doc(uid).get();
      if (!doc.exists) {
        throw new Error('User not found');
      }
      return doc.data();
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  },

  // Update user
  async updateUser(uid, data) {
    try {
      const userRef = db.collection('users').doc(uid);
      await userRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return await this.getUserById(uid);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  },

  // Verify ID token
  async verifyIdToken(token) {
    try {
      const decodedToken = await auth.verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  },
};

/**
 * Project Service
 */
const projectService = {
  // Create project
  async createProject(userId, projectData) {
    try {
      const projectRef = db.collection('projects').doc();
      const project = {
        id: projectRef.id,
        userId,
        name: projectData.name,
        description: projectData.description || '',
        status: 'draft',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await projectRef.set(project);
      return project;
    } catch (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }
  },

  // Get user projects
  async getUserProjects(userId) {
    try {
      const snapshot = await db
        .collection('projects')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      throw new Error(`Failed to get projects: ${error.message}`);
    }
  },

  // Get project by ID
  async getProjectById(projectId) {
    try {
      const doc = await db.collection('projects').doc(projectId).get();
      if (!doc.exists) {
        throw new Error('Project not found');
      }
      return doc.data();
    } catch (error) {
      throw new Error(`Failed to get project: ${error.message}`);
    }
  },

  // Update project
  async updateProject(projectId, data) {
    try {
      const projectRef = db.collection('projects').doc(projectId);
      await projectRef.update({
        ...data,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return await this.getProjectById(projectId);
    } catch (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }
  },

  // Delete project
  async deleteProject(projectId) {
    try {
      await db.collection('projects').doc(projectId).delete();
    } catch (error) {
      throw new Error(`Failed to delete project: ${error.message}`);
    }
  },
};

/**
 * Asset Service
 */
const assetService = {
  // Upload asset to Firebase Storage
  async uploadAsset(projectId, file, assetData) {
    try {
      const timestamp = Date.now();
      const storagePath = `projects/${projectId}/assets/${timestamp}_${file.originalname}`;
      
      const fileUpload = bucket.file(storagePath);
      await fileUpload.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      // Generate signed URL
      const [publicUrl] = await fileUpload.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15 days
      });

      // Create asset document
      const assetRef = db.collection('assets').doc();
      const asset = {
        id: assetRef.id,
        projectId,
        userId: assetData.userId,
        name: assetData.name || file.originalname,
        type: assetData.type,
        url: publicUrl,
        storagePath,
        size: file.size,
        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await assetRef.set(asset);
      return asset;
    } catch (error) {
      throw new Error(`Failed to upload asset: ${error.message}`);
    }
  },

  // Get project assets
  async getProjectAssets(projectId) {
    try {
      const snapshot = await db
        .collection('assets')
        .where('projectId', '==', projectId)
        .orderBy('uploadedAt', 'desc')
        .get();
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      throw new Error(`Failed to get assets: ${error.message}`);
    }
  },

  // Delete asset
  async deleteAsset(assetId) {
    try {
      const doc = await db.collection('assets').doc(assetId).get();
      if (!doc.exists) {
        throw new Error('Asset not found');
      }
      const asset = doc.data();
      
      // Delete from storage
      await bucket.file(asset.storagePath).delete();
      
      // Delete document
      await db.collection('assets').doc(assetId).delete();
    } catch (error) {
      throw new Error(`Failed to delete asset: ${error.message}`);
    }
  },
};

/**
 * Client Service
 */
const clientService = {
  // Add client to project
  async addClient(projectId, clientData) {
    try {
      const clientRef = db.collection('clients').doc();
      const client = {
        id: clientRef.id,
        projectId,
        userId: clientData.userId,
        email: clientData.email,
        name: clientData.name,
        stripeCustomerId: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        contacts: [],
      };
      await clientRef.set(client);
      return client;
    } catch (error) {
      throw new Error(`Failed to add client: ${error.message}`);
    }
  },

  // Get project clients
  async getProjectClients(projectId) {
    try {
      const snapshot = await db
        .collection('clients')
        .where('projectId', '==', projectId)
        .get();
      return snapshot.docs.map(doc => doc.data());
    } catch (error) {
      throw new Error(`Failed to get clients: ${error.message}`);
    }
  },
};

/**
 * Proofing Service
 */
const proofingService = {
  // Create proofing link
  async createProofingLink(projectId, linkData) {
    try {
      const linkRef = db.collection('proofing_links').doc();
      const link = {
        id: linkRef.id,
        projectId,
        userId: linkData.userId,
        clientId: linkData.clientId,
        token: this._generateToken(),
        assetIds: linkData.assetIds,
        status: 'pending',
        expiresAt: admin.firestore.Timestamp.fromDate(
          new Date(Date.now() + (linkData.expiresIn || 7) * 24 * 60 * 60 * 1000)
        ),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        approvedAt: null,
      };
      await linkRef.set(link);
      return link;
    } catch (error) {
      throw new Error(`Failed to create proofing link: ${error.message}`);
    }
  },

  // Get proofing link by token
  async getProofingLinkByToken(token) {
    try {
      const snapshot = await db
        .collection('proofing_links')
        .where('token', '==', token)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        throw new Error('Proofing link not found');
      }
      return snapshot.docs[0].data();
    } catch (error) {
      throw new Error(`Failed to get proofing link: ${error.message}`);
    }
  },

  // Submit feedback
  async submitFeedback(proofingLinkId, feedbackData) {
    try {
      const feedbackRef = db.collection('feedback').doc();
      const feedback = {
        id: feedbackRef.id,
        proofingLinkId,
        assetId: feedbackData.assetId,
        clientId: feedbackData.clientId,
        type: feedbackData.type,
        content: feedbackData.content,
        coordinates: feedbackData.coordinates || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await feedbackRef.set(feedback);
      return feedback;
    } catch (error) {
      throw new Error(`Failed to submit feedback: ${error.message}`);
    }
  },

  // Approve proofing
  async approveProofing(proofingLinkId) {
    try {
      const linkRef = db.collection('proofing_links').doc(proofingLinkId);
      await linkRef.update({
        status: 'approved',
        approvedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return await linkRef.get().then(doc => doc.data());
    } catch (error) {
      throw new Error(`Failed to approve proofing: ${error.message}`);
    }
  },

  _generateToken() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  },
};

module.exports = {
  admin,
  db,
  auth,
  bucket,
  userService,
  projectService,
  assetService,
  clientService,
  proofingService,
};
