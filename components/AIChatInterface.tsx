
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { ChatMessage, PortfolioData } from '../types';
import { generateFileContent } from '../constants'; // To get context
import ChatBubble from './ChatBubble';
import { Send, AlertTriangle, Loader2 } from 'lucide-react';

interface AIChatInterfaceProps {
  portfolioData: PortfolioData;
}

const TYPING_ANIMATION_ID_PREFIX = "ai-typing-";

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ portfolioData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [apiKeyAvailable, setApiKeyAvailable] = useState<boolean>(false);

  useEffect(() => {
    setApiKeyAvailable(!!process.env.API_KEY);
    if (process.env.API_KEY) {
         setMessages([
            {
            id: `${TYPING_ANIMATION_ID_PREFIX}${crypto.randomUUID()}`, // Ensure initial AI message also gets typing effect
            text: "Hello! I'm Nandang's AI Portfolio Assistant, running on his VSCode-themed website. How can I help you today? Ask me about his skills, projects, or experience!",
            sender: 'ai',
            timestamp: new Date(),
            },
        ]);
    } else {
        setMessages([
            {
            id: crypto.randomUUID(), // No typing for error messages
            text: "AI Assistant is currently unavailable. The API key has not been configured for this application.",
            sender: 'ai',
            timestamp: new Date(),
            error: true,
            },
        ]);
    }
  }, []);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getContextualPrompt = (userInput: string): string => {
    const about = JSON.parse(generateFileContent('about.json', portfolioData));
    const experience = JSON.parse(generateFileContent('experience.json', portfolioData));
    const skills = JSON.parse(generateFileContent('skills.json', portfolioData));
    const projectsList = JSON.parse(generateFileContent('projects.json', portfolioData)).projects;
    const projectTitles = projectsList.map((p: {id: string, title: string}) => p.title).join(', ');

    const contactDetails = [];
    if (portfolioData.email) contactDetails.push(`Email: ${portfolioData.email}`);
    if (portfolioData.phone) contactDetails.push(`Phone: ${portfolioData.phone}`);
    if (portfolioData.linkedIn) contactDetails.push(`LinkedIn: ${portfolioData.linkedIn}`);
    if (portfolioData.instagram) contactDetails.push(`Instagram: ${portfolioData.instagram}`);
    if (portfolioData.tiktok) contactDetails.push(`TikTok: ${portfolioData.tiktok}`);
    if (portfolioData.otherSocial) contactDetails.push(`${portfolioData.otherSocial.name}: ${portfolioData.otherSocial.url}`);


    return `
You are a friendly, professional, and helpful AI assistant for Nandang Eka Prasetya's portfolio.
You are embedded in Nandang's interactive portfolio website, which is designed to look and feel like the Visual Studio Code editor.
Your goal is to answer questions about Nandang, his skills, experience, projects, and this website itself, based ONLY on the information provided below.
Do not make up information or answer questions outside of this context. If the answer is not in the provided information, politely state that you don't have that specific detail.
Keep your answers concise and well-formatted.
**Use Markdown for formatting (e.g., for lists, bold, italics, inline code like \`example.json\`, and code blocks using triple backticks \`\`\`language\ncode\n\`\`\`).**

**About This Portfolio Website:**
*   This website is Nandang Eka Prasetya's interactive portfolio.
*   Its purpose is to showcase Nandang's skills, experience, and projects in a unique, VSCode-inspired interface.
*   It was built using React, TypeScript, Tailwind CSS, and Vite. The AI chat assistant you are interacting with (that's you!) is powered by Google's Gemini API.
*   Users can navigate different sections (like 'About', 'Experience', 'Projects') by clicking the corresponding files (e.g., \`about.json\`, \`experience.json\`) in the 'Explorer' sidebar on the left. They can also use the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on a Mac) to search for files and commands.

**Nandang Eka Prasetya's Information:**
*   **Name:** ${portfolioData.name} (He also goes by ${portfolioData.nickname})
*   **Current Role:** ${about.current_position.role} at ${about.current_position.company} (from ${about.current_position.period})
*   **Education:**
    ${about.education.map((edu: { school: string, major: string, period: string}) => `  - ${edu.major} from ${edu.school} (${edu.period})`).join('\n    ')}
*   **Contact & Socials:** ${contactDetails.join('; ')} (Details in \`contact.json\`)

*   **Key Skills:** ${skills.skills.join(', ')} (View details in \`skills.json\`)

*   **Work Experience:**
    ${experience.work_experience.map((exp: { role: string, company: string, period: string}) => `  - ${exp.role} at ${exp.company} (${exp.period})`).join('\n    ')} (View details in \`experience.json\`)

*   **Project Titles:** ${projectTitles}
    (For project details, the user can click on \`projects.json\` in the Explorer to see project cards, then click a card to open its details.)

**Guidance for Responding:**
*   If a user asks for general info (e.g., "tell me about Nandang"), provide a brief summary.
*   If a user asks about a specific section (e.g., "what are his skills?", "show me his projects", "how to contact him?"), refer them to the relevant JSON file in the Explorer (e.g., "You can find Nandang's skills listed in \`skills.json\` in the Explorer sidebar.", or "Contact details including social media links are in \`contact.json\`.").
*   If asked about how to use the website, explain the Explorer sidebar and Command Palette for navigation.
*   Be polite and helpful!

Based on this information, please answer the following user question:
User: ${userInput}
AI:`;
  };


  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !apiKeyAvailable) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = getContextualPrompt(userMessage.text);
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17', 
        contents: prompt,
      });

      const aiResponseText = response.text;

      const aiMessage: ChatMessage = {
        id: `${TYPING_ANIMATION_ID_PREFIX}${crypto.randomUUID()}`, // Prefix ID for AI messages to trigger typing
        text: aiResponseText || "Sorry, I couldn't generate a response.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (e) {
      console.error("Error calling Gemini API:", e);
      setError("Sorry, an error occurred while contacting the AI. Please try again.");
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        text: "Sorry, I faced an issue trying to respond. Please check the connection or try again later.",
        sender: 'ai',
        timestamp: new Date(),
        error: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--editor-background)] text-[var(--editor-foreground)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {error && (
        <div className="p-3 bg-red-500/20 text-red-300 text-sm flex items-center">
          <AlertTriangle size={18} className="mr-2" /> {error}
        </div>
      )}
      {!apiKeyAvailable && (
         <div className="p-3 bg-yellow-500/20 text-yellow-300 text-sm flex items-center justify-center">
            <AlertTriangle size={18} className="mr-2" />
            AI Assistant features are disabled. API key not configured.
        </div>
      )}
      <div className="p-3 border-t border-[var(--border-color)] bg-[var(--sidebar-background)]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={apiKeyAvailable ? "Ask something about Nandang..." : "AI Assistant unavailable"}
            className="flex-1 p-2 bg-[var(--editor-background)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--focus-border)] text-sm text-[var(--editor-foreground)] placeholder-[var(--text-muted)]"
            disabled={isLoading || !apiKeyAvailable}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !apiKeyAvailable}
            className="p-2.5 bg-[var(--modal-button-background)] text-[var(--modal-button-foreground)] rounded-md hover:bg-[var(--modal-button-hover-background)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatInterface;
