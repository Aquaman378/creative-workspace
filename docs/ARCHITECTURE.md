# Architecture Overview 🏗️

System design and architecture for Creative Workspace.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native Mobile App                   │
│         (iOS & Android - Single codebase)                    │
├─────────────────────────────────────────────────────────────┤
│                      Redux Store                              │
│              (State Management & Caching)                     │
├─────────────────────────────────────────────────────────────┤
│                    API Client Layer                           │
│         (HTTP Requests to Backend & Firebase)                │
└────────────────┬──────────────────────────┬──────────────────┘
                 │                          │
                 ▼                          ▼
        ┌─────────────────┐      ┌──────────────────────┐
        │  Node.js        │      │  Firebase            │
        │  Backend        │      │  ├── Firestore      │
        │  ├── Auth       │      │  ├── Storage        │
        │  ├── Projects   │      │  ├── Auth           │
        │  ├── Clients    │      │  └── Realtime DB    │
        │  ├── Assets     │      │                     │
        │  ├── Invoices   │      │  (Microservices)    │
        │  └── Payments   │      └──────────────────────┘
        └────────┬────────┘
                 │
        ┌────────┴──────────────────────┐
        ▼                               ▼
    ┌──────────────────┐        ┌─────────────────┐
    │   Stripe API     │        │  Firebase Admin │
    │  (Payments)      │        │  SDK (Backend)  │
    └──────────────────┘        └─────────────────┘
        │                             │
        ├─────────────────────────────┤
        │ Apple Pay & Google Pay      │
        │ (Native Integration)        │
        └─────────────────────────────┘
```

## Data Flow Architecture

### User Journey: Client Approval → Invoice → Payment

```
1. Creator uploads assets
   └─> Stored in Firebase Storage
   └─> Metadata saved to Firestore

2. Creator creates proofing link
   └─> Backend generates unique token
   └─> Link sent to client via email

3. Client views and approves
   └─> Feedback stored in Firestore
   └─> Status updated to "approved"

4. Invoice triggered automatically
   └─> Backend creates invoice
   └─> Payment link sent to client

5. Client pays
   └─> Stripe processes payment
   └─> Webhook confirms
   └─> Invoice marked as paid
   └─> Creator notified
```

## Technology Stack Details

### Frontend (React Native)

**Structure:**
```
mobile/src/
├── screens/
│   ├── ProofingScreen.js      # Client proofing portal
│   ├── InvoicingScreen.js     # Invoice management
│   ├── AssetsScreen.js        # Asset hub
│   ├── ProjectsScreen.js      # Project list
│   └── AuthScreen.js          # Login/Registration
├── components/
│   ├── ProofingGallery.js     # Image gallery with feedback
│   ├── InvoiceCard.js         # Invoice display
│   ├── AssetUploader.js       # File upload
│   └── PaymentButton.js       # Apple/Google Pay buttons
├── services/
│   ├── firebaseService.js     # Firebase operations
│   ├── apiService.js          # API calls
│   ├── paymentService.js      # Payment integration
│   └── authService.js         # Authentication
├── redux/
│   ├── store.js
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── projectSlice.js
│   │   ├── assetSlice.js
│   │   └── invoiceSlice.js
│   └── actions/
├── navigation/
│   ├── RootNavigator.js       # Main navigation stack
│   └── TabNavigator.js        # Bottom tab navigation
└── utils/
    ├── constants.js
    ├── validators.js
    └── formatters.js
