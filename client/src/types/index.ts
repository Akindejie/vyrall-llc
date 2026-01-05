import type { ReactNode } from 'react';

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

/**
 * Core event types for the event creation system
 */
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

export type ModuleType =
  | 'capacity'
  | 'photo_gallery'
  | 'links'
  | 'privacy'
  | 'announcements'
  | 'rsvp'
  | 'custom';

export interface CustomModule {
  id: string;
  type: ModuleType;
  config: Record<string, any>;
  order: number;
  isActive: boolean;
}

export interface EventFormData {
  id: string;
  name: string;
  phoneNumber: string;
  dateTime: string;
  location: string;
  costPerPerson: string;
  costCurrency: string;
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

export interface ModuleDefinition {
  type: ModuleType;
  label: string;
  icon: string;
  description: string;
  renderComponent: (config: any, onChange: (config: any) => void) => ReactNode;
}

export interface EventCreationState {
  currentEvent: EventFormData | null;
  isLoading: boolean;
  error: string | null;
  activeModules: ModuleType[];
}

export const createEmptyEvent = (): EventFormData => ({
  id: crypto.randomUUID(),
  name: '',
  phoneNumber: '',
  dateTime: '',
  location: '',
  costPerPerson: '',
  costCurrency: 'USD',
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

/**
 * Component Prop Types
 */
export interface BackgroundChangerProps {
  onBackgroundChange: (imageUrl: string | null) => void;
  className?: string;
}

export interface CurrencyInputProps {
  amount: string;
  onAmountChange: (value: string) => void;
  currencyCode: string;
  onCurrencyChange: (code: string) => void;
  placeholder?: string;
  className?: string;
}

export interface ModalToggles {
  showCapacity: boolean;
  showLinks: boolean;
  showPhotoGallery: boolean;
  showPrivacy: boolean;
  showAnnouncements: boolean;
}

export interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  toggles: ModalToggles;
  onToggle: (key: keyof ModalToggles) => void;
}

export interface FormInputProps {
  icon: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'tel' | 'datetime-local' | 'number';
  showButton?: boolean;
  buttonIcon?: string;
  onButtonClick?: () => void;
  className?: string;
  variant?: 'default' | 'ghost';
}

export interface FormTextareaProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  className?: string;
}

export interface GlossyDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface ImageUploadProps {
  currentImage: string | null;
  onImageChange: (imageUrl: string | null) => void;
  type: 'flyer' | 'background';
  className?: string;
}

export interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface NominatimResult {
  display_name: string;
  place_id: number;
}

export interface QuickLinkButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
  variant?: 'default' | 'text';
}

export interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  messages: string[];
}

export interface AnnouncementsModuleProps {
  announcement: string;
  onChange: (text: string) => void;
  onRemove: () => void;
}

export interface CapacityModuleProps {
  capacity: number | undefined;
  onChange: (capacity: number) => void;
  onRemove: () => void;
}

export interface LinksModuleProps {
  links: CustomLink[];
  onAdd: (title: string, url: string) => void;
  onRemoveLink: (id: string) => void;
  onUpdate: (id: string, title: string, url: string) => void;
  onClose: () => void;
}

export interface PhotoGalleryModuleProps {
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  onRemove: () => void;
}

export interface PrivacyModuleProps {
  privacy: PrivacySettings;
  onChange: (privacy: PrivacySettings) => void;
  onRemove: () => void;
}
