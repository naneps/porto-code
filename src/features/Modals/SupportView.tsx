import React from 'react';
import { Heart, Coffee, CreditCard, ExternalLink, Wallet } from 'lucide-react';

interface SupportViewProps {
  onClose?: () => void;
}

const SupportView: React.FC<SupportViewProps> = () => {
  const supportOptions = [
    {
      id: 'buymeacoffee',
      title: 'Buy Me a Coffee',
      description: 'A quick and easy way to show appreciation with a virtual coffee.',
      icon: Coffee,
      url: 'https://buymeacoffee.com/ekaprasety8',
      shortUrl: 'coff.ee/ekaprasety8',
      color: '#FFDD00',
    },
    {
      id: 'kofi',
      title: 'Ko-fi',
      description: 'Support ongoing development with a one-time or monthly contribution.',
      icon: Heart,
      url: 'https://ko-fi.com/nannnn',
      color: '#29ABE0',
    },
    {
      id: 'saweria',
      title: 'Saweria',
      description: 'Popular Indonesian donation platform. Fast and convenient local support.',
      icon: Wallet,
      url: 'https://saweria.co/nannndev',
      shortUrl: 'saweria.co/nannndev',
      color: '#FF6B35',
    },
    {
      id: 'paypal',
      title: 'PayPal',
      description: 'Direct donation via PayPal for those who prefer this method.',
      icon: CreditCard,
      url: 'https://paypal.me/n4n10',
      color: '#003087',
    },
  ];

  return (
    <div className="h-full overflow-auto bg-[var(--editor-background)] text-[var(--editor-foreground)] p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--focus-border)]/10 mb-4">
            <Heart className="w-8 h-8 text-[var(--focus-border)]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Support the Creator</h1>
          <p className="text-[var(--text-muted)] max-w-md mx-auto">
            Porto Code is a passion project. Your support helps me build more tools, write better code, and keep this portfolio (and other open source work) alive.
          </p>
        </div>

        {/* Support Options */}
        <div className="space-y-4 mb-10">
          {supportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <a
                key={option.id}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-5 p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--sidebar-background)] hover:border-[var(--focus-border)]/50 hover:bg-[var(--editor-tab-inactive-background)] transition-all duration-200"
              >
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${option.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: option.color }} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg group-hover:text-[var(--focus-border)] transition-colors">{option.title}</h3>
                    <ExternalLink size={15} className="text-[var(--text-muted)] group-hover:text-[var(--focus-border)] transition-colors" />
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">
                    {option.description}
                  </p>
                  {option.shortUrl && (
                    <div className="text-xs font-mono text-[var(--text-accent)] mt-2">
                      {option.shortUrl}
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>

        {/* Thank You Message */}
        <div className="text-center border-t border-[var(--border-color)]/60 pt-8">
          <p className="text-sm text-[var(--text-muted)]">
            Every contribution, no matter the size, means a lot. Thank you for being part of this journey.
          </p>
          <div className="mt-4 text-xs font-mono text-[var(--text-muted)]/70">
            — Nandang Eka Prasetya
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportView;