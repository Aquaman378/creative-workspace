/**
 * Links Routes
 * Short link management
 */

const express = require('express');
const router = express.Router();

const linkController = {
  create: async (req, res) => {
    try {
      const { projectId, url, type, title } = req.body;

      // TODO: Implement short link creation
      // 1. Generate short code
      // 2. Save to Firestore
      // 3. Return short URL

      res.status(201).json({
        success: true,
        link: {
          id: 'link_123',
          projectId,
          shortUrl: 'https://cw.app/l/abc123',
          originalUrl: url,
          type,
          title,
          clicks: 0,
          createdAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { message: error.message },
      });
    }
  },

  getAll: async (req, res) => {
    try {
      // TODO: Query all links for user
      res.json({
        success: true,
        links: [],
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { message: error.message },
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { linkId } = req.params;

      // TODO: Delete link
      res.json({
        success: true,
        message: 'Link deleted',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: { message: error.message },
      });
    }
  },
};

// Routes
router.post('/', linkController.create);
router.get('/', linkController.getAll);
router.delete('/:linkId', linkController.delete);

module.exports = router;
