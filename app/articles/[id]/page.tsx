import ArticleView from '../../components/article-view';

interface NewsArticle {
  id: number;
  title: string;
  link: string;
  content: string;
  created_at: string;
  matched_keywords: string[];
}

async function getArticle(id: string): Promise<NewsArticle | { error: string }> {
    // Using cache: 'no-store' to ensure fresh data on each request,
    // as our backend script might update the data frequently.
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://beackkayq.onrender.com';
    try {
        const res = await fetch(`${API_URL}/api/articles/${id}/`, { cache: 'no-store' });
        
        if (!res.ok) {
            // Instead of throwing, return a specific error object
            return { error: 'Failed to fetch article. It may have been deleted or the server is down.' };
        }
        
        return res.json();
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown network error occurred.';
        return { error: errorMessage };
    }
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const result = await getArticle(params.id);

  // Check if the result is an error object
  if ('error' in result) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Could not load article</h1>
        <p className="text-gray-600 mt-2">{result.error}</p>
        <a href="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          &larr; Back to all news
        </a>
      </div>
    );
  }

  // If no error, render the article
  return <ArticleView article={result} keywords={result.matched_keywords} />;
} 