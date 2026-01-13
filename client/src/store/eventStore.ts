import {
  useRecoilState,
  useResetRecoilState,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {
  currentEventState,
  isLoadingState,
  errorState,
  showCustomizeModalState,
  showCapacityState,
  showPhotoGalleryState,
  showLinksState,
  showPrivacyState,
  showAnnouncementsState,
  showAllQuickLinksState,
  showStatusModalState,
  statusTypeState,
  statusMessagesState,
} from './atoms';
import type { EventFormData, ModuleType } from '../types';
import { saveEventDraft, publishEvent as apiPublishEvent } from '../api/appApi';

export const useEventStore = () => {
  const currentEvent = useRecoilValue(currentEventState);
  const setCurrentEvent = useSetRecoilState(currentEventState);
  const isLoading = useRecoilValue(isLoadingState);
  const setIsLoading = useSetRecoilState(isLoadingState);
  const error = useRecoilValue(errorState);
  const setError = useSetRecoilState(errorState);
  const [showCustomizeModal, setShowCustomizeModal] = useRecoilState(
    showCustomizeModalState
  );

  const resetCurrentEvent = useResetRecoilState(currentEventState);
  const resetIsLoading = useResetRecoilState(isLoadingState);
  const resetError = useResetRecoilState(errorState);
  const resetShowCustomizeModal = useResetRecoilState(showCustomizeModalState);
  const resetShowCapacity = useResetRecoilState(showCapacityState);
  const resetShowPhotoGallery = useResetRecoilState(showPhotoGalleryState);
  const resetShowLinks = useResetRecoilState(showLinksState);
  const resetShowPrivacy = useResetRecoilState(showPrivacyState);
  const resetShowAnnouncements = useResetRecoilState(showAnnouncementsState);
  const resetShowAllQuickLinks = useResetRecoilState(showAllQuickLinksState);
  const resetShowStatusModal = useResetRecoilState(showStatusModalState);
  const resetStatusType = useResetRecoilState(statusTypeState);
  const resetStatusMessages = useResetRecoilState(statusMessagesState);

  const updateEventField = <K extends keyof EventFormData>(
    field: K,
    value: EventFormData[K]
  ) => {
    setCurrentEvent((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const setFlyerImage = (image: string | null) => {
    setCurrentEvent((prev) => ({
      ...prev,
      flyerImage: image,
      updatedAt: new Date().toISOString(),
    }));
  };

  const setBackgroundImage = (image: string | null) => {
    setCurrentEvent((prev) => ({
      ...prev,
      backgroundImage: image,
      updatedAt: new Date().toISOString(),
    }));
  };

  const addLink = (title: string, url: string) => {
    setCurrentEvent((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        {
          id: crypto.randomUUID(),
          title,
          url,
        },
      ],
      updatedAt: new Date().toISOString(),
    }));
  };

  const removeLink = (id: string) => {
    setCurrentEvent((prev) => ({
      ...prev,
      links: prev.links.filter((link) => link.id !== id),
      updatedAt: new Date().toISOString(),
    }));
  };

  const updateLink = (id: string, title: string, url: string) => {
    setCurrentEvent((prev) => ({
      ...prev,
      links: prev.links.map((link) =>
        link.id === id ? { ...link, title, url } : link
      ),
      updatedAt: new Date().toISOString(),
    }));
  };

  const setCapacity = (capacity: number) => {
    setCurrentEvent((prev) => ({
      ...prev,
      capacity,
      updatedAt: new Date().toISOString(),
    }));
  };

  const toggleModule = (moduleType: ModuleType) => {
    setCurrentEvent((prev) => {
      const existingModule = prev.customModules.find(
        (m) => m.type === moduleType
      );

      if (existingModule) {
        return {
          ...prev,
          customModules: prev.customModules.map((m) =>
            m.type === moduleType ? { ...m, isActive: !m.isActive } : m
          ),
          updatedAt: new Date().toISOString(),
        };
      } else {
        return {
          ...prev,
          customModules: [
            ...prev.customModules,
            {
              id: crypto.randomUUID(),
              type: moduleType,
              config: {},
              order: prev.customModules.length,
              isActive: true,
            },
          ],
          updatedAt: new Date().toISOString(),
        };
      }
    });
  };

  const saveEvent = useRecoilCallback(
    ({ snapshot }) =>
      async (userId?: string) => {
        setIsLoading(true);
        setError(null);
        try {
          let event = await snapshot.getPromise(currentEventState);
          if (userId && !event.userId) {
            event = { ...event, userId };
          }
          const response = await saveEventDraft(event);
          if (!response.success) {
            throw new Error(response.error || 'Failed to save event');
          }
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to save event';
          setError(errorMessage);
          console.error('Error saving event:', err);
          throw err;
        }
      },
    [setIsLoading, setError]
  );

  const publishEvent = useRecoilCallback(
    ({ snapshot, set }) =>
      async (userId?: string) => {
        setIsLoading(true);
        setError(null);
        try {
          let event = await snapshot.getPromise(currentEventState);
          if (userId && !event.userId) {
            event = { ...event, userId };
          }
          const response = await apiPublishEvent(event);
          if (!response.success) {
            throw new Error(response.error || 'Failed to publish event');
          }
          set(currentEventState, (prev) => ({
            ...prev,
            ...(userId && !prev.userId ? { userId } : {}),
            status: 'live' as const,
          }));
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to publish event';
          setError(errorMessage);
          console.error('Error publishing event:', err);
          throw err; // Re-throw to allow handlePublish to catch it
        }
      },
    [setIsLoading, setError]
  );

  const resetEvent = () => {
    resetCurrentEvent();
    resetIsLoading();
    resetError();
    resetShowCustomizeModal();
    resetShowCapacity();
    resetShowPhotoGallery();
    resetShowLinks();
    resetShowPrivacy();
    resetShowAnnouncements();
    resetShowAllQuickLinks();
    resetShowStatusModal();
    resetStatusType();
    resetStatusMessages();
  };

  return {
    currentEvent,
    isLoading,
    error,
    showCustomizeModal,
    updateEventField,
    setFlyerImage,
    setBackgroundImage,
    addLink,
    removeLink,
    updateLink,
    setCapacity,
    toggleModule,
    setLoading: setIsLoading,
    setError,
    setShowCustomizeModal,
    setCurrentEvent,
    saveEvent,
    publishEvent,
    resetEvent,
  };
};
