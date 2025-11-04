# Loyer Brussels - Fresh Start

A Next.js 15 application for calculating fair rent in Brussels based on the rent grid system. This is a political organizing tool that uses rent calculation as an entry point for WUUNE membership recruitment and tenant rights advocacy.

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Email**: Resend
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- A Supabase account and project
- A Resend account and API key
- A Vercel account (for deployment)

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Resend Configuration (for email)
RESEND_API_KEY=re_your-api-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and API keys to `.env.local`
3. Run the database migrations (to be added)

### 4. Set Up Resend

1. Create an account at [resend.com](https://resend.com)
2. Generate an API key
3. Add the API key to `.env.local`
4. Verify your sending domain

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── lib/                   # Utilities and integrations
│   ├── supabase.ts       # Supabase client
│   └── email.ts          # Resend email integration
├── .claude/              # Claude Code configuration
│   ├── commands/         # Custom slash commands
│   ├── settings.json     # Project settings
│   └── README.md         # Claude Code documentation
├── AGENCY_BRIEF.md       # Comprehensive business requirements
└── README.md             # This file
```

## 🎯 Business Context

See [AGENCY_BRIEF.md](./AGENCY_BRIEF.md) for a comprehensive overview of:
- Business objectives and problem statement
- Target audiences and user personas
- Feature requirements and user journeys
- Design and content strategy
- Success metrics and KPIs

## 🤖 Claude Code Commands

This project includes specialized Claude Code commands for development:

### Superpowers (Development)
- `/refactor` - Intelligent code refactoring
- `/optimize` - Performance optimization
- `/debug` - Advanced debugging assistance
- `/test` - Smart test generation
- `/security` - Security audit
- `/architecture` - Architecture analysis
- `/pr` - Create pull request

### UX UI Skills
- `/ui-review` - Comprehensive UI/UX review
- `/component` - Create new component with best practices
- `/accessibility` - Accessibility audit and fixes
- `/responsive` - Responsive design check
- `/design-system` - Design system consistency
- `/i18n` - Internationalization review
- `/ux-improve` - UX improvement suggestions
- `/animation` - Add smooth animations
- `/forms` - Optimize form UX

See [.claude/README.md](./.claude/README.md) for more details.

## 🚢 Deployment

### Deploy to Vercel

1. Install the Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`

Alternatively, connect your GitHub repository to Vercel for automatic deployments.

## 📝 Development Workflow

1. **Start Development**: `npm run dev`
2. **Build for Production**: `npm run build`
3. **Run Production Build**: `npm start`
4. **Lint Code**: `npm run lint`

## 🎨 Styling

This project uses Tailwind CSS for styling. The design system follows:
- Mobile-first responsive design
- Accessibility (WCAG 2.1 AA)
- Consistent design tokens
- Dark mode support

## 🔒 Security

- Environment variables are never committed to Git
- API keys are stored securely in Vercel environment variables
- Supabase Row Level Security (RLS) should be configured
- All user inputs should be validated

## 📄 License

[Add your license information here]

## 🤝 Contributing

[Add contribution guidelines here]

## 💬 Support

For questions or issues:
- Check the [AGENCY_BRIEF.md](./AGENCY_BRIEF.md) for business context
- Review [.claude/README.md](./.claude/README.md) for development tools
- Contact the development team

---

**Fresh Start** - Built with Next.js 15, TypeScript, and modern web technologies.
