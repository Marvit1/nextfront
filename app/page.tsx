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
    console.log('handleLinkClick called with articleId:', articleId);
    console.log('Current visited set:', Array.from(visited));
    const newVisited = new Set(visited);
    newVisited.add(articleId);
    console.log('New visited set:', Array.from(newVisited));
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
        <div className="flex items-center justify-center py-16 sm:py-24">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin" style={{animationDuration: '1.5s'}}></div>
            </div>
            <p className="text-gray-500 dark:text-gray-400 animate-pulse text-lg">Loading latest articles...</p>
            <div className="mt-4 flex justify-center gap-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center mx-4 sm:mx-0">
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 sm:p-8 md:p-12 rounded-2xl border border-red-200 dark:border-red-800/50 shadow-lg">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-red-800 dark:text-red-200 mb-3">Could not fetch news</h2>
            <p className="text-red-600 dark:text-red-300 text-lg">{error}</p>
            <button 
              onClick={() => fetchArticles(1)}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    
    if (articles.length > 0) {
      return (
                            <div className="grid gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto">
          {articles.map((article) => {
            const isVisited = visited.has(article.id);
            console.log(`Article ${article.id} isVisited:`, isVisited, 'visited set:', Array.from(visited));
            return (
              <article key={article.id} className={`group relative overflow-hidden ${isVisited ? '!bg-gray-400 dark:!bg-gray-700 !border-gray-600 dark:!border-gray-500' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'} border rounded-2xl shadow-lg hover:shadow-2xl dark:hover:shadow-indigo-900/20 transition-all duration-500 ease-out transform hover:-translate-y-2`}>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-4 sm:p-6 md:p-8">
                  {/* Status indicator */}
                  <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${isVisited ? 'bg-gray-600' : 'bg-blue-500'} animate-pulse`}></div>
                                                <span className={`text-xs font-medium uppercase tracking-wide ${isVisited ? 'text-gray-700 dark:text-gray-300' : 'text-blue-600 dark:text-blue-400'}`}>
                                  {isVisited ? 'Read' : 'New'}
                                </span>
              </div>
                                                    <div className={`text-xs ${isVisited ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
                      {new Date(article.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  <Link 
                    href={`/articles/${article.id}`}
                    onClick={() => handleLinkClick(article.id)}
                    className="block"
                  >
                    <h2 className={`text-lg sm:text-xl md:text-2xl font-bold transition-all duration-300 leading-tight mb-4 group-hover:scale-[1.02] cursor-pointer ${isVisited ? 'text-gray-700 dark:text-gray-300' : 'text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                      {article.title}
                    </h2>
                  </Link>

                  {article.source_url && (
                    <div className={`flex items-center gap-2 mb-4 text-sm ${isVisited ? 'text-gray-600 dark:text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      <span className="font-medium truncate">{article.source_url.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')}</span>
                    </div>
                  )}

                  {article.matched_keywords && article.matched_keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {article.matched_keywords.map(kw => (
                            <span key={kw} className={`px-3 py-1 text-xs font-semibold rounded-full border ${isVisited ? 'text-gray-700 bg-gray-100 dark:bg-gray-800/50 dark:text-gray-200 border-gray-300 dark:border-gray-700' : 'text-purple-700 bg-purple-100 dark:bg-purple-900/50 dark:text-purple-200 border-purple-200 dark:border-purple-800'}`}>
                                #{kw}
                            </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className={`relative ${isVisited ? '!bg-gray-500 dark:!bg-gray-700 !border-gray-600 dark:!border-gray-500' : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700'} px-4 sm:px-6 md:px-8 py-4 border-t`}>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <a 
                        href={article.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLinkClick(article.id);
                        }}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="whitespace-nowrap text-blue-600 font-semibold">Read Original</span>
                    </a>
                    <button 
                        onClick={(e) => handleCopy(e, article.link, article.id)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base ${
                          copySuccessId === article.id 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                        }`}
                    >
                        {copySuccessId === article.id ? (
                          <>
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="whitespace-nowrap">Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="whitespace-nowrap">Copy Link</span>
                          </>
                        )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      );
    }

    return (
      <div className="text-center mx-2 sm:mx-0">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-8 sm:p-12 md:p-16 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">No News Available</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">Waiting for the script to find relevant articles...</p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>
    );
  };

                return (
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          Live Updates
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-purple-200 mb-4 tracking-tight">
          Latest News
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Stay informed with real-time news updates and intelligent keyword filtering
        </p>
      </div>
      
      <div>
        {renderContent()}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 sm:mt-16">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0">
              <button 
                  onClick={() => fetchArticles(currentPage - 1)}
                  disabled={currentPage <= 1 || isLoading}
                  className="group flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                  <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
              </button>
              
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchArticles(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                          pageNum === currentPage
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <button 
                  onClick={() => fetchArticles(currentPage + 1)}
                  disabled={currentPage >= totalPages || isLoading}
                  className="group flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                  Next
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
