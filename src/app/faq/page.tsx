'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { ArrowLeft, Search, ChevronDown, ChevronUp, HelpCircle, BookOpen, Users, MessageCircle, Heart } from 'lucide-react'
import FeedbackModal from '@/components/FeedbackModal'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'getting-started' | 'features' | 'account' | 'community' | 'billing'
  icon: React.ElementType
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What is Gathered?',
    answer: 'Gathered is a Christian community platform that connects believers, helps you find local fellowships and small groups, and provides tools for spiritual growth through events, devotionals, prayer requests, and testimonies.',
    category: 'getting-started',
    icon: HelpCircle
  },
  {
    id: '2',
    question: 'How do I join a fellowship?',
    answer: 'Navigate to the "Fellowship Discovery" section on your dashboard, browse available fellowships, and click "Join Fellowship" on any that interest you. Some groups may require leader approval.',
    category: 'getting-started',
    icon: Users
  },
  {
    id: '3',
    question: 'What&apos;s the difference between a Disciple and a Steward?',
    answer: 'Disciples are individual users looking for community and fellowship. Stewards are leaders who create and manage fellowship groups, host events, and shepherd their communities.',
    category: 'account',
    icon: Users
  },
  {
    id: '4',
    question: 'How do I create my own fellowship?',
    answer: 'As a Steward (leader), click "Create Fellowship" from your dashboard. Fill in details like name, description, meeting times, and privacy settings. Once created, you can start inviting members!',
    category: 'features',
    icon: MessageCircle
  },
  {
    id: '5',
    question: 'Can I attend events without joining a fellowship?',
    answer: 'Yes! You can browse and RSVP to public events regardless of fellowship membership. However, joining the fellowship gives you access to additional features like group chat and private announcements.',
    category: 'features',
    icon: BookOpen
  },
  {
    id: '6',
    question: 'How do I share my testimony?',
    answer: 'Click on the "Testimonies" tab in the main navigation or access it from your dashboard. Press the "Share Your Testimony" button, fill in your story, choose a category, and post it to inspire others.',
    category: 'features',
    icon: MessageCircle
  },
  {
    id: '7',
    question: 'What are devotionals?',
    answer: 'Devotionals are daily Bible readings with reflection questions and prayer prompts. Approved Stewards can create devotionals, and all users can access them to grow in their faith journey.',
    category: 'features',
    icon: BookOpen
  },
  {
    id: '8',
    question: 'How can I submit a prayer request?',
    answer: 'Go to the "Prayers" section and click "Share Prayer Request". You can choose to remain anonymous or share your name. Others can pray for your request and leave encouragement.',
    category: 'features',
    icon: Heart
  },
  {
    id: '9',
    question: 'Is there a mobile app?',
    answer: 'Currently, Gathered is optimized for mobile browsers, giving you a native app-like experience. A dedicated mobile app is in development.',
    category: 'getting-started',
    icon: HelpCircle
  },
  {
    id: '10',
    question: 'How do I manage my fellowship as a Steward?',
    answer: 'Click "Manage" on any fellowship you created. You can view members, schedule events, send announcements, moderate group chat, and adjust settings like privacy and membership rules.',
    category: 'features',
    icon: Users
  },
  {
    id: '11',
    question: 'Can I be both a Disciple and a Steward?',
    answer: 'Yes! You can switch between Disciple and Steward views using the Settings menu. This lets you both participate in communities and lead your own fellowship.',
    category: 'account',
    icon: Users
  },
  {
    id: '12',
    question: 'Are my prayer requests and testimonies private?',
    answer: 'Testimonies are public by default to inspire the community. Prayer requests can be posted anonymously. Both can be shared within specific fellowships or the entire community.',
    category: 'community',
    icon: Heart
  },
  {
    id: '13',
    question: 'How do I report inappropriate content?',
    answer: 'Click the three dots menu on any post, announcement, or message and select "Report". Choose a reason, provide details, and our moderation team will review it promptly.',
    category: 'community',
    icon: HelpCircle
  },
  {
    id: '14',
    question: 'Can I customize my profile?',
    answer: 'Yes! Click on your profile icon or navigate to "My Profile". You can add a bio, interests, location, denomination, and profile pictures to help others connect with you.',
    category: 'account',
    icon: Users
  },
  {
    id: '15',
    question: 'What happens when I RSVP to an event?',
    answer: 'Your RSVP helps event organizers plan better. You can choose "Going", "Interested", or "Not Going". You&apos;ll receive reminders as the event approaches.',
    category: 'features',
    icon: BookOpen
  }
]

const categories = [
  { id: 'all', label: 'All Topics', icon: HelpCircle },
  { id: 'getting-started', label: 'Getting Started', icon: HelpCircle },
  { id: 'features', label: 'Features', icon: BookOpen },
  { id: 'account', label: 'Account', icon: Users },
  { id: 'community', label: 'Community', icon: MessageCircle }
]

export default function FAQPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)

  const toggleItem = (id: string) => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter(item => item !== id))
    } else {
      setExpandedItems([...expandedItems, id])
    }
  }

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      {/* Header */}
      <div className="bg-[#0F1433] shadow-sm border-b border-[#D4AF37]/30 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="mr-4 p-2 text-white/60 hover:text-white transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 flex items-center space-x-3">
              <Logo size="md" showText={false} />
              <h1 className="text-xl font-bold text-white">Help Center</h1>
            </div>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="p-2 text-white/60 hover:text-white transition-colors"
              title="Submit Feedback"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            placeholder="Search FAQ..."
            className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-full py-3 pl-10 pr-4 text-white placeholder-white/60 focus:outline-none focus:border-[#F5C451]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(category => {
            const IconComponent = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#F5C451] text-[#0F1433]'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-[#D4AF37]/30'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.label}</span>
              </button>
            )
          })}
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-white/80 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="bg-[#F5C451] text-[#0F1433] px-6 py-3 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors"
              >
                Submit a Question
              </button>
            </div>
          ) : (
            filteredFAQs.map(faq => {
              const IconComponent = faq.icon
              const isExpanded = expandedItems.includes(faq.id)
              
              return (
                <div
                  key={faq.id}
                  className="bg-white/5 border border-[#D4AF37] rounded-2xl overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none"></div>
                  
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors relative z-10"
                  >
                    <div className="flex items-start space-x-3 flex-1 text-left">
                      <div className="w-8 h-8 bg-[#F5C451] rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4 text-[#0F1433]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{faq.question}</h3>
                        {!isExpanded && (
                          <p className="text-sm text-white/60 line-clamp-1">{faq.answer}</p>
                        )}
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#F5C451]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#F5C451]" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pl-11 relative z-10">
                      <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Can't Find Answer CTA */}
        <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5C451] rounded-2xl p-6 text-[#0F1433] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/20 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <HelpCircle className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Still Need Help?</h3>
            <p className="mb-4 opacity-90">
              Can&apos;t find the answer you&apos;re looking for? Submit your question or feedback below!
            </p>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="bg-[#0F1433] text-[#F5C451] px-6 py-3 rounded-lg font-semibold hover:bg-[#0F1433]/90 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </div>
  )
}

