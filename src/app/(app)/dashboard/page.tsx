"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface UserProfile {
  id: string;
  display_name: string | null;
  short_bio: string | null;
  long_bio: string | null;
  tags: string[] | null;
  social_style: string | null;
  preferred_group_size: string | null;
  availability_summary: string | null;
  profile_complete?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleGoToDiscover = () => {
    router.push("/discover/assistant");
  };

  const handleGoToHost = () => {
    // Placeholder route for now
    router.push("/events/create"); // change when you have this route
  };

  const handleEditProfile = () => {
    // Later you can build a dedicated profile edit page
    router.push("/profile"); // placeholder
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex justify-center py-10">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg">
        <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
              Welcome to Gathered
            </p>
            <h1 className="text-2xl font-semibold">
              {profile?.display_name
                ? `Hey, ${profile.display_name} 👋`
                : "Hey, welcome 👋"}
            </h1>
            <p className="text-sm text-slate-400">
              Your profile is set. Let&apos;s help you find your people and plan your next hangout.
            </p>
          </div>
        </header>

        {loading && (
          <p className="text-sm text-slate-300">Loading your dashboard...</p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-400">
            {error}
          </p>
        )}

        {!loading && profile && (
          <div className="grid gap-6 mt-4 md:grid-cols-[2fr,3fr]">
            {/* Left: profile summary */}
            <section className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h2 className="text-sm font-semibold mb-2">Your profile</h2>
                {profile.short_bio && (
                  <p className="text-sm text-slate-200 mb-1">
                    {profile.short_bio}
                  </p>
                )}
                {profile.long_bio && (
                  <p className="text-xs text-slate-400">
                    {profile.long_bio}
                  </p>
                )}

                <div className="mt-3 space-y-1">
                  {profile.tags && profile.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {profile.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full bg-slate-800 text-xs text-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-400">
                    <span className="font-medium text-slate-300">Social style:</span>{" "}
                    {profile.social_style || "Not set"}
                  </p>
                  <p className="text-xs text-slate-400">
                    <span className="font-medium text-slate-300">Group size:</span>{" "}
                    {profile.preferred_group_size || "Not set"}
                  </p>
                  <p className="text-xs text-slate-400">
                    <span className="font-medium text-slate-300">Availability:</span>{" "}
                    {profile.availability_summary || "Not set"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleEditProfile}
                  className="mt-4 text-xs px-3 py-2 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800"
                >
                  Edit profile
                </button>
              </div>
            </section>

            {/* Right: next actions */}
            <section className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h2 className="text-sm font-semibold mb-2">
                  Start with one of these
                </h2>
                <p className="text-xs text-slate-400 mb-3">
                  Think of this as your first mission. We&apos;ll keep it light.
                </p>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoToDiscover}
                    className="w-full text-left px-3 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/60 hover:bg-emerald-500/20"
                  >
                    <p className="text-sm font-medium text-emerald-300">
                      🔍 Find your people
                    </p>
                    <p className="text-xs text-slate-200">
                      Use Discovery Assistant to search for people, groups, and events that match your vibe.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={handleGoToHost}
                    className="w-full text-left px-3 py-3 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800"
                  >
                    <p className="text-sm font-medium text-slate-100">
                      📅 Host your first hangout
                    </p>
                    <p className="text-xs text-slate-300">
                      Use the Activity Planner (coming soon) to turn your idea into a real event.
                    </p>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h2 className="text-sm font-semibold mb-2">
                  What we know about you so far
                </h2>
                <p className="text-xs text-slate-300 mb-2">
                  We&apos;ll use this to recommend better people and activities as Gathered grows:
                </p>
                <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
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
                </ul>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
