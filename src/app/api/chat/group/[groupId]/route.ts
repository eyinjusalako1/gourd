import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getAuthenticatedUser } from "@/lib/server-auth-utils";

/**
 * GET /api/chat/group/[groupId]
 * 
 * Fetches messages for a group chat.
 * 
 * Authorization:
 * - Requires authenticated user
 * - User must be an active member of the group
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> | { groupId: string } }
) {
  try {
    // Resolve params (handle both Promise and direct params)
    const resolvedParams = params instanceof Promise ? await params : params;
    const groupId = resolvedParams.groupId;

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    // Get authenticated user from request
    const authUser = await getAuthenticatedUser(req);
    
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = authUser.userId;

    // Verify user is an active member of the group
    const { data: membership, error: membershipError } = await supabaseServer
      .from("group_memberships")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(1);

    if (membershipError || !membership || membership.length === 0) {
      return NextResponse.json(
        { error: "You must be an active member of this group to view messages" },
        { status: 403 }
      );
    }

    // Fetch messages (RLS will also enforce access)
    // Use explicit column selection to avoid PostgREST relationship resolution issues
    const { data: messages, error: messagesError } = await supabaseServer
      .from("group_chat_messages")
      .select("id, group_id, user_id, content, type, metadata, created_at")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true })
      .limit(50);

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return NextResponse.json(
        { error: "Failed to fetch messages", details: messagesError.message },
        { status: 500 }
      );
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({ messages: [] });
    }

    // Get user profiles for message authors (fetch separately to avoid relationship issues)
    const userIds = Array.from(new Set(messages.map((m: any) => m.user_id)));
    let profileMap = new Map();
    
    if (userIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabaseServer
        .from("user_profiles")
        .select("id, name, avatar_url")
        .in("id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        // Continue without profiles - we'll use fallbacks
      } else if (profiles) {
        profileMap = new Map(profiles.map((p: any) => [p.id, p]));
      }
    }

    // Combine messages with user profiles
    const messagesWithProfiles = messages.map((message: any) => {
      const profile = profileMap.get(message.user_id);
      
      return {
        id: message.id,
        group_id: message.group_id,
        user_id: message.user_id,
        content: message.content,
        type: message.type,
        metadata: message.metadata,
        created_at: message.created_at,
        user: {
          id: message.user_id,
          name: profile?.name || `User ${message.user_id.substring(0, 8)}`,
          avatar_url: profile?.avatar_url || null,
        },
      };
    });

    return NextResponse.json({ messages: messagesWithProfiles });
  } catch (error: any) {
    console.error("Error in GET /api/chat/group/[groupId]:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/chat/group/[groupId]
 * 
 * Posts a new message to a group chat.
 * 
 * Authorization:
 * - Requires authenticated user
 * - User must be an active member of the group
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> | { groupId: string } }
) {
  try {
    // Resolve params
    const resolvedParams = params instanceof Promise ? await params : params;
    const groupId = resolvedParams.groupId;

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { content, type = "text", metadata } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // Get authenticated user from request
    const authUser = await getAuthenticatedUser(req);
    
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = authUser.userId;

    // Verify user is an active member of the group
    const { data: membership, error: membershipError } = await supabaseServer
      .from("group_memberships")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", userId)
      .eq("status", "active")
      .limit(1);

    if (membershipError || !membership || membership.length === 0) {
      return NextResponse.json(
        { error: "You must be an active member of this group to post messages" },
        { status: 403 }
      );
    }

    // Insert message (RLS will also enforce access)
    const { data: messages, error: insertError } = await supabaseServer
      .from("group_chat_messages")
      .insert({
        group_id: groupId,
        user_id: userId,
        content: content.trim(),
        type: type || "text",
        metadata: metadata || null,
      })
      .select(`
        id,
        group_id,
        user_id,
        content,
        type,
        metadata,
        created_at
      `)
      .limit(1);

    if (insertError) {
      console.error("Error inserting message:", insertError);
      return NextResponse.json(
        { error: "Failed to post message", details: insertError.message },
        { status: 500 }
      );
    }

    // Get first result (should only be one)
    const newMessage = messages && messages.length > 0 ? messages[0] : null;
    
    if (!newMessage) {
      return NextResponse.json(
        { error: "Message created but could not be retrieved" },
        { status: 500 }
      );
    }

    // Get user profile for the message author (use limit(1) instead of single() to avoid relationship issues)
    const { data: profileData } = await supabaseServer
      .from("user_profiles")
      .select("id, name, avatar_url")
      .eq("id", userId)
      .limit(1);

    const profile = profileData && profileData.length > 0 ? profileData[0] : null;

    const messageWithProfile = {
      ...newMessage,
      user: {
        id: userId,
        name: profile?.name || authUser.email?.split("@")[0] || "User",
        avatar_url: profile?.avatar_url || null,
      },
    };

    return NextResponse.json({ message: messageWithProfile }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/chat/group/[groupId]:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

