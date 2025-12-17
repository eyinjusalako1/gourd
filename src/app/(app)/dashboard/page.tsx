"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useUserProfile } from "@/hooks/useUserProfile";
import { EventService } from "@/lib/event-service";
import { FellowshipService } from "@/lib/fellowship-service";
import { Event, FellowshipGroup } from "@/types";
import { Calendar, MapPin, Clock, Users, MessageCircle, Users as UsersIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  display_name: string | null;
  short_bio: string | null;
  long_bio: string | null;
  tags: string[] | null;
  social_style: string | null;
  preferred_group_size: string | null;
  availability_summary: string | null;
  city?: string | null;
  avatar_url?: string | null;
  profile_complete?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isSteward } = useUserProfile();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hostedEvents, setHostedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [userGroups, setUserGroups] = useState<FellowshipGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [activeGroupsCount, setActiveGroupsCount] = useState(0);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setError("You must be logged in to view your dashboard");
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/profile/get-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id }),
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.error || "Failed to fetch profile");
        }

        setProfile(json.profile as UserProfile);
      } catch (err: any) {
        setError(err.message || "Something went wrong fetching your profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  // Load user's events (hosted and joined)
  useEffect(() => {
    if (!user?.id) {
      setEventsLoading(false);
      return;
    }

    const loadUserEvents = async () => {
      setEventsLoading(true);
      try {
        const [hosted, joined] = await Promise.all([
          EventService.getUserHostedEvents(user.id),
          EventService.getUserRSVPedEvents(user.id),
        ]);
        setHostedEvents(hosted);
        setJoinedEvents(joined);
      } catch (err: any) {
        console.error("Error loading user events:", err);
      } finally {
        setEventsLoading(false);
      }
    };

    loadUserEvents();
  }, [user?.id]);

  // Load user's groups
  useEffect(() => {
    if (!user?.id) {
      setGroupsLoading(false);
      return;
    }

    const loadUserGroups = async () => {
      setGroupsLoading(true);
      try {
        // TODO: Implement getUserJoinedGroups method in FellowshipService
        // For now, get all groups and filter by membership
        const allGroups = await FellowshipService.getGroups(user.id);
        
        // Filter to only groups user is a member of
        // TODO: Replace with direct query once getUserJoinedGroups is implemented
        const { data: memberships } = await supabase
          .from('group_memberships')
          .select('group_id')
          .eq('user_id', user.id)
          .eq('status', 'active');
        
        const userGroupIds = new Set(memberships?.map(m => m.group_id) || []);
        const joinedGroups = allGroups.filter(g => userGroupIds.has(g.id));
        
        setUserGroups(joinedGroups);
        setActiveGroupsCount(joinedGroups.length);
      } catch (err: any) {
        console.error("Error loading user groups:", err);
        // Graceful fallback - show empty state
        setUserGroups([]);
        setActiveGroupsCount(0);
      } finally {
        setGroupsLoading(false);
      }
    };

    loadUserGroups();
  }, [user?.id]);

  // TODO: Load chat data when chat service is implemented
  useEffect(() => {
    // Placeholder for chat data loading
    // TODO: Implement chat message count fetching
    // For now, set placeholder count
    setNewMessagesCount(0);
  }, [user?.id]);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  // Load recommended upcoming events (simple v1)
  useEffect(() => {
    const loadRecommendedEvents = async () => {
      setRecommendedLoading(true);
      try {
        const events = await EventService.getUpcomingEvents(undefined, 5);
        setRecommendedEvents(events);
      } catch (err) {
        console.error("Error loading recommended events:", err);
      } finally {
        setRecommendedLoading(false);
      }
    };

    loadRecommendedEvents();
  }, []);

  const handleGoToDiscover = () => {
    router.push("/discovery");
  };

  const handleGoToHost = () => {
    router.push("/events/create");
  };

  const handleEditProfile = () => {
    router.push("/profile");
  };

  const handleBrowseGroups = () => {
    router.push("/fellowship");
  };

  const handleGoToChats = () => {
    router.push("/chat");
  };

  const getFirstName = () => {
    const displayName = profile?.display_name || user?.user_metadata?.name || "";
    if (!displayName) return "";
    return String(displayName).split(" ")[0];
  };

  const getAvatarInitial = () => {
    const source =
      profile?.display_name ||
      user?.user_metadata?.name ||
      (user?.email as string | undefined) ||
      "";
    if (!source) return "U";
    return String(source).charAt(0).toUpperCase();
  };

  const firstName = getFirstName();

  const hasProfileSignals =
    !!(
      profile &&
      (profile.social_style ||
        profile.preferred_group_size ||
        profile.availability_summary ||
        (profile.tags && profile.tags.length > 0))
    );

  const showCompleteVibe = !hasProfileSignals;

  return (
    <main className="min-h-screen bg-navy-900 text-slate-50 flex justify-center py-8 px-4">
      <div className="w-full max-w-5xl space-y-6">
        {/* Hero welcome section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-purple-900 border border-gold-600/20 hover:border-gold-500/40 shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-colors px-5 py-6 md:px-8 md:py-7">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-10 w-52 h-52 bg-gold-500/15 blur-3xl rounded-full" />
            <div className="absolute -bottom-20 -left-10 w-52 h-52 bg-indigo-500/15 blur-3xl rounded-full" />
          </div>

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-gold-500">
                Welcome to Gathered
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {firstName ? `Hey, ${firstName} 👋` : "Hey, welcome 👋"}
              </h1>
              <p className="text-sm md:text-base text-slate-100/80 max-w-xl">
                Your community is growing. Connect with groups, chat with friends, and plan your next hangout.
              </p>
            </div>

            <div className="mt-2 md:mt-0 flex-shrink-0">
              <div className="rounded-2xl bg-navy-900/40 border border-gold-600/20 px-4 py-3 backdrop-blur-md min-w-[190px]">
                <p className="text-[11px] uppercase tracking-wide text-gold-500 mb-1">
                  Community activity
                </p>
                {groupsLoading ? (
                  <p className="text-xs text-slate-200/80">Loading…</p>
                ) : activeGroupsCount > 0 || newMessagesCount > 0 ? (
                  <div className="space-y-1.5 text-xs text-slate-50">
                    {activeGroupsCount > 0 && (
                      <div>
                        <p className="font-semibold">{activeGroupsCount}</p>
                        <p className="text-[11px] text-slate-200/80">
                          {activeGroupsCount === 1 ? "Active group" : "Active groups"}
                          {profile?.city && ` near ${profile.city}`}
                        </p>
                      </div>
                    )}
                    {newMessagesCount > 0 && (
                      <>
                        {activeGroupsCount > 0 && <div className="h-4 w-px bg-gold-600/35 my-1" />}
                        <div>
                          <p className="font-semibold">{newMessagesCount}</p>
                          <p className="text-[11px] text-slate-200/80">
                            {newMessagesCount === 1 ? "New message today" : "New messages today"}
                          </p>
                        </div>
                      </>
                    )}
                    {activeGroupsCount === 0 && newMessagesCount === 0 && (
                      <p className="text-xs text-slate-200/80">
                        Join a group to start connecting.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-200/80">
                    Join a group to start connecting.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <p className="text-sm text-slate-200">Loading your dashboard...</p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        {/* Profile snapshot + quick actions */}
        {!loading && profile && (
          <section className="grid gap-5 md:grid-cols-[minmax(0,7fr)_minmax(0,6fr)]">
            {/* Profile snapshot card */}
            <div className="bg-navy-900/40 border border-white/10 rounded-2xl p-5 shadow-lg hover:border-gold-500/30 hover:shadow-[0_0_25px_rgba(245,196,81,0.35)] transition-colors">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-navy-900 font-semibold text-xl border-4 border-navy-900 shadow-lg">
                    {getAvatarInitial()}
                  </div>
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                    <div>
                      <h2 className="text-base md:text-lg font-semibold truncate">
                        {profile.display_name || firstName || "Your profile"}
                      </h2>
                      {profile.city && (
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{profile.city}</span>
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleEditProfile}
                      className="inline-flex items-center justify-center rounded-full border border-gold-600/40 px-3 py-1.5 text-[11px] font-medium text-gold-500 hover:bg-gold-500/10 transition-colors mt-1 md:mt-0"
                    >
                      Edit profile
                    </button>
                  </div>

                  {profile.short_bio && (
                    <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                      {profile.short_bio}
                    </p>
                  )}
                  {profile.long_bio && !profile.short_bio && (
                    <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                      {profile.long_bio}
                    </p>
                  )}

                  <p className="mt-2 text-[11px] text-slate-400">
                    The better your profile, the easier it is to find your people.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-[11px] text-slate-300 md:grid-cols-3">
                <div className="rounded-xl bg-navy-900/60 border border-white/10 px-3 py-2">
                  <p className="text-slate-400">Social style</p>
                  <p className="font-medium text-slate-100 mt-0.5">
                    {profile.social_style || "Not set"}
                  </p>
                </div>
                <div className="rounded-xl bg-navy-900/60 border border-white/10 px-3 py-2">
                  <p className="text-slate-400">Group size</p>
                  <p className="font-medium text-slate-100 mt-0.5">
                    {profile.preferred_group_size || "Not set"}
                  </p>
                </div>
                <div className="rounded-xl bg-navy-900/60 border border-white/10 px-3 py-2">
                  <p className="text-slate-400">Availability</p>
                  <p className="font-medium text-slate-100 mt-0.5 truncate">
                    {profile.availability_summary || "Not set"}
                  </p>
                </div>
              </div>

              {profile.tags && profile.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-[11px] text-slate-400 mb-1">Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full bg-gold-500/10 text-[11px] text-gold-500 border border-gold-500/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick actions card */}
            <div className="space-y-4">
              <div className="bg-navy-900/40 border border-white/10 rounded-2xl p-5 shadow-lg hover:border-gold-500/30 hover:shadow-[0_0_25px_rgba(245,196,81,0.35)] transition-colors">
                <h2 className="text-sm font-semibold mb-1">
                  Start with one of these
                </h2>
                <p className="text-xs text-slate-400 mb-4">
                  Think of these as your first missions. We&apos;ll keep it light.
                </p>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoToDiscover}
                    className="w-full text-left px-4 py-3.5 rounded-2xl bg-gold-500 text-navy-900 hover:bg-gold-600 transition-colors shadow-sm font-semibold"
                  >
                    <p className="text-sm mb-0.5">
                      🔍 Find your people
                    </p>
                    <p className="text-xs text-navy-900/80">
                      Use Discovery Assistant to find events and people that match your vibe.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={handleBrowseGroups}
                    className="w-full text-left px-4 py-3.5 rounded-2xl border border-gold-600/40 text-gold-500 hover:bg-gold-500/10 transition-colors"
                  >
                    <p className="text-sm font-semibold mb-0.5">
                      👥 Browse groups
                    </p>
                    <p className="text-xs text-slate-300">
                      Discover and join fellowship groups in your area.
                    </p>
                  </button>

                  {isSteward && (
                    <button
                      type="button"
                      onClick={handleGoToHost}
                      className="w-full text-left px-4 py-3.5 rounded-2xl border border-gold-600/40 text-gold-500 hover:bg-gold-500/10 transition-colors"
                    >
                      <p className="text-sm font-semibold mb-0.5">
                        📅 Host your first hangout
                      </p>
                      <p className="text-xs text-slate-300">
                        Use Activity Planner to turn an idea into a real event.
                      </p>
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-navy-900/40 border border-white/10 rounded-2xl p-4 text-[11px] text-slate-300 hover:border-gold-500/30 hover:shadow-[0_0_20px_rgba(245,196,81,0.25)] transition-colors">
                {showCompleteVibe ? (
                  <>
                    <p className="font-semibold text-slate-100 mb-1">
                      Complete your vibe
                    </p>
                    <p className="mb-2 text-slate-400">
                      Finish these details to get better recommendations.
                    </p>
                    <button
                      type="button"
                      onClick={handleEditProfile}
                      className="mt-2 inline-flex items-center rounded-full border border-gold-600/40 px-3 py-1.5 text-[11px] font-medium text-gold-500 hover:bg-gold-500/10 transition-colors"
                    >
                      Finish profile
                    </button>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-slate-100 mb-1">
                      Recommended for you
                    </p>
                    <p className="mb-2 text-slate-400">
                      A few things that might fit your rhythm.
                    </p>
                    {recommendedLoading ? (
                      <p className="text-slate-400">Loading suggestions…</p>
                    ) : recommendedEvents.length === 0 ? (
                      <p className="text-slate-400">
                        As events appear, we&apos;ll surface the best ones for you
                        here.
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {recommendedEvents.slice(0, 2).map((event) => {
                          const { date, time } = formatEventDate(
                            event.start_time
                          );
                          return (
                            <li key={event.id}>
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(`/events/${event.id}`)
                                }
                                className="w-full text-left rounded-xl bg-navy-900/60 border border-white/10 px-3 py-2 hover:border-gold-500/40 hover:bg-navy-900/80 transition-colors"
                              >
                                <p className="text-[11px] font-semibold text-slate-50 line-clamp-1">
                                  {event.title}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-300">
                                  <span className="inline-flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{date}</span>
                                  </span>
                                  <span className="inline-flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{time}</span>
                                  </span>
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Your Groups section */}
        {!loading && user && (
          <section className="mt-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-semibold">Your groups</h2>
              <button
                type="button"
                onClick={handleBrowseGroups}
                className="text-xs text-gold-500 hover:text-gold-600"
              >
                Browse all →
              </button>
            </div>

            <div className="bg-navy-900/40 border border-white/10 rounded-2xl p-6 md:p-7 hover:border-gold-500/30 hover:shadow-[0_0_15px_rgba(245,196,81,0.2)] transition-colors">
              {groupsLoading ? (
                <p className="text-xs text-slate-400">Loading your groups…</p>
              ) : userGroups.length === 0 ? (
                <div className="text-center py-6">
                  <UsersIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-300 mb-2">
                    You haven&apos;t joined a group yet — join one to start meeting people.
                  </p>
                  <button
                    type="button"
                    onClick={handleBrowseGroups}
                    className="mt-4 inline-flex items-center rounded-full bg-gold-500 text-navy-900 px-4 py-2 text-sm font-semibold hover:bg-gold-600 transition-colors"
                  >
                    Explore groups
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {userGroups.slice(0, 4).map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => router.push(`/fellowship/${group.id}`)}
                      className="w-full text-left p-4 bg-navy-900/60 border border-white/10 rounded-xl hover:border-gold-500/40 hover:shadow-[0_0_10px_rgba(245,196,81,0.15)] transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-slate-200 truncate flex-1">
                          {group.name}
                        </h3>
                      </div>
                      {group.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                          {group.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        {group.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{group.location}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{group.member_count || 0} members</span>
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Recent Chats section */}
        {!loading && user && (
          <section className="mt-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-semibold">Recent chats</h2>
              <button
                type="button"
                onClick={handleGoToChats}
                className="text-xs text-gold-500 hover:text-gold-600"
              >
                Go to chats →
              </button>
            </div>

            <div className="bg-navy-900/40 border border-white/10 rounded-2xl p-6 md:p-7 hover:border-gold-500/30 hover:shadow-[0_0_15px_rgba(245,196,81,0.2)] transition-colors">
              {/* TODO: Implement chat data fetching when chat service is available */}
              <div className="text-center py-6">
                <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-300 mb-2">
                  Your recent chats will appear here.
                </p>
                <button
                  type="button"
                  onClick={handleGoToChats}
                  className="mt-4 inline-flex items-center rounded-full border border-gold-600/40 text-gold-500 px-4 py-2 text-sm font-medium hover:bg-gold-500/10 transition-colors"
                >
                  Go to chats
                </button>
              </div>
            </div>
          </section>
        )}

        {/* This Week - Events section (secondary) */}
        {!loading && user && (
          <section className="mt-8 space-y-7">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base md:text-lg font-semibold">This week</h2>
            </div>

            {/* Events you're hosting */}
            <div className="bg-navy-900/40 border border-white/10 rounded-2xl p-5 md:p-6 hover:border-gold-500/30 hover:shadow-[0_0_15px_rgba(245,196,81,0.2)] transition-colors">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-sm font-semibold">
                    Events you&apos;re hosting ({hostedEvents.length})
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Invite others into what you&apos;re building.
                  </p>
                </div>
                {isSteward && (
                  <button
                    type="button"
                    onClick={handleGoToHost}
                    className="hidden md:inline-flex items-center rounded-full border border-slate-700 px-3 py-1.5 text-[11px] text-slate-50 hover:bg-slate-800"
                  >
                    Host event
                  </button>
                )}
              </div>

              {eventsLoading ? (
                <p className="text-xs text-slate-400">Loading...</p>
              ) : hostedEvents.length === 0 ? (
                <div className="text-xs text-slate-400">
                  <p>You&apos;re not hosting any events yet.</p>
                  {isSteward && (
                    <button
                      type="button"
                      onClick={handleGoToHost}
                      className="mt-3 inline-flex items-center rounded-full bg-gold-500 text-navy-900 px-3 py-1.5 text-[11px] font-semibold hover:bg-gold-600"
                    >
                      Host an event
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {hostedEvents.slice(0, 3).map((event) => {
                    const { date, time } = formatEventDate(event.start_time);
                    return (
                      <button
                        key={event.id}
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="w-full text-left p-4 bg-navy-900/60 border border-white/10 rounded-xl hover:border-gold-500/40 hover:shadow-[0_0_10px_rgba(245,196,81,0.15)] transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate">
                              {event.title}
                            </p>
                            <div className="flex items-center space-x-3 mt-1 text-xs text-slate-400">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{date}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{time}</span>
                              </span>
                              {event.location && (
                                <span className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate">
                                    {event.location}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-400">
                              {event.rsvp_count}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {hostedEvents.length > 3 && (
                    <button
                      onClick={() => router.push("/events")}
                      className="text-xs text-gold-500 hover:text-gold-600 mt-2"
                    >
                      View all {hostedEvents.length} hosted events →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Events you're going to */}
            <div className="bg-navy-900/40 border border-white/10 rounded-2xl p-5 md:p-6 hover:border-gold-500/30 hover:shadow-[0_0_15px_rgba(245,196,81,0.2)] transition-colors">
              <div className="mb-3 pb-3 border-b border-white/5">
                <h3 className="text-sm font-semibold">
                  Events you&apos;re going to ({joinedEvents.length})
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Keep track of where you&apos;re showing up next.
                </p>
              </div>

              {eventsLoading ? (
                <p className="text-xs text-slate-400">Loading...</p>
              ) : joinedEvents.length === 0 ? (
                <p className="text-xs text-slate-400">
                  You haven&apos;t joined any events yet. Try{" "}
                  <button
                    type="button"
                    onClick={handleGoToDiscover}
                    className="underline underline-offset-2 text-gold-500 hover:text-gold-600"
                  >
                    Find your people
                  </button>{" "}
                  above.
                </p>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {joinedEvents.slice(0, 3).map((event) => {
                    const { date, time } = formatEventDate(event.start_time);
                    return (
                      <button
                        key={event.id}
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="w-full text-left p-4 bg-navy-900/60 border border-white/10 rounded-xl hover:border-gold-500/40 hover:shadow-[0_0_10px_rgba(245,196,81,0.15)] transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-200 truncate">
                              {event.title}
                            </p>
                            <div className="flex items-center space-x-3 mt-1 text-xs text-slate-400">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{date}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{time}</span>
                              </span>
                              {event.location && (
                                <span className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate">
                                    {event.location}
                                  </span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-2">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-400">
                              {event.rsvp_count}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {joinedEvents.length > 3 && (
                    <button
                      onClick={() => router.push("/events")}
                      className="text-xs text-gold-500 hover:text-gold-600"
                    >
                      View all {joinedEvents.length} joined events →
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Recommended for you */}
        <section className="space-y-3 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-semibold">
              Recommended for you
            </h2>
            {/* TODO: Surface filters (interests, location) once available */}
          </div>

          {recommendedLoading ? (
            <p className="text-xs text-slate-400">Loading recommendations…</p>
          ) : recommendedEvents.length === 0 ? (
            <p className="text-xs text-slate-400">
              No upcoming events yet. As people start hosting, we&apos;ll show
              them here.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              {recommendedEvents.map((event) => {
                const { date, time } = formatEventDate(event.start_time);
                return (
                  <button
                    key={event.id}
                    onClick={() => router.push(`/events/${event.id}`)}
                    className="text-left bg-navy-900/40 border border-white/10 rounded-2xl p-4 hover:border-gold-500/30 hover:bg-navy-900/70 transition-colors shadow-sm"
                  >
                    <p className="text-sm font-semibold text-slate-50 line-clamp-2">
                      {event.title}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-300">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{date}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{time}</span>
                      </span>
                      {event.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-[100px]">
                            {event.location}
                          </span>
                        </span>
                      )}
                    </div>
                    {/* TODO: Filter recommendations by user interests & location */}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
