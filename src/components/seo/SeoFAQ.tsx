import React from 'react';
import StructuredData from '../StructuredData';
import { generateFAQSchema } from '../../lib/structuredDataSchemas';

export interface FAQItem {
  question: string;
  answer: string;
}

interface SeoFAQProps {
  title: string;
  questions: FAQItem[];
  includeSchema?: boolean;
}

const SeoFAQ: React.FC<SeoFAQProps> = ({ title, questions, includeSchema = true }) => {
  if (questions.length === 0) return null;

  return (
    <>
      {includeSchema && <StructuredData data={generateFAQSchema(questions)} />}
      <div className="mt-12 pt-8 border-t border-gray-800">
        <h2
          className="text-base font-semibold text-gray-300 mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {title}
        </h2>
        <div className="space-y-4">
          {questions.map((faq, i) => (
            <details key={i} className="group">
              <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors py-2 list-none flex items-start gap-2">
                <span className="text-[#D4AF37] mt-0.5 shrink-0">&#9656;</span>
                <span>{faq.question}</span>
              </summary>
              <p className="text-xs text-gray-500 leading-relaxed pl-5 pb-3">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
};

export default SeoFAQ;
