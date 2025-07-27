"use client"; // This directive marks the component as a Client Component

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// --- Constants ---
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://beackkayq.onrender.com';
  const ARTICLES_ENDPOINT = `/api/proxy`; // Use local proxy instead of direct API call
const POLLING_INTERVAL = 15000; // 15 seconds
const VISITED_ARTICLES_KEY = 'visitedNewsArticles';

// Define the type for a single article to ensure type safety
interface NewsArticle {
  id: number;
  title: string;
  link: string;
  source_url: string;
  scraped_time: string;
  created_at: string;
  matched_keywords: string[];
}

interface PaginatedResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: NewsArticle[];
}

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<number>>(new Set());
  // useRef to store the timestamp of the latest article to avoid re-renders
  const latestArticleTimestamp = useRef<string | null>(null);
  const [copySuccessId, setCopySuccessId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // --- Fetching Logic ---
  const fetchArticles = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${ARTICLES_ENDPOINT}?page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch data.');
      const data: PaginatedResponse = await res.json();
      
      setArticles(data.results);
      setTotalPages(Math.ceil(data.count / 20)); // Assuming page size is 20
      setCurrentPage(page);

      // Update the timestamp ref only if we are on the first page
      if (page === 1 && data.results.length > 0) {
        latestArticleTimestamp.current = data.results[0].created_at;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load visited articles from localStorage
    const storedVisited = localStorage.getItem(VISITED_ARTICLES_KEY);
    if (storedVisited) {
      setVisited(new Set(JSON.parse(storedVisited)));
    }
    // Fetch initial articles for the first page
    fetchArticles(1);
  }, []); // Runs only on initial mount

  // --- Polling Logic ---
  useEffect(() => {
    const fetchNewArticles = async () => {
      // Polling only makes sense if we have a timestamp and are on the first page
      if (!latestArticleTimestamp.current || currentPage !== 1) return;

      try {
        const res = await fetch(`${ARTICLES_ENDPOINT}?since=${latestArticleTimestamp.current}`);
        if (!res.ok) throw new Error('Polling request failed.');
        const newArticles: NewsArticle[] = await res.json();
        
        if (newArticles.length > 0) {
          latestArticleTimestamp.current = newArticles[0].created_at;
          setArticles(prevArticles => [...newArticles, ...prevArticles]);
          // Optionally refetch the whole page to update total count, or just prepend
        }
        if (error) setError(null);
      } catch (err) {
        console.error("Failed to fetch new articles:", err);
      }
    };

    const intervalId = setInterval(fetchNewArticles, POLLING_INTERVAL);
    return () => clearInterval(intervalId); // Cleanup
  }, [currentPage, error]); // Rerun polling setup if currentPage changes

  const handleLinkClick = (articleId: number) => {
    const newVisited = new Set(visited);
    newVisited.add(articleId);
    setVisited(newVisited);
    localStorage.setItem(VISITED_ARTICLES_KEY, JSON.stringify(Array.from(newVisited)));
  };

  const handleCopy = (e: React.MouseEvent, link: string, articleId: number) => {
    e.preventDefault(); // Stop the event from bubbling up to the Link click
    e.stopPropagation(); // Stop the browser from navigating
    
    navigator.clipboard.writeText(link).then(() => {
        setCopySuccessId(articleId);
        setTimeout(() => setCopySuccessId(null), 2000); // Reset after 2 seconds
    }, (err) => {
        console.error('Failed to copy link: ', err);
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading articles...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-700 bg-red-50 p-4 sm:p-6 md:p-8 rounded-lg border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/50 mx-4 sm:mx-0">
          <h2 className="text-lg sm:text-xl font-semibold">Could not fetch news</h2>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      );
    }
    
    if (articles.length > 0) {
      return (
        <ul className="space-y-4 sm:space-y-6">
          {articles.map((article) => {
            const isVisited = visited.has(article.id);
            return (
              <li key={article.id} className={`${isVisited ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-white dark:bg-gray-800/50'} border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg dark:hover:shadow-indigo-900/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1 mx-4 sm:mx-0`}>
                <div className="p-4 sm:p-5 md:p-6">
                  <Link 
                    href={`/articles/${article.id}`}
                    onClick={() => handleLinkClick(article.id)}
                    className={`group block`}
                  >
                    <h2 className={`text-base sm:text-lg md:text-xl font-bold transition-colors leading-tight ${isVisited ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                      {article.title}
                    </h2>
                  </Link>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-x-3">
                    <span>Published: {new Date(article.created_at).toLocaleString()}</span>
                    {article.source_url && (
                        <>
                            <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
                            <span>Source: <span className="font-medium text-gray-700 dark:text-gray-300 break-all">{article.source_url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')}</span></span>
                        </>
                    )}
                  </div>

                  {article.matched_keywords && article.matched_keywords.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1 sm:gap-2">
                        {article.matched_keywords.map(kw => (
                            <span key={kw} className="px-2 py-0.5 text-xs font-medium text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900 dark:text-purple-200">
                                {kw}
                            </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* --- Action Buttons --- */}
                <div className={`${isVisited ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-gray-50 dark:bg-gray-800'} px-4 sm:px-5 md:px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4`}>
                    <a 
                        href={article.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors w-full sm:w-auto text-center sm:text-left"
                    >
                        Read Original
                    </a>
                    <button 
                        onClick={(e) => handleCopy(e, article.link, article.id)}
                        className={`text-sm font-medium px-3 py-2 rounded-md transition-all w-full sm:w-auto ${copySuccessId === article.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                    >
                        {copySuccessId === article.id ? 'Copied!' : 'Copy Link'}
                    </button>
                </div>
              </li>
            );
          })}
        </ul>
      );
    }

    return (
      <div className="text-center text-gray-500 bg-white p-6 sm:p-8 rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 mx-4 sm:mx-0">
        <h2 className="text-lg sm:text-xl font-semibold">No News Available</h2>
        <p className="mt-2 text-sm">Waiting for the script to find relevant articles...</p>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8 text-center tracking-tight">
        Latest News
      </h1>
      
      <div>
        {renderContent()}
      </div>

      {/* --- Pagination Controls --- */}
      {totalPages > 1 && (
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 px-4 sm:px-0">
            <button 
                onClick={() => fetchArticles(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:bg-gray-800 transition-colors"
            >
                Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 order-first sm:order-none">
                Page {currentPage} of {totalPages}
            </span>
            <button 
                onClick={() => fetchArticles(currentPage + 1)}
                disabled={currentPage >= totalPages || isLoading}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:bg-gray-800 transition-colors"
            >
                Next
            </button>
        </div>
      )}
    </div>
  );
}
