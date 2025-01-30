import { useTheme } from '../context/ThemeContext';
import {
  // Core Icons
  Globe, Code, BrainCircuit, MessageSquarePlus,
  // Additional Feature Icons
  Rocket, Cpu, Database, Terminal,
  Sparkles, Bot, Binary, Network,
  ChevronRight, Zap, GitBranch, Search,
  FlaskConical, Telescope, RadioTower, Workflow
} from 'lucide-react';


interface ChatTemplatesProps {
  onTemplateSelect: (query: string) => void;
}

export default function ChatTemplates({ onTemplateSelect }: ChatTemplatesProps) {
  const { theme } = useTheme();
  const isCyberpunk = theme === 'cyberpunk';
  const isRetro = theme === 'retro';

  const templates = [
    {
      icon: <Cpu className="w-5 h-5" />,
      title: isCyberpunk ? "QUERY_DATA" : "Search Internet",
      description: isCyberpunk 
        ? "SEARCH_INTERNET" 
        : "Search through Internet with LLM",
      query: "use web_search tool Search Internet query= perform a web search and list {Toolhouse.ai} competitors"
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: isCyberpunk ? "DEBUG_CODE" : "Debug Code",
      description: isCyberpunk 
        ? "ANALYZE_CODE_EXECUTION" 
        : "Get help with code debugging and optimization",
      query: "Can you help me debug this error in my Toolhouse integration?"
    },
    {
      icon: <FlaskConical className="w-5 h-5" />,
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
    <>
      
    
      <div className="grid grid-cols-2 gap-4 px-4">
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={() => onTemplateSelect(template.query)}
            className={`
              group p-4 text-left transition-all duration-300 
              ${isCyberpunk
                ? 'border border-[#00ff00]/30 hover:border-[#00ff00]/60 bg-black/50 hover:bg-[#001100] font-mono'
                : isRetro
                ? 'retro-card transform hover:scale-105 transition-transform'
                : 'border border-gray-700/50 hover:border-blue-500/50 bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm'
              }
              rounded-lg hover:shadow-lg
              ${isCyberpunk 
                ? 'hover:shadow-[#00ff00]/20' 
                : isRetro
                ? 'hover:shadow-[#ffd700]/20'
                : 'hover:shadow-blue-500/20'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <div className={`
                p-2 rounded-md transition-all duration-300
                ${isCyberpunk
                  ? 'bg-[#001100] group-hover:bg-[#002200]'
                  : isRetro
                  ? 'retro-icon group-hover:scale-110'
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
                    : isRetro
                    ? 'retro-text text-[#ffd700] text-sm uppercase'
                    : 'text-gray-200 text-base'
                  }
                `}>
                  {template.title}
                </h3>
                <p className={`
                  text-sm
                  ${isCyberpunk
                    ? 'text-[#00ff00]/70 text-xs'
                    : isRetro
                    ? 'retro-text text-[#ff004d] text-xs'
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
    </>
  );
}