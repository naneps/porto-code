
import { useState, useEffect, useCallback } from 'react';
import { PREDEFINED_THEMES, FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS, DEFAULT_THEME_NAME, DEFAULT_FONT_FAMILY_ID, DEFAULT_FONT_SIZE_ID, generateCSSVariables } from '../themes';

export const useThemeManager = () => {
  const [currentThemeName, setCurrentThemeName] = useState<string>(() => localStorage.getItem('portfolio-theme') || DEFAULT_THEME_NAME);
  const [currentFontFamilyId, setCurrentFontFamilyId] = useState<string>(() => localStorage.getItem('portfolio-font-family') || DEFAULT_FONT_FAMILY_ID);
  const [currentFontSizeId, setCurrentFontSizeId] = useState<string>(() => localStorage.getItem('portfolio-font-size') || DEFAULT_FONT_SIZE_ID);

  useEffect(() => {
    const selectedTheme = PREDEFINED_THEMES.find(theme => theme.name === currentThemeName) || PREDEFINED_THEMES[0];
    const selectedFontFamily = FONT_FAMILY_OPTIONS.find(font => font.id === currentFontFamilyId) || FONT_FAMILY_OPTIONS[0];
    const selectedFontSize = FONT_SIZE_OPTIONS.find(size => size.id === currentFontSizeId) || FONT_SIZE_OPTIONS[1];

    let cssVars = generateCSSVariables(selectedTheme.properties);
    cssVars += `\n--editor-font-family: ${selectedFontFamily.value};`;
    cssVars += `\n--editor-font-size: ${selectedFontSize.value};`;
    cssVars += `\n--editor-line-height: ${selectedFontSize.lineHeight || '1.5'};`;
    
    const styleElement = document.getElementById('dynamic-theme-styles');
    if (styleElement) {
        styleElement.innerHTML = `:root {\n${cssVars}\n}`;
    } else {
        const newStyleElement = document.createElement('style');
        newStyleElement.id = 'dynamic-theme-styles';
        newStyleElement.innerHTML = `:root {\n${cssVars}\n}`;
        document.head.appendChild(newStyleElement);
    }

    localStorage.setItem('portfolio-theme', currentThemeName);
    localStorage.setItem('portfolio-font-family', currentFontFamilyId);
    localStorage.setItem('portfolio-font-size', currentFontSizeId);

  }, [currentThemeName, currentFontFamilyId, currentFontSizeId]);

  const handleThemeChange = useCallback((themeName: string) => setCurrentThemeName(themeName), []);
  const handleFontFamilyChange = useCallback((fontId: string) => setCurrentFontFamilyId(fontId), []);
  const handleFontSizeChange = useCallback((sizeId: string) => setCurrentFontSizeId(sizeId), []);

  return {
    currentThemeName,
    currentFontFamilyId,
    currentFontSizeId,
    handleThemeChange,
    handleFontFamilyChange,
    handleFontSizeChange,
  };
};
