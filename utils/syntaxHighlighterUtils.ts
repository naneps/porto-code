
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const getSyntaxHighlighterTheme = (currentThemeName: string): any => {
  const isAppLightTheme = currentThemeName === 'VSCode Light+';
  const baseTheme = isAppLightTheme ? vs : vscDarkPlus;
  
  // Deep clone the base theme to avoid mutating the original
  const newTheme = JSON.parse(JSON.stringify(baseTheme));

  // Apply overrides from CSS variables
  const preStyleUpdates = {
    background: 'var(--editor-background)',
    color: 'var(--editor-foreground)',
    margin: '0', // Reset margin
    padding: '1rem', // Standard padding
    fontSize: 'var(--editor-font-size)',
    fontFamily: 'var(--editor-font-family)',
    lineHeight: 'var(--editor-line-height)',
    height: '100%', // Ensure it fills its container
    overflow: 'auto', // Allow scrolling for content
  };

  newTheme['pre[class*="language-"]'] = { 
    ...(newTheme['pre[class*="language-"]'] || {}), 
    ...preStyleUpdates 
  };

  const codeStyleUpdates = {
    background: 'transparent', // Code block itself should be transparent
    color: 'var(--editor-foreground)', // Inherit foreground
    fontFamily: 'var(--editor-font-family)',
    fontSize: 'var(--editor-font-size)',
    lineHeight: 'var(--editor-line-height)',
    textShadow: 'none', // Remove default text shadow if any
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
