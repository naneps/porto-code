import { useState, useEffect, useCallback } from 'react';
import { PREDEFINED_THEMES, FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS, generateCSSVariables, TERMINAL_FONT_SIZE_OPTIONS } from '../App/themes';
import { FontSizeOption } from '../App/types';

export const useThemeManager = (
  passedInDefaultThemeName: string,
  passedInDefaultFontFamilyId: string,
  passedInDefaultEditorFontSizeId: string,
  currentTerminalFontSizeIdExt: string, // Keep existing params for terminal font
  terminalFontSizesExt: FontSizeOption[]
) => {
  const [currentThemeName, setCurrentThemeName] = useState<string>(() => localStorage.getItem('portfolio-theme') || passedInDefaultThemeName);
  const [currentFontFamilyId, setCurrentFontFamilyId] = useState<string>(() => localStorage.getItem('portfolio-font-family') || passedInDefaultFontFamilyId);
  const [currentEditorFontSizeId, setCurrentEditorFontSizeId] = useState<string>(() => localStorage.getItem('portfolio-font-size') || passedInDefaultEditorFontSizeId);
  // Terminal font size is managed by App.tsx and passed in, this hook only applies it.

  useEffect(() => {
    const selectedTheme = PREDEFINED_THEMES.find(theme => theme.name === currentThemeName) || PREDEFINED_THEMES.find(theme => theme.name === passedInDefaultThemeName) || PREDEFINED_THEMES[0];
    const selectedFontFamily = FONT_FAMILY_OPTIONS.find(font => font.id === currentFontFamilyId) || FONT_FAMILY_OPTIONS.find(font => font.id === passedInDefaultFontFamilyId) || FONT_FAMILY_OPTIONS[0];
    const selectedEditorFontSize = FONT_SIZE_OPTIONS.find(size => size.id === currentEditorFontSizeId) || FONT_SIZE_OPTIONS.find(size => size.id === passedInDefaultEditorFontSizeId) || FONT_SIZE_OPTIONS[1];
    const selectedTerminalFontSize = terminalFontSizesExt.find(size => size.id === currentTerminalFontSizeIdExt) || terminalFontSizesExt[0];


    let cssVars = generateCSSVariables(selectedTheme.properties);
    // Editor font
    cssVars += `\n--editor-font-family: ${selectedFontFamily.value};`;
    cssVars += `\n--editor-font-size: ${selectedEditorFontSize.value};`;
    cssVars += `\n--editor-line-height: ${selectedEditorFontSize.lineHeight || '1.5'};`;
    // Terminal font
    cssVars += `\n--terminal-font-size: ${selectedTerminalFontSize.value};`;
    cssVars += `\n--terminal-line-height: ${selectedTerminalFontSize.lineHeight || '1.5'};`;

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
    localStorage.setItem('portfolio-font-size', currentEditorFontSizeId);
    // localStorage for terminal font size is handled in App.tsx

  }, [currentThemeName, currentFontFamilyId, currentEditorFontSizeId, currentTerminalFontSizeIdExt, terminalFontSizesExt, passedInDefaultThemeName, passedInDefaultFontFamilyId, passedInDefaultEditorFontSizeId]);

  const handleThemeChange = useCallback((themeName: string) => setCurrentThemeName(themeName), []);
  const handleFontFamilyChange = useCallback((fontId: string) => setCurrentFontFamilyId(fontId), []);
  const handleFontSizeChange = useCallback((sizeId: string) => setCurrentEditorFontSizeId(sizeId), []); // This is for editor font size

  return {
    currentThemeName,
    currentFontFamilyId,
    currentFontSizeId: currentEditorFontSizeId, // Exporting as currentFontSizeId for backward compatibility where it implies editor
    handleThemeChange,
    handleFontFamilyChange,
    handleFontSizeChange, // This handler is for editor font size
  };
};