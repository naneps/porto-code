
import { PortfolioData, WorkExperienceEntry, ProjectDetail, LogLevel, AIValidationStatus, ChatMessage } from '../App/types';
import { generateFileContent } from '../App/constants';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

// Build the system context block once per session
export const buildSystemContext = (portfolioData: PortfolioData): string => {
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

    const availableFiles = ['about.json', 'experience.json', 'skills.json', 'projects.json', 'contact.json'];

    return `You are a friendly, professional, and helpful AI assistant for Nandang Eka Prasetya's portfolio.
You are embedded in Nandang's interactive portfolio website, which is designed to look and feel like Visual Studio Code.
Your goal is to answer questions about Nandang, his skills, experience, projects, and this website itself, based ONLY on the information provided below.
Do not make up information or answer questions outside of this context. If the answer is not in the provided information, politely state that you don't have that specific detail.
Keep your answers concise and well-formatted using Markdown.

**IMPORTANT: Response Format**
At the VERY END of EVERY response, you MUST output a special JSON block (even if there are no file recommendations or follow-ups).
The block must look exactly like this example:

%%RESPONSE_META%%
{
  "recommendedFiles": ["about.json"],
  "followUpQuestions": ["What are his key skills?", "Can you show his projects?", "How can I contact him?"]
}
%%END_RESPONSE_META%%

Rules for the JSON block:
- "recommendedFiles": array of filenames from this list ONLY: ${availableFiles.join(', ')}. Empty array [] if none relevant.
- "followUpQuestions": array of exactly 3 short, specific follow-up questions the user might want to ask next. Always provide 3.
- Do NOT put any markdown or explanation inside the JSON block.

**About This Portfolio Website:**
- Built with React, TypeScript, and Vite. AI powered by Google Gemini.
- Navigate by clicking files in the 'Explorer' sidebar, or use Ctrl+Shift+P for the Command Palette.

**Nandang Eka Prasetya's Information:**
- **Name:** ${portfolioData.name} (nickname: ${portfolioData.nickname})
- **Role:** ${portfolioData.role || 'Full Stack Developer'}
- **Summary:** ${portfolioData.summary || 'Software developer.'}
- **Current Role:** ${about.current_position.role} at ${about.current_position.company} (${about.current_position.period})
  - ${about.current_position.description || ''}
- **Education:**
  ${about.education.map((edu: { school: string, major: string, period: string, gpa?: string}) => `  - ${edu.major} at ${edu.school} (${edu.period})${edu.gpa ? ', GPA: ' + edu.gpa : ''}`).join('\n  ')}
- **Contact & Socials:** ${contactDetails.join('; ')}
- **Key Skills:** ${skills.skills.join(', ')}
- **Work Experience:**
  ${(experience.work_experience as WorkExperienceEntry[]).map(exp =>
      `  - **${exp.role} at ${exp.company} (${exp.period})**\n    ${exp.description || ''}`
  ).join('\n  ')}
- **Projects:** ${projectTitles}`;
};

// Parse the %%RESPONSE_META%% block out of the AI response text
export const parseResponseMeta = (rawText: string): {
    cleanText: string;
    recommendedFiles: string[];
    followUpQuestions: string[];
} => {
    const metaBlockRegex = /%%RESPONSE_META%%\s*([\s\S]*?)\s*%%END_RESPONSE_META%%/;
    const match = rawText.match(metaBlockRegex);

    let recommendedFiles: string[] = [];
    let followUpQuestions: string[] = [];

    if (match && match[1]) {
        try {
            const parsed = JSON.parse(match[1].trim());
            recommendedFiles = Array.isArray(parsed.recommendedFiles) ? parsed.recommendedFiles : [];
            followUpQuestions = Array.isArray(parsed.followUpQuestions) ? parsed.followUpQuestions : [];
        } catch (_) {
            // Malformed JSON — ignore gracefully
        }
    }

    const cleanText = rawText.replace(metaBlockRegex, '').trim();
    return { cleanText, recommendedFiles, followUpQuestions };
};

// Build the contents array for multi-turn conversation history
export const buildConversationContents = (
    userInput: string,
    history: ChatMessage[],
    systemContext: string
): string => {
    // Build conversation history string (last 10 messages max to avoid token overflow)
    const recentHistory = history.slice(-10);
    let historyText = '';
    if (recentHistory.length > 0) {
        historyText = '\n\n**Previous conversation:**\n' + recentHistory.map(msg =>
            `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text.substring(0, 500)}`
        ).join('\n');
    }

    return `${systemContext}${historyText}

Now answer the following:
User: ${userInput}
Assistant:`;
};

