import api from './api';
import type { AIRequest, AIResponse } from '../types';

/**
 * AI service for asking study-related questions
 */
class AIService {
  /**
   * Ask a question to the AI assistant
   */
  async askQuestion(request: AIRequest): Promise<AIResponse> {
    const response = await api.post<AIResponse>('/ai/ask', request);
    return response.data;
  }
}

export default new AIService();