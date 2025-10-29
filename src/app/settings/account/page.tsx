'use client'

import React, { useState } from 'react'
import AppHeader from '@/components/AppHeader'

export default function AccountSettingsPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      <AppHeader title="Account" subtitle="Profile, email, password" backHref="/settings" />
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <div>
          <label className="block text-sm text-white mb-2">Name</label>
          <input className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-white mb-2">Email</label>
          <input type="email" className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-white mb-2">New Password</label>
          <input type="password" className="w-full bg-white/10 border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
        </div>
        <button className="w-full bg-[#F5C451] text-[#0F1433] py-3 rounded-lg font-semibold hover:bg-[#D4AF37]">Save</button>
      </div>
    </div>
  )
}


