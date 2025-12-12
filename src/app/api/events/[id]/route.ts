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

    // Decode the event ID in case it was URL encoded
    const decodedEventId = decodeURIComponent(eventId.trim());
    console.log('API: Fetching event with ID:', decodedEventId);

    // Query using server-side Supabase (bypasses RLS)
    const { data: event, error } = await supabaseServer
      .from("events")
      .select("*")
      .eq("id", decodedEventId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching event:", error);
      return NextResponse.json(
        { error: "Failed to fetch event", details: error.message },
        { status: 500 }
      );
    }

    if (!event) {
      console.warn("Event not found for ID:", decodedEventId);
      // Try one more time without trimming, in case there's a whitespace issue
      const { data: eventRetry, error: retryError } = await supabaseServer
        .from("events")
        .select("*")
        .eq("id", eventId.trim())
        .maybeSingle();
      
      if (eventRetry) {
        console.log("Event found on retry:", eventRetry.id, eventRetry.title);
        return NextResponse.json({ event: eventRetry }, { status: 200 });
      }
      
      return NextResponse.json(
        { error: "Event not found", eventId: decodedEventId },
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


