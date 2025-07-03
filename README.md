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
```

See the `supabase/README.md` file for more details on Supabase configuration.

## Technologies Used

- React with TypeScript
- Vite for bundling
- Zustand for state management
- Supabase for backend and authentication (optional)
- TailwindCSS for styling

## License

MIT
