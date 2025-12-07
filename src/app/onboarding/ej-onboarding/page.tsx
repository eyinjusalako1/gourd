"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useUserProfile } from "@/hooks/useUserProfile";

type Step = 1 | 2 | 3;

interface Answers {
  interests: string;
  weekend_style: string;
  social_energy: string;
  availability: string;
  preferred_group_size: string;
}

interface EjResult {
  short_bio: string;
  long_bio: string;
  tags: string[];
  social_style: string;
  preferred_group_size: string;
  availability_summary: string;
}

export default function EjOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { updateProfile, markProfileComplete } = useUserProfile();
  const [step, setStep] = useState<Step>(1);
  const [answers, setAnswers] = useState<Answers>({
    interests: "",
    weekend_style: "",
    social_energy: "",
    availability: "",
    preferred_group_size: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [ejResult, setEjResult] = useState<EjResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateAnswer = (field: keyof Answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const canGoNext = () => {
    if (step === 1) {
      return answers.interests.trim().length > 0;
    }
    if (step === 2) {
      return (
        answers.weekend_style.trim().length > 0 &&
        answers.social_energy.trim().length > 0
      );
    }
    if (step === 3) {
      return (
        answers.availability.trim().length > 0 &&
        answers.preferred_group_size.trim().length > 0
      );
    }
    return false;
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    setStep((prev) => (prev < 3 ? ((prev + 1) as Step) : prev));
  };

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    setEjResult(null);

    try {
      const res = await fetch("/api/agents/EJ", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const errorMessage = data?.error || "Failed to contact EJ";
        
        // Show user-friendly message for quota errors
        if (data?.code === "QUOTA_EXCEEDED" || errorMessage.includes("quota")) {
          throw new Error(
            "The AI service is temporarily unavailable due to usage limits. " +
            "Please try again later, or contact support if this persists."
          );
        }
        
        throw new Error(errorMessage);
      }

      const json = await res.json();
      const data = json.data as EjResult;
      setEjResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong talking to EJ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalAction = async () => {
    if (!user || !ejResult) return;

    setIsSaving(true);
    setError(null);

    try {
      // Parse interests from answers
      const interestsArray = answers.interests
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);

      // Combine EJ-generated tags with parsed interests
      const allTags = [...(ejResult.tags || []), ...interestsArray];
      const uniqueTags = Array.from(new Set(allTags));

      // Parse availability from answers
      const availabilityArray = answers.availability
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      // Update profile with EJ-generated data
      await updateProfile({
        bio: ejResult.long_bio || ejResult.short_bio || null,
        interests: uniqueTags.length > 0 ? uniqueTags : null,
        availability: availabilityArray.length > 0 ? availabilityArray : null,
      });

      // Mark profile as complete
      await markProfileComplete();

      // Redirect to dashboard
      router.replace('/dashboard');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-xl bg-slate-900 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-800">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
            Gathered Onboarding
          </p>
          <h1 className="text-2xl font-semibold mb-1">Let&apos;s get to know you</h1>
          <p className="text-sm text-slate-400">
            Step {step} of 3
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 mb-6 overflow-hidden">
          <div
            className="h-2 bg-emerald-400 transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {step === 1 && (
          <section className="space-y-4">
            <h2 className="text-lg font-medium">Your interests</h2>
            <p className="text-sm text-slate-400">
              Tell EJ what you&apos;re into so we can match you with the right people and activities.
            </p>
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                What are your main interests?
              </label>
              <textarea
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={3}
                placeholder="e.g. gym, anime, church, brunch, football, gaming..."
                value={answers.interests}
                onChange={(e) => updateAnswer("interests", e.target.value)}
              />
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <h2 className="text-lg font-medium">Your social vibe</h2>
            <p className="text-sm text-slate-400">
              Help us understand what kind of social energy you bring.
            </p>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                What does your ideal weekend look like?
              </label>
              <textarea
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={3}
                placeholder="e.g. gym in the morning, church on Sunday, anime or Netflix in the evening..."
                value={answers.weekend_style}
                onChange={(e) => updateAnswer("weekend_style", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                How would you describe your social energy?
              </label>
              <select
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={answers.social_energy}
                onChange={(e) => updateAnswer("social_energy", e.target.value)}
              >
                <option value="">Select one</option>
                <option value="introvert">Introvert</option>
                <option value="ambivert">Ambivert</option>
                <option value="extrovert">Extrovert</option>
                <option value="depends_on_vibes">Depends on the vibes</option>
              </select>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <h2 className="text-lg font-medium">Timing & group size</h2>
            <p className="text-sm text-slate-400">
              When are you usually free and what kind of group size do you prefer?
            </p>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                When are you usually available?
              </label>
              <textarea
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={2}
                placeholder="e.g. weekday evenings after 6pm, Saturdays, Sunday afternoons..."
                value={answers.availability}
                onChange={(e) => updateAnswer("availability", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                What kind of group size do you prefer?
              </label>
              <select
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={answers.preferred_group_size}
                onChange={(e) =>
                  updateAnswer("preferred_group_size", e.target.value)
                }
              >
                <option value="">Select one</option>
                <option value="1-1">One-on-one</option>
                <option value="3-5">Small group (3–5)</option>
                <option value="6-10">Medium group (6–10)</option>
                <option value="10+">Bigger vibes (10+)</option>
                <option value="no_preference">No preference</option>
              </select>
            </div>
          </section>
        )}

        {/* Error */}
        {error && (
          <p className="mt-4 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
            className="text-sm px-3 py-2 rounded-lg border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {step < 3 && (
            <button
              type="button"
              disabled={!canGoNext() || isSubmitting}
              onClick={handleNext}
              className="ml-auto text-sm px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              disabled={!canGoNext() || isSubmitting}
              onClick={handleSubmit}
              className="ml-auto text-sm px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Talking to EJ..." : "Finish with EJ"}
            </button>
          )}
        </div>

        {/* EJ result */}
        {ejResult && (
          <div className="mt-8 border-t border-slate-800 pt-6 space-y-3">
            <h2 className="text-lg font-semibold">Here&apos;s your Gathered profile from EJ</h2>
            <p className="text-sm text-slate-300">
              <span className="font-medium">Short bio:</span> {ejResult.short_bio}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-medium">Long bio:</span> {ejResult.long_bio}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-medium">Tags:</span> {ejResult.tags?.join(", ")}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-medium">Social style:</span> {ejResult.social_style}
            </p>
            <p className="text-sm text-slate-300">
              <span className="font-medium">Availability:</span> {ejResult.availability_summary}
            </p>

            <button
              type="button"
              onClick={handleFinalAction}
              disabled={isSaving}
              className="mt-3 w-full text-sm px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-400 transition-colors"
            >
              {isSaving ? "Saving your profile..." : "Save & Continue to Dashboard"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

