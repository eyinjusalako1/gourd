import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

/**
 * GET /api/events/[id]
 * 
 * Gets an event by ID. Uses server-side Supabase to bypass RLS.
 * This ensures events created with supabaseServer can be read.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    console.log('API: Fetching event with ID:', eventId);

    // Query using server-side Supabase (bypasses RLS)
    const { data: event, error } = await supabaseServer
      .from("events")
      .select("*")
      .eq("id", eventId.trim())
      .maybeSingle();

    if (error) {
      console.error("Error fetching event:", error);
      return NextResponse.json(
        { error: "Failed to fetch event", details: error.message },
        { status: 500 }
      );
    }

    if (!event) {
      console.warn("Event not found for ID:", eventId);
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    console.log("Event found:", event.id, event.title);
    return NextResponse.json({ event }, { status: 200 });
  } catch (error: any) {
    console.error("Unexpected error fetching event:", error);
    return NextResponse.json(
      { error: "Unexpected error fetching event", details: error.message },
      { status: 500 }
    );
  }
}

