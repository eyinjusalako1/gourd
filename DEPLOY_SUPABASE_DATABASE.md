# Deploy Gamification Schema to Supabase
## Quick Setup Guide

**Your Project:** https://supabase.com/dashboard/project/tkhbdtfljxkhgeccqnpq

---

## 🎯 Step 1: Open SQL Editor

1. Go to your Supabase dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"** button

---

## 📝 Step 2: Copy & Paste Schema

Open the file `GAMIFICATION_SCHEMA.sql` in your project root.

**Copy the entire file** and paste it into the SQL Editor.

---

## 🚀 Step 3: Run Migration

1. Click **"Run"** button (or press Ctrl+Enter)
2. Wait for execution to complete
3. Check for any errors

**Expected Result:**
```
Success. No rows returned
```

---

## ✅ Step 4: Verify Tables

Go to **Table Editor** in Supabase dashboard.

You should see these **10 new tables**:
- ✅ `faith_flames`
- ✅ `faith_streaks`
- ✅ `unity_points`
- ✅ `unity_contributions`
- ✅ `challenge_templates`
- ✅ `weekly_challenges`
- ✅ `challenge_progress`
- ✅ `blessing_badges`
- ✅ `user_badges`
- ✅ `fellowship_highlights`

---

## 🔐 Step 5: Set Up Row Level Security

The schema includes RLS policies. To enable:

1. Go to **Authentication > Policies**
2. For each gamification table, enable RLS
3. Or run this in SQL Editor:

```sql
ALTER TABLE faith_flames ENABLE ROW LEVEL SECURITY;
ALTER TABLE faith_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE unity_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
```

---

## 🌱 Step 6: Verify Seed Data

The schema includes seed data for:
- Challenge templates (5 pre-defined)
- Blessing badges (8 pre-defined)

Check in Table Editor:
- `challenge_templates` should have 5 rows
- `blessing_badges` should have 8 rows

---

## 🧪 Step 7: Test Connection

Your Next.js app is already configured! Test by:

1. Go to http://localhost:3000/dashboard
2. Look for gamification UI
3. Check browser console for API calls

**Expected:** Real data from Supabase (not mock data)

---

## 🐛 Troubleshooting

### "relation does not exist"
- Run the full schema again
- Check for missing semicolons

### "foreign key constraint fails"
- Ensure existing tables (`users`, `fellowships`) exist
- Check your table names match exactly

### "permission denied"
- Enable RLS properly
- Check your anon key permissions

### Still seeing mock data?
- Restart Next.js dev server
- Clear browser cache
- Check `.env.local` has correct credentials

---

## 📊 What You'll See

Once deployed, the dashboard will show:
- Real Faith Flame streaks
- Actual Unity Points
- Live challenge progress
- Earned badges
- Fellowship highlights

---

## 🎉 Done!

Your gamification system is now live with real data!

**Next:** Test with actual fellowship activity to see engagement metrics in action.

---

**Need Help?** Check `GAMIFICATION_SCHEMA.sql` for all table definitions and constraints.




