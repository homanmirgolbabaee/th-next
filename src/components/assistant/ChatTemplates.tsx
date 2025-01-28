import { useTheme } from './ThemeContext';
import { Search, Code, BrainCircuit, MessageSquarePlus } from 'lucide-react';

interface ChatTemplatesProps {
  onTemplateSelect: (query: string) => void;
}

export default function ChatTemplates({ onTemplateSelect }: ChatTemplatesProps) {
  const { theme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';

  const templates = [
    {
      icon: <Search className={isCyberpunk ? "text-[#00ff00]" : "text-blue-400"} />,
      title: isCyberpunk ? "QUERY_DATA" : "Search Data",
      description: isCyberpunk 
        ? "ACCESS_TOOLHOUSE_ANALYTICS" 
        : "Search through your Toolhouse analytics and metrics",
      query: "Show me the latest analytics data from my Toolhouse account"
    },
    {
      icon: <Code className={isCyberpunk ? "text-[#00ff00]" : "text-blue-400"} />,
      title: isCyberpunk ? "DEBUG_CODE" : "Debug Code",
      description: isCyberpunk 
        ? "ANALYZE_CODE_EXECUTION" 
        : "Get help with code debugging and optimization",
      query: "Can you help me debug this error in my Toolhouse integration?"
    },
    {
      icon: <BrainCircuit className={isCyberpunk ? "text-[#00ff00]" : "text-blue-400"} />,
      title: isCyberpunk ? "AI_INSIGHTS" : "AI Insights",
      description: isCyberpunk 
        ? "NEURAL_PATTERN_ANALYSIS" 
        : "Get AI-powered insights and recommendations",
      query: "What AI capabilities does Toolhouse offer?"
    },
    {
      icon: <MessageSquarePlus className={isCyberpunk ? "text-[#00ff00]" : "text-blue-400"} />,
      title: isCyberpunk ? "CUSTOM_QUERY" : "Custom Query",
      description: isCyberpunk 
        ? "INITIATE_CUSTOM_SEQUENCE" 
        : "Ask anything about Toolhouse",
      query: "Tell me more about Toolhouse's features"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 px-4">
      {templates.map((template, index) => (
        <button
          key={index}
          onClick={() => onTemplateSelect(template.query)}
          className={`
            group p-4 text-left transition-all duration-300 
            ${isCyberpunk
              ? 'border border-[#00ff00]/30 hover:border-[#00ff00]/60 bg-black/50 hover:bg-[#001100] font-mono'
              : 'border border-gray-700/50 hover:border-blue-500/50 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm'
            }
            rounded-lg hover:scale-105 hover:shadow-lg
            ${isCyberpunk ? 'hover:shadow-[#00ff00]/20' : 'hover:shadow-blue-500/20'}
          `}
        >
          <div className="flex items-start space-x-3">
            <div className={`
              p-2 rounded-md
              ${isCyberpunk
                ? 'bg-[#001100] group-hover:bg-[#002200]'
                : 'bg-gray-700/50 group-hover:bg-gray-600/50'
              }
            `}>
              {template.icon}
            </div>
            <div className="flex-1">
              <h3 className={`
                font-medium mb-1
                ${isCyberpunk
                  ? 'text-[#00ff00] text-sm'
                  : 'text-gray-200 text-base'
                }
              `}>
                {template.title}
              </h3>
              <p className={`
                text-sm
                ${isCyberpunk
                  ? 'text-[#00ff00]/70 text-xs'
                  : 'text-gray-400'
                }
              `}>
                {template.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}