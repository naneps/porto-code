

import React, { useState, useEffect } from 'react';
import { ICONS, ALL_FEATURE_IDS } from '../../App/constants';
import { Volume2, VolumeX, Palette, Type as FontIcon, ListTree, Terminal, Code2 as DevIcon, UserCircle2, Save, Github as GithubIconLucide, RotateCcw as ResetIcon, Wand2 } from 'lucide-react';
import { Theme, FontFamilyOption, FontSizeOption, SettingsEditorProps as EditorProps, FeatureStatus, CustomizableCSSVariable, ThemeProperties } from '../../App/types'; 
import MaintenanceView from '../../UI/MaintenanceView';
import { CUSTOMIZABLE_CSS_VARIABLES } from '../../App/themes'; // Import the list

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

const SettingsEditor: React.FC<EditorProps> = ({
  isSoundMuted,
  handleToggleSoundMute,
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
  currentUser,
  userGuestBookNickname,
  onUserGuestBookNicknameChange,
  userGitHubUsername,
  onUserGitHubUsernameChange,
  onSaveUserPreferences,
  addNotificationAndLog,
  onClearLocalStorage,
  featureStatus,
  // Theme Customization Props
  customColorOverrides,
  currentThemeBaseProperties,
  onApplyCustomColorOverride,
  onSaveCustomThemeOverrides,
  onResetCustomThemeOverrides,
  onResetSingleColorOverride,
}) => {
  const SoundIcon = isSoundMuted ? (ICONS.VolumeXIcon || VolumeX) : (ICONS.Volume2Icon || Volume2);
  const ThemeIcon = ICONS.theme_command || Palette;
  const EditorFontIcon = ICONS.font_command || FontIcon;
  const EditorFontSizeIcon = ListTree; 
  const TerminalFontSizeIcon = Terminal;
  const DeveloperModeIcon = ICONS.Code2 || DevIcon;
  const UserProfileIcon = UserCircle2;
  const SaveIcon = Save;
  const ClearSettingsIcon = ICONS.reset_settings_icon || ResetIcon;
  const CustomizeThemeIcon = Wand2;

  const [localNickname, setLocalNickname] = useState(userGuestBookNickname || '');
  const [localGitHubUsername, setLocalGitHubUsername] = useState(userGitHubUsername || '');

  useEffect(() => {
    setLocalNickname(userGuestBookNickname || (currentUser?.displayName || ''));
  }, [userGuestBookNickname, currentUser]);

  useEffect(() => {
    setLocalGitHubUsername(userGitHubUsername || '');
  }, [userGitHubUsername]);

  const handleSaveIdentitySettings = () => {
    onUserGuestBookNicknameChange(localNickname.trim());
    onUserGitHubUsernameChange(localGitHubUsername.trim());
    onSaveUserPreferences();
  };

  if (featureStatus !== 'active') {
    return <MaintenanceView featureName={ALL_FEATURE_IDS.settingsEditor} featureIcon={ICONS.settings_icon} />;
  }

  const groupedCustomizableVars = CUSTOMIZABLE_CSS_VARIABLES.reduce((acc, item) => {
    (acc[item.group] = acc[item.group] || []).push(item);
    return acc;
  }, {} as Record<string, CustomizableCSSVariable[]>);

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-[var(--editor-background)] text-[var(--editor-foreground)]">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[var(--editor-tab-active-foreground)]">Settings</h1>
      </header>

      {currentUser && (
        <section className="mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-medium text-[var(--text-accent)] border-b border-[var(--border-color)] pb-2 mb-4">
            Guest Book Identity
          </h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="guestbook-nickname" className="block text-sm font-medium text-[var(--editor-foreground)] mb-1">
                Guest Book Nickname
              </label>
              <input
                type="text"
                id="guestbook-nickname"
                value={localNickname}
                onChange={(e) => setLocalNickname(e.target.value)}
                placeholder={currentUser.displayName || "Your display name"}
                className="w-full px-3 py-1.5 text-sm bg-[var(--sidebar-background)] text-[var(--editor-foreground)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--focus-border)] focus:ring-1 focus:ring-[var(--focus-border)]"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">This name will be displayed on your guest book posts.</p>
            </div>
            <div>
              <label htmlFor="guestbook-github-username" className="block text-sm font-medium text-[var(--editor-foreground)] mb-1">
                Preferred GitHub Username <span className="text-xs text-[var(--text-muted)]">(Optional)</span>
              </label>
              <input
                type="text"
                id="guestbook-github-username"
                value={localGitHubUsername}
                onChange={(e) => setLocalGitHubUsername(e.target.value)}
                placeholder="e.g., your_github_handle"
                className="w-full px-3 py-1.5 text-sm bg-[var(--sidebar-background)] text-[var(--editor-foreground)] border border-[var(--border-color)] rounded-md focus:outline-none focus:border-[var(--focus-border)] focus:ring-1 focus:ring-[var(--focus-border)]"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">If provided, this will be used for GitHub profile links on your posts.</p>
            </div>
            <button
              onClick={handleSaveIdentitySettings}
              className="flex items-center px-4 py-2 bg-[var(--modal-button-background)] text-[var(--modal-button-foreground)] rounded-md text-sm font-medium hover:bg-[var(--modal-button-hover-background)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)] transition-colors"
            >
              <SaveIcon size={16} className="mr-2" />
              Save Guest Book Identity
            </button>
          </div>
        </section>
      )}

      <section className="mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-medium text-[var(--text-accent)] border-b border-[var(--border-color)] pb-2 mb-0">
          General
        </h2>
        <div className="space-y-0">
          <ToggleSwitch
            checked={!isSoundMuted}
            onChange={handleToggleSoundMute}
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
        <div className="flex items-center border-b border-[var(--border-color)] pb-2 mb-4">
            {CustomizeThemeIcon && <CustomizeThemeIcon size={20} className="mr-2 text-[var(--text-accent)]" />}
            <h2 className="text-lg md:text-xl font-medium text-[var(--text-accent)]">
                Customize Theme Colors ({currentThemeName})
            </h2>
        </div>
        
        {Object.entries(groupedCustomizableVars).map(([groupName, vars]) => (
          <div key={groupName} className="mb-4">
            <h3 className="text-md font-semibold text-[var(--editor-foreground)] mb-2">{groupName}</h3>
            <div className="space-y-1 grid grid-cols-1 md:grid-cols-2 gap-x-4">
              {vars.map(({ variable, label }) => {
                const currentValue: string = customColorOverrides[variable] || currentThemeBaseProperties[variable] || '#000000';
                return (
                  <div key={variable} className="flex items-center justify-between py-1.5 border-b border-[var(--border-color)] border-opacity-50 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0">
                    <label htmlFor={`color-${variable}`} className="text-xs text-[var(--text-muted)] mr-2 truncate" title={variable}>
                      {label}
                    </label>
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="color"
                        id={`color-${variable}`}
                        value={currentValue}
                        onChange={(e) => onApplyCustomColorOverride(variable, e.target.value)}
                        className="w-6 h-6 p-0 border-none rounded cursor-pointer bg-transparent"
                        title={`Current: ${currentValue}. Click to change.`}
                      />
                       <span className="text-xs font-mono text-[var(--text-muted)] w-14 text-center">{currentValue.toUpperCase()}</span>
                       <button 
                          onClick={() => onResetSingleColorOverride(variable)}
                          className="p-0.5 text-[var(--text-muted)] hover:text-[var(--link-foreground)]"
                          title={`Reset ${label} to theme default`}
                          aria-label={`Reset ${label}`}
                        >
                          <ResetIcon size={12} />
                        </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <button
                onClick={onSaveCustomThemeOverrides}
                className="flex items-center justify-center px-3 py-1.5 text-xs bg-[var(--modal-button-background)] text-[var(--modal-button-foreground)] rounded-md hover:bg-[var(--modal-button-hover-background)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)] transition-colors"
            >
                <SaveIcon size={14} className="mr-1.5" /> Save Customizations for {currentThemeName}
            </button>
            <button
                onClick={onResetCustomThemeOverrides}
                className="flex items-center justify-center px-3 py-1.5 text-xs bg-[var(--sidebar-item-hover-background)] hover:bg-[var(--activitybar-hover-background)] text-[var(--modal-foreground)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)] transition-colors"
            >
                <ResetIcon size={14} className="mr-1.5" /> Reset All Customizations for {currentThemeName}
            </button>
        </div>
      </section>

      <section className="mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-medium text-[var(--text-accent)] border-b border-[var(--border-color)] pb-2 mb-0">
          Developer
        </h2>
        <div className="space-y-0">
            <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)]">
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
      
      <section className="mb-6 md:mb-8">
        <h2 className="text-lg md:text-xl font-medium text-[var(--text-accent)] border-b border-[var(--border-color)] pb-2 mb-0">
          Data Management
        </h2>
        <div className="space-y-0">
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                    {ClearSettingsIcon && <ClearSettingsIcon size={18} className="mr-3 text-[var(--text-accent)] flex-shrink-0" />}
                    <div>
                        <label className="block text-sm font-medium text-[var(--editor-foreground)]">Clear Cached Settings</label>
                        <p className="text-xs text-[var(--text-muted)]">
                            Resets all application settings (theme, fonts, panel states, etc.) to their defaults.
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClearLocalStorage}
                    className="px-3 py-1.5 text-xs bg-[var(--modal-button-background)] text-[var(--modal-button-foreground)] hover:bg-[var(--modal-button-hover-background)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--focus-border)]"
                >
                    Clear All Cached Settings
                </button>
            </div>
        </div>
      </section>

    </div>
  );
};

export default SettingsEditor;
