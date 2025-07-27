# News Scraper Frontend

A modern Next.js frontend application for displaying and managing news articles scraped from various sources. Built with TypeScript, Tailwind CSS, and connected to a Django REST API.

## Features

- 📰 **News Display**: Browse articles with pagination and real-time updates
- 🏷️ **Keyword Management**: Add and remove keywords for news filtering
- 🌙 **Dark/Light Theme**: Toggle between themes with persistent settings
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚡ **Fast Loading**: Static site generation for optimal performance
- 🔒 **Security**: Built-in security headers and best practices

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + Lucide React icons
- **Theme**: next-themes for dark/light mode
- **API**: REST API integration with Django backend
- **Deployment**: Render (Static Site)

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm 8+
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd my-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run export` - Build static export
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build directories

## Project Structure

```
my-app/
├── app/                    # Next.js app directory
│   ├── articles/          # Article detail pages
│   ├── components/        # Reusable components
│   ├── settings/          # Settings/keywords management
│   ├── api-test/          # API connection test
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── public/                # Static assets
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
├── render.yaml            # Render deployment configuration
└── DEPLOYMENT.md          # Deployment guide
```

## API Integration

The app connects to a Django REST API with the following endpoints:

- **Base URL**: `https://beackkayq.onrender.com`
- **Articles**: `/api/articles/`
- **Keywords**: `/api/keywords/`
- **Individual Article**: `/api/articles/{id}/`

### API Test

Visit `/api-test` to verify API connectivity and see real-time status of all endpoints.

## Environment Variables

### Required
- `NEXT_PUBLIC_API_URL` - API base URL

### Optional
- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_VERSION` - Application version
- `NODE_ENV` - Environment (production/development)

## Deployment

### Render Deployment

1. **Connect to Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Create new Static Site
   - Connect your GitHub repository

2. **Configure Build:**
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `out`

3. **Set Environment Variables:**
   - Add all required environment variables
   - See `DEPLOYMENT.md` for detailed instructions

4. **Deploy:**
   - Click "Create Static Site"
   - Wait for build to complete

### Manual Deployment

```bash
# Build the project
npm run build

# The static files will be in the `out` directory
# Upload these files to your hosting provider
```

## Security Features

- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **CORS Protection**: Proper cross-origin request handling
- **Input Validation**: TypeScript type checking
- **Environment Variables**: Secure configuration management

## Performance Optimizations

- **Static Generation**: Pre-built pages for fast loading
- **Code Splitting**: Automatic code splitting by Next.js
- **Image Optimization**: Optimized image handling
- **CSS Optimization**: Purged and optimized CSS
- **Console Removal**: Production builds remove console logs

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run type-check && npm run lint`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version (18+ required)
   - Run `npm run type-check` for TypeScript errors
   - Run `npm run lint` for code style issues

2. **API Connection Issues**
   - Verify `NEXT_PUBLIC_API_URL` is set correctly
   - Check if API is running and accessible
   - Use `/api-test` page to diagnose issues

3. **Environment Variables**
   - Ensure variables start with `NEXT_PUBLIC_` for client access
   - Redeploy after changing environment variables

### Debug Commands

```bash
# Check versions
node --version
npm --version

# Type checking
npm run type-check

# Linting
npm run lint

# Clean build
npm run clean && npm run build
```

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the [Deployment Guide](DEPLOYMENT.md)
- Visit the API test page at `/api-test`
- Review the troubleshooting section above
