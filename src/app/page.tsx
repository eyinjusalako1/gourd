import Link from 'next/link'
import { Calendar, Users, Heart, BookOpen } from 'lucide-react'
import { Logo } from '@/components/Logo'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Logo size="lg" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Gathered
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Find fellowship, build community, grow in faith together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                View Events
              </Link>
              <Link
                href="/dashboard"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Connect, Grow, and Serve Together
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Whether you're seeking fellowship or building community, Gathered brings believers together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Find Events
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Discover Bible studies, prayer meetings, and fellowship events
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gold-600 dark:text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Join Fellowships
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with small groups and Christian communities
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Build Community
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage fellowship groups for your church
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Grow in Faith
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access daily verses, prayer tools, and spiritual growth resources
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
