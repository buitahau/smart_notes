const aiService = require('./aiService');
const noteService = require('./noteService');

class QueryService {
  async query(userId, query) {
    try {
      // Get note IDs from AI service
      console.log('QueryService.query: ' + userId + '/' + query);
      const noteIds = await aiService.queryTaskList(userId, query);

      // Get notes by their IDs
      const { success, notes, error } = await noteService.getNotesByIds(
        noteIds,
        userId
      );

      if (!success) {
        throw new Error(error || 'Failed to fetch notes');
      }

      return notes || [];
    } catch (error) {
      console.error('Error in query service:', error);
      throw error; // Re-throw to be handled by the controller
    }
  }
}

module.exports = new QueryService();
