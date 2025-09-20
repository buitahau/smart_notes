const axios = require('axios');

class AIService {
  async queryTaskList(userId, query) {
    try {
      const response = await axios.post(
        'http://localhost:8787/query/task_list',
        {
          query,
          userId,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error querying task list:', error);
      throw new Error('Failed to query task list');
    }
  }
}

module.exports = new AIService();
