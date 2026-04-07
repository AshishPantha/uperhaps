import React from 'react';
import { getDescriptionHtml } from '@/lib/richtext'

interface StyledProductDescriptionProps {
  descriptionHtml?: unknown;
  descriptionRichText?: unknown;
}

const StyledProductDescription: React.FC<StyledProductDescriptionProps> = ({
  descriptionHtml,
  descriptionRichText,
}) => {
  const html = getDescriptionHtml(descriptionHtml, descriptionRichText)

  return (
    <div className="relative p-6 rounded-lg overflow-hidden">
      {/* Background fading effect */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'radial-gradient(circle, rgba(245, 245, 245, 0.8) 50%, rgba(255, 255, 255, 0) 100%)',
          boxShadow: 'inset 0 0 30px rgba(255, 255, 255, 0.6)',  // subtle inner shadow for uniform fading
        }}
        aria-hidden="true"
      ></div>
      {/* Content */}
      <div 
        className="relative prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default StyledProductDescription;
