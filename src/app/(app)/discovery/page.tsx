"use client";

import React, { useState } from "react";

interface DiscoveryResult {
  intent: string;
  interests: string[];
  location_hint: string;
  time_preferences: string;
  other_constraints: string[];
}

export default function DiscoveryAssistantPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = query.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
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
    } catch (err: any) {
      setError(
        err.message || "Something went wrong talking to Discovery Assistant"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-start justify-center py-10">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg">
        <header className="mb-6">
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

        {result && (
          <section className="mt-8 border-t border-slate-800 pt-6 space-y-4">
            <h2 className="text-lg font-semibold">Interpreted filters</h2>

            <div className="space-y-1">
              <p className="text-sm text-slate-300">
                <span className="font-medium">Intent:</span> {result.intent}
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-medium">Interests:</span>{" "}
                {result.interests?.length
                  ? result.interests.join(", ")
                  : "None detected"}
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-medium">Location hint:</span>{" "}
                {result.location_hint || "None detected"}
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-medium">Time preferences:</span>{" "}
                {result.time_preferences || "None detected"}
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-medium">Other constraints:</span>{" "}
                {result.other_constraints?.length
                  ? result.other_constraints.join(", ")
                  : "None detected"}
              </p>
            </div>

            <p className="text-xs text-slate-500">
              These filters can be used to search for matching people, groups, and events in your database.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

