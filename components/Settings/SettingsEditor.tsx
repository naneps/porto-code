

import React from 'react';
import { ICONS } from '../../constants';
import { Volume2, VolumeX, Palette, Type as FontIcon, ListTree, Terminal, Code2 as DevIcon } from 'lucide-react';
import { Theme, FontFamilyOption, FontSizeOption } from '../../types';

interface SettingSelectProps {
  label: string;
  options: { id: string; label: string; value?: string }[];
  currentValueId: string;
  onChange: (id: string) => void;
  Icon?: React.ElementType;
  description?: string;
}

const SettingSelect: React.FC<SettingSelectProps> = ({ label, options, currentValueId, onChange, Icon, description }) => (
  <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)] last:border-b-0">
    <div className="flex items-center">
      {Icon && <Icon size={18} className="mr-3 text-[var(--text-accent)] flex-shrink-0" />}
      <div>
        <label htmlFor={`setting-${label.toLowerCase().replace(/\s+/g, '-')}`} className="block text-sm font-medium text-[var(--editor-foreground)]">
          {label}
        </label>
        {description && <p className="text-xs text-[var(--text-muted)]">{description}</p>}
      </div>
    </div>
    <select
      id={`setting-${label.toLowerCase().replace(/\s+/g, '-')}`}
      value={currentValueId}
      onChange={(e) => onChange(e.target.value)}
      className="min-w-[150px] max-w-[200px] px-2 py-1.5 text-xs bg-[var(--sidebar-background)] text-[var(--editor-foreground)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--focus-border)] focus:ring-1 focus:ring-[var(--focus-border)] appearance-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23${ICONS.chevron_down_icon ? 'currentColor' : '6B7280'}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.5rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.25em 1.25em',
        paddingRight: '2.5rem',
      }}
    >
      {options.map(option => (
        <option key={option.id} value={option.id}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; label: string; description?: string; Icon?: React.ElementType }> = ({ checked, onChange, label, description, Icon }) => (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)] last:border-b-0">
      <div className="flex items-center">
        {Icon && <Icon size={18} className="mr-3 text-[var(--text-accent)] flex-shrink-0" />}
        <div>
          <label className="block text-sm font-medium text-[var(--editor-foreground)]">{label}</label>
          {description && <p className="text-xs text-[var(--text-muted)]">{description}</p>}
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)] focus:ring-opacity-50
                    ${checked ? 'bg-[var(--text-accent)]' : 'bg-[var(--sidebar-item-hover-background)]'}`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out
                      ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );

interface SettingsEditorProps {
  isSoundMuted: boolean;
  handleToggleSoundMute: () => void; // Changed from onToggleSoundMute
  themes: Theme[];
  currentThemeName: string;
  onThemeChange: (themeName: string) => void;
  fontFamilies: FontFamilyOption[];
  currentFontFamilyId: string;
  onFontFamilyChange: (fontId: string) => void;
  editorFontSizes: FontSizeOption[];
  currentEditorFontSizeId: string;
  onEditorFontSizeChange: (sizeId: string) => void;
  terminalFontSizes: FontSizeOption[];
  currentTerminalFontSizeId: string;
  onTerminalFontSizeChange: (sizeId: string) => void;
  isDevModeEnabled?: boolean; 
  onToggleDevMode?: () => void; 
}

const SettingsEditor: React.FC<SettingsEditorProps> = ({
  isSoundMuted,
  handleToggleSoundMute, // Changed from onToggleSoundMute
  themes,
  currentThemeName,
  onThemeChange,
  fontFamilies,
  currentFontFamilyId,
  onFontFamilyChange,
  editorFontSizes,
  currentEditorFontSizeId,
  onEditorFontSizeChange,
  terminalFontSizes,
  currentTerminalFontSizeId,
  onTerminalFontSizeChange,
  isDevModeEnabled, 
  onToggleDevMode, 
}) => {
  const SoundIcon = isSoundMuted ? (ICONS.VolumeXIcon || VolumeX) : (ICONS.Volume2Icon || Volume2);
  const ThemeIcon = ICONS.theme_command || Palette;
  const EditorFontIcon = ICONS.font_command || FontIcon;
  const EditorFontSizeIcon = ListTree; 
  const TerminalFontSizeIcon = Terminal;
  const DeveloperModeIcon = ICONS.Code2 || DevIcon;


  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-[var(--editor-background)] text-[var(--editor-foreground)]">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--editor-tab-active-foreground)]">Settings</h1>
      </header>

      <section className="mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-medium text-[var(--text-accent)] border-b border-[var(--border-color)] pb-2 mb-0">
          General
        </h2>
        <div className="space-y-0">
          <ToggleSwitch
            checked={!isSoundMuted}
            onChange={handleToggleSoundMute} // Use changed prop
            label="Sound Effects"
            description={isSoundMuted ? "Sound effects are currently muted." : "Enable or disable UI sound effects."}
            Icon={SoundIcon}
          />
        </div>
      </section>

      <section className="mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-medium text-[var(--text-accent)] border-b border-[var(--border-color)] pb-2 mb-0">
          Appearance
        </h2>
        <div className="space-y-0">
          <SettingSelect
            label="Theme"
            options={themes.map(t => ({ id: t.name, label: t.name }))}
            currentValueId={currentThemeName}
            onChange={onThemeChange}
            Icon={ThemeIcon}
            description="Controls the colors of the UI."
          />
          <SettingSelect
            label="Editor Font Family"
            options={fontFamilies}
            currentValueId={currentFontFamilyId}
            onChange={onFontFamilyChange}
            Icon={EditorFontIcon}
            description="Controls the font family used in the editor and other monospaced areas."
          />
          <SettingSelect
            label="Editor Font Size"
            options={editorFontSizes}
            currentValueId={currentEditorFontSizeId}
            onChange={onEditorFontSizeChange}
            Icon={EditorFontSizeIcon}
            description="Controls the font size in pixels for the editor."
          />
           <SettingSelect
            label="Terminal Font Size"
            options={terminalFontSizes}
            currentValueId={currentTerminalFontSizeId}
            onChange={onTerminalFontSizeChange}
            Icon={TerminalFontSizeIcon}
            description="Controls the font size in pixels for the integrated terminal."
          />
        </div>
      </section>

      <section className="mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-medium text-[var(--text-accent)] border-b border-[var(--border-color)] pb-2 mb-0">
          Developer
        </h2>
        <div className="space-y-0">
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                    {DeveloperModeIcon && <DeveloperModeIcon size={18} className="mr-3 text-[var(--text-accent)] flex-shrink-0" />}
                    <div>
                        <label className="block text-sm font-medium text-[var(--editor-foreground)]">Developer Mode</label>
                        <p className="text-xs text-[var(--text-muted)]">
                            Currently: <span className={`font-semibold ${isDevModeEnabled ? 'text-green-400' : 'text-red-400'}`}>{isDevModeEnabled ? 'Enabled' : 'Disabled'}</span>.
                            Enables browser developer tools and inspect element.
                        </p>
                    </div>
                </div>
                <button
                    onClick={onToggleDevMode}
                    className="px-3 py-1.5 text-xs bg-[var(--modal-button-background)] text-[var(--modal-button-foreground)] hover:bg-[var(--modal-button-hover-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)]"
                >
                    {isDevModeEnabled ? 'Disable Dev Mode' : 'Enable Dev Mode'}
                </button>
            </div>
        </div>
      </section>

    </div>
  );
};

export default SettingsEditor;
