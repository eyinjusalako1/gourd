'use client'

import React, { useState } from 'react'
import { X, Mail, UserPlus, CheckCircle } from 'lucide-react'

interface MemberInviteModalProps {
  isOpen: boolean
  onClose: () => void
  fellowshipName: string
}

export default function MemberInviteModal({ isOpen, onClose, fellowshipName }: MemberInviteModalProps) {
  const [inviteMethod, setInviteMethod] = useState<'email' | 'link'>('email')
  const [emailInput, setEmailInput] = useState('')
  const [message, setMessage] = useState(`Join ${fellowshipName} on Gathered!`)
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleInvite = async () => {
    if (inviteMethod === 'email' && !emailInput.trim()) {
      return
    }

    setIsLoading(true)

    // Simulate sending invite
    setTimeout(() => {
      setIsLoading(false)
      setSent(true)
      
      // Reset after showing success
      setTimeout(() => {
        setSent(false)
        setEmailInput('')
        onClose()
      }, 2000)
    }, 1500)
  }

  const handleCopyLink = () => {
    const inviteLink = `https://gathered.app/join?code=FLW${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    navigator.clipboard.writeText(inviteLink)
    // Could show a toast notification here
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#0F1433] border border-[#D4AF37] rounded-2xl p-6 max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-[#F5C451] rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-[#0F1433]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Invite Members</h2>
            <p className="text-sm text-white/60">{fellowshipName}</p>
          </div>
        </div>

        {sent ? (
          // Success state
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Invitation Sent!</h3>
            <p className="text-white/80">
              {inviteMethod === 'email' 
                ? `Invite sent to ${emailInput}` 
                : 'Link copied to clipboard'}
            </p>
          </div>
        ) : (
          <>
            {/* Invite Method Tabs */}
            <div className="flex bg-white/5 rounded-lg p-1 mb-6">
              <button
                onClick={() => setInviteMethod('email')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  inviteMethod === 'email'
                    ? 'bg-[#F5C451] text-[#0F1433]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4 inline-block mr-2" />
                Email
              </button>
              <button
                onClick={() => setInviteMethod('link')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  inviteMethod === 'link'
                    ? 'bg-[#F5C451] text-[#0F1433]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <UserPlus className="w-4 h-4 inline-block mr-2" />
                Link
              </button>
            </div>

            {/* Content based on method */}
            {inviteMethod === 'email' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="friend@example.com"
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Message (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Add a personal message..."
                    className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451] resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleInvite}
                  disabled={!emailInput.trim() || isLoading}
                  className="w-full bg-[#F5C451] text-[#0F1433] py-3 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0F1433]"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Invitation</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Invitation Link</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value="https://gathered.app/join?code=FLW..."
                      readOnly
                      className="flex-1 bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white text-sm"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="bg-white/10 border border-[#D4AF37]/30 px-4 py-3 rounded-lg text-white hover:bg-white/20 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleInvite}
                  disabled={isLoading}
                  className="w-full bg-[#F5C451] text-[#0F1433] py-3 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0F1433]"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Generate Link</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}





