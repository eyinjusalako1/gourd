import Link from 'next/link'
import { Calendar, Users, Heart, BookOpen, ArrowRight, MapPin, Clock } from 'lucide-react'
import Logo from '@/components/Logo'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F1433]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1433] via-[#1a1f3a] to-[#0F1433]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/10 to-transparent"></div>
        
        <div className="relative max-w-md mx-auto px-4 py-12">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            
            {/* Main Title */}
            <h2 className="text-2xl font-bold text-white mb-4">
              Welcome to Gathered
            </h2>
            
            {/* Tagline */}
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Find fellowship, build community, grow in faith together
            </p>
            
            {/* Call-to-Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="block w-full bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] py-4 rounded-xl font-semibold text-lg hover:from-[#F5C451] hover:to-[#D4AF37] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                href="/events"
                className="block w-full bg-white/10 border border-[#D4AF37] text-white py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-200"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">
            Connect, Grow, and Serve Together
          </h2>
          <p className="text-white/80 leading-relaxed">
            Whether you&apos;re seeking fellowship or building community, Gathered brings believers together
          </p>
        </div>

        {/* Feature Cards */}
        <div className="space-y-4">
          {/* Find Events Card */}
          <Link href="/events">
            <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 hover:bg-white/10 transition-all duration-200 hover:shadow-lg cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Find Events
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Discover Bible studies, prayer meetings, and fellowship events
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#F5C451]" />
              </div>
            </div>
          </Link>

          {/* Join Fellowships Card */}
          <Link href="/dashboard">
            <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 hover:bg-white/10 transition-all duration-200 hover:shadow-lg cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Join Fellowships
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Connect with small groups and Christian communities
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#F5C451]" />
              </div>
            </div>
          </Link>

          {/* Build Community Card */}
          <Link href="/dashboard">
            <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 hover:bg-white/10 transition-all duration-200 hover:shadow-lg cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Build Community
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Create and manage fellowship groups for your church
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#F5C451]" />
              </div>
            </div>
          </Link>

          {/* Grow in Faith Card */}
          <Link href="/dashboard">
            <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6 hover:bg-white/10 transition-all duration-200 hover:shadow-lg cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Grow in Faith
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Access daily verses, prayer tools, and spiritual growth resources
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#F5C451]" />
              </div>
            </div>
          </Link>
        </div>

        {/* Sample Fellowship Preview */}
        <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5C451] rounded-2xl p-6 text-[#0F1433] mt-8">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold mb-2">Join a Fellowship Today</h3>
            <p className="text-sm opacity-90">Connect with believers in your area</p>
          </div>
          
          {/* Sample Fellowship Card */}
          <div className="bg-[#0F1433]/10 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-[#0F1433] rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-[#F5C451]" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#0F1433]">Young Adults Bible Study</h4>
                <p className="text-sm opacity-80">Downtown Community Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm opacity-80">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>0.5 miles</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Wed 7:00 PM</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>24 members</span>
              </div>
            </div>
          </div>
          
          <Link
            href="/dashboard"
            className="block w-full bg-[#0F1433] text-[#F5C451] py-3 rounded-lg font-semibold text-center hover:bg-[#0F1433]/90 transition-colors"
          >
            Explore All Fellowships
          </Link>
        </div>
      </div>
    </div>
  )
}