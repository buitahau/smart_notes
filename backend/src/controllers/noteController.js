const noteService = require('../services/noteService');

class NoteController {
  async createNote(req, res) {
    try {
      const { content } = req.body;
      const userId = req.user.id;

      if (!content || content.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Note content is required'
        });
      }

      const result = await noteService.createNote(userId, content.trim());

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.status(201).json({
        success: true,
        note: result.note
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getNotes(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const result = await noteService.getNotesByUserId(userId, limit, offset);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.error
        });
      }

      res.json({
        success: true,
        notes: result.notes,
        pagination: {
          limit,
          offset,
          count: result.notes.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getNoteById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await noteService.getNoteById(id, userId);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: 'Note not found'
        });
      }

      res.json({
        success: true,
        note: result.note
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async updateNote(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      if (!content || content.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Note content is required'
        });
      }

      const result = await noteService.updateNote(id, userId, content.trim());

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: 'Note not found or update failed'
        });
      }

      res.json({
        success: true,
        note: result.note
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async deleteNote(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await noteService.deleteNote(id, userId);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: 'Note not found or delete failed'
        });
      }

      res.json({
        success: true,
        message: 'Note deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new NoteController();