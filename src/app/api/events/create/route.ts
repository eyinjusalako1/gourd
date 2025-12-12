import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { isUserSteward } from "@/lib/server-auth";

/**
 * POST /api/events/create
 * 
 * Creates a new event. Only Stewards can create events.
 * 
 * Authorization:
 * - Requires authenticated user (userId in request body)
 * - User must have role = "steward" in user_profiles
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, ...eventData } = body;

    // Validate userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user is a Steward (server-side authorization)
    const isSteward = await isUserSteward(userId);

    if (!isSteward) {
      return NextResponse.json(
        { error: "Only Stewards can create events" },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!eventData.title || !eventData.description || !eventData.start_time) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, start_time" },
        { status: 400 }
      );
    }

    // Ensure created_by matches the authenticated user (security)
    const finalEventData = {
      ...eventData,
      created_by: userId, // Use userId from request (validated above)
      is_active: true,
    };

    // Insert event using service role (bypasses RLS)
    const { data: event, error: insertError } = await supabaseServer
      .from("events")
      .insert([finalEventData])
      .select()
      .single();

    if (insertError) {
      console.error("Error creating event:", insertError);
      return NextResponse.json(
        { error: "Failed to create event", details: insertError.message },
        { status: 500 }
      );
    }

    // Ensure event has an ID before returning
    if (!event || !event.id) {
      console.error("Event created but missing ID:", event);
      return NextResponse.json(
        { error: "Event created but ID is missing" },
        { status: 500 }
      );
    }

    return NextResponse.json({ event }, { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error creating event:", error);
    return NextResponse.json(
      { error: "Unexpected error creating event", details: error.message },
      { status: 500 }
    );
  }
}

