
import { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { ChatMessage, PortfolioData } from '../types';
import { getContextualPrompt } from '../utils/aiUtils'; // Import the prompt generator
import { playSound } from '../utils/audioUtils';

export const TYPING_ANIMATION_ID_PREFIX = "ai-typing-";

export const useGeminiChat = (portfolioData: PortfolioData) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyAvailable, setApiKeyAvailable] = useState<boolean>(false);

  useEffect(() => {
    const keyExists = !!process.env.API_KEY;
    setApiKeyAvailable(keyExists);

    if (messages.length === 0) { // Only set initial message if messages array is empty
        if (keyExists) {
            setMessages([
                {
                id: `${TYPING_ANIMATION_ID_PREFIX}${crypto.randomUUID()}`,
                text: "Hello! I'm Nandang's AI Portfolio Assistant, running on his VSCode-themed website. How can I help you today? Ask me about his skills, projects, or experience!",
                sender: 'ai',
                timestamp: new Date(),
                },
            ]);
        } else {
            setMessages([
                {
                id: crypto.randomUUID(),
                text: "AI Assistant is currently unavailable. The API key has not been configured for this application.",
                sender: 'ai',
                timestamp: new Date(),
                error: true,
                },
            ]);
            playSound('error');
        }
    }
  }, [messages.length, setMessages]); // setMessages is stable, messages.length ensures this primarily acts on initialization

  const handleSendMessage = useCallback(async () => {
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
    playSound('ui-click'); // Sound for sending a message

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = getContextualPrompt(userMessage.text, portfolioData);
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17', 
        contents: prompt,
      });

      const aiResponseText = response.text;

      const aiMessage: ChatMessage = {
        id: `${TYPING_ANIMATION_ID_PREFIX}${crypto.randomUUID()}`,
        text: aiResponseText || "Sorry, I couldn't generate a response.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      playSound('chat-receive');

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
      playSound('error');
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, apiKeyAvailable, portfolioData, setMessages]); // Added setMessages to dependencies

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
