import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center flex-wrap gap-1 text-xs text-gray-500 mb-8">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight className="w-3 h-3 text-gray-700 flex-shrink-0" />}
          {item.href && i < items.length - 1 ? (
            <Link
              to={item.href}
              className="hover:text-[#D4AF37] transition-colors duration-200 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ) : (
            <span className={i === items.length - 1 ? 'text-[#D4AF37]' : ''}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
