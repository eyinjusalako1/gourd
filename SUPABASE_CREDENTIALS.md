# 🔑 Supabase Credentials Reference

## **Where to Find Your Credentials:**

1. **Go to your Supabase project dashboard**
2. **Click Settings (gear icon)**
3. **Click "API" in the left sidebar**

## **Credentials You Need:**

### **Project URL**
```
https://your-project-id.supabase.co
```
- **Location**: Project Settings > API > Project URL
- **Usage**: Frontend connection to Supabase

### **Anon (Public) Key**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE5NTYzNTUyMDB9.your-signature-here
```
- **Location**: Project Settings > API > Project API keys > anon public
- **Usage**: Frontend authentication and data access
- **Security**: Safe to use in frontend code

### **Service Role Key**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2NDA5OTUyMDAsImV4cCI6MTk1NjM1NTIwMH0.your-signature-here
```
- **Location**: Project Settings > API > Project API keys > service_role secret
- **Usage**: Server-side operations, admin functions
- **Security**: ⚠️ KEEP SECRET - Never expose in frontend code!

## **Environment File Template:**

```bash
# Copy this to .env.local and fill in your actual values
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## **Database Password:**
- **Location**: Project Settings > Database > Database password
- **Usage**: Direct database access (rarely needed)
- **Security**: Keep secure, used for direct PostgreSQL connections

---

**Save this information securely! You'll need it for deployment.** 🔐


