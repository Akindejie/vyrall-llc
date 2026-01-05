/**
 * Mock API functions for event operations
 * 
 * To replace with real API:
 * 1. Update the BASE_URL constant
 * 2. Replace mock delays with actual fetch calls
 * 3. Add proper error handling
 * 4. Add authentication headers if needed
 */

import type { EventFormData } from '../types/event.types';
import type { ApiResponse, ImageUploadResponse, EventSaveResponse } from '../types/api.types';

// Configuration - change this when connecting to real backend
// const BASE_URL = '/api'; // Replace with your actual API URL
const MOCK_DELAY = 800; // Simulated network delay

/**
 * Helper function to simulate API delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Upload an image (flyer or background)
 * 
 * To replace with real API:
 * const formData = new FormData();
 * formData.append('image', file);
 * const response = await fetch(`${BASE_URL}/upload`, {
 *   method: 'POST',
 *   body: formData,
 * });
 */
export const uploadImage = async (file: File): Promise<ApiResponse<ImageUploadResponse>> => {
  await delay(MOCK_DELAY);

  try {
    // Mock implementation - convert to base64 for preview
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const url = reader.result as string;
        resolve({
          success: true,
          data: {
            url,
            filename: file.name,
            size: file.size,
          },
        });
      };
      
      reader.onerror = () => {
        reject({
          success: false,
          error: 'Failed to read file',
        });
      };
      
      reader.readAsDataURL(file);
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

/**
 * Save event as draft
 * 
 * To replace with real API:
 * const response = await fetch(`${BASE_URL}/events`, {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(eventData),
 * });
 */
export const saveEventDraft = async (
  eventData: EventFormData
): Promise<ApiResponse<EventSaveResponse>> => {
  await delay(MOCK_DELAY);

  try {
    // Mock implementation - store in localStorage
    const drafts = JSON.parse(localStorage.getItem('event_drafts') || '[]');
    const existingIndex = drafts.findIndex((d: EventFormData) => d.id === eventData.id);
    
    if (existingIndex >= 0) {
      drafts[existingIndex] = eventData;
    } else {
      drafts.push(eventData);
    }
    
    localStorage.setItem('event_drafts', JSON.stringify(drafts));

    return {
      success: true,
      data: {
        eventId: eventData.id,
        status: 'draft',
        message: 'Event draft saved successfully',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save draft',
    };
  }
};

/**
 * Publish event
 * 
 * To replace with real API:
 * const response = await fetch(`${BASE_URL}/events/${eventData.id}/publish`, {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(eventData),
 * });
 */
export const publishEvent = async (
  eventData: EventFormData
): Promise<ApiResponse<EventSaveResponse>> => {
  await delay(MOCK_DELAY);

  try {
    // Mock implementation
    const updatedEvent = { ...eventData, status: 'live' as const };
    
    // Save to localStorage as "published"
    const published = JSON.parse(localStorage.getItem('published_events') || '[]');
    const existingIndex = published.findIndex((e: EventFormData) => e.id === updatedEvent.id);
    
    if (existingIndex >= 0) {
      published[existingIndex] = updatedEvent;
    } else {
      published.push(updatedEvent);
    }
    
    localStorage.setItem('published_events', JSON.stringify(published));

    return {
      success: true,
      data: {
        eventId: updatedEvent.id,
        status: 'live',
        message: 'Event published successfully',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to publish event',
    };
  }
};

/**
 * Get event by ID
 * 
 * To replace with real API:
 * const response = await fetch(`${BASE_URL}/events/${eventId}`);
 */
export const getEventById = async (eventId: string): Promise<ApiResponse<EventFormData>> => {
  await delay(MOCK_DELAY);

  try {
    // Check drafts first
    const drafts = JSON.parse(localStorage.getItem('event_drafts') || '[]');
    const draft = drafts.find((d: EventFormData) => d.id === eventId);
    
    if (draft) {
      return {
        success: true,
        data: draft,
      };
    }

    // Check published events
    const published = JSON.parse(localStorage.getItem('published_events') || '[]');
    const event = published.find((e: EventFormData) => e.id === eventId);
    
    if (event) {
      return {
        success: true,
        data: event,
      };
    }

    return {
      success: false,
      error: 'Event not found',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch event',
    };
  }
};

/**
 * Delete event
 * 
 * To replace with real API:
 * const response = await fetch(`${BASE_URL}/events/${eventId}`, {
 *   method: 'DELETE',
 * });
 */
export const deleteEvent = async (eventId: string): Promise<ApiResponse<void>> => {
  await delay(MOCK_DELAY);

  try {
    // Remove from drafts
    const drafts = JSON.parse(localStorage.getItem('event_drafts') || '[]');
    const filteredDrafts = drafts.filter((d: EventFormData) => d.id !== eventId);
    localStorage.setItem('event_drafts', JSON.stringify(filteredDrafts));

    // Remove from published
    const published = JSON.parse(localStorage.getItem('published_events') || '[]');
    const filteredPublished = published.filter((e: EventFormData) => e.id !== eventId);
    localStorage.setItem('published_events', JSON.stringify(filteredPublished));

    return {
      success: true,
      message: 'Event deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete event',
    };
  }
};

