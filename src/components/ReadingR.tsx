import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Book, ChevronDown, ChevronUp } from 'lucide-react';

const ReadingRecommendations = () => {
  const [expanded, setExpanded] = useState(false);

  const recommendations = [
    { title: "1984", author: "George Orwell" },
    { title: "To Kill a Mockingbird", author: "Harper Lee" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { title: "Pride and Prejudice", author: "Jane Austen" },
    { title: "The Catcher in the Rye", author: "J.D. Salinger" }
  ];

  const visibleRecommendations = expanded ? recommendations : recommendations.slice(0, 3);

  return (
    <div className="sticky top-1">
      <section className="rounded-lg bg-gray-50 bg-opacity-40 px-6 py-8 shadow-md transition-all duration-300 ease-in-out">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          My Favorites
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Some of my favorite books I have ever read, recommended for you!
        </p>
        <ul className="space-y-4 mb-6">
          {visibleRecommendations.map((book, index) => (
            <li key={index} className="flex items-center p-2 rounded-md transition-colors duration-200 hover:bg-gray-200">
              <Book className="h-5 w-5 mr-3 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">{book.title}</span>
              <span className="text-xs text-gray-500 ml-2">by {book.author}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white transition-all duration-300 ease-in-out"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              View More Recommendations
            </>
          )}
        </Button>
      </section>
    </div>
  );
};

export default ReadingRecommendations;