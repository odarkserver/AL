# 🤖 ODARK AI Assistant

Advanced AI-powered assistant with real-time chat, image generation, and web search capabilities. Built with Next.js 15, TypeScript, and cutting-edge AI technologies.

## ✨ Features

### 🎯 Core Capabilities
- **💬 AI Chat Interface** - Real-time conversations with advanced AI models
- **🎨 Image Generation** - Create stunning images with AI-powered generation
- **🔍 Web Search** - Intelligent web search with ranked results
- **📱 Responsive Design** - Mobile-first, modern UI with glass morphism effects
- **🌙 Dark Theme** - Beautiful dark mode with gradient backgrounds

### 🚀 Advanced Features
- **🔐 Authentication System** - Secure login with GitHub, Google, and email
- **💾 Database Integration** - Full Prisma ORM with SQLite
- **⚡ Real-time Features** - WebSocket support for live collaboration
- **📊 Analytics & Logging** - Comprehensive usage tracking and system logs
- **🐳 Docker Support** - Containerized deployment with Docker & Docker Compose
- **🔄 CI/CD Pipeline** - Automated testing, building, and deployment with GitHub Actions

## 🛠 Technology Stack

### Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Modern utility-first CSS
- **🧩 shadcn/ui** - High-quality accessible components

### AI & Backend
- **🤖 Z-AI Web Dev SDK** - Advanced AI integration
- **🗄️ Prisma ORM** - Type-safe database operations
- **🔐 NextAuth.js** - Complete authentication solution
- **⚡ Socket.io** - Real-time WebSocket communication

### Development & Deployment
- **🐳 Docker** - Containerization
- **🔄 GitHub Actions** - CI/CD pipeline
- **📊 ESLint & TypeScript** - Code quality assurance
- **🎯 Framer Motion** - Smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 20 or higher
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/odarkserver/AL.git
cd AL

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Setup database
npm run db:push
npm run db:generate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Z-AI SDK (Optional - uses default if not provided)
Z_AI_API_KEY="your-z-ai-api-key"
```

## 📁 Project Structure

```
AL/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── chat/          # AI chat API
│   │   │   ├── generate-image/ # Image generation API
│   │   │   └── web-search/    # Web search API
│   │   ├── auth/              # Authentication pages
│   │   └── page.tsx           # Main application page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── chat-interface.tsx # Chat component
│   │   ├── image-generator.tsx # Image generation
│   │   └── web-search.tsx    # Web search component
│   ├── lib/                   # Utilities and configurations
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── db.ts             # Database client
│   │   ├── socket.ts         # WebSocket setup
│   │   └── utils.ts          # Helper functions
│   └── hooks/                 # Custom React hooks
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                   # Static assets
├── .github/
│   └── workflows/           # GitHub Actions CI/CD
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose setup
└── README.md               # This file
```

## 🎯 Available Features

### 💬 AI Chat
- Real-time conversation with AI
- Message history and persistence
- Typing indicators
- Multiple chat sessions
- WebSocket support for real-time updates

### 🎨 Image Generation
- AI-powered image creation
- Multiple size options (512x512, 1024x1024, etc.)
- Download generated images
- Image history
- Progress tracking with WebSocket

### 🔍 Web Search
- Real-time web search
- Ranked search results
- Search history
- Multiple search engines support
- Result caching

### 🔐 Authentication
- Email/password authentication
- OAuth providers (GitHub, Google)
- Secure session management
- User profile management
- Role-based access control

### 📊 Database Features
- User management
- Chat session persistence
- Image generation history
- Web search logs
- API usage tracking
- System logging

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Using Docker Directly

```bash
# Build the image
docker build -t odark-ai .

# Run the container
docker run -p 3000:3000 --env-file .env odark-ai
```

## 🔄 CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow that:

- ✅ **Linting** - Code quality checks with ESLint
- 🔍 **Testing** - Build verification and smoke tests
- 🔒 **Security** - Dependency audit and secret scanning
- 🚀 **Deployment** - Automated deployment to production
- 🐳 **Docker** - Build and push Docker images

### Required GitHub Secrets

Set these secrets in your GitHub repository settings:

- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GITHUB_ID`
- `GITHUB_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `VERCEL_TOKEN` (for Vercel deployment)
- `DOCKER_USERNAME` (for Docker Hub)
- `DOCKER_PASSWORD` (for Docker Hub)

## 📚 API Documentation

### Chat API
```typescript
POST /api/chat
{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ]
}
```

### Image Generation API
```typescript
POST /api/generate-image
{
  "prompt": "A beautiful sunset",
  "size": "1024x1024"
}
```

### Web Search API
```typescript
POST /api/web-search
{
  "query": "Next.js 15 features",
  "num": 10
}
```

## 🎨 Customization

### Theming
The application uses a dark theme with purple/pink gradients. Customize colors in:

- `tailwind.config.ts` - Tailwind configuration
- `src/app/globals.css` - Global styles
- Component files for specific styling

### AI Models
Modify AI behavior in:
- `src/app/api/chat/route.ts` - Chat configuration
- `src/app/api/generate-image/route.ts` - Image generation settings
- `src/lib/auth.ts` - Authentication system

### Database Schema
Update the database schema in `prisma/schema.prisma` and run:

```bash
npm run db:push
npm run db:generate
```

## 🚀 Production Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Docker
```bash
# Build production image
docker build -t odarkserver/odark-ai:latest .

# Run with production settings
docker run -d \
  --name odark-ai \
  -p 3000:3000 \
  --env-file .env.production \
  odarkserver/odark-ai:latest
```

### Traditional Server
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Z-AI](https://z-ai.com) - For the powerful AI SDK
- [Next.js](https://nextjs.org) - The React framework
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Prisma](https://prisma.io) - Next-generation ORM

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Visit the [documentation](https://github.com/odarkserver/AL/wiki)
- Contact the maintainers

---

**Built with ❤️ by ODARK Server**  
*Advanced AI Assistant for the Modern Web*
