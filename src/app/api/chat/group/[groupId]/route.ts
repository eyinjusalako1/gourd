import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

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
  { params }: { params: Promise<{ groupId: string }> | { id: string } }
) {
  try {
    // Resolve params (handle both Promise and direct params)
    const resolvedParams = params instanceof Promise ? await params : params;
    const groupId = 'groupId' in resolvedParams ? resolvedParams.groupId : ('id' in resolvedParams ? resolvedParams.id : '');

    if (!groupId) {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    // Get authenticated user from session
    const {
      data: { session },
      error: sessionError,
    } = await supabaseServer.auth.getSession();

    if (sessionError || !session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

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
    const { data: messages, error: messagesError } = await supabaseServer
      .from("group_chat_messages")
      .select(`
        id,
        group_id,
        user_id,
        content,
        type,
        metadata,
        created_at,
        user:user_id (
          id,
          email
        )
      `)
      .eq("group_id", groupId)
      .order("created_at", { ascending: true })
      .limit(50);

    if (messagesError) {
      console.error("Error fetching messages:", messagesError);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    // Get user profiles for message authors
    const userIds = Array.from(new Set(messages?.map((m: any) => m.user_id) || []));
    const { data: profiles } = await supabaseServer
      .from("user_profiles")
      .select("id, name, avatar_url")
      .in("id", userIds);

    const profileMap = new Map(profiles?.map((p: any) => [p.id, p]) || []);

    // Combine messages with user profiles
    const messagesWithProfiles = (messages || []).map((message: any) => ({
      id: message.id,
      group_id: message.group_id,
      user_id: message.user_id,
      content: message.content,
      type: message.type,
      metadata: message.metadata,
      created_at: message.created_at,
      user: {
        id: message.user_id,
        name: profileMap.get(message.user_id)?.name || message.user?.email?.split("@")[0] || "User",
        avatar_url: profileMap.get(message.user_id)?.avatar_url || null,
      },
    }));

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
  { params }: { params: Promise<{ groupId: string }> | { id: string } }
) {
  try {
    // Resolve params
    const resolvedParams = params instanceof Promise ? await params : params;
    const groupId = 'groupId' in resolvedParams ? resolvedParams.groupId : ('id' in resolvedParams ? resolvedParams.id : '');

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

    // Get authenticated user from session
    const {
      data: { session },
      error: sessionError,
    } = await supabaseServer.auth.getSession();

    if (sessionError || !session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

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
    const { data: message, error: insertError } = await supabaseServer
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
      .limit(1)
      .single();

    if (insertError) {
      console.error("Error inserting message:", insertError);
      return NextResponse.json(
        { error: "Failed to post message" },
        { status: 500 }
      );
    }

    // Get user profile for the message author
    const { data: profile } = await supabaseServer
      .from("user_profiles")
      .select("id, name, avatar_url")
      .eq("id", userId)
      .limit(1)
      .single();

    const messageWithProfile = {
      ...message,
      user: {
        id: userId,
        name: profile?.name || session.user.email?.split("@")[0] || "User",
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

