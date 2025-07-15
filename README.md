# Phone Store - Inditex Technical Interview

A modern e-commerce application built with Next.js 15, featuring a mobile phone
store with cart functionality, product search, and responsive design.

## 🚀 Live Demo

**[View Live Demo](https://inditex-sigma.vercel.app/)**

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: SCSS Modules
- **State Management**: React Context API
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel
- **API**: Server Actions for secure server-side data fetching

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd inditex-interview/inditex
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   cp .env.local.example .env.local
   ```

   Update the `.env.local` file with your API credentials:

   ```env
   # API Configuration (Server-side only - recommended for security)

   PUBLIC_API_BASE_URL=api-url
   PUBLIC_API_KEY=your-api-key-here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the
   application.

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## 🚀 Production Deployment

### Manual Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🔐 Environment Variables

### Server-Side (Recommended)

- `PUBLIC_API_BASE_URL`
- `PUBLIC_API_KEY`

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)

---

**Live Demo**:
[https://inditex-sigma.vercel.app/](https://inditex-sigma.vercel.app/)
