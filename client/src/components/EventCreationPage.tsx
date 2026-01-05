import React, { useState } from 'react';
import { useEventStore } from '../store/eventStore';
import { ImageUpload } from './ImageUpload';
import { BackgroundChanger } from './BackgroundChanger';
import { FormInput, FormTextarea } from './FormInput';
import { QuickLinkButton } from './QuickLinkButton';
import { CapacityModule, LinksModule } from './modules';
import { CustomizeModal } from './CustomizeModal';

export const EventCreationPage: React.FC = () => {
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
  } = useEventStore();

  const [showCapacity, setShowCapacity] = useState(false);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  const handlePublish = async () => {
    // Basic validation
    if (!currentEvent.name) {
      alert('Please enter an event name');
      return;
    }

    try {
      await publishEvent();
      alert('Event published successfully! 🎉');
    } catch (error) {
      alert('Failed to publish event');
    }
  };

  const handleSaveDraft = async () => {
    try {
      await saveEvent();
      alert('Draft saved successfully!');
    } catch (error) {
      alert('Failed to save draft');
    }
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">let's hang</h1>
          <div className="flex items-center gap-4">
            <button className="text-white hover:text-white/80 transition-colors">Home</button>
            <button className="text-white hover:text-white/80 transition-colors">People</button>
            <button className="text-white hover:text-white/80 transition-colors">Search</button>
            <button className="px-6 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors">
              Sign in
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left side - Flyer */}
          <div className="space-y-4">
            <ImageUpload
              currentImage={currentEvent.flyerImage}
              onImageChange={setFlyerImage}
              type="flyer"
            />
            <BackgroundChanger onBackgroundChange={setBackgroundImage} />
          </div>

          {/* Right side - Form */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white mb-6">Name your event</h2>

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
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-6 space-y-4 border border-white/20">
              <FormInput
                icon="📅"
                placeholder="Date and time"
                value={currentEvent.dateTime}
                onChange={(value) => updateEventField('dateTime', value)}
                type="datetime-local"
              />
              <FormInput
                icon="📍"
                placeholder="Location"
                value={currentEvent.location}
                onChange={(value) => updateEventField('location', value)}
              />
              <FormInput
                icon="💰"
                placeholder="Cost per person"
                value={currentEvent.costPerPerson}
                onChange={(value) => updateEventField('costPerPerson', value)}
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
                onRemove={removeLink}
                onUpdate={updateLink}
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
                  icon="📸"
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
              <QuickLinkButton
                icon="..."
                label="Show more"
                onClick={() => {}}
              />
            </div>

            {/* Customize section */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1 text-center">
                  <div className="flex justify-center items-center gap-6 mb-4">
                    <span className="text-3xl">📢</span>
                    <span className="text-3xl">🎲</span>
                    <span className="text-3xl">👥</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Customize your event your way
                  </h3>
                  <div className="flex justify-center gap-4 mt-4">
                    <span className="text-3xl">🔗</span>
                    <span className="text-3xl">📸</span>
                    <span className="text-3xl text-2xl">RSVP</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCustomizeModal(true)}
                className="w-full py-4 rounded-2xl bg-white/20 hover:bg-white/30 
                  text-white font-medium transition-colors flex items-center justify-center gap-2"
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
      />
    </div>
  );
};

