import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.scss'
import { CartProvider } from '../contexts/CartContext'
import { LoadingProvider } from '../contexts/LoadingContext'
import { Navigation } from '../components/Navigation'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Phone Store',
  description: 'Your one-stop shop for the latest mobile phones',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LoadingProvider>
          <CartProvider>
            <Navigation />
            <main>{children}</main>
          </CartProvider>
        </LoadingProvider>
      </body>
    </html>
  )
}
