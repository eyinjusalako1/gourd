'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  X, 
  Camera, 
  MapPin, 
  BookOpen, 
  User, 
  Mail,
  Save,
  Upload
} from 'lucide-react'

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (profileData: any) => void
  currentProfile: any
}

export default function ProfileEditModal({ 
  isOpen, 
  onClose, 
  onSave, 
  currentProfile 
}: ProfileEditModalProps) {
  const [formData, setFormData] = useState({
    name: currentProfile?.name || '',
    bio: currentProfile?.bio || '',
    location: currentProfile?.location || '',
    denomination: currentProfile?.denomination || '',
    interests: currentProfile?.interests || [],
    avatarUrl: currentProfile?.avatarUrl || '',
    coverImageUrl: currentProfile?.coverImageUrl || ''
  })

  const [newInterest, setNewInterest] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setFormData({
      name: currentProfile?.name || '',
      bio: currentProfile?.bio || '',
      location: currentProfile?.location || '',
      denomination: currentProfile?.denomination || '',
      interests: currentProfile?.interests || [],
      avatarUrl: currentProfile?.avatarUrl || '',
      coverImageUrl: currentProfile?.coverImageUrl || ''
    })
  }, [currentProfile])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }))
      setNewInterest('')
    }
  }

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((i: string) => i !== interest)
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // In real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddInterest()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#0F1433] border border-[#D4AF37]/30 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="relative inline-block">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={formData.name || 'Profile'}
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#0F1433] mx-auto mb-3"
                />
              ) : (
                <div className="w-20 h-20 bg-[#F5C451] rounded-full flex items-center justify-center border-4 border-[#0F1433] mx-auto mb-3">
                  <span className="text-xl font-bold text-[#0F1433]">
                    {formData.name.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1 bg-[#0F1433] border-2 border-[#F5C451] rounded-full text-[#F5C451] hover:bg-[#0F1433]/90 transition-colors"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  setFormData(prev => ({
                    ...prev,
                    avatarUrl: typeof reader.result === 'string' ? reader.result : prev.avatarUrl
                  }))
                }
                reader.readAsDataURL(file)
              }}
            />
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="text-[#F5C451] text-sm font-medium hover:text-[#D4AF37] transition-colors"
            >
              Change Photo
            </button>
          </div>
          {/* Cover Photo */}
          <div className="text-center">
            <div className="relative">
              {formData.coverImageUrl ? (
                <img
                  src={formData.coverImageUrl}
                  alt="Cover"
                  className="w-full h-24 object-cover rounded-xl border border-[#D4AF37]/40 mb-2"
                />
              ) : (
                <div className="w-full h-24 bg-gradient-to-r from-[#D4AF37] to-[#F5C451] rounded-xl mb-2"></div>
              )}
              <button
                onClick={() => coverInputRef.current?.click()}
                className="absolute top-2 right-2 p-2 bg-[#0F1433]/70 rounded-full text-[#F5C451] hover:bg-[#0F1433]/90 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  setFormData(prev => ({
                    ...prev,
                    coverImageUrl: typeof reader.result === 'string' ? reader.result : prev.coverImageUrl
                  }))
                }
                reader.readAsDataURL(file)
              }}
            />
            <button
              onClick={() => coverInputRef.current?.click()}
              className="text-[#F5C451] text-sm font-medium hover:text-[#D4AF37] transition-colors"
            >
              Change Cover Photo
            </button>
          </div>


          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
              placeholder="Enter your full name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              rows={3}
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
              placeholder="City, State"
            />
          </div>

          {/* Denomination */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              <BookOpen className="w-4 h-4 inline mr-2" />
              Denomination
            </label>
            <select
              value={formData.denomination}
              onChange={(e) => handleInputChange('denomination', e.target.value)}
              className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F5C451]"
            >
              <option value="">Select denomination</option>
              <option value="Non-denominational">Non-denominational</option>
              <option value="Baptist">Baptist</option>
              <option value="Methodist">Methodist</option>
              <option value="Presbyterian">Presbyterian</option>
              <option value="Lutheran">Lutheran</option>
              <option value="Catholic">Catholic</option>
              <option value="Episcopal">Episcopal</option>
              <option value="Pentecostal">Pentecostal</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Interests
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white/10 border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                placeholder="Add an interest"
              />
              <button
                onClick={handleAddInterest}
                className="bg-[#F5C451] text-[#0F1433] px-3 py-2 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full border border-[#D4AF37]/30 flex items-center space-x-2"
                >
                  <span>{interest}</span>
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 text-white py-3 px-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-[#D4AF37]/50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-[#F5C451] text-[#0F1433] py-3 px-4 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0F1433]"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
