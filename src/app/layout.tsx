import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/assistant/ThemeContext'
import { ChatProvider } from '@/components/assistant/ChatContext'
import ErrorBoundary from '@/components/assistant/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Toolhouse Assistant',
  description: 'Your AI-powered helper for getting things done',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <ChatProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}