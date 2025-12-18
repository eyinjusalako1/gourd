# Group Chat Setup Instructions

## Database Migration Required

The group chat feature requires the `group_chat_messages` table to be created in your Supabase database.

### Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to your project
   - Click on "SQL Editor" in the left sidebar

2. **Run the Migration**
   - Open the file: `supabase-migrations/create-group-chat-messages.sql`
   - Copy the entire SQL script
   - Paste it into the SQL Editor
   - Click "Run" to execute

3. **Verify the Table was Created**
   - Go to "Table Editor" in Supabase
   - You should see `group_chat_messages` in the list of tables

### What the Migration Creates:

- **Table**: `group_chat_messages`
  - Stores chat messages for fellowship groups
  - Links messages to groups and users
  - Supports text messages and devotion shares

- **RLS Policies**:
  - Users can only view messages in groups they're members of
  - Users can only post messages in groups they're members of

### Troubleshooting:

If you're still getting errors after running the migration:

1. **Check if the table exists:**
   ```sql
   SELECT * FROM group_chat_messages LIMIT 1;
   ```

2. **Check RLS policies:**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'group_chat_messages';
   ```

3. **Verify you're a member of the group:**
   - Go to the group detail page
   - Make sure you've joined the group
   - Check that your membership status is "active"

4. **Check server logs:**
   - In Vercel, go to your deployment
   - Check the "Functions" tab for error logs
   - Look for detailed error messages from the API route

