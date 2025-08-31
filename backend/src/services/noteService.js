const supabase = require('../config/supabase');
const Note = require('../models/Note');

class NoteService {
  async createNote(userId, content) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([
          {
            user_id: userId,
            content: content,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        note: Note.fromSupabaseRow(data)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getNotesByUserId(userId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw error;
      }

      const notes = data.map(row => Note.fromSupabaseRow(row));

      return {
        success: true,
        notes: notes
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getNoteById(noteId, userId) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        note: Note.fromSupabaseRow(data)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateNote(noteId, userId, content) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update({ content: content })
        .eq('id', noteId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        note: Note.fromSupabaseRow(data)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteNote(noteId, userId) {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new NoteService();