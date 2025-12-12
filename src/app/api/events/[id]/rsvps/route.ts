import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

/**
 * GET /api/events/[id]/rsvps
 * 
 * Gets RSVPs for an event with user profile data. Uses server-side Supabase to bypass RLS.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (Next.js 14 vs 15 compatibility)
    const resolvedParams = params instanceof Promise ? await params : params;
    const eventId = resolvedParams.id;

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const decodedEventId = decodeURIComponent(eventId.trim());
    console.log('API: Fetching RSVPs for event ID:', decodedEventId);

    // Fetch RSVPs
    const { data: rsvps, error: rsvpsError } = await supabaseServer
      .from("event_rsvps")
      .select("*")
      .eq("event_id", decodedEventId)
      .order("rsvp_date", { ascending: false });

    if (rsvpsError) {
      console.error("Error fetching RSVPs:", rsvpsError);
      return NextResponse.json(
        { error: "Failed to fetch RSVPs", details: rsvpsError.message },
        { status: 500 }
      );
    }

    if (!rsvps || rsvps.length === 0) {
      return NextResponse.json({ rsvps: [] }, { status: 200 });
    }

    // Fetch user profiles for all RSVP user IDs
    const userIds = Array.from(new Set(rsvps.map((r: any) => r.user_id)));
    const { data: profiles, error: profilesError } = await supabaseServer
      .from("user_profiles")
      .select("id, name, email, avatar_url")
      .in("id", userIds);

    // Create a map of user_id to profile
    const profileMap = new Map();
    if (profiles) {
      profiles.forEach((profile: any) => {
        profileMap.set(profile.id, profile);
      });
    }

    // Combine RSVPs with user profiles
    const rsvpsWithProfiles = rsvps.map((rsvp: any) => ({
      ...rsvp,
      user_profile: profileMap.get(rsvp.user_id) || null,
    }));

    console.log("RSVPs found:", rsvpsWithProfiles.length);
    return NextResponse.json({ rsvps: rsvpsWithProfiles }, { status: 200 });
  } catch (error: any) {
    console.error("Unexpected error fetching RSVPs:", error);
    return NextResponse.json(
      { error: "Unexpected error fetching RSVPs", details: error.message },
      { status: 500 }
    );
  }
}

