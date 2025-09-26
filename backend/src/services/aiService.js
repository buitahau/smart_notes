import axios from 'axios';

const AI_BASE_URL = process.env.AI_BASE_URL || 'http://localhost:8787';

class AIService {
  constructor() {
    this.baseURL = AI_BASE_URL;
  }

  async _makeRequest(endpoint, data) {
    try {
      const response = await axios.post(`${this.baseURL}${endpoint}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error calling ${endpoint}:`, error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw new Error(`Failed to call ${endpoint}: ${error.message}`);
    }
  }

  async insertNote(noteId, content, userId, dateAt) {
    return this._makeRequest('/note/insert', {
      noteId,
      content,
      userId,
      dateAt,
    });
  }

  async classifyQuery(query) {
    return this._makeRequest('/query/classify', { query });
  }

  async queryTaskList(userId, query) {
    return this._makeRequest('/query/task_list', {
      query,
      userId,
    });
  }

  async queryDateLookup(userId, query) {
    return this._makeRequest('/query/date_lookup', {
      query,
      userId,
    });
  }
}

export default new AIService();
