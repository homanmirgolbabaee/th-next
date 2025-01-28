import ChatWindow from '@/components/assistant/ChatWindow';
import { ThemeProvider } from '@/components/assistant/ThemeContext';
import ThemeToggle from '@/components/assistant/ThemeToggle';

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-8 transition-all duration-500">
        <ThemeToggle />
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Toolhouse Assistant
            </h1>
            <p className="text-gray-400 mt-2">Your AI-powered helper for getting things done</p>
          </div>
          <ChatWindow />
        </div>
      </div>
    </ThemeProvider>
  );
}