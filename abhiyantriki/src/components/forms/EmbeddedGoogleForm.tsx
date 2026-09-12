import React from 'react';

interface EmbeddedGoogleFormProps {
  formUrl: string;
}

export const EmbeddedGoogleForm: React.FC<EmbeddedGoogleFormProps> = ({ formUrl }) => {
  // Append ?embedded=true per spec 09 to avoid Google frame-busting
  const safeUrl = formUrl.includes('?') ? `${formUrl}&embedded=true` : `${formUrl}?embedded=true`;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-ocean-700 bg-space-900/60 backdrop-blur">
      <iframe
        src={safeUrl}
        title="Event Registration Form"
        width="100%"
        height="800"
        loading="lazy"
        style={{ border: 0 }}
      >
        Loading Google Registration Form…
      </iframe>
    </div>
  );
};
