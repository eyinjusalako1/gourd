"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useUserProfile } from "@/hooks/useUserProfile";
import { EventService } from "@/lib/event-service";
import { Event } from "@/types";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex justify-center py-8 px-4">
      <div className="w-full max-w-5xl space-y-6">
        {/* Hero welcome section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-emerald-700 border border-slate-800 shadow-2xl px-5 py-6 md:px-8 md:py-7">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-10 w-52 h-52 bg-emerald-400/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-20 -left-10 w-52 h-52 bg-indigo-500/15 blur-3xl rounded-full" />
          </div>

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">
                Welcome to Gathered
              </p>
              <h1 className="text-2xl md:text-3xl font-semibold">
                {firstName ? `Hey, ${firstName} 👋` : "Hey, welcome 👋"}
              </h1>
              <p className="text-sm md:text-base text-slate-100/80 max-w-xl">
                Your profile is set. Let&apos;s help you find your people and plan your
                next hangout.
              </p>
            </div>

            <div className="mt-2 md:mt-0 flex-shrink-0">
              <div className="rounded-2xl bg-slate-950/40 border border-emerald-300/30 px-4 py-3 backdrop-blur-md min-w-[190px]">
                <p className="text-[11px] uppercase tracking-wide text-emerald-200/80 mb-1">
                  Your activity
                </p>
                {eventsLoading ? (
                  <p className="text-xs text-slate-200/80">Loading stats…</p>
                ) : hostedEvents.length > 0 || joinedEvents.length > 0 ? (
                  <div className="flex items-center gap-4 text-xs text-slate-50">
                    <div>
                      <p className="font-semibold">{hostedEvents.length}</p>
                      <p className="text-[11px] text-slate-200/80">
                        Events hosted
                      </p>
                    </div>
                    <div className="h-8 w-px bg-emerald-300/30" />
                    <div>
                      <p className="font-semibold">{joinedEvents.length}</p>
                      <p className="text-[11px] text-slate-200/80">
                        Events joined
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-200/80">
                    You haven&apos;t joined or hosted any events yet. Let&apos;s change
                    that.
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-emerald-400 to-amber-300 flex items-center justify-center text-slate-950 font-semibold text-xl border-4 border-slate-950 shadow-lg">
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
                      className="inline-flex items-center justify-center rounded-full border border-slate-700 px-3 py-1.5 text-[11px] font-medium text-slate-50 hover:bg-slate-800 transition-colors mt-1 md:mt-0"
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
                <div className="rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2">
                  <p className="text-slate-400">Social style</p>
                  <p className="font-medium text-slate-100 mt-0.5">
                    {profile.social_style || "Not set"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2">
                  <p className="text-slate-400">Group size</p>
                  <p className="font-medium text-slate-100 mt-0.5">
                    {profile.preferred_group_size || "Not set"}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2">
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
                        className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-[11px] text-emerald-200 border border-emerald-400/40"
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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
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
                    className="w-full text-left px-4 py-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/60 hover:bg-emerald-500/25 transition-colors shadow-sm"
                  >
                    <p className="text-sm font-semibold text-emerald-200 mb-0.5">
                      🔍 Find your people
                    </p>
                    <p className="text-xs text-emerald-50/90">
                      Use Discovery Assistant to find events and people that match your vibe.
                    </p>
                  </button>

                  {isSteward && (
                    <button
                      type="button"
                      onClick={handleGoToHost}
                      className="w-full text-left px-4 py-3.5 rounded-2xl bg-slate-950 border border-amber-300/60 hover:bg-slate-900 transition-colors shadow-sm"
                    >
                      <p className="text-sm font-semibold text-amber-200 mb-0.5">
                        📅 Host your first hangout
                      </p>
                      <p className="text-xs text-amber-50/90">
                        Use Activity Planner to turn an idea into a real event.
                      </p>
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-300">
                <p className="font-semibold text-slate-100 mb-1">
                  What we know about you so far
                </p>
                <p className="mb-2 text-slate-400">
                  We&apos;ll use this to recommend better people and activities as
                  Gathered grows:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {profile.tags && profile.tags.length > 0 && (
                    <li>You&apos;re into: {profile.tags.join(", ")}</li>
                  )}
                  {profile.social_style && (
                    <li>Your social energy: {profile.social_style}</li>
                  )}
                  {profile.preferred_group_size && (
                    <li>Preferred hangout size: {profile.preferred_group_size}</li>
                  )}
                  {profile.availability_summary && (
                    <li>Best times to meet: {profile.availability_summary}</li>
                  )}
                  {!profile.tags?.length &&
                    !profile.social_style &&
                    !profile.preferred_group_size &&
                    !profile.availability_summary && (
                      <li>We&apos;ll learn more as you update your profile.</li>
                    )}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* My events section */}
        {!loading && user && (
          <section className="mt-2 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-semibold">My events</h2>
            </div>

            {/* Events you’re hosting */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    Events you&apos;re hosting
                  </h3>
                  <p className="text-[11px] text-slate-400">
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
                      className="mt-3 inline-flex items-center rounded-full bg-emerald-500 text-slate-950 px-3 py-1.5 text-[11px] font-semibold hover:bg-emerald-400"
                    >
                      Host an event
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {hostedEvents.slice(0, 3).map((event) => {
                    const { date, time } = formatEventDate(event.start_time);
                    return (
                      <button
                        key={event.id}
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="w-full text-left p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition-colors shadow-sm"
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
                      className="text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      View all {hostedEvents.length} hosted events →
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Events you’re going to */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5">
              <div className="mb-3">
                <h3 className="text-sm font-semibold">
                  Events you&apos;re going to
                </h3>
                <p className="text-[11px] text-slate-400">
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
                    className="underline underline-offset-2 text-emerald-300 hover:text-emerald-200"
                  >
                    Find your people
                  </button>{" "}
                  above.
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {joinedEvents.slice(0, 3).map((event) => {
                    const { date, time } = formatEventDate(event.start_time);
                    return (
                      <button
                        key={event.id}
                        onClick={() => router.push(`/events/${event.id}`)}
                        className="w-full text-left p-3 bg-slate-950 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition-colors shadow-sm"
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
                      className="text-xs text-emerald-400 hover:text-emerald-300"
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
                    className="text-left bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-emerald-400/60 hover:bg-slate-900/80 transition-colors shadow-sm"
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
