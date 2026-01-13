/**
 * API functions for event operations using Firestore
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import type {
  EventFormData,
  ApiResponse,
  ImageUploadResponse,
  EventSaveResponse,
} from '../types';

// Firestore collection name
const EVENTS_COLLECTION = 'events';

/**
 * Helper function to remove undefined values from an object
 * Firestore doesn't accept undefined values
 */
const removeUndefinedValues = <T extends Record<string, unknown>>(
  obj: T
): Partial<T> => {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      // Recursively clean nested objects
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        cleaned[key] = removeUndefinedValues(value as Record<string, unknown>);
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned as Partial<T>;
};

/**
 * Helper function to estimate the size of an object in bytes
 */
const estimateSize = (obj: unknown): number => {
  const jsonString = JSON.stringify(obj);
  return new Blob([jsonString]).size;
};

/**
 * Helper function to compress base64 images by limiting photoGallery size
 * Firestore has a 1MB limit per document, so we need to limit large arrays
 */
const compressEventData = (eventData: EventFormData): EventFormData => {
  const MAX_TOTAL_SIZE = 900000; // 900KB total limit (leaving room for other fields)

  let photoGallery = eventData.photoGallery;

  // Check photoGallery size
  if (photoGallery && photoGallery.length > 0) {
    const photoGallerySize = estimateSize(photoGallery);

    if (photoGallerySize > MAX_TOTAL_SIZE) {
      // Keep only the first few photos that fit within the limit
      const limitedPhotos: string[] = [];
      let currentSize = 0;

      for (const photo of photoGallery) {
        const photoSize = estimateSize(photo);
        if (currentSize + photoSize < MAX_TOTAL_SIZE) {
          limitedPhotos.push(photo);
          currentSize += photoSize;
        } else {
          break;
        }
      }

      photoGallery = limitedPhotos;
    }
  }

  // Check individual image fields (warnings removed for production)

  return {
    ...eventData,
    photoGallery,
  };
};

/**
 * Upload an image (flyer or background)
 * This is a mock implementation that converts the file to a base64 string
 */
export const uploadImage = async (
  file: File
): Promise<ApiResponse<ImageUploadResponse>> => {
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
 */
export const saveEventDraft = async (
  eventData: EventFormData
): Promise<ApiResponse<EventSaveResponse>> => {
  try {
    // Compress large arrays/images before saving
    const compressedData = compressEventData(eventData);

    const eventRef = doc(db, EVENTS_COLLECTION, eventData.id);
    const eventToSave = {
      ...compressedData,
      status: 'draft' as const,
      updatedAt: new Date().toISOString(),
    };

    // Remove undefined values before saving to Firestore
    const cleanedEvent = removeUndefinedValues(eventToSave);

    // Check total size before saving
    const totalSize = estimateSize(cleanedEvent);
    const MAX_TOTAL_SIZE_KB = 1000; // 1MB = 1000KB
    if (totalSize > 1000000) {
      return {
        success: false,
        error: `Event data is too large (${Math.round(
          totalSize / 1024
        )}KB). Maximum allowed size is ${MAX_TOTAL_SIZE_KB}KB. Please reduce the number of photos or image sizes.`,
      };
    }

    await setDoc(eventRef, cleanedEvent, { merge: true });

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
 */
export const publishEvent = async (
  eventData: EventFormData
): Promise<ApiResponse<EventSaveResponse>> => {
  try {
    // Compress large arrays/images before saving
    const compressedData = compressEventData(eventData);

    const eventRef = doc(db, EVENTS_COLLECTION, eventData.id);
    const updatedEvent = {
      ...compressedData,
      status: 'live' as const,
      updatedAt: new Date().toISOString(),
    };

    // Remove undefined values before saving to Firestore
    const cleanedEvent = removeUndefinedValues(updatedEvent);

    // Check total size before saving
    const totalSize = estimateSize(cleanedEvent);
    const MAX_TOTAL_SIZE_KB = 1000; // 1MB = 1000KB
    if (totalSize > 1000000) {
      return {
        success: false,
        error: `Event data is too large (${Math.round(
          totalSize / 1024
        )}KB). Maximum allowed size is ${MAX_TOTAL_SIZE_KB}KB. Please reduce the number of photos or image sizes.`,
      };
    }

    await setDoc(eventRef, cleanedEvent, { merge: true });

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
 */
export const getEventById = async (
  eventId: string
): Promise<ApiResponse<EventFormData>> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    const eventSnap = await getDoc(eventRef);

    if (eventSnap.exists()) {
      return {
        success: true,
        data: eventSnap.data() as EventFormData,
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
 */
export const deleteEvent = async (
  eventId: string
): Promise<ApiResponse<void>> => {
  try {
    const eventRef = doc(db, EVENTS_COLLECTION, eventId);
    await deleteDoc(eventRef);

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

/**
 * Get all published events
 */
export const getAllEvents = async (): Promise<ApiResponse<EventFormData[]>> => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const q = query(eventsRef, where('status', '==', 'live'));
    const querySnapshot = await getDocs(q);

    const events: EventFormData[] = [];
    querySnapshot.forEach((doc) => {
      events.push(doc.data() as EventFormData);
    });

    return {
      success: true,
      data: events,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch events',
    };
  }
};

/**
 * Get events by user ID
 */
export const getUserEvents = async (
  userId: string
): Promise<ApiResponse<EventFormData[]>> => {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const q = query(
      eventsRef,
      where('userId', '==', userId),
      where('status', '==', 'live')
    );
    const querySnapshot = await getDocs(q);

    const events: EventFormData[] = [];
    querySnapshot.forEach((doc) => {
      events.push(doc.data() as EventFormData);
    });

    return {
      success: true,
      data: events,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to fetch user events',
    };
  }
};
