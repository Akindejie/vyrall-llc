/**
 * API response types
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ImageUploadResponse {
  url: string;
  filename: string;
  size: number;
}

export interface EventSaveResponse {
  eventId: string;
  status: 'draft' | 'live';
  message: string;
}


