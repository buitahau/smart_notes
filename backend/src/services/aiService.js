import IntentEnum from '../enums/IntentEnum.js';
import AdapterFactory from '../ai/adapters/adapterFactory.js';
import { queryTaskList as queryTaskListFunction } from '../ai/services/query/queryTaskList.js';
import { queryDateLookup as queryDateLookupFunction } from '../ai/services/query/queryDateLookup.js';
import { insertNote as insertNoteFunction } from '../ai/services/insert.js';
import { updateNote as updateNoteFunction } from '../ai/services/update.js';
import { deleteNote as deleteNoteFunction } from '../ai/services/delete.js';

// Simple rule-based classifier as fallback
const classifyQuerySimple = query => {
  const lowerQuery = query.toLowerCase();

  // Date lookup patterns
  const datePatterns = [
    /when did/i,
    /when will/i,
    /when was/i,
    /when is/i,
    /when.*last/i,
    /when.*next/i,
    /what.*date/i,
    /what.*time/i,
    /what day/i,
  ];

  // Task list patterns
  const taskPatterns = [
    /show.*task/i,
    /list.*task/i,
    /get.*task/i,
    /what.*task/i,
    /find.*task/i,
    /search.*task/i,
    /my.*task/i,
    /all.*task/i,
  ];

  // Check date patterns first
  for (const pattern of datePatterns) {
    if (pattern.test(lowerQuery)) {
      return { intent: IntentEnum.DATE_LOOKUP };
    }
  }

  // Check task patterns
  for (const pattern of taskPatterns) {
    if (pattern.test(lowerQuery)) {
      return { intent: IntentEnum.TASK_LIST };
    }
  }

  // Default to task list
  return { intent: IntentEnum.TASK_LIST };
};

// Create context for Node.js environment
const createContext = (userId, query, noteId, content, dateAt) => {
  return {
    env: {
      AI: {
        run: async (model, input) => {
          // Placeholder for embedding generation
          // In a real implementation, you would use an embedding service
          throw new Error(
            'AI embedding service not configured for Node.js environment'
          );
        },
      },
      CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN,
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_EMBEDDING_MODEL: process.env.OPENAI_EMBEDDING_MODEL,
    },
    req: {
      json: async () =>
        noteId ? { noteId, content, userId, dateAt } : { userId, query },
    },
    json: data => data,
  };
};

class AIService {
  constructor() {
    // Initialize adapter factory if needed
    try {
      AdapterFactory.initialize();
    } catch (error) {
      console.warn('AdapterFactory initialization failed:', error.message);
    }
  }

  async classifyQuery(query) {
    try {
      // Try to use the AI adapter first
      const queryAdapter = AdapterFactory.getQueryAdapter();
      const result = await queryAdapter.classifyQuery(query);
      console.log('AI classification result:', result);
      return result;
    } catch (error) {
      console.warn(
        'AI classification failed, using simple classifier:',
        error.message
      );
      // Fallback to simple rule-based classification
      return classifyQuerySimple(query);
    }
  }

  async queryTaskList(userId, query) {
    try {
      const context = createContext(userId, query);

      // Call the actual queryTaskList function from queryTaskList.js
      const result = await queryTaskListFunction(context);

      // Extract note IDs from the result
      if (result && result.json) {
        const noteIds = await result.json();
        return noteIds;
      }

      return [];
    } catch (error) {
      console.error('Error in queryTaskList:', error);
      // Fallback to empty array if vector search fails
      console.warn('Vector search failed, returning empty array');
      return [];
    }
  }

  async queryDateLookup(userId, query) {
    try {
      console.log('AIService.queryDateLookup: ' + userId + '/' + query);

      const context = createContext(userId, query);

      // Call the actual queryDateLookup function from queryDateLookup.js
      const result = await queryDateLookupFunction(context);

      // Extract note IDs from the result
      if (result && result.json) {
        const noteIds = await result.json();
        return noteIds;
      }

      return [];
    } catch (error) {
      console.error('Error in queryDateLookup:', error);
      // Fallback to empty array if vector search fails
      console.warn('Vector search failed, returning empty array');
      return [];
    }
  }

  async insertNote(noteId, content, userId, dateAt) {
    try {
      console.log('AIService.insertNote: ' + noteId + '/' + userId);

      const context = createContext(userId, null, noteId, content, dateAt);

      // Call the actual insertNote function from insert.js
      const result = await insertNoteFunction(context);

      // Extract the result from the response
      if (result && result.json) {
        const insertResult = await result.json();
        return insertResult;
      }

      return { success: true, noteId };
    } catch (error) {
      console.error('Error inserting note:', error);
      // Fallback to mock success if vector insertion fails
      console.warn('Vector insertion failed, returning mock success');
      return { success: true, noteId };
    }
  }

  async updateNote(noteId, updateData) {
    try {
      const { userId, content, dateAt } = updateData || {};

      if (!noteId || !userId) {
        throw new Error('noteId and userId are required to update note');
      }

      const hasContentUpdate =
        typeof content === 'string' && content.trim().length > 0;
      const hasDateUpdate = Boolean(dateAt);

      if (!hasContentUpdate && !hasDateUpdate) {
        // Nothing meaningful to sync with the vector index
        return { success: true, noteId, skipped: true };
      }

      const context = createContext(
        userId,
        null,
        noteId,
        hasContentUpdate ? content : '',
        hasDateUpdate ? dateAt : null
      );

      const result = await updateNoteFunction(context);

      if (result && result.json) {
        const updateResult = await result.json();
        return updateResult;
      }

      return { success: true, noteId };
    } catch (error) {
      console.error('Error updating note:', error);
      console.warn('Vector update failed, returning mock success');
      return { success: true, noteId };
    }
  }

  async deleteNote(noteId) {
    try {
      if (!noteId) {
        throw new Error('noteId is required to delete note');
      }

      const context = createContext(null, null, noteId);
      const result = await deleteNoteFunction(context);

      if (result && result.json) {
        const deleteResult = await result.json();
        return deleteResult;
      }

      return { success: true, noteId };
    } catch (error) {
      console.error('Error deleting note:', error);
      console.warn('Vector delete failed, returning mock success');
      return { success: true, noteId };
    }
  }
}

export default new AIService();