```

**Key Libraries:**
- `react-native` - Core framework
- `@react-navigation/native` - Navigation
- `redux` & `react-redux` - State management
- `firebase` - Backend services
- `@stripe/react-native` - Payment processing
- `react-native-image-picker` - File uploads

### Backend (Node.js + Express)

**Structure:**
```
backend/src/
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── projects.js           # Project management
│   ├── clients.js            # Client management
│   ├── assets.js             # Asset management
│   ├── proofing.js           # Proofing portal
│   ├── invoices.js           # Invoice management
│   ├── payments.js           # Payment processing
│   └── links.js              # Link management
├── controllers/
│   ├── authController.js
│   ├── projectController.js
│   ├── assetController.js
│   ├── invoiceController.js
│   └── paymentController.js
├── services/
│   ├── firebaseService.js    # Firebase Admin SDK
│   ├── stripeService.js      # Stripe integration
│   ├── emailService.js       # Transactional emails
│   ├── storageService.js     # File upload/download
│   └── invoiceService.js     # Invoice generation
├── middleware/
│   ├── auth.js               # JWT verification
│   ├── errorHandler.js       # Error handling
│   ├── validation.js         # Request validation
│   └── cors.js               # CORS configuration
├── models/
│   └── firebaseModels.js     # Firestore schema
├── utils/
│   ├── logger.js
│   ├── helpers.js
│   ├── validators.js
│   └── constants.js
├── webhooks/
│   └── stripeWebhook.js      # Stripe event handlers
└── server.js                 # Express app setup
```

**Key Libraries:**
- `express` - Web framework
- `firebase-admin` - Firebase backend
- `stripe` - Payment processing
- `jsonwebtoken` - JWT auth
- `multer` - File uploads
- `dotenv` - Environment variables
- `cors` - CORS handling
- `express-validator` - Request validation

### Database (Firestore)

**Collections Schema:**

```
┌─ users/
│  ├─ {userId}
│  │  ├─ email: string
│  │  ├─ name: string
│  │  ├─ avatar: string
│  │  ├─ tier: string (free/pro)
│  │  ├─ stripeCustomerId: string
│  │  ├─ createdAt: timestamp
│  │  └─ updatedAt: timestamp
│
├─ projects/
│  ├─ {projectId}
│  │  ├─ userId: string (owner)
│  │  ├─ name: string
│  │  ├─ description: string
│  │  ├─ status: string (draft/active/archived)
│  │  ├─ createdAt: timestamp
│  │  └─ updatedAt: timestamp
│
├─ clients/
│  ├─ {clientId}
│  │  ├─ projectId: string
│  │  ├─ userId: string (creator)
│  │  ├─ email: string
│  │  ├─ name: string
│  │  ├─ stripeCustomerId: string
│  │  ├─ createdAt: timestamp
│  │  └─ contacts: [{ email, name, phone }]
│
├─ assets/
│  ├─ {assetId}
│  │  ├─ projectId: string
│  │  ├─ userId: string (uploader)
│  │  ├─ name: string
│  │  ├─ type: string (image/video/mockup)
│  │  ├─ url: string (Firebase Storage URL)
│  │  ├─ thumbnailUrl: string
│  │  ├─ size: number (bytes)
│  │  ├─ uploadedAt: timestamp
│  │  └─ metadata: { width, height, duration, ... }
│
├─ proofing_links/
│  ├─ {linkId}
│  │  ├─ projectId: string
│  │  ├─ userId: string (creator)
│  │  ├─ clientId: string
│  │  ├─ token: string (unique, indexable)
│  │  ├─ assetIds: [string]
│  │  ├─ status: string (pending/approved/rejected)
│  │  ├─ expiresAt: timestamp
│  │  ├─ createdAt: timestamp
│  │  └─ approvedAt: timestamp
│
├─ feedback/
│  ├─ {feedbackId}
│  │  ├─ proofingLinkId: string
│  │  ├─ assetId: string
│  │  ├─ clientId: string
│  │  ├─ type: string (comment/annotation/approval)
│  │  ├─ content: string
│  │  ├─ coordinates: { x, y } (for annotations)
│  │  ├─ createdAt: timestamp
│  │  └─ updatedAt: timestamp
│
├─ invoices/
│  ├─ {invoiceId}
│  │  ├─ projectId: string
│  │  ├─ userId: string (creator)
│  │  ├─ clientId: string
│  │  ├─ amount: number
│  │  ├─ currency: string (USD/EUR/etc)
│  │  ├─ status: string (draft/sent/viewed/paid/overdue)
│  │  ├─ stripeInvoiceId: string
│  │  ├─ description: string
│  │  ├─ items: [{ description, amount, quantity }]
│  │  ├─ dueDate: timestamp
│  │  ├─ sentAt: timestamp
│  │  ├─ paidAt: timestamp
│  │  ├─ createdAt: timestamp
│  │  └─ updatedAt: timestamp
│
├─ payments/
│  ├─ {paymentId}
│  │  ├─ invoiceId: string
│  │  ├─ userId: string (payer)
│  │  ├─ amount: number
│  │  ├─ currency: string
│  │  ├─ status: string (processing/succeeded/failed/refunded)
│  │  ├─ paymentMethod: string (card/apple_pay/google_pay)
│  │  ├─ stripePaymentIntentId: string
│  │  ├─ paidAt: timestamp
│  │  ├─ refundedAt: timestamp
│  │  ├─ metadata: { ... }
│  │  ├─ createdAt: timestamp
│  │  └─ updatedAt: timestamp
│
├─ links/
│  ├─ {linkId}
│  │  ├─ projectId: string
│  │  ├─ userId: string (creator)
│  │  ├─ title: string
│  │  ├─ originalUrl: string
│  │  ├─ shortCode: string
│  │  ├─ type: string (social_media/pop_up_store/deliverable)
│  │  ├─ clicks: number
│  │  ├─ createdAt: timestamp
│  │  └─ updatedAt: timestamp
│
└─ audit_logs/
   └─ {logId}
      ├─ userId: string
      ├─ action: string
      ├─ resource: string
      ├─ resourceId: string
      ├─ changes: object
      ├─ ipAddress: string
      ├─ userAgent: string
      ├─ timestamp: timestamp
      └─ metadata: { ... }
