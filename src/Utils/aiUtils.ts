import { PortfolioData, WorkExperienceEntry, ProjectDetail, LogLevel, AIValidationStatus } from '../App/types';
import { generateFileContent } from '../App/constants';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

export const getContextualPrompt = (userInput: string, portfolioData: PortfolioData): string => {
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

    // List of files the AI can recommend for opening
    const availableFiles = ['about.json', 'experience.json', 'skills.json', 'projects.json', 'contact.json'];

    return `
You are a friendly, professional, and helpful AI assistant for Nandang Eka Prasetya's portfolio.
You are embedded in Nandang's interactive portfolio website, which is designed to look and feel like the Visual Studio Code editor.
Your goal is to answer questions about Nandang, his skills, experience, projects, and this website itself, based ONLY on the information provided below.
Do not make up information or answer questions outside of this context. If the answer is not in the provided information, politely state that you don't have that specific detail.
Keep your answers concise and well-formatted.
**Use Markdown for formatting (e.g., for lists, bold, italics, inline code like \\\`example.json\\\`, and code blocks using triple backticks \\\`\`\`language\\ncode\\n\\\`\`\`).**

**IMPORTANT: File Recommendations**
If you mention a specific file that the user should open (like \\\`about.json\\\`, \\\`projects.json\\\`, etc.), first mention it naturally in your text.
Then, at the VERY END of your entire response, list these recommended files in a special block.
The block MUST start with \`%%FILE_RECOMMENDATIONS%%\` on its own line.
Each subsequent line should contain a single filename enclosed in square brackets, like \`[filename.json]\`.
The block MUST end with \`%%END_FILE_RECOMMENDATIONS%%\` on its own line.
Only include files from this list: ${availableFiles.join(', ')}.
Do NOT use any other markdown link format for file recommendations.

Example of how to recommend files:
"...you can find more details in his projects file. You might also want to check his skills.
%%FILE_RECOMMENDATIONS%%
[projects.json]
[skills.json]
%%END_FILE_RECOMMENDATIONS%%"

**About This Portfolio Website:**
*   This website is Nandang Eka Prasetya's interactive portfolio.
*   Its purpose is to showcase Nandang's skills, experience, and projects in a unique, VSCode-inspired interface.
*   It was built using React, TypeScript, Tailwind CSS, and Vite. The AI chat assistant you are interacting with (that's you!) is powered by Google's Gemini API.
*   Users can navigate different sections (like 'About', 'Experience', 'Projects') by clicking the corresponding files (e.g., \\\`about.json\\\`, \\\`experience.json\\\`) in the 'Explorer' sidebar on the left. They can also use the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on a Mac) to search for files and commands.

**Nandang Eka Prasetya's Information:**
*   **Name:** ${portfolioData.name} (He also goes by ${portfolioData.nickname})
*   **Summary:** ${portfolioData.summary || 'Nandang Eka Prasetya is a software developer.'}
*   **Current Role:** ${about.current_position.role} at ${about.current_position.company} (from ${about.current_position.period})
    *   **Description:** ${about.current_position.description || 'Details about current role.'}
*   **Education:**
    ${about.education.map((edu: { school: string, major: string, period: string}) => `  - ${edu.major} from ${edu.school} (${edu.period})`).join('\n    ')}
*   **Contact & Socials:** ${contactDetails.join('; ')} (Details can be found in contact.json)

*   **Key Skills:** ${skills.skills.join(', ')} (Detailed list in skills.json)

*   **Work Experience:**
    ${(experience.work_experience as WorkExperienceEntry[]).map(exp => 
        `  - **${exp.role} at ${exp.company} (${exp.period})**\\n    *Description:* ${exp.description || 'No specific description provided.'}`
    ).join('\n    ')}
    (View more details in experience.json)

*   **Project Titles:** ${projectTitles}
    (For project details, the user can explore projects.json to see project cards, then click a card to open its details.)

**Guidance for Responding:**
*   If a user asks for general info (e.g., "tell me about Nandang"), provide a brief summary based on the 'Summary' field.
*   If a user asks about a specific section (e.g., "what are his skills?", "show me his projects", "how to contact him?"), mention the relevant JSON file in your text, and then list it in the \`%%FILE_RECOMMENDATIONS%%\` block at the end.
*   If asked about how to use the website, explain the Explorer sidebar and Command Palette for navigation.
*   Be polite and helpful!

Based on this information, please answer the following user question:
User: ${userInput}
AI:`;
  };


export const fetchAIProjectSuggestion = async (
    developerSkills: string[],
    addAppLog: (level: LogLevel, message: string, source?: string, details?: Record<string, any>) => void,
    userKeywords?: string // Added optional userKeywords
  ): Promise<Omit<ProjectDetail, 'id'> | null> => {
  if (!process.env.API_KEY) {
    addAppLog('error', "API_KEY is not set. Cannot fetch AI project suggestion.", 'AIService');
    console.error("API_KEY is not set. Cannot fetch AI project suggestion.");
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
Example of the JSON structure:
{
  "title": "AI-Powered Recipe Recommender",
  "description": "A mobile application that suggests recipes based on user dietary preferences, available ingredients, and cooking skill level. Features personalized meal plans and grocery list generation.",
  "technologies": ["Flutter", "Firebase", "Python", "TensorFlow Lite"],
  "year": ${new Date().getFullYear() + 1},
  "related_skills": ["Mobile Development", "Machine Learning", "UI/UX Design"]
}
`;
  addAppLog('debug', 'Requesting AI project suggestion.', 'AIService', { skills: developerSkills, userKeywords });
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17", 
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.8, 
        }
    });
    
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    addAppLog('debug', 'Received AI project suggestion response.', 'AIService', { responseTextLength: jsonStr.length });

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
      console.error("AI project suggestion response has incorrect structure:", suggestedData);
      return null;
    }
  } catch (error: any) {
    addAppLog('error', "Error fetching or parsing AI project suggestion.", 'AIService', { error: error.message || String(error), userKeywords });
    console.error("Error fetching or parsing AI project suggestion:", error);
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
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        temperature: 0.1, // Low temperature for deterministic classification
        topK: 1,
      }
    });

    const validationText = response.text.trim().toUpperCase();
    addAppLog('info', `Gemini validation response: ${validationText}`, 'GuestBookValidation');

    if (validationText === 'OK') {
      return 'validated_ok';
    } else if (validationText === 'FLAGGED') {
      return 'validated_flagged';
    } else {
      addAppLog('warning', `Unexpected response from Gemini validation: ${validationText}`, 'GuestBookValidation');
      return 'validation_error'; // Or validation_skipped if we want to be lenient
    }
  } catch (error: any) {
    addAppLog('error', "Error during Gemini guest book message validation.", 'GuestBookValidation', { error: error.message || String(error) });
    console.error("Error validating guest book message with Gemini:", error);
    return 'validation_error';
  }
};