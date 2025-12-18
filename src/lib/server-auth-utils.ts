import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Get authenticated user from request (for API routes)
 * Extracts session from cookies and returns user ID
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<{ userId: string; email?: string } | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    // Create a client with the anon key
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Try to get from Authorization header first
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error) {
        console.error("Error verifying token from Authorization header:", error);
      } else if (user) {
        return { userId: user.id, email: user.email };
      }
    }

    // Try to get from cookies (Supabase stores session in cookies)
    // Cookie name format: sb-<project-ref>-auth-token
    const projectRef = supabaseUrl.split("//")[1]?.split(".")[0];
    const cookieName = projectRef ? `sb-${projectRef}-auth-token` : null;
    
    if (cookieName) {
      const cookieValue = req.cookies.get(cookieName)?.value;
      if (cookieValue) {
        try {
          // Parse the cookie (it's a JSON string with access_token)
          const sessionData = JSON.parse(decodeURIComponent(cookieValue));
          if (sessionData?.access_token) {
            const { data: { user }, error } = await supabase.auth.getUser(sessionData.access_token);
            if (!error && user) {
              return { userId: user.id, email: user.email };
            }
          }
        } catch (e) {
          // Cookie parsing failed, continue to other methods
        }
      }
    }

    // Fallback: try common cookie names
    const commonCookies = [
      "sb-access-token",
      "sb-auth-token",
      "supabase.auth.token",
    ];

    for (const cookieName of commonCookies) {
      const cookieValue = req.cookies.get(cookieName)?.value;
      if (cookieValue) {
        try {
          const sessionData = typeof cookieValue === 'string' && cookieValue.startsWith('{') 
            ? JSON.parse(decodeURIComponent(cookieValue))
            : { access_token: cookieValue };
          
          if (sessionData?.access_token) {
            const { data: { user }, error } = await supabase.auth.getUser(sessionData.access_token);
            if (!error && user) {
              return { userId: user.id, email: user.email };
            }
          }
        } catch (e) {
          // Continue to next cookie
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting authenticated user:", error);
    return null;
  }
}

