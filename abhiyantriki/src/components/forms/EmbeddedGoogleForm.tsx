import React, { useMemo } from 'react';
import { ExternalLink, HelpCircle } from 'lucide-react';

interface EmbeddedGoogleFormProps {
  formUrl: string;
}

export const EmbeddedGoogleForm: React.FC<EmbeddedGoogleFormProps> = ({ formUrl }) => {
  // Convert shortlinks to full embeddable viewform URLs with ?embedded=true
  const { embedUrl, directUrl } = useMemo(() => {
    const clean = (formUrl || '').trim();
    let direct = clean || 'https://forms.gle/y81No241PDAsHmBCA';
    let embed = clean;

    // Known mapping for festival registration form
    if (clean.includes('forms.gle/y81No241PDAsHmBCA')) {
      embed = 'https://docs.google.com/forms/d/e/1FAIpQLSedXlK3LEjnhzmK-MYlxT1kH8sscxsm9aZMcHIiBMzygT5raQ/viewform?embedded=true';
      direct = 'https://forms.gle/y81No241PDAsHmBCA';
    } else if (clean.includes('docs.google.com/forms')) {
      if (!clean.includes('embedded=true')) {
        embed = clean.includes('?') ? `${clean}&embedded=true` : `${clean}?embedded=true`;
      }
    }

    return { embedUrl: embed, directUrl: direct };
  }, [formUrl]);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-neutral-900/90 border border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2 text-zinc-400">
          <HelpCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <span>Trouble loading form in your browser?</span>
        </div>
        <a
          href={directUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-white hover:text-cyan-300 transition-colors font-medium underline underline-offset-4 decoration-white/30 shrink-0"
        >
          <span>Open in New Tab</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="w-full rounded-xl overflow-hidden border border-white/15 bg-neutral-950/80 backdrop-blur min-h-[600px] relative">
        <iframe
          src={embedUrl}
          title="Event Registration Form"
          width="100%"
          height="800"
          loading="lazy"
          className="w-full h-[750px] border-0"
        >
          Loading Google Registration Form…
        </iframe>
      </div>
    </div>
  );
};
