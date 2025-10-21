import Link from 'next/link'
import { Calendar, Users, Heart, BookOpen } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Gourd
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Your church community event management platform
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
              Everything you need for church events
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Manage events, track RSVPs, and build community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Event Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage church events with ease
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gold-600 dark:text-gold-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                RSVP Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track attendance and manage guest lists
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Community Building
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Foster connections within your church community
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Bible Study Groups
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organize study groups and spiritual events
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
