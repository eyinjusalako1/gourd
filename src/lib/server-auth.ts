import { supabaseServer } from "./supabaseServer";

/**
 * Server-side utility to check if a user is a Steward
 * @param userId - The user's ID from auth.users
 * @returns Promise<boolean> - true if user is a Steward, false otherwise
 */
export async function isUserSteward(userId: string): Promise<boolean> {
  try {
    const { data: profile, error } = await supabaseServer
      .from("user_profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return false;
    }

    // Normalize role to lowercase for comparison
    const role = typeof profile.role === "string" 
      ? profile.role.toLowerCase() 
      : profile.role;

    return role === "steward";
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
}

/**
 * Server-side utility to get user's role
 * @param userId - The user's ID from auth.users
 * @returns Promise<string | null> - User's role or null if not found
 */
export async function getUserRole(userId: string): Promise<string | null> {
  try {
    const { data: profile, error } = await supabaseServer
      .from("user_profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return null;
    }

    return typeof profile.role === "string" 
      ? profile.role.toLowerCase() 
      : profile.role;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

