const noteService = require('../services/noteService');

class NoteController {
  async createNote(req, res) {
    try {
      const { content, date } = req.body;
      // Extract userId from authenticated user (set by authenticateToken middleware)
      const userId = req.user?.id;

      // Enhanced validation
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required',
        });
      }

      if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Note content is required and must be a non-empty string',
        });
      }

      // Enhanced content validation
      const trimmedContent = content.trim();
      if (trimmedContent.length > 10000) {
        return res.status(400).json({
          success: false,
          message: 'Note content exceeds maximum length of 10,000 characters',
        });
      }

      // Enhanced date validation
      let dateAt = null;
      if (date) {
        if (typeof date !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Date must be a valid ISO string',
          });
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            success: false,
            message:
              'Invalid date format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
          });
        }

        // Prevent future dates beyond reasonable limit (1 year)
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        if (parsedDate > oneYearFromNow) {
          return res.status(400).json({
            success: false,
            message: 'Date cannot be more than one year in the future',
          });
        }

        dateAt = parsedDate;
      }

      const result = await noteService.createNote(
        userId,
        trimmedContent,
        dateAt
      );

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error || 'Failed to create note',
        });
      }

      res.status(201).json({
        success: true,
        message: 'Note created successfully',
        note: result.note,
      });
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while creating note',
      });
    }
  }

  async getNotes(req, res) {
    try {
      // Extract userId from authenticated user (set by authenticateToken middleware)
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required',
        });
      }

      // Enhanced pagination validation
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 100);
      const offset = Math.max(parseInt(req.query.offset) || 0, 0);

      // Optional search and filter parameters
      const { search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

      const result = await noteService.getNotesByUserId(userId, limit, offset, {
        search: search?.trim(),
        sortBy,
        sortOrder,
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error || 'Failed to retrieve notes',
        });
      }

      res.json({
        success: true,
        notes: result.notes,
        pagination: {
          limit,
          offset,
          count: result.notes.length,
          hasMore: result.notes.length === limit,
        },
      });
    } catch (error) {
      console.error('Error retrieving notes:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving notes',
      });
    }
  }

  async getNoteById(req, res) {
    try {
      const { id } = req.params;
      // Extract userId from authenticated user (set by authenticateToken middleware)
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required',
        });
      }

      // Validate note ID
      if (!id || typeof id !== 'string' || id.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Valid note ID is required',
        });
      }

      const result = await noteService.getNoteById(id.trim(), userId);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error || 'Note not found or access denied',
        });
      }

      res.json({
        success: true,
        note: result.note,
      });
    } catch (error) {
      console.error('Error retrieving note by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving note',
      });
    }
  }

  async updateNote(req, res) {
    try {
      const { id } = req.params;
      const { content, date } = req.body;
      // Extract userId from authenticated user (set by authenticateToken middleware)
      const userId = req.user?.id;

      // Enhanced validation
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required',
        });
      }

      // Validate note ID
      if (!id || typeof id !== 'string' || id.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Valid note ID is required',
        });
      }

      if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Note content is required and must be a non-empty string',
        });
      }

      // Enhanced content validation
      const trimmedContent = content.trim();
      if (trimmedContent.length > 10000) {
        return res.status(400).json({
          success: false,
          message: 'Note content exceeds maximum length of 10,000 characters',
        });
      }

      // Enhanced date validation
      let dateAt = null;
      if (date) {
        if (typeof date !== 'string') {
          return res.status(400).json({
            success: false,
            message: 'Date must be a valid ISO string',
          });
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            success: false,
            message:
              'Invalid date format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
          });
        }

        // Prevent future dates beyond reasonable limit (1 year)
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        if (parsedDate > oneYearFromNow) {
          return res.status(400).json({
            success: false,
            message: 'Date cannot be more than one year in the future',
          });
        }

        dateAt = parsedDate;
      }

      const result = await noteService.updateNote(
        id.trim(),
        userId,
        trimmedContent,
        dateAt
      );

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error || 'Note not found or update failed',
        });
      }

      res.json({
        success: true,
        message: 'Note updated successfully',
        note: result.note,
      });
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating note',
      });
    }
  }

  async deleteNote(req, res) {
    try {
      const { id } = req.params;
      // Extract userId from authenticated user (set by authenticateToken middleware)
      const userId = req.user?.id;

      // Enhanced validation
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required',
        });
      }

      // Validate note ID
      if (!id || typeof id !== 'string' || id.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Valid note ID is required',
        });
      }

      const result = await noteService.deleteNote(id.trim(), userId);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: result.error || 'Note not found or delete failed',
        });
      }

      res.json({
        success: true,
        message: 'Note deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting note',
      });
    }
  }
}

module.exports = new NoteController();
