import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { EventFormData, ModuleType } from '../types/event.types';
import { createEmptyEvent } from '../types/event.types';

interface EventStore {
  // State
  currentEvent: EventFormData;
  isLoading: boolean;
  error: string | null;
  showCustomizeModal: boolean;
  
  // Actions
  updateEventField: <K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K]
  ) => void;
  setFlyerImage: (image: string | null) => void;
  setBackgroundImage: (image: string | null) => void;
  addLink: (title: string, url: string) => void;
  removeLink: (id: string) => void;
  updateLink: (id: string, title: string, url: string) => void;
  setCapacity: (capacity: number) => void;
  toggleModule: (moduleType: ModuleType) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setShowCustomizeModal: (show: boolean) => void;
  saveEvent: () => Promise<void>;
  publishEvent: () => Promise<void>;
  resetEvent: () => void;
}

export const useEventStore = create<EventStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentEvent: createEmptyEvent(),
      isLoading: false,
      error: null,
      showCustomizeModal: false,

      // Actions
      updateEventField: (field, value) =>
        set((state) => ({
          currentEvent: {
            ...state.currentEvent,
            [field]: value,
            updatedAt: new Date().toISOString(),
          },
        })),

      setFlyerImage: (image) =>
        set((state) => ({
          currentEvent: {
            ...state.currentEvent,
            flyerImage: image,
            updatedAt: new Date().toISOString(),
          },
        })),

      setBackgroundImage: (image) =>
        set((state) => ({
          currentEvent: {
            ...state.currentEvent,
            backgroundImage: image,
            updatedAt: new Date().toISOString(),
          },
        })),

      addLink: (title, url) =>
        set((state) => ({
          currentEvent: {
            ...state.currentEvent,
            links: [
              ...state.currentEvent.links,
              {
                id: crypto.randomUUID(),
                title,
                url,
              },
            ],
            updatedAt: new Date().toISOString(),
          },
        })),

      removeLink: (id) =>
        set((state) => ({
          currentEvent: {
            ...state.currentEvent,
            links: state.currentEvent.links.filter((link) => link.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),

      updateLink: (id, title, url) =>
        set((state) => ({
          currentEvent: {
            ...state.currentEvent,
            links: state.currentEvent.links.map((link) =>
              link.id === id ? { ...link, title, url } : link
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      setCapacity: (capacity) =>
        set((state) => ({
          currentEvent: {
            ...state.currentEvent,
            capacity,
            updatedAt: new Date().toISOString(),
          },
        })),

      toggleModule: (moduleType) =>
        set((state) => {
          const existingModule = state.currentEvent.customModules.find(
            (m) => m.type === moduleType
          );

          if (existingModule) {
            return {
              currentEvent: {
                ...state.currentEvent,
                customModules: state.currentEvent.customModules.map((m) =>
                  m.type === moduleType ? { ...m, isActive: !m.isActive } : m
                ),
                updatedAt: new Date().toISOString(),
              },
            };
          } else {
            return {
              currentEvent: {
                ...state.currentEvent,
                customModules: [
                  ...state.currentEvent.customModules,
                  {
                    id: crypto.randomUUID(),
                    type: moduleType,
                    config: {},
                    order: state.currentEvent.customModules.length,
                    isActive: true,
                  },
                ],
                updatedAt: new Date().toISOString(),
              },
            };
          }
        }),

      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      setShowCustomizeModal: (show) => set({ showCustomizeModal: show }),

      saveEvent: async () => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call - replace with real API
          const { saveEventDraft } = await import('../api/eventApi');
          await saveEventDraft(get().currentEvent);
          set({ isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to save event',
          });
        }
      },

      publishEvent: async () => {
        set({ isLoading: true, error: null });
        try {
          // Mock API call - replace with real API
          const { publishEvent } = await import('../api/eventApi');
          await publishEvent(get().currentEvent);
          set((state) => ({
            currentEvent: {
              ...state.currentEvent,
              status: 'live',
            },
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to publish event',
          });
        }
      },

      resetEvent: () =>
        set({
          currentEvent: createEmptyEvent(),
          isLoading: false,
          error: null,
          showCustomizeModal: false,
        }),
    }),
    { name: 'EventStore' }
  )
);
