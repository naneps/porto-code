
import { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { ChatMessage, PortfolioData, LogLevel } from '../types';
import { getContextualPrompt } from '../utils/aiUtils'; // Import the prompt generator
import { playSound } from '../utils/audioUtils';

export const TYPING_ANIMATION_ID_PREFIX = "ai-typing-"; // Keep for unique ID generation, though typing anim is removed

export const useGeminiChat = (
  portfolioData: PortfolioData,
  addAppLog: (level: LogLevel, message: string, source?: string, details?: Record<string, any>) => void
) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const savedMessages = localStorage.getItem('portfolio-chatMessages');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        return parsedMessages.map((msg: ChatMessage) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (error) {
      console.error("Failed to load chat messages from localStorage:", error);
      addAppLog('error', "Failed to load chat messages from localStorage.", 'AIChatHook', { error });
    }
    return [];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyAvailable, setApiKeyAvailable] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('portfolio-chatMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const keyExists = !!process.env.API_KEY;
    setApiKeyAvailable(keyExists);
    addAppLog('debug', `Gemini API Key Available: ${keyExists}`, 'AIChatHook');

    if (messages.length === 0) { 
        if (keyExists) {
            const initialMessageText = "Hello! I'm Nandang's AI Portfolio Assistant, running on his VSCode-themed website. How can I help you today? Ask me about his skills, projects, or experience!";
            setMessages([
                {
                id: `${TYPING_ANIMATION_ID_PREFIX}${crypto.randomUUID()}`,
                text: initialMessageText,
                sender: 'ai',
                timestamp: new Date(),
                recommendedFiles: ['about.json', 'projects.json', 'skills.json'] // Example initial recommendations
                },
            ]);
            addAppLog('info', 'AI Assistant initialized with welcome message.', 'AI', { initialMessage: initialMessageText });
        } else {
            const errorMsg = "AI Assistant is currently unavailable. The API key has not been configured for this application.";
            setMessages([
                {
                id: crypto.randomUUID(),
                text: errorMsg,
                sender: 'ai',
                timestamp: new Date(),
                error: true,
                },
            ]);
            addAppLog('error', errorMsg, 'AI');
            playSound('error');
        }
    }
  }, [apiKeyAvailable, addAppLog]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || !apiKeyAvailable) return;

    const userMessageText = input.trim();
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    playSound('ui-click');
    addAppLog('action', `User message sent to AI: "${userMessageText.substring(0,100)}${userMessageText.length > 100 ? '...' : ''}"`, 'User');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = getContextualPrompt(userMessage.text, portfolioData);
      addAppLog('debug', 'Generated contextual prompt for AI.', 'AI', { promptLength: prompt.length });
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17', 
        contents: prompt,
      });

      let aiResponseText = response.text || "Sorry, I couldn't generate a response.";
      let recommendedFiles: string[] = [];

      // Parse for %%FILE_RECOMMENDATIONS%% block
      const recommendationBlockRegex = /%%FILE_RECOMMENDATIONS%%([\s\S]*?)%%END_FILE_RECOMMENDATIONS%%/;
      const match = aiResponseText.match(recommendationBlockRegex);

      if (match && match[1]) {
        const fileListText = match[1].trim();
        // Extract filenames like [file.json]
        recommendedFiles = fileListText.split('\\n')
          .map(line => line.trim().match(/^\[(.*?)\]$/))
          .filter(Boolean)
          .map(fileMatch => (fileMatch as RegExpMatchArray)[1]);
        
        // Remove the block from the main message text
        aiResponseText = aiResponseText.replace(recommendationBlockRegex, '').trim();
        if (aiResponseText.length === 0 && recommendedFiles.length > 0) {
             aiResponseText = "Here are some files you might find relevant:"; // Provide default text if only recommendations
        }
      }
      
      const aiMessage: ChatMessage = {
        id: `${TYPING_ANIMATION_ID_PREFIX}${crypto.randomUUID()}`, // ID doesn't control typing anim anymore
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
        recommendedFiles: recommendedFiles.length > 0 ? recommendedFiles : undefined,
      };
      setMessages(prev => [...prev, aiMessage]);
      addAppLog('info', `AI response received: "${aiResponseText.substring(0,100)}${aiResponseText.length > 100 ? '...' : ''}"`, 'AI', { recommendedFiles });
      playSound('chat-receive');

    } catch (e: any) {
      console.error("Error calling Gemini API:", e);
      const errorMsg = "Sorry, an error occurred while contacting the AI. Please try again.";
      setError(errorMsg);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        text: "Sorry, I faced an issue trying to respond. Please check the connection or try again later.",
        sender: 'ai',
        timestamp: new Date(),
        error: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      addAppLog('error', 'Error calling Gemini API.', 'AI', { error: e.message || String(e) });
      playSound('error');
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, apiKeyAvailable, portfolioData, addAppLog]); 

  return {
    messages,
    setMessages, 
    input,
    setInput,
    isLoading,
    error,
    apiKeyAvailable,
    handleSendMessage,
  };
};