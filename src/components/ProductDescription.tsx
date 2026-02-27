import React from 'react';
import '@/components/richtext-component.css';  // Import the CSS file here

interface ProductDescriptionProps {
  descriptionHtml: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ descriptionHtml }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div 
        dangerouslySetInnerHTML={{ __html: descriptionHtml }} 
        className="rich-text-content prose prose-headings:mb-3 prose-p:mb-2"
      />
    </div>
  );
};

export default ProductDescription;