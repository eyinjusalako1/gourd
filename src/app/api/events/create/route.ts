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
    if (!eventData.title || !eventData.description || !eventData.start_time || !eventData.end_time) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, start_time, end_time" },
        { status: 400 }
      );
    }

    // Ensure created_by matches the authenticated user (security)
    const finalEventData = {
      ...eventData,
      created_by: userId, // Use userId from request (validated above)
      is_active: true,
    };

    // Clean up eventData - remove undefined values and ensure proper types
    const cleanedEventData: any = {
      title: finalEventData.title,
      description: finalEventData.description,
      event_type: finalEventData.event_type,
      start_time: finalEventData.start_time,
      end_time: finalEventData.end_time,
      created_by: finalEventData.created_by,
      is_active: finalEventData.is_active,
    }

    // Add optional fields only if they exist
    if (finalEventData.location) cleanedEventData.location = finalEventData.location
    if (finalEventData.is_virtual !== undefined) cleanedEventData.is_virtual = finalEventData.is_virtual
    if (finalEventData.virtual_link) cleanedEventData.virtual_link = finalEventData.virtual_link
    if (finalEventData.virtual_platform) cleanedEventData.virtual_platform = finalEventData.virtual_platform
    if (finalEventData.max_attendees) cleanedEventData.max_attendees = finalEventData.max_attendees
    if (finalEventData.is_recurring !== undefined) cleanedEventData.is_recurring = finalEventData.is_recurring
    if (finalEventData.recurrence_pattern) cleanedEventData.recurrence_pattern = finalEventData.recurrence_pattern
    if (finalEventData.recurrence_end_date) cleanedEventData.recurrence_end_date = finalEventData.recurrence_end_date
    if (finalEventData.group_id) cleanedEventData.group_id = finalEventData.group_id
    if (finalEventData.tags && Array.isArray(finalEventData.tags) && finalEventData.tags.length > 0) {
      cleanedEventData.tags = finalEventData.tags
    }
    if (finalEventData.requires_rsvp !== undefined) cleanedEventData.requires_rsvp = finalEventData.requires_rsvp
    if (finalEventData.allow_guests !== undefined) cleanedEventData.allow_guests = finalEventData.allow_guests

    // Insert event using service role (bypasses RLS)
    // Select only specific columns to avoid PostgREST relationship resolution issues
    const { data: events, error: insertError } = await supabaseServer
      .from("events")
      .insert([cleanedEventData])
      .select('id, title, description, event_type, location, is_virtual, virtual_link, virtual_platform, start_time, end_time, created_by, created_at, updated_at, rsvp_count, max_attendees, is_recurring, recurrence_pattern, recurrence_end_date, group_id, is_active, tags, requires_rsvp, allow_guests')
      .limit(1);

    if (insertError) {
      console.error("Error creating event:", insertError);
      console.error("Event data attempted:", cleanedEventData);
      return NextResponse.json(
        { error: "Failed to create event", details: insertError.message, code: insertError.code },
        { status: 500 }
      );
    }

    // Get first result (should only be one)
    const event = events && events.length > 0 ? events[0] : null;

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