// Legacy single-turn prompt builder (kept for backward compat)
export const getContextualPrompt = (userInput: string, portfolioData: PortfolioData): string => {
    return buildConversationContents(userInput, [], buildSystemContext(portfolioData));
};


export const fetchAIProjectSuggestion = async (
    developerSkills: string[],
    addAppLog: (level: LogLevel, message: string, source?: string, details?: Record<string, any>) => void,
    userKeywords?: string
  ): Promise<Omit<ProjectDetail, 'id'> | null> => {
  if (!process.env.API_KEY) {
    addAppLog('error', "API_KEY is not set. Cannot fetch AI project suggestion.", 'AIService');
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let keywordInstruction = '';
  if (userKeywords && userKeywords.trim() !== '') {
    keywordInstruction = `The user has also provided these keywords/interests for the project idea: "${userKeywords}". Please try to incorporate these themes or topics naturally into your suggestion if possible, while still aligning with the developer's skills.`;
  }

  const prompt = `
You are an expert project manager and creative software architect.
Your task is to suggest a new and interesting software project idea.
The project should be innovative yet feasible. 
Consider these skills of the developer who might build this: ${developerSkills.join(', ')}.
${keywordInstruction}
Please generate the following details for the project:
1.  **title**: A catchy and descriptive project title (string).
2.  **description**: A concise (2-3 sentences) description of what the project does, its purpose, and key features (string).
3.  **technologies**: An array of 3-5 core technologies or tools that would be suitable for building this project (array of strings).
4.  **year**: A plausible year of completion (number, e.g., ${new Date().getFullYear() + 1}).
5.  **related_skills**: An array of 2-4 skills relevant to developing this project, possibly drawing from or complementing the developer's existing skills (array of strings).

Return the response as a single, valid JSON object with exactly these keys: "title", "description", "technologies", "year", "related_skills".
Do not include any other text or explanation outside of the JSON object.
`;
  addAppLog('debug', 'Requesting AI project suggestion.', 'AIService', { skills: developerSkills, userKeywords });
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash", 
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.8, 
        }
    });
    
    let jsonStr = (response.text || "").trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }

    const suggestedData = JSON.parse(jsonStr) as Omit<ProjectDetail, 'id'>;

    if (
      suggestedData &&
      typeof suggestedData.title === 'string' &&
      typeof suggestedData.description === 'string' &&
      Array.isArray(suggestedData.technologies) &&
      typeof suggestedData.year === 'number' &&
      Array.isArray(suggestedData.related_skills)
    ) {
      addAppLog('info', `Successfully parsed AI project suggestion: "${suggestedData.title}"`, 'AIService', { userKeywords });
      return suggestedData;
    } else {
      addAppLog('error', "AI project suggestion response has incorrect structure.", 'AIService', { responseData: suggestedData, userKeywords });
      return null;
    }
  } catch (error: any) {
    addAppLog('error', "Error fetching or parsing AI project suggestion.", 'AIService', { error: error.message || String(error), userKeywords });
    return null;
  }
};

export const validateGuestBookMessageWithGemini = async (
  message: string,
  addAppLog: (level: LogLevel, message: string, source?: string, details?: Record<string, any>) => void
): Promise<AIValidationStatus> => {
  if (!process.env.API_KEY) {
    addAppLog('warning', "Gemini API Key not available. Skipping guest book message validation.", 'GuestBookValidation');
    return 'validation_skipped';
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    You are a content moderation assistant for a public guest book.
    Your task is to determine if the following message is respectful, appropriate, and not spammy for a public guest book on a developer's portfolio website.
    The message should be generally positive or constructive. Avoid hate speech, offensive language, personal attacks, excessive profanity, or clearly irrelevant spam.
    Respond with ONLY ONE of the following keywords:
    - "OK" if the message is appropriate.
    - "FLAGGED" if the message is inappropriate, offensive, spam, or otherwise problematic.

    Message to validate: "${message}"

    Your response:
  `;

  addAppLog('debug', "Sending guest book message to Gemini for validation.", 'GuestBookValidation', { messageLength: message.length });

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1,
        topK: 1,
      }
    });

    const validationText = (response.text || "").trim().toUpperCase();
    addAppLog('info', `Gemini validation response: ${validationText}`, 'GuestBookValidation');

    if (validationText === 'OK') {
      return 'validated_ok';
    } else if (validationText === 'FLAGGED') {
      return 'validated_flagged';
    } else {
      addAppLog('warning', `Unexpected response from Gemini validation: ${validationText}`, 'GuestBookValidation');
      return 'validation_error';
    }
  } catch (error: any) {
    addAppLog('error', "Error during Gemini guest book message validation.", 'GuestBookValidation', { error: error.message || String(error) });
    return 'validation_error';
  }
};
