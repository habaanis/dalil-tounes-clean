import { Link } from 'react-router-dom';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { blogArticles } from './blogData';
import { SEOHead } from '../../components/SEOHead';

export default function Blog() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Blog — Dalil Tounes"
        description="Découvrez les articles et actualités de Dalil Tounes, l'annuaire de référence des entreprises tunisiennes."
      />

      <section className="pt-20 pb-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-6">
            Dalil Tounes
          </p>
          <h1
            className="text-4xl md:text-5xl font-light text-gray-900 leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Le Blog
          </h1>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-8" />
          <p className="text-gray-500 text-lg font-light leading-relaxed max-w-xl mx-auto">
            Histoires, réflexions et actualités autour du commerce local tunisien.
          </p>
        </div>
      </section>

      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-1">
            {blogArticles.map((article, index) => (
              <Link
                key={article.id}
                to={`/blog/${article.slug}`}
                className="group block"
              >
                <article className="py-10 border-t border-gray-100 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start hover:bg-gray-50/50 transition-colors duration-300 px-2 -mx-2 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-medium">
                        {article.category}
                      </span>
                      <span className="text-gray-200">·</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime} de lecture
                      </span>
                    </div>

                    <h2
                      className="text-xl md:text-2xl font-light text-gray-900 mb-3 group-hover:text-gray-700 transition-colors leading-snug"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {article.title}
                    </h2>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 max-w-xl mb-4">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{article.author}</span>
                      <span>·</span>
                      <span>{article.date}</span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center self-center">
                    <ArrowRight className="w-5 h-5 text-[#D4AF37] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {blogArticles.length === 0 && (
            <div className="text-center py-24">
              <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-light">Aucun article pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
