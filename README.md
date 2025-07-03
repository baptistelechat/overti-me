# OverTi-me - Overtime Hours Manager

OverTi-me is a web application for tracking and managing your working hours and overtime. The application automatically calculates regular hours, 25% overtime, and 50% overtime based on configured thresholds.

## Features

- Track working hours by day and week
- Automatic calculation of regular and overtime hours
- Export data to JSON format (CSV and Excel coming soon)
- Data synchronization with Supabase (optional)
- Offline mode with local storage
- Responsive interface for mobile and desktop

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/overti-me.git
cd overti-me

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Supabase Configuration (optional)

The application can work entirely offline with local storage. If you want to enable synchronization with Supabase:

1. Create an account on [Supabase](https://supabase.com/) and create a new project
2. Configure email authentication in your Supabase project
3. Run the SQL script provided in `supabase/schema.sql` to create the `weeks` table
4. Copy the `.env.example` file to `.env.local` and fill in the environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Production URL for authentication redirects
VITE_PRODUCTION_URL=your_production_url
```

### Authentication Redirects Configuration

For authentication features like email verification, password reset, and email change to work correctly in production:

1. Set the `VITE_PRODUCTION_URL` environment variable to your production URL (e.g., `https://your-app.vercel.app`)
2. In your Supabase dashboard, go to Authentication > URL Configuration
3. Add your production URL to the "Site URL" field
4. Add all necessary redirect URLs to the "Redirect URLs" list:
   - Your production URL (e.g., `https://your-app.vercel.app`)
   - Your local development URL (e.g., `http://localhost:3000`)
   - Any preview deployment URLs (you can use wildcards like `https://*.vercel.app` for Vercel preview deployments)

See the `supabase/README.md` file for more details on Supabase configuration.

## Technologies Used

- React with TypeScript
- Vite for bundling
- Zustand for state management
- Supabase for backend and authentication (optional)
- TailwindCSS for styling

## License

MIT
