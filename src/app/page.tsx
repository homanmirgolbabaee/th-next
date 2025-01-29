// page.tsx
import ChatWindow from '@/components/assistant/ChatWindow';
import { ThemeProvider } from '@/components/assistant/ThemeContext';
import { ChatProvider } from '@/components/assistant/ChatContext';
import ThemeToggle from '@/components/assistant/ThemeToggle';
import Sidebar from '@/components/assistant/Sidebar';

export default function Home() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
          <Sidebar />
          <div className="ml-16 lg:ml-64 h-screen flex flex-col">
            <ThemeToggle />
            <div className="flex-1 flex flex-col h-full">
              <ChatWindow />
            </div>
          </div>
        </div>
      </ChatProvider>
    </ThemeProvider>
  );
}