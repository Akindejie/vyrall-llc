/**
 * Core event types for the event creation system
 */

export interface EventFormData {
  id: string;
  name: string;
  phoneNumber: string;
  dateTime: string;
  location: string;
  costPerPerson: string;
  description: string;
  capacity?: number;
  flyerImage: string | null;
  backgroundImage: string | null;
  links: CustomLink[];
  photoGallery: string[];
  privacy: PrivacySettings;
  announcements: string;
  customModules: CustomModule[];
  status: 'draft' | 'live';
  createdAt: string;
  updatedAt: string;
}

export interface CustomLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface PrivacySettings {
  isPublic: boolean;
  requireApproval: boolean;
  hideGuestList: boolean;
}

export interface CustomModule {
  id: string;
  type: ModuleType;
  config: Record<string, any>;
  order: number;
  isActive: boolean;
}

export type ModuleType = 
  | 'capacity'
  | 'photo_gallery'
  | 'links'
  | 'privacy'
  | 'announcements'
  | 'rsvp'
  | 'custom';

export interface ModuleDefinition {
  type: ModuleType;
  label: string;
  icon: string;
  description: string;
  renderComponent: (config: any, onChange: (config: any) => void) => React.ReactNode;
}

export interface EventCreationState {
  currentEvent: EventFormData | null;
  isLoading: boolean;
  error: string | null;
  activeModules: ModuleType[];
}

// Default empty event
export const createEmptyEvent = (): EventFormData => ({
  id: crypto.randomUUID(),
  name: '',
  phoneNumber: '',
  dateTime: '',
  location: '',
  costPerPerson: '',
  description: '',
  capacity: undefined,
  flyerImage: null,
  backgroundImage: null,
  links: [],
  photoGallery: [],
  privacy: {
    isPublic: true,
    requireApproval: false,
    hideGuestList: false,
  },
  announcements: '',
  customModules: [],
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

