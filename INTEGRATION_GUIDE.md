# Social Media Integration Guide
## Sharing Gathered Content to External Platforms

**Last Updated:** November 1, 2025

---

## 🎯 Integration Philosophy

**Goal:** Make sharing Gathered content to WhatsApp, Instagram, and Email seamless and beautiful—without pulling users away from the platform.

**Principles:**
1. **One-click sharing** from any content item
2. **Beautiful, branded** shared content
3. **Deep-linking** back to Gathered
4. **Tracking** share effectiveness
5. **No friction** in the flow

---

## 📱 WhatsApp Integration

### Implementation

#### Deep-Link Format
```
whatsapp://send?text=[ENCODED_MESSAGE]&phone=[OPTIONAL_NUMBER]
```

#### Share Button Component
```typescript
// components/ShareButtons.tsx
import { MessageCircle } from 'lucide-react'

interface WhatsAppShareProps {
  content: {
    type: 'event' | 'prayer' | 'devotion' | 'post'
    title: string
    description: string
    metadata?: object
  }
  fellowshipId: string
}

export function WhatsAppShareButton({ content, fellowshipId }: WhatsAppShareProps) {
  const handleShare = async () => {
    // Generate share message
    const message = generateWhatsAppMessage(content)
    
    // Track share
    await fetch('/api/share/track', {
      method: 'POST',
      body: JSON.stringify({
        content_type: content.type,
        platform: 'whatsapp',
        fellowship_id: fellowshipId
      })
    })
    
    // Open WhatsApp
    const encoded = encodeURIComponent(message)
    window.location.href = `whatsapp://send?text=${encoded}`
  }
  
  return (
    <button
      onClick={handleShare}
      className="flex items-center space-x-2 px-4 py-2 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-lg transition-colors"
    >
      <MessageCircle className="w-4 h-4" />
      <span>Share to WhatsApp</span>
    </button>
  )
}
```

#### Message Templates

**Event Sharing:**
```
🎉 [Event Title]

Join us for [Event Description]!

📅 [Date] at [Time]
📍 [Location or Virtual Link]

RSVP & Details: [Short Link to Event Page]

#Fellowship #Community #Gathered
```

**Prayer Request:**
```
🙏 Prayer Request

[Prayer Title]

[Prayer Description]

Join us in lifting this up to God!

Pray: [Short Link to Prayer Post]

#PrayerWarriors #Community
```

**Devotion Sharing:**
```
📖 This Week's Devotion

[Devotion Title]

[Scripture Reference]

"What is God saying to you through this?"

Read more: [Short Link to Devotion]

#Devotion #FaithWalk #Gathered
```

### API Endpoint

```typescript
// app/api/share/whatsapp/route.ts
export async function POST(req: Request) {
  const { content, fellowshipId, userId } = await req.json()
  
  // Generate share message
  const message = generateWhatsAppMessage(content)
  
  // Track share
  await db.share_tracking.insert({
    user_id: userId,
    fellowship_id: fellowshipId,
    content_type: content.type,
    content_id: content.id,
    platform: 'whatsapp',
    metadata: { message_length: message.length }
  })
  
  return Response.json({ success: true, message })
}
```

---

## 📸 Instagram Story Card Generation

### Implementation

#### Story Card API
```typescript
// app/api/share/instagram/route.ts
import { createCanvas, loadImage } from 'canvas'

export async function POST(req: Request) {
  const { template, content, fellowshipId } = await req.json()
  
  // Load template
  const templateData = await loadStoryTemplate(template)
  
  // Generate card
  const canvas = createCanvas(1080, 1920) // Instagram Story dimensions
  const ctx = canvas.getContext('2d')
  
  // Draw background
  ctx.fillStyle = '#0F1433' // Navy
  ctx.fillRect(0, 0, 1080, 1920)
  
  // Draw gradient
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1920)
  gradient.addColorStop(0, '#D4AF37')
  gradient.addColorStop(1, '#F5C451')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1080, 200)
  
  // Draw fellowship branding
  const logo = await loadImage(templateData.logo)
  ctx.drawImage(logo, 40, 40, 120, 120)
  
  // Draw content
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 64px Poppins'
  ctx.textAlign = 'center'
  ctx.fillText(content.title, 540, 800)
  
  // Draw metadata
  ctx.font = '48px Poppins'
  ctx.fillText(content.date, 540, 900)
  ctx.fillText(content.location, 540, 1000)
  
  // Draw call-to-action
  ctx.fillStyle = '#D4AF37'
  ctx.fillRect(340, 1500, 400, 120)
  ctx.fillStyle = '#0F1433'
  ctx.font = 'bold 48px Poppins'
  ctx.fillText('Tap to RSVP →', 540, 1570)
  
  // Add Gathered watermark
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  ctx.font = '32px Poppins'
  ctx.fillText('Gathered.app', 540, 1850)
  
  // Convert to image
  const buffer = canvas.toBuffer('image/png')
  
  // Upload to storage
  const imageUrl = await uploadToStorage(buffer, `${fellowshipId}/instagram_${Date.now()}.png`)
  
  return Response.json({ imageUrl })
}
```

#### Story Card Component
```typescript
// components/InstagramStoryCard.tsx
import { ImageSquare } from 'lucide-react'

export function InstagramStoryCardButton({ content, fellowshipId }: ShareProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const generateCard = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/share/instagram', {
        method: 'POST',
        body: JSON.stringify({
          template: 'event', // or 'prayer', 'devotion'
          content,
          fellowshipId
        })
      })
      
      const { imageUrl } = await response.json()
      setImageUrl(imageUrl)
      
      // Track share
      await fetch('/api/share/track', {
        method: 'POST',
        body: JSON.stringify({
          content_type: content.type,
          platform: 'instagram',
          fellowship_id: fellowshipId
        })
      })
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <button
      onClick={generateCard}
      disabled={loading}
      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-colors"
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <ImageSquare className="w-4 h-4" />
          <span>Create Story Card</span>
        </>
      )}
    </button>
  )
}
```

### Story Card Templates

#### Event Template
```
┌────────────────────────────┐
│ [Fellowship Logo]          │
│ ─────────────────────────  │
│                            │
│        📅                  │
│                            │
│  SUNDAY MORNING            │
│  GATHERING                 │
│                            │
│  Join us for worship &     │
│  fellowship               │
│                            │
│  December 8, 10:00 AM     │
│  Main Sanctuary            │
│                            │
│  ┌────────────────────┐   │
│  │  Tap to RSVP →    │   │
│  └────────────────────┘   │
│                            │
│     Gathered.app           │
└────────────────────────────┘
```

#### Prayer Template
```
┌────────────────────────────┐
│ [Fellowship Logo]          │
│ ─────────────────────────  │
│                            │
│        🙏                  │
│                            │
│  PRAYER REQUEST            │
│                            │
│  Our fellowship is         │
│  praying for...           │
│                            │
│  Final exams this week     │
│                            │
│  Join us in lifting        │
│  this up to God           │
│                            │
│  ┌────────────────────┐   │
│  │  Pray Together →   │   │
│  └────────────────────┘   │
│                            │
│     Gathered.app           │
└────────────────────────────┘
```

---

## 📧 Email Weekly Summary

### Implementation

#### Weekly Summary Generator
```typescript
// lib/weekly-summary-generator.ts
export async function generateWeeklySummary(fellowshipId: string) {
  const fellowship = await getFellowship(fellowshipId)
  const period = getLastWeek()
  
  // Fetch data
  const [activity, engagement, members, events] = await Promise.all([
    getWeeklyActivity(fellowshipId, period),
    getEngagementMetrics(fellowshipId, period),
    getActiveMembers(fellowshipId),
    getUpcomingEvents(fellowshipId)
  ])
  
  // Generate HTML
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #D4AF37, #F5C451); padding: 30px; text-align: center; color: white; }
        .content { padding: 20px; }
        .metric { display: flex; justify-content: space-between; padding: 15px; border-bottom: 1px solid #eee; }
        .highlight { background: #f9f9f9; padding: 20px; margin: 20px 0; border-left: 4px solid #D4AF37; }
        .cta { text-align: center; padding: 20px; }
        .button { background: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Fellowship Week</h1>
          <p>${fellowship.name}</p>
        </div>
        
        <div class="content">
          <h2>Activity Overview</h2>
          <div class="metric">
            <span>📝 Posts Shared:</span>
            <strong>${activity.posts}</strong>
          </div>
          <div class="metric">
            <span>🙏 Prayers Offered:</span>
            <strong>${activity.prayers}</strong>
          </div>
          <div class="metric">
            <span>📖 Devotions Completed:</span>
            <strong>${activity.devotions}</strong>
          </div>
          <div class="metric">
            <span>🎯 Average FER:</span>
            <strong>${engagement.fer.toFixed(1)}</strong>
          </div>
          
          <div class="highlight">
            <h3>🎉 Highlights</h3>
            ${activity.highlights.map(h => `<p>• ${h}</p>`).join('')}
          </div>
          
          <h2>Coming Up</h2>
          ${events.map(e => `
            <div class="metric">
              <div>
                <strong>${e.title}</strong><br>
                <small>${e.date} at ${e.time}</small>
              </div>
              <a href="${e.link}" class="button">RSVP</a>
            </div>
          `).join('')}
          
          <div class="cta">
            <a href="https://app.gathered.com/fellowships/${fellowshipId}" class="button">
              View Full Dashboard
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
  
  return { html, text: htmlToText(html) }
}
```

#### Email API Endpoint
```typescript
// app/api/export/weekly-summary/route.ts
export async function POST(req: Request) {
  const { fellowshipId, format, recipient } = await req.json()
  
  // Generate summary
  const summary = await generateWeeklySummary(fellowshipId)
  
  if (format === 'email' && recipient) {
    // Send email via Resend or SendGrid
    await sendEmail({
      to: recipient,
      subject: `Your ${getWeekName()} Fellowship Summary`,
      html: summary.html
    })
    
    return Response.json({ success: true, sent: true })
  }
  
  // Return for preview/download
  if (format === 'html') {
    return new Response(summary.html, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
  
  if (format === 'pdf') {
    const pdf = await htmlToPdf(summary.html)
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="summary-${Date.now()}.pdf"`
      }
    })
  }
  
  return Response.json({ html: summary.html, text: summary.text })
}
```

---

## 🔗 Universal Share Component

### Master Share Button
```typescript
// components/ShareMenu.tsx
import { Share2, MessageCircle, ImageSquare, Mail, Copy } from 'lucide-react'
import { useState } from 'react'

interface ShareMenuProps {
  content: ShareableContent
  fellowshipId: string
}

export function ShareMenu({ content, fellowshipId }: ShareMenuProps) {
  const [open, setOpen] = useState(false)
  
  const shareOptions = [
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]',
      action: () => shareToWhatsApp(content, fellowshipId)
    },
    {
      label: 'Instagram Story',
      icon: ImageSquare,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      action: () => generateInstagramCard(content, fellowshipId)
    },
    {
      label: 'Email',
      icon: Mail,
      color: 'bg-blue-500',
      action: () => shareViaEmail(content, fellowshipId)
    },
    {
      label: 'Copy Link',
      icon: Copy,
      color: 'bg-gray-500',
      action: () => copyToClipboard(content.url)
    }
  ]
  
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <Share2 className="w-5 h-5" />
      </button>
      
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center pb-20">
          <div className="bg-[#0F1433] rounded-t-2xl p-6 w-full max-w-md">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-white mb-4 text-center">Share</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {shareOptions.map(option => {
                const Icon = option.icon
                return (
                  <button
                    key={option.label}
                    onClick={() => {
                      option.action()
                      setOpen(false)
                    }}
                    className={`${option.color} text-white rounded-xl p-6 flex flex-col items-center space-y-2 hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-8 h-8" />
                    <span className="font-medium">{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

---

## 📊 Share Tracking

### Analytics Dashboard
```typescript
// components/ShareAnalytics.tsx
export function ShareAnalytics({ fellowshipId }: { fellowshipId: string }) {
  const { data } = useQuery(['share-analytics', fellowshipId], () =>
    fetch(`/api/analytics/shares/${fellowshipId}`).then(r => r.json())
  )
  
  return (
    <div className="bg-white/5 border border-[#D4AF37] rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Content Shares</h3>
      
      <div className="space-y-4">
        {data?.platforms.map(platform => (
          <div key={platform.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <platform.icon className="w-6 h-6" />
              <span className="text-white">{platform.name}</span>
            </div>
            <span className="text-[#F5C451] font-bold">{platform.count}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-[#D4AF37]/30">
        <p className="text-white/60 text-sm">
          Total shares: <span className="text-[#F5C451] font-bold">{data?.total}</span>
        </p>
      </div>
    </div>
  )
}
```

---

## 🧪 Testing

### Share Functionality Tests
```typescript
describe('Share Integration', () => {
  it('should generate WhatsApp link correctly', () => {
    const content = { type: 'event', title: 'Sunday Gathering' }
    const message = generateWhatsAppMessage(content)
    expect(message).toContain('Sunday Gathering')
  })
  
  it('should track share', async () => {
    const response = await request(app)
      .post('/api/share/track')
      .send({ content_type: 'event', platform: 'whatsapp', fellowship_id: 'test-id' })
    
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })
  
  it('should generate Instagram story card', async () => {
    const response = await request(app)
      .post('/api/share/instagram')
      .send({ template: 'event', content: { title: 'Test' } })
    
    expect(response.status).toBe(200)
    expect(response.body.imageUrl).toBeDefined()
  })
})
```

---

These integrations ensure Gathered content is shareable everywhere while maintaining beautiful branding and trackability! 🚀


