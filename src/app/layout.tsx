// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/assistant/context/ThemeContext'
import { ChatProvider } from '@/components/assistant/context/ChatContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Toolhouse Assistant',
  description: 'AI-powered chat assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-black min-h-screen`}>
        <ThemeProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}