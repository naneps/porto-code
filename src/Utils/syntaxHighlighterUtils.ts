
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const getSyntaxHighlighterTheme = (currentThemeName: string): any => {
  const isAppLightTheme = currentThemeName === 'VSCode Light+';
  const baseThemeSource = isAppLightTheme ? vs : vscDarkPlus;

  if (!baseThemeSource || typeof baseThemeSource !== 'object' || baseThemeSource === null) {
    console.warn('Syntax highlighter base theme is not available or not a valid object. Falling back to empty style.');
    return {}; // Fallback to an empty style object
  }
  
  // Deep clone the base theme to avoid mutating the original
  let newTheme: any = {}; // Initialize as any to match return type flexibility
  try {
    // Ensure that functions are not part of the theme object being cloned, or handle them appropriately if they are.
    // For typical style objects, JSON stringify/parse is a common way to deep clone.
    newTheme = JSON.parse(JSON.stringify(baseThemeSource));
  } catch (e) {
    console.error('Failed to clone syntax highlighter theme. This might be due to non-serializable content in the theme object (e.g., functions). Falling back to empty style.', e);
    return {}; // Fallback on cloning error
  }


  // Apply overrides from CSS variables
  // Let index.html's .markdown-content pre handle background, padding, border, border-radius, and font-size.
  const preStyleUpdates: React.CSSProperties = {
    // background: 'var(--editor-background)', // REMOVED - Handled by .markdown-content pre in index.html
    color: 'var(--editor-foreground)',      // Base text color inside the code block
    margin: '0',                            // Reset margin to align with global styles
    // padding: '1rem',                      // REMOVED - Handled by .markdown-content pre in index.html
    // fontSize: 'var(--editor-font-size)', // REMOVED - To allow 0.9em from .markdown-content pre
    fontFamily: 'var(--editor-font-family)',// Ensure font family consistency
    lineHeight: 'var(--editor-line-height)',// Ensure line height consistency
    height: '100%',                         // Ensure it fills its container
    overflow: 'auto',                       // Allow scrolling for content
    // border: 'none',                      // REMOVED - Handled by .markdown-content pre
    // borderRadius: '0px',                 // REMOVED - Handled by .markdown-content pre
  };

  newTheme['pre[class*="language-"]'] = { 
    ...(newTheme['pre[class*="language-"]'] || {}), 
    ...preStyleUpdates 
  };

  const codeStyleUpdates: React.CSSProperties = {
    background: 'transparent', // Code tag itself inside pre should be transparent
    color: 'var(--editor-foreground)', // Inherit foreground
    fontFamily: 'var(--editor-font-family)',
    fontSize: 'inherit', // Explicitly inherit font size from the parent <pre> tag
    lineHeight: 'var(--editor-line-height)',
    textShadow: 'none', // Remove default text shadow if any
    padding: '0', // No padding for the code tag itself
    margin: '0', // No margin for the code tag itself
  };

  newTheme['code[class*="language-"]'] = { 
    ...(newTheme['code[class*="language-"]'] || {}), 
    ...codeStyleUpdates 
  };

  // Specific token overrides using CSS variables
  const tokenStyleOverrides: { [selector: string]: React.CSSProperties } = {
    '.token.string': { color: 'var(--syntax-string)' },
    '.token.keyword': { color: 'var(--syntax-keyword)' },
    '.token.comment': { color: 'var(--syntax-comment)', fontStyle: 'italic' },
    '.token.number': { color: 'var(--syntax-number)' },
    '.token.boolean': { color: 'var(--syntax-boolean)' },
    '.token.property': { color: 'var(--syntax-property)' }, // Often for JSON keys
    '.token.operator': { color: 'var(--syntax-operator)' },
    '.token.punctuation': { color: 'var(--syntax-punctuation)' },
    '.token.function': { color: 'var(--syntax-function)' },
    '.token.plain-text': { color: 'var(--editor-foreground)' }, // For text not otherwise matched
    // Ensure JSON keys are specifically colored if 'property' isn't enough
    '.language-json .token.property': { color: 'var(--syntax-property)' },
  };

  for (const [selector, styles] of Object.entries(tokenStyleOverrides)) {
    newTheme[selector] = { ...(newTheme[selector] || {}), ...styles };
  }
  
  return newTheme;
};
