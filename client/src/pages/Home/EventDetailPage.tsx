import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { Header } from '../../components/Header';
import { getEventById, deleteEvent } from '../../api/appApi';
import { useEventStore } from '../../store/eventStore';
import { Loader } from '../../components/Loader';
import {
  userState,
  eventDetailState,
  eventDetailLoadingState,
  isDeletingEventState,
  showDeleteConfirmState,
} from '../../store/atoms';

export const EventDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { setCurrentEvent } = useEventStore();
  const user = useRecoilValue(userState);
  const [event, setEvent] = useRecoilState(eventDetailState);
  const [isLoading, setIsLoading] = useRecoilState(eventDetailLoadingState);
  const [isDeleting, setIsDeleting] = useRecoilState(isDeletingEventState);
  const [showDeleteConfirm, setShowDeleteConfirm] = useRecoilState(
    showDeleteConfirmState
  );

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        navigate('/home');
        return;
      }

      setIsLoading(true);
      try {
        const response = await getEventById(id);
        if (response.success && response.data) {
          setEvent(response.data);
        } else {
          navigate('/home');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        navigate('/home');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate, setIsLoading, setEvent]);

  const handleEdit = () => {
    if (event) {
      setCurrentEvent(event);
      navigate('/home/create');
    }
  };

  const handleDelete = async () => {
    if (!event || !id) return;

    setIsDeleting(true);
    try {
      const response = await deleteEvent(id);
      if (response.success) {
        navigate('/home');
      } else {
        console.error('Failed to delete event:', response.error);
        setIsDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const getCurrencySymbol = (code: string) => {
    try {
      return (0)
        .toLocaleString(undefined, {
          style: 'currency',
          currency: code,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
        .replace(/\d/g, '')
        .trim();
    } catch {
      return code;
    }
  };

  const formatCurrency = (currencyCode: string, amount: string) => {
    const symbol = getCurrencySymbol(currencyCode || 'USD');
    return `${symbol}${amount}`;
  };

  const isOwner = user && event && event.userId === user.uid;

  if (isLoading) {
    return <Loader message="Loading event..." />;
  }

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen w-full">
      {/* Background overlay */}
      {event.backgroundImage && (
        <div
          className="fixed inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${event.backgroundImage})` }}
        />
      )}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-300/80 via-purple-300/80 to-pink-400/80 backdrop-blur-sm" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <Header />

        {/* Back button */}
        <button
          onClick={() => navigate('/home')}
          className="mb-6 text-white/70 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Events
        </button>

        {/* Event Detail Content */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-black/20 backdrop-blur-sm rounded-3xl border border-white/20 p-8 shadow-2xl">
            {/* Event Flyer */}
            {event.flyerImage && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <img
                  src={event.flyerImage}
                  alt={event.name}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Event Title and Status */}
            <div className="flex items-start justify-between mb-6">
              <h1 className="text-4xl font-bold text-white">
                {event.name || 'Untitled Event'}
              </h1>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  event.status === 'live'
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                }`}
              >
                {event.status === 'live' ? 'Live' : 'Draft'}
              </span>
            </div>

            {/* Event Details */}
            <div className="space-y-6 mb-8">
              {event.dateTime && (
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📅</span>
                  <div>
                    <div className="text-white/60 text-sm mb-1">
                      Date & Time
                    </div>
                    <div className="text-white text-lg">
                      {formatDate(event.dateTime)}
                    </div>
                  </div>
                </div>
              )}

              {event.location && (
                <div className="flex items-start gap-4">
                  <span className="text-2xl">📍</span>
                  <div>
                    <div className="text-white/60 text-sm mb-1">Location</div>
                    <div className="text-white text-lg">{event.location}</div>
                  </div>
                </div>
              )}

              {event.costPerPerson && (
                <div className="flex items-start gap-4">
                  <span className="text-2xl">💰</span>
                  <div>
                    <div className="text-white/60 text-sm mb-1">
                      Cost per Person
                    </div>
                    <div className="text-white text-lg">
                      {formatCurrency(
                        event.costCurrency || 'USD',
                        event.costPerPerson
                      )}
                    </div>
                  </div>
                </div>
              )}

              {event.capacity && (
                <div className="flex items-start gap-4">
                  <span className="text-2xl">👥</span>
                  <div>
                    <div className="text-white/60 text-sm mb-1">Capacity</div>
                    <div className="text-white text-lg">
                      {event.capacity} people
                    </div>
                  </div>
                </div>
              )}

              {event.description && (
                <div>
                  <div className="text-white/60 text-sm mb-2">Description</div>
                  <div className="text-white text-lg whitespace-pre-wrap">
                    {event.description}
                  </div>
                </div>
              )}

              {event.links && event.links.length > 0 && (
                <div>
                  <div className="text-white/60 text-sm mb-2">Links</div>
                  <div className="flex flex-wrap gap-2">
                    {event.links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                      >
                        {link.icon && <span className="mr-2">{link.icon}</span>}
                        {link.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {event.photoGallery && event.photoGallery.length > 0 && (
                <div>
                  <div className="text-white/60 text-sm mb-2">
                    Photo Gallery
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {event.photoGallery.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    ))}
                  </div>
                </div>
              )}

              {event.announcements && (
                <div>
                  <div className="text-white/60 text-sm mb-2">
                    Announcements
                  </div>
                  <div className="text-white text-lg whitespace-pre-wrap">
                    {event.announcements}
                  </div>
                </div>
              )}

              {event.privacy && (
                <div>
                  <div className="text-white/60 text-sm mb-2">
                    Privacy Settings
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-lg">
                        {event.privacy.isPublic ? '🌐' : '🔒'}
                      </span>
                      <span className="text-white">
                        {event.privacy.isPublic
                          ? 'Public Event'
                          : 'Private Event'}
                      </span>
                    </div>
                    {event.privacy.requireApproval && (
                      <div className="flex items-center gap-2">
                        <span className="text-white text-lg">✅</span>
                        <span className="text-white">Requires Approval</span>
                      </div>
                    )}
                    {event.privacy.hideGuestList && (
                      <div className="flex items-center gap-2">
                        <span className="text-white text-lg">👁️</span>
                        <span className="text-white">Guest List Hidden</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isOwner && (
              <div className="flex items-center gap-4 pt-6 border-t border-white/20">
                <button
                  onClick={handleEdit}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Edit Event
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 font-semibold transition-all"
                >
                  Delete Event
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-black/90 backdrop-blur-sm rounded-3xl border border-white/20 p-8 max-w-md mx-4">
            <h2 className="text-2xl font-bold text-white mb-4">Delete Event</h2>
            <p className="text-white/70 mb-6">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
