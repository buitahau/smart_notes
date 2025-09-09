import apiClient from './api-client';
import { API_ENDPOINTS } from '@utils/constants';
import { ApiResponse, Note } from './note-service';

class QueryService {
  async sendQuery(query: string): Promise<{notes: Note[]}> {
 
      const response = await apiClient.post<ApiResponse<Note>>(API_ENDPOINTS.QUERY.BASE, { query });
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to excute query');
      }
      return {notes: response.data.notes || []};
  }
}

export const queryService = new QueryService();