```

## Authentication Flow

```
1. User registers/logs in
   └─> Firebase Authentication (Email/Password)
   └─> Backend creates JWT token
   └─> Token stored in Redux (mobile) / Secure Storage
   └─> Mobile app authenticated for subsequent requests

2. JWT verification
   └─> Middleware checks Authorization header
   └─> Token decoded and validated
   └─> User ID extracted for Firestore queries
   └─> Request proceeds or rejected
```

## Payment Flow

```
1. Invoice Created
   └─> Stored in Firestore
   └─> Stripe invoice created via API
   └─> Status: "draft"

2. Invoice Sent
   └─> Email sent to client
   └─> Payment link generated
   └─> Status: "sent"

3. Client Initiates Payment
   └─> Mobile app creates Stripe PaymentIntent
   └─> Client enters payment details or uses Apple/Google Pay
   └─> paymentIntentId stored temporarily

4. Payment Processing
   └─> Stripe processes charge
   └─> Webhook received (payment_intent.succeeded)
   └─> Backend updates invoice status to "paid"
   └─> Firestore payment record created
   └─> Creator notified via email/push notification

5. Post-Payment
   └─> Invoice marked as "completed"
   └─> Project status can auto-advance
   └─> Analytics tracked
   └─> Audit log recorded
```

## Security Architecture

### Data Protection
- **Firebase Security Rules** - Firestore access control by user
- **JWT Tokens** - Stateless authentication
- **TLS/HTTPS** - All communication encrypted
- **Environment Variables** - Secrets never committed

### API Security
- **CORS** - Whitelist allowed origins
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Server-side validation
- **SQL Injection Prevention** - Firestore queries safe by default

### Payment Security
- **PCI Compliance** - Stripe handles payment data
- **Never store card data** - Use Stripe tokenization
- **Webhook verification** - Verify Stripe signatures

## Deployment Architecture

### Development
```
Local Machine
├─ Mobile App (Emulator/Simulator)
├─ Backend (localhost:3000)
└─ Firebase (Dev Project)
```

### Production
```
Cloud Environment
├─ Mobile App (App Store & Play Store)
├─ Backend (Cloud Run / Heroku / AWS)
├─ Firebase (Prod Project)
├─ CDN (Firebase Hosting for web)
└─ Monitoring (Firebase Crashlytics, Analytics)
```

## Performance Optimization

### Mobile App
- **Code Splitting** - Lazy load screens
- **Image Optimization** - WebP + thumbnails
- **Caching** - Redux persist for offline support
- **Pagination** - Load assets in batches

### Backend
- **Firestore Indexing** - Composite indexes for queries
- **Cloud Functions** - Serverless for heavy operations
- **Caching** - Redis for frequently accessed data
- **CDN** - Firebase Storage with CDN

## Monitoring & Analytics

### Logging
- **Firebase Crashlytics** - Mobile app crashes
- **Backend Logs** - Winston/Bunyan
- **Error Tracking** - Sentry integration

### Analytics
- **Firebase Analytics** - User behavior
- **Custom Events** - Business metrics
- **Performance Monitoring** - Load times, API latency

---

**Last Updated**: January 2024
