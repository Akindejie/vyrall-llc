import { atom } from 'recoil';
import type { User } from 'firebase/auth';
import type { EventFormData } from '../types';
import { createEmptyEvent } from '../types';

// Auth State
export const userState = atom<User | null>({
  key: 'userState',
  default: null,
});

// Event Creation State
export const currentEventState = atom<EventFormData>({
  key: 'currentEventState',
  default: createEmptyEvent(),
});

export const isLoadingState = atom<boolean>({
  key: 'isLoadingState',
  default: false,
});

export const errorState = atom<string | null>({
  key: 'errorState',
  default: null,
});

export const showCustomizeModalState = atom<boolean>({
  key: 'showCustomizeModalState',
  default: false,
});

// Event Creation Page UI State
export const showCapacityState = atom<boolean>({
  key: 'showCapacityState',
  default: false,
});

export const showPhotoGalleryState = atom<boolean>({
  key: 'showPhotoGalleryState',
  default: false,
});

export const showLinksState = atom<boolean>({
  key: 'showLinksState',
  default: false,
});

export const showPrivacyState = atom<boolean>({
  key: 'showPrivacyState',
  default: false,
});

export const showAnnouncementsState = atom<boolean>({
  key: 'showAnnouncementsState',
  default: false,
});

export const showAllQuickLinksState = atom<boolean>({
  key: 'showAllQuickLinksState',
  default: false,
});

// Status Modal State
export const showStatusModalState = atom<boolean>({
  key: 'showStatusModalState',
  default: false,
});

export const statusTypeState = atom<'success' | 'error'>({
  key: 'statusTypeState',
  default: 'success',
});

export const statusMessagesState = atom<string[]>({
  key: 'statusMessagesState',
  default: [],
});

// Home Page State
export const activeTabState = atom<'myEvents' | 'allEvents'>({
  key: 'activeTabState',
  default: 'myEvents',
});

export const myEventsState = atom<EventFormData[]>({
  key: 'myEventsState',
  default: [],
});

export const allEventsState = atom<EventFormData[]>({
  key: 'allEventsState',
  default: [],
});

export const eventsLoadingState = atom<boolean>({
  key: 'eventsLoadingState',
  default: true,
});

export const hasFetchedEventsState = atom<boolean>({
  key: 'hasFetchedEventsState',
  default: false,
});

// Event Detail Page State
export const eventDetailState = atom<EventFormData | null>({
  key: 'eventDetailState',
  default: null,
});

export const eventDetailLoadingState = atom<boolean>({
  key: 'eventDetailLoadingState',
  default: true,
});

export const isDeletingEventState = atom<boolean>({
  key: 'isDeletingEventState',
  default: false,
});

export const showDeleteConfirmState = atom<boolean>({
  key: 'showDeleteConfirmState',
  default: false,
});
