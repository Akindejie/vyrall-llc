import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { Header } from '../../components/Header';
import { useEventStore } from '../../store/eventStore';
import {
  userState,
  showCapacityState,
  showPhotoGalleryState,
  showLinksState,
  showPrivacyState,
  showAnnouncementsState,
  showAllQuickLinksState,
  showStatusModalState,
  statusTypeState,
  statusMessagesState,
} from '../../store/atoms';
import { ImageUpload } from '../../components/ImageUpload';
import { BackgroundChanger } from '../../components/BackgroundChanger';
import { GlossyDatePicker } from '../../components/GlossyDatePicker';
import { LocationAutocomplete } from '../../components/LocationAutocomplete';
import { CurrencyInput } from '../../components/CurrencyInput';
import { FormInput, FormTextarea } from '../../components/FormInput';
import { QuickLinkButton } from '../../components/QuickLinkButton';
import {
  CapacityModule,
  LinksModule,
  PhotoGalleryModule,
  PrivacyModule,
  AnnouncementsModule,
} from '../../components/modules';
import { CustomizeModal } from '../../components/CustomizeModal';
import { StatusModal } from '../../components/StatusModal';

export const EventCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentEvent,
    updateEventField,
    setFlyerImage,
    setBackgroundImage,
    addLink,
    removeLink,
    updateLink,
    setCapacity,
    publishEvent,
    saveEvent,
    setShowCustomizeModal,
    showCustomizeModal,
    resetEvent,
  } = useEventStore();

  const user = useRecoilValue(userState);
  const [showCapacity, setShowCapacity] = useRecoilState(showCapacityState);
  const [showPhotoGallery, setShowPhotoGallery] = useRecoilState(
    showPhotoGalleryState
  );
  const [showLinks, setShowLinks] = useRecoilState(showLinksState);
  const [showPrivacy, setShowPrivacy] = useRecoilState(showPrivacyState);
  const [showAnnouncements, setShowAnnouncements] = useRecoilState(
    showAnnouncementsState
  );
  const [showAllQuickLinks, setShowAllQuickLinks] = useRecoilState(
    showAllQuickLinksState
  );
  const [showStatusModal, setShowStatusModal] =
    useRecoilState(showStatusModalState);
  const [statusType, setStatusType] = useRecoilState(statusTypeState);
  const [statusMessages, setStatusMessages] =
    useRecoilState(statusMessagesState);

  const handlePublish = async () => {
    const missingFields: string[] = [];

    if (!currentEvent.name) missingFields.push('Event Name');
    if (!currentEvent.dateTime) missingFields.push('Date & Time');
    if (!currentEvent.location) missingFields.push('Location');
    // Add more validation if strict needed (e.g., Image?)

    if (missingFields.length > 0) {
      setStatusType('error');
      setStatusMessages(missingFields);
      setShowStatusModal(true);
      return;
    }

    try {
      await publishEvent(user?.uid);
      setStatusType('success');
      setStatusMessages([]);
      setShowStatusModal(true);
    } catch (error) {
      // Catch backend errors (like file size too large) and show in modal
      let errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to publish event. Please try again.';

      // Enhance error message if it's about file size but doesn't mention max size
      if (
        errorMessage.includes('too large') &&
        !errorMessage.includes('Maximum allowed')
      ) {
        const MAX_TOTAL_SIZE_KB = 1000; // 1MB = 1000KB
        if (!errorMessage.includes(`${MAX_TOTAL_SIZE_KB}KB`)) {
          errorMessage = `${errorMessage} Maximum allowed total size is ${MAX_TOTAL_SIZE_KB}KB.`;
        }
      }

      setStatusType('error');
      setStatusMessages([errorMessage]);
      setShowStatusModal(true);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await saveEvent(user?.uid);
      alert('Draft saved successfully!');
    } catch {
      alert('Failed to save draft');
    }
  };

  const handleFileSizeError = (message: string) => {
    setStatusType('error');
    setStatusMessages([message]);
    setShowStatusModal(true);
  };

  return (
    <div className="min-h-screen w-full">
      {/* Background overlay */}
      {currentEvent.backgroundImage && (
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${currentEvent.backgroundImage})` }}
        />
      )}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-300/80 via-purple-300/80 to-pink-400/80 backdrop-blur-sm" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <Header />

        {/* Main layout */}
        <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left side - Flyer */}
          <div className="space-y-4">
            <ImageUpload
              currentImage={currentEvent.flyerImage}
              onImageChange={setFlyerImage}
              type="flyer"
              onFileSizeError={handleFileSizeError}
            />
            <BackgroundChanger
              onBackgroundChange={setBackgroundImage}
              onFileSizeError={handleFileSizeError}
            />
          </div>

          {/* Right side - Form */}
          <div className="space-y-4">
            <input
              type="text"
              value={currentEvent.name}
              onChange={(e) => updateEventField('name', e.target.value)}
              placeholder="Name your event"
              className="w-full bg-transparent outline-none text-4xl font-bold text-white placeholder-white/50 mb-6"
            />

            {/* Phone number input */}
            <FormInput
              icon="📱"
              placeholder="Enter phone number to save the draft"
              value={currentEvent.phoneNumber}
              onChange={(value) => updateEventField('phoneNumber', value)}
              type="tel"
              showButton
              buttonIcon="➔"
              onButtonClick={handleSaveDraft}
            />

            {/* Event details card */}
            <div className="bg-black/20 backdrop-blur-sm rounded-3xl border border-white/20 relative z-20">
              <GlossyDatePicker
                value={currentEvent.dateTime}
                onChange={(value) => updateEventField('dateTime', value)}
                placeholder="Date and time"
              />
              <div className="h-[1px] bg-white/10 mx-5" />
              <LocationAutocomplete
                value={currentEvent.location}
                onChange={(value) => updateEventField('location', value)}
                placeholder="Location"
              />
              <div className="h-[1px] bg-white/10 mx-5" />
              <CurrencyInput
                amount={currentEvent.costPerPerson}
                onAmountChange={(value) =>
                  updateEventField('costPerPerson', value)
                }
                currencyCode={currentEvent.costCurrency || 'USD'}
                onCurrencyChange={(code) =>
                  updateEventField('costCurrency', code)
                }
                placeholder="Cost per person"
              />
            </div>

            {/* Description */}
            <FormTextarea
              placeholder="Describe your event"
              value={currentEvent.description}
              onChange={(value) => updateEventField('description', value)}
              rows={3}
            />

            {/* Dynamic modules */}
            {showCapacity && (
              <CapacityModule
                capacity={currentEvent.capacity}
                onChange={setCapacity}
                onRemove={() => setShowCapacity(false)}
              />
            )}

            {showLinks && (
              <LinksModule
                links={currentEvent.links}
                onAdd={addLink}
                onRemoveLink={removeLink}
                onUpdate={updateLink}
                onClose={() => setShowLinks(false)}
              />
            )}

            {showPhotoGallery && (
              <PhotoGalleryModule
                photos={currentEvent.photoGallery}
                onPhotosChange={(photos) =>
                  updateEventField('photoGallery', photos)
                }
                onRemove={() => setShowPhotoGallery(false)}
                onFileSizeError={handleFileSizeError}
              />
            )}

            {showPrivacy && (
              <PrivacyModule
                privacy={currentEvent.privacy}
                onChange={(privacy) => updateEventField('privacy', privacy)}
                onRemove={() => setShowPrivacy(false)}
              />
            )}

            {showAnnouncements && (
              <AnnouncementsModule
                announcement={currentEvent.announcements}
                onChange={(text) => updateEventField('announcements', text)}
                onRemove={() => setShowAnnouncements(false)}
              />
            )}

            {/* Quick links */}
            <div className="flex flex-wrap gap-3">
              {!showCapacity && (
                <QuickLinkButton
                  icon="👥"
                  label="Capacity"
                  onClick={() => setShowCapacity(true)}
                />
              )}
              {!showPhotoGallery && (
                <QuickLinkButton
                  icon="️"
                  label="Photo gallery"
                  onClick={() => setShowPhotoGallery(true)}
                />
              )}
              {!showLinks && (
                <QuickLinkButton
                  icon="🔗"
                  label="Links"
                  onClick={() => setShowLinks(true)}
                />
              )}

              {showAllQuickLinks && (
                <>
                  {!showPrivacy && (
                    <QuickLinkButton
                      icon="🔒"
                      label="Privacy"
                      onClick={() => setShowPrivacy(true)}
                    />
                  )}
                  {!showAnnouncements && (
                    <QuickLinkButton
                      icon="📢"
                      label="Announcements"
                      onClick={() => setShowAnnouncements(true)}
                    />
                  )}
                </>
              )}

              <QuickLinkButton
                icon={showAllQuickLinks ? '↑' : '...'}
                label={showAllQuickLinks ? 'Show less' : 'Show more'}
                onClick={() => setShowAllQuickLinks(!showAllQuickLinks)}
                variant="text"
              />
            </div>

            {/* Customize section */}
            <div className="bg-black/20 backdrop-blur-md rounded-3xl p-6 border border-white/10 relative overflow-hidden min-h-[220px] flex flex-col justify-end">
              {/* Scattered Icons */}
              {/* Top Left - List */}
              <div className="absolute top-8 left-16 opacity-40 rotate-[-12deg]">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </div>

              {/* Mid Left - Megaphone */}
              <div className="absolute top-24 left-8 opacity-40 rotate-12">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 8l-4.8 2.4a2 2 0 0 0 .8 3.6h4"></path>
                  <path d="M17 12a5 5 0 0 0-5-5V2"></path>
                  <path d="M7 16l-3 4"></path>
                  <path d="M7 10.5V16h4.5"></path>
                  <path d="M21 16a2 2 0 0 0-2-2"></path>
                  <path d="M18 17a4 4 0 0 1-4-4"></path>
                </svg>
              </div>

              {/* Bottom Left - People */}
              <div className="absolute bottom-24 left-20 opacity-40 rotate-[-8deg]">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>

              {/* Top Right - Link */}
              <div className="absolute top-8 right-16 opacity-40 rotate-45">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </div>

              {/* Mid Right - Image */}
              <div className="absolute top-16 right-6 opacity-40 rotate-[-15deg]">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>

              {/* Bottom Right - RSVP */}
              <div className="absolute bottom-24 right-14 opacity-40 rotate-12">
                <span className="text-2xl font-black text-white tracking-wider outline-text">
                  RSVP
                </span>
              </div>

              <div className="relative z-10 w-full text-center mt-12 mb-6">
                <h3 className="text-white text-xl font-medium tracking-wide">
                  Customize your
                  <br />
                  event your way
                </h3>
              </div>

              <button
                onClick={() => setShowCustomizeModal(true)}
                className="relative z-10 w-full py-4 rounded-xl bg-white/20 hover:bg-white/25 
                  text-white font-medium transition-all flex items-center justify-center gap-2"
              >
                <span className="text-xl">🎨</span>
                Customize
              </button>
            </div>

            {/* Go live button */}
            <button
              onClick={handlePublish}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 
                hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg 
                transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span className="text-xl">🚀</span>
              Go live
            </button>
          </div>
        </div>
      </div>

      {/* Customize Modal */}
      <CustomizeModal
        isOpen={showCustomizeModal}
        onClose={() => setShowCustomizeModal(false)}
        toggles={{
          showCapacity,
          showLinks,
          showPhotoGallery,
          showPrivacy,
          showAnnouncements,
        }}
        onToggle={(key) => {
          switch (key) {
            case 'showCapacity':
              setShowCapacity(!showCapacity);
              break;
            case 'showLinks':
              setShowLinks(!showLinks);
              break;
            case 'showPhotoGallery':
              setShowPhotoGallery(!showPhotoGallery);
              break;
            case 'showPrivacy':
              setShowPrivacy(!showPrivacy);
              break;
            case 'showAnnouncements':
              setShowAnnouncements(!showAnnouncements);
              break;
          }
        }}
      />

      {/* Status Modal */}
      <StatusModal
        isOpen={showStatusModal}
        type={statusType}
        messages={statusMessages}
        onClose={() => {
          setShowStatusModal(false);
          if (statusType === 'success') {
            resetEvent();
            // Navigate back to home page after successful publish
            navigate('/home');
          }
        }}
      />
    </div>
  );
};

export default EventCreationPage;
