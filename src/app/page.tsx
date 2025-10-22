import { Heart, Users, BookOpen, Calendar, MapPin, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Connect with Fellow{' '}
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Believers
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join Gathered to find fellowship, participate in Bible studies, 
            share testimonies, and grow in faith with your Christian community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-3">
              Get Started
            </button>
            <button className="btn-secondary text-lg px-8 py-3">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Strengthen Your Faith Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need to connect with your Christian community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Find Fellowship
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with believers in your area and join local Christian communities.
            </p>
          </div>

          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gold-100 dark:bg-gold-900 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gold-600 dark:text-gold-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Bible Studies
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Join or create Bible study groups, both virtual and in-person.
            </p>
          </div>

          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Events & Prayer
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Organize and join prayer meetings, church events, and community gatherings.
            </p>
          </div>

          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Location-Based
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Find believers and events near you with our location-based discovery.
            </p>
          </div>

          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Share Testimonies
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Share your faith journey and encourage others with your testimony.
            </p>
          </div>

          <div className="card text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Safe Community
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our community is moderated to ensure a safe, Christ-centered environment.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Connect with Your Faith Community?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of believers who are already growing in fellowship together.
          </p>
          <button className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors">
            Start Your Journey
          </button>
        </div>
      </section>
    </div>
  )
}
