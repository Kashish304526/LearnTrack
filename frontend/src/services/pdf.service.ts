import api from './api';
import type { PDFSummaryResponse } from '../types';

/**
 * PDF service for summarizing PDF documents
 */
class PDFService {
  /**
   * Upload and summarize a PDF file
   */
  async summarizePDF(file: File): Promise<PDFSummaryResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<PDFSummaryResponse>('/pdf/summarize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export default new PDFService();