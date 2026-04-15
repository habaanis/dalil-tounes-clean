import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Share2 } from 'lucide-react';
import { blogArticles } from './blogData';
import { SEOHead } from '../../components/SEOHead';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const article = blogArticles.find(a => a.slug === slug);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`${article.title} — Blog Dalil Tounes`}
        description={article.excerpt}
        image={article.coverImage}
      />

      <div className="pt-16 pb-10 px-4 border-b border-gray-100">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-6">
            {article.category}
          </span>
          <h1
            className="text-3xl md:text-4xl font-light text-gray-900 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {article.title}
          </h1>
          {article.subtitle && (
            <p className="mt-4 text-gray-500 text-lg font-light">{article.subtitle}</p>
          )}
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-8" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between py-6 border-b border-gray-100">
          <div className="flex items-center gap-5 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <User className="w-3 h-3" />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {article.readTime} de lecture
            </span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            Partager
          </button>
        </div>

        <div
          className="py-12 prose-blog"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{ fontFamily: 'inherit' }}
        />

        <div className="py-10 border-t border-gray-100">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour au blog
          </Link>
        </div>
      </div>
    </div>
  );
}
