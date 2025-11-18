# Deployment Guide for Gourd

## Quick Start Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/gourd.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will automatically detect Next.js and deploy

3. **Set Environment Variables** (if using Supabase):
   - In Vercel dashboard, go to your project settings
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Option 2: Netlify

1. **Build the project locally**:
   ```bash
   npm install
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder
   - Or connect your GitHub repository

### Option 3: Manual Server Deployment

1. **Prepare your server**:
   ```bash
   # On your server
   git clone https://github.com/yourusername/gourd.git
   cd gourd
   npm install
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

3. **Set up reverse proxy** (nginx example):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Environment Setup

### Development
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Production
Set these environment variables in your deployment platform:
- `NEXT_PUBLIC_API_URL=https://yourdomain.com/api`
- `NEXT_PUBLIC_SUPABASE_URL=your_supabase_url`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key`

## Database Setup (Optional)

If you want to use Supabase for data persistence:

1. **Create Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Set up database tables**:
   ```sql
   -- Users table (if not using Supabase Auth)
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email TEXT UNIQUE NOT NULL,
     name TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Events table
   CREATE TABLE events (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title TEXT NOT NULL,
     description TEXT,
     start_time TIMESTAMP WITH TIME ZONE NOT NULL,
     end_time TIMESTAMP WITH TIME ZONE NOT NULL,
     location TEXT,
     is_virtual BOOLEAN DEFAULT FALSE,
     virtual_link TEXT,
     virtual_platform TEXT,
     event_type TEXT NOT NULL,
     requires_rsvp BOOLEAN DEFAULT TRUE,
     allow_guests BOOLEAN DEFAULT FALSE,
     max_attendees INTEGER,
     is_recurring BOOLEAN DEFAULT FALSE,
     recurrence_pattern TEXT,
     recurrence_end_date TIMESTAMP WITH TIME ZONE,
     tags TEXT[],
     created_by UUID REFERENCES users(id),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     rsvp_count INTEGER DEFAULT 0
   );

   -- RSVPs table
   CREATE TABLE event_rsvps (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     event_id UUID REFERENCES events(id) ON DELETE CASCADE,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     status TEXT NOT NULL CHECK (status IN ('going', 'maybe', 'not_going')),
     guest_count INTEGER DEFAULT 0,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(event_id, user_id)
   );
   ```

## Troubleshooting

### Common Issues

1. **Build fails with TypeScript errors**:
   ```bash
   npm run lint
   # Fix any linting errors
   npm run build
   ```

2. **Environment variables not working**:
   - Make sure variables start with `NEXT_PUBLIC_` for client-side access
   - Restart your development server after adding new variables

3. **Styling issues**:
   - Ensure Tailwind CSS is properly configured
   - Check that `globals.css` is imported in `layout.tsx`

### Performance Optimization

1. **Enable compression** (if using custom server):
   ```javascript
   // next.config.js
   const withCompression = require('next-compress')
   module.exports = withCompression()
   ```

2. **Add caching headers**:
   ```javascript
   // next.config.js
   module.exports = {
     async headers() {
       return [
         {
           source: '/static/:path*',
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, max-age=31536000, immutable',
             },
           ],
         },
       ]
     },
   }
   ```

## Monitoring and Analytics

Consider adding:
- **Vercel Analytics** (if using Vercel)
- **Google Analytics**
- **Sentry** for error tracking
- **Uptime monitoring**

## Security Checklist

- [ ] Environment variables are properly secured
- [ ] HTTPS is enabled in production
- [ ] Database access is restricted
- [ ] API endpoints are protected
- [ ] User input is validated
- [ ] Dependencies are up to date

## Support

If you encounter issues:
1. Check the console for errors
2. Review the deployment logs
3. Ensure all environment variables are set
4. Verify database connections (if applicable)
5. Check network connectivity






