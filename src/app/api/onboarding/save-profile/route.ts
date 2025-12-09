import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Lazy initialization of Supabase admin client (only when needed)
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase configuration missing. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, answers, onboardingResult } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (!onboardingResult) {
      return NextResponse.json(
        { error: "Onboarding result is required" },
        { status: 400 }
      );
    }

    // Parse interests from answers
    const interestsArray = answers?.interests
      ? answers.interests
          .split(",")
          .map((i: string) => i.trim())
          .filter((i: string) => i.length > 0)
      : [];

    // Combine AI-generated tags with parsed interests
    const allTags = [
      ...(onboardingResult.tags || []),
      ...interestsArray,
    ];
    const uniqueTags = Array.from(new Set(allTags));

    // Parse availability from answers
    const availabilityArray = answers?.availability
      ? answers.availability
          .split(",")
          .map((a: string) => a.trim())
          .filter((a: string) => a.length > 0)
      : [];

    // Prepare profile update payload
    const profileUpdate = {
      id: userId,
      bio: onboardingResult.long_bio || onboardingResult.short_bio || null,
      interests: uniqueTags.length > 0 ? uniqueTags : null,
      availability: availabilityArray.length > 0 ? availabilityArray : null,
      profile_complete: true,
      updated_at: new Date().toISOString(),
    };

    // Save to Supabase using admin client (bypasses RLS)
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("user_profiles")
      .upsert(profileUpdate, {
        onConflict: "id",
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving profile to Supabase:", error);
      return NextResponse.json(
        {
          error: "Failed to save profile to database",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: data,
      message: "Profile saved successfully",
    });
  } catch (error: any) {
    console.error("Unexpected error saving profile:", error);
    return NextResponse.json(
      {
        error: "Unexpected error saving profile",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

