-- Create group_chat_messages table for fellowship group chats
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS group_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES fellowship_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'devotion_share')),
  metadata JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for efficient querying by group and time
CREATE INDEX IF NOT EXISTS idx_group_chat_messages_group_created 
ON group_chat_messages(group_id, created_at DESC);

-- Enable RLS
ALTER TABLE group_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy 1: SELECT - Allow authenticated users who are active members of the group
CREATE POLICY "Users can view messages in groups they are members of"
ON group_chat_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM group_memberships
    WHERE group_memberships.group_id = group_chat_messages.group_id
      AND group_memberships.user_id = auth.uid()
      AND group_memberships.status = 'active'
  )
);

-- RLS Policy 2: INSERT - Allow authenticated users who are active members of the group
CREATE POLICY "Users can post messages in groups they are members of"
ON group_chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM group_memberships
    WHERE group_memberships.group_id = group_chat_messages.group_id
      AND group_memberships.user_id = auth.uid()
      AND group_memberships.status = 'active'
  )
);

