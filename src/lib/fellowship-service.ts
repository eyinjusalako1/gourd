import { supabase } from './supabase'
import { FellowshipGroup, GroupMembership, JoinRequest } from '@/types'

export class FellowshipService {
  // Get all public groups or groups user is member of
  static async getGroups(userId?: string): Promise<FellowshipGroup[]> {
    let query = supabase
      .from('fellowship_groups')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (userId) {
      // Get public groups + groups user is member of
      const { data: userGroups } = await supabase
        .from('group_memberships')
        .select('group_id')
        .eq('user_id', userId)
        .eq('status', 'active')

      const userGroupIds = userGroups?.map(m => m.group_id) || []
      
      if (userGroupIds.length > 0) {
        query = query.or(`is_private.eq.false,id.in.(${userGroupIds.join(',')})`)
      } else {
        query = query.eq('is_private', false)
      }
    } else {
      query = query.eq('is_private', false)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Get group by ID
  static async getGroup(groupId: string): Promise<FellowshipGroup | null> {
    const { data, error } = await supabase
      .from('fellowship_groups')
      .select('*')
      .eq('id', groupId)
      .single()

    if (error) throw error
    return data
  }

  // Create a new fellowship group
  static async createGroup(groupData: Omit<FellowshipGroup, 'id' | 'created_at' | 'updated_at' | 'member_count'>): Promise<FellowshipGroup> {
    const { data, error } = await supabase
      .from('fellowship_groups')
      .insert([groupData])
      .select()
      .single()

    if (error) throw error

    // Add creator as admin member
    await supabase
      .from('group_memberships')
      .insert([{
        group_id: data.id,
        user_id: groupData.created_by,
        role: 'admin',
        status: 'active',
        joined_at: new Date().toISOString()
      }])

    return data
  }

  // Join a group (for public groups)
  static async joinGroup(groupId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('group_memberships')
      .insert([{
        group_id: groupId,
        user_id: userId,
        role: 'member',
        status: 'active',
        joined_at: new Date().toISOString()
      }])

    if (error) throw error

    // Update member count
    await this.updateMemberCount(groupId)
  }

  // Request to join a private group
  static async requestToJoinGroup(groupId: string, userId: string, message?: string): Promise<void> {
    const { error } = await supabase
      .from('join_requests')
      .insert([{
        group_id: groupId,
        user_id: userId,
        message,
        status: 'pending'
      }])

    if (error) throw error
  }

  // Approve join request
  static async approveJoinRequest(requestId: string, approvedBy: string): Promise<void> {
    const { data: request } = await supabase
      .from('join_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (!request) throw new Error('Request not found')

    // Add user to group
    await supabase
      .from('group_memberships')
      .insert([{
        group_id: request.group_id,
        user_id: request.user_id,
        role: 'member',
        status: 'active',
        joined_at: new Date().toISOString(),
        invited_by: approvedBy
      }])

    // Update request status
    await supabase
      .from('join_requests')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: approvedBy
      })
      .eq('id', requestId)

    // Update member count
    await this.updateMemberCount(request.group_id)
  }

  // Reject join request
  static async rejectJoinRequest(requestId: string, rejectedBy: string): Promise<void> {
    const { error } = await supabase
      .from('join_requests')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString(),
        reviewed_by: rejectedBy
      })
      .eq('id', requestId)

    if (error) throw error
  }

  // Get group members
  static async getGroupMembers(groupId: string): Promise<GroupMembership[]> {
    const { data, error } = await supabase
      .from('group_memberships')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('group_id', groupId)
      .eq('status', 'active')

    if (error) throw error
    return data || []
  }

  // Get pending join requests for a group
  static async getPendingRequests(groupId: string): Promise<JoinRequest[]> {
    const { data, error } = await supabase
      .from('join_requests')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('group_id', groupId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Check if user is member of group
  static async isMember(groupId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('group_memberships')
      .select('id')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    return !error && !!data
  }

  // Check if user is admin of group
  static async isAdmin(groupId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('group_memberships')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    return !error && data?.role === 'admin'
  }

  // Update member count
  private static async updateMemberCount(groupId: string): Promise<void> {
    const { count } = await supabase
      .from('group_memberships')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', groupId)
      .eq('status', 'active')

    await supabase
      .from('fellowship_groups')
      .update({ member_count: count || 0 })
      .eq('id', groupId)
  }

  // Leave group
  static async leaveGroup(groupId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('group_memberships')
      .update({ status: 'inactive' })
      .eq('group_id', groupId)
      .eq('user_id', userId)

    if (error) throw error

    // Update member count
    await this.updateMemberCount(groupId)
  }
}


