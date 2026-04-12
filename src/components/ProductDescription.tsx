import React from 'react';
import '@/components/richtext-component.css';  // Import the CSS file here
import { getDescriptionHtml } from '@/lib/richtext'

interface ProductDescriptionProps {
  descriptionHtml?: unknown;
  descriptionRichText?: unknown;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  descriptionHtml,
  descriptionRichText,
}) => {
  const html = getDescriptionHtml(descriptionHtml, descriptionRichText)

  return (
    <div className="max-w-2xl mx-auto">
      <div 
        dangerouslySetInnerHTML={{ __html: html }} 
        className="rich-text-content prose prose-headings:mb-3 prose-p:mb-2"
      />
    </div>
  );
};

export default ProductDescription;
