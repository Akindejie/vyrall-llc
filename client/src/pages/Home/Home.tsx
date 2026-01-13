import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { getAllEvents, getUserEvents } from '../../api/appApi';
import { Loader } from '../../components/Loader';
import { Header } from '../../components/Header';
import {
  userState,
  activeTabState,
  myEventsState,
  allEventsState,
  eventsLoadingState,
  hasFetchedEventsState,
} from '../../store/atoms';
import type { EventFormData } from '../../types';

export const Home: React.FC = () => {
  const user = useRecoilValue(userState);
  const [activeTab, setActiveTab] = useRecoilState(activeTabState);
  const [myEvents, setMyEvents] = useRecoilState(myEventsState);
  const [allEvents, setAllEvents] = useRecoilState(allEventsState);
  const [isLoading, setIsLoading] = useRecoilState(eventsLoadingState);
  const [hasFetched, setHasFetched] = useRecoilState(hasFetchedEventsState);

  // Fetch events when user changes
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Fetch all events
        const allEventsResponse = await getAllEvents();
        const allEventsData =
          allEventsResponse.success && allEventsResponse.data
            ? allEventsResponse.data
            : [];

        // Fetch user's events if logged in
        let myEventsData: EventFormData[] = [];
        if (user?.uid) {
          const userEventsResponse = await getUserEvents(user.uid);
          myEventsData =
            userEventsResponse.success && userEventsResponse.data
              ? userEventsResponse.data
              : [];
        }

        // Update events data first
        setAllEvents(allEventsData);
        setMyEvents(myEventsData);

        // Use requestAnimationFrame to ensure state has fully updated before hiding loader
        requestAnimationFrame(() => {
          setHasFetched(true);
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error fetching events:', error);
        setAllEvents([]);
        setMyEvents([]);
        requestAnimationFrame(() => {
          setHasFetched(true);
          setIsLoading(false);
        });
      }
    };

    fetchEvents();
  }, [user, setIsLoading, setAllEvents, setMyEvents, setHasFetched]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const displayEvents = activeTab === 'myEvents' ? myEvents : allEvents;

  return (
    <div className="min-h-screen w-full">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-300/80 via-purple-300/80 to-pink-400/80 backdrop-blur-sm" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <Header currentPage="home" />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Tabs and Create Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab('myEvents')}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                  activeTab === 'myEvents'
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                }`}
              >
                My Events
              </button>
              <button
                onClick={() => setActiveTab('allEvents')}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                  activeTab === 'allEvents'
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/15'
                }`}
              >
                All Events
              </button>
            </div>
            <Link
              to="/home/create"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span className="text-xl">➕</span>
              Create Event
            </Link>
          </div>

          {/* Events List */}
          {isLoading || !hasFetched ? (
            <Loader message="Loading events..." fullScreen={false} />
          ) : displayEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-black/20 backdrop-blur-sm rounded-3xl border border-white/20 p-12 shadow-2xl text-center max-w-md">
                <h2 className="text-2xl font-bold text-white mb-4">
                  No events yet
                </h2>
                <p className="text-white/60 mb-6">
                  {activeTab === 'myEvents'
                    ? "You haven't created any events yet. Create your first event to get started!"
                    : 'No events have been published yet.'}
                </p>
                {activeTab === 'myEvents' && (
                  <Link
                    to="/home/create"
                    className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold transition-all"
                  >
                    Create Your First Event
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/home/event/${event.id}`}
                  className="bg-black/20 backdrop-blur-sm rounded-3xl border border-white/20 p-6 hover:bg-black/30 transition-all cursor-pointer block"
                >
                  {event.flyerImage && (
                    <div className="mb-4 rounded-2xl overflow-hidden">
                      <img
                        src={event.flyerImage}
                        alt={event.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {event.name || 'Untitled Event'}
                  </h3>
                  <div className="space-y-2 text-white/70 text-sm">
                    {event.dateTime && (
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{formatDate(event.dateTime)}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.costPerPerson && (
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span>
                          {event.costCurrency || 'USD'} {event.costPerPerson}
                        </span>
                      </div>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-white/60 text-sm mt-3 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.status === 'live'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}
                    >
                      {event.status === 'live' ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
