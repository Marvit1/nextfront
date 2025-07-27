"use client";

import { useState } from 'react';
import Link from 'next/link';

interface NewsArticle {
  id: number;
  title: string;
  link: string;
  content: string;
  created_at: string;
}

// Helper component to highlight multiple keywords
const HighlightedText = ({ text, keywords }: { text: string, keywords: string[] }) => {
    if (!keywords || keywords.length === 0 || !text) {
      return <>{text}</>;
    }
    // Create a regex pattern to match any of the keywords
    const escapedKeywords = keywords.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const pattern = `(${escapedKeywords.join('|')})`;
    const parts = text.split(new RegExp(pattern, 'gi'));
    
    return (
      <>
        {parts.map((part, index) => {
          const isMatch = keywords.some(k => k.toLowerCase() === part.toLowerCase());
          return isMatch ? (
            <span key={index} className="bg-yellow-200 font-bold px-1 rounded-sm">
              {part}
            </span>
          ) : (
            part
          );
        })}
      </>
    );
};


export default function ArticleView({ article, keywords }: { article: NewsArticle, keywords: string[] }) {
  const [copySuccess, setCopySuccess] = useState('');

  const handleCopy = () => {
    if (article) {
        navigator.clipboard.writeText(article.link).then(() => {
            setCopySuccess('Link copied to clipboard!');
            setTimeout(() => setCopySuccess(''), 2000); // Reset message after 2 seconds
        }, (err) => {
            setCopySuccess('Failed to copy!');
            console.error('Could not copy text: ', err);
        });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to News Feed
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400">Published: {new Date(article.created_at).toLocaleString()}</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mt-2">
           <HighlightedText text={article.title} keywords={keywords} />
        </h1>
      </header>
      
      <div className="prose prose-lg prose-indigo dark:prose-invert max-w-none whitespace-pre-wrap border-t border-gray-200 dark:border-gray-700 pt-8">
        <HighlightedText text={article.content} keywords={keywords} />
      </div>

      <footer className="mt-12">
        {keywords && keywords.length > 0 && (
            <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">Matched Keywords</h3>
                <div className="flex flex-wrap gap-2">
                    {keywords.map((kw, index) => (
                        <span key={index} className="px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-200 rounded-full">
                            {kw}
                        </span>
                    ))}
                </div>
            </div>
        )}

        <div className="pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center">
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold text-base">
                Read Original Source
            </a>
            <button onClick={handleCopy} className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-semibold text-base">
                {copySuccess ? 'Copied!' : 'Copy Link'}
            </button>        
            {copySuccess && <span className="text-sm text-green-600 dark:text-green-400 transition-opacity duration-300">{copySuccess}</span>}
        </div>
      </footer>
    </div>
  );
} 