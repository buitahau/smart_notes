const aiService = require('./aiService');
const noteService = require('./noteService');
const IntentEnum = require('../enums/IntentEnum');
const { AIResponseFactory } = require('../models/AIResponse');

class QueryService {
  async query(userId, query) {
    try {
      // Get intent from AI service
      const intentResponse = await aiService.classifyQuery(query);
      const intent = intentResponse.intent || IntentEnum.UNKNOWN;

      // Route based on intent
      switch (intent) {
        case IntentEnum.TASK_LIST:
          return await this.queryTaskList(userId, query);
        case IntentEnum.DATE_LOOKUP:
          return await this.queryDateLookup(userId, query);
        default:
          // Default to task list for unknown intents
          return await this.queryTaskList(userId, query);
      }
    } catch (error) {
      console.error('Error in query service:', error);
      throw error; // Re-throw to be handled by the controller
    }
  }

  async queryDateLookup(userId, query) {
    try {
      // Get date from AI service
      const dateInfo = await aiService.queryDateLookup(userId, query);
      return AIResponseFactory.create(IntentEnum.DATE_LOOKUP, dateInfo);
    } catch (error) {
      console.error('Error in date lookup:', error);
      return AIResponseFactory.createError(IntentEnum.DATE_LOOKUP, error.message);
    }
  }

  async queryTaskList(userId, query) {
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
        return AIResponseFactory.createError(IntentEnum.TASK_LIST, error || 'Failed to fetch notes');
      }

      return AIResponseFactory.create(IntentEnum.TASK_LIST, notes || []);
    } catch (error) {
      console.error('Error in task list query:', error);
      return AIResponseFactory.createError(IntentEnum.TASK_LIST, error.message);
    }
  }
}

module.exports = new QueryService();
