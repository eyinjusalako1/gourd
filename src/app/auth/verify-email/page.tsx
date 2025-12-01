'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Mail, CheckCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const [emailSent, setEmailSent] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Check Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We&apos;ve sent you a verification link
          </p>
        </div>

        {/* Content */}
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Verify Your Account
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please check your email and click the verification link to activate your Gathered account. 
            If you don&apos;t see the email, check your spam folder.
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Email verification required</span>
              </div>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Didn&apos;t receive the email?</p>
              <button 
                onClick={() => setEmailSent(true)}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Resend verification email
              </button>
            </div>

            {emailSent && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-green-600 dark:text-green-400 text-sm">
                  Verification email sent! Please check your inbox.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/auth/login" 
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}








