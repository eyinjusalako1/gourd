"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Clock, MapPin, Monitor, Users, Tag } from "lucide-react";

interface DiscoveryResult {
  intent: string;
  interests: string[];
  location_hint: string;
  time_preferences: string;
  other_constraints: string[];
}

interface DiscoveryEventResult {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location?: string;
  tags: string[];
  event_type: string;
  is_virtual: boolean;
  virtual_link?: string;
  created_by: string;
  rsvp_count: number;
  max_attendees?: number;
}

export default function DiscoveryAssistantPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [events, setEvents] = useState<DiscoveryEventResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const canSubmit = query.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isLoading) return;

    setIsLoading(true);
    setError(null);
    setSearchError(null);
    setResult(null);
    setEvents([]);

    try {
      // Step 1: Get filters from DiscoveryAssistant
      const res = await fetch("/api/agents/DiscoveryAssistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          userContext: {
            // Fill this in later with real user data
            // location: "London",
            // userId: "123",
          },
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Discovery Assistant request failed");
      }

      const data = json.data as DiscoveryResult;
      setResult(data);

      // Step 2: Search for events using the filters
      setIsSearching(true);
      try {
        const searchRes = await fetch("/api/discover/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            intent: data.intent,
            interests: data.interests,
            location_hint: data.location_hint,
            time_preferences: data.time_preferences,
            other_constraints: data.other_constraints,
          }),
        });

        const searchJson = await searchRes.json();

        if (!searchRes.ok) {
          throw new Error(searchJson?.error || "Search failed");
        }

        setEvents(searchJson.events || []);
      } catch (searchErr: any) {
        setSearchError(
          searchErr.message || "Failed to search for events"
        );
        setEvents([]);
      } finally {
        setIsSearching(false);
      }
    } catch (err: any) {
      setError(
        err.message || "Something went wrong talking to Discovery Assistant"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-start justify-center py-10">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg">
        <header className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
            Discover
          </p>
          <h1 className="text-2xl font-semibold mb-1">
            Discovery Assistant
          </h1>
          <p className="text-sm text-slate-400">
            Type how you&apos;d naturally describe what you&apos;re looking for,
            and we&apos;ll turn it into filters for people, groups, and events.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              What are you looking for?
            </label>
            <textarea
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={3}
              placeholder='e.g. "I want anime friends in Stratford who are free on Sundays for chill hangs"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!canSubmit || isLoading}
              className="px-4 py-2 text-sm rounded-lg bg-emerald-500 text-slate-950 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? "Thinking..." : "Ask Discovery Assistant"}
            </button>
          </div>
        </form>

        {/* Loading state for search */}
        {isSearching && (
          <div className="mt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto"></div>
            <p className="mt-2 text-sm text-slate-400">Searching for events...</p>
          </div>
        )}

        {/* Search error */}
        {searchError && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <p className="text-sm text-red-400">{searchError}</p>
          </div>
        )}

        {/* Results section */}
        {result && !isSearching && (
          <section className="mt-8 border-t border-slate-800 pt-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Interpreted filters</h2>
              <div className="space-y-1 text-sm text-slate-300">
                <p>
                  <span className="font-medium">Intent:</span> {result.intent}
                </p>
                {result.interests?.length > 0 && (
                  <p>
                    <span className="font-medium">Interests:</span>{" "}
                    {result.interests.join(", ")}
                  </p>
                )}
                {result.location_hint && (
                  <p>
                    <span className="font-medium">Location:</span> {result.location_hint}
                  </p>
                )}
                {result.time_preferences && (
                  <p>
                    <span className="font-medium">Time:</span> {result.time_preferences}
                  </p>
                )}
              </div>
            </div>

            {/* Event results */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Matching Events {events.length > 0 && `(${events.length})`}
              </h2>

              {events.length === 0 ? (
                <div className="text-center py-12 bg-slate-950 border border-slate-800 rounded-xl">
                  <p className="text-slate-300 mb-2">No events match this yet.</p>
                  <p className="text-sm text-slate-400">
                    Try a different query to find events that match your interests.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => {
                    const { date, time } = formatEventDate(event.start_time);
                    return (
                      <div
                        key={event.id}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-emerald-500/50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/events/${event.id}`)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-slate-100 flex-1">
                            {event.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-xs text-slate-400">
                            {event.is_virtual ? (
                              <Monitor className="w-4 h-4" />
                            ) : (
                              <MapPin className="w-4 h-4" />
                            )}
                            <span>{event.is_virtual ? "Virtual" : "In-Person"}</span>
                          </div>
                        </div>

                        <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                          {event.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-slate-400">
                            <Calendar className="w-4 h-4" />
                            <span>{date}</span>
                            <Clock className="w-4 h-4 ml-2" />
                            <span>{time}</span>
                          </div>

                          {event.location && (
                            <div className="flex items-center space-x-2 text-sm text-slate-400">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}

                          <div className="flex items-center space-x-2 text-sm text-slate-400">
                            <Users className="w-4 h-4" />
                            <span>
                              {event.rsvp_count} going
                              {event.max_attendees && ` / ${event.max_attendees} max`}
                            </span>
                          </div>
                        </div>

                        {event.tags && event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {event.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded-full flex items-center space-x-1"
                              >
                                <Tag className="w-3 h-3" />
                                <span>{tag}</span>
                              </span>
                            ))}
                            {event.tags.length > 3 && (
                              <span className="px-2 py-1 bg-slate-800 text-slate-200 text-xs rounded-full">
                                +{event.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/events/${event.id}`);
                          }}
                          className="w-full px-4 py-2 text-sm rounded-lg bg-emerald-500/10 border border-emerald-500/60 text-emerald-300 font-medium hover:bg-emerald-500/20 transition-colors"
                        >
                          View Event Details
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

