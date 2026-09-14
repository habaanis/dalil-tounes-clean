import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CityAutocomplete({ value, onChange }: CityAutocompleteProps) {
  const { language } = useLanguage();

  const placeholders: Record<string, string> = {
    fr: 'Votre ville',
    en: 'Your city',
    ar: 'مدينتك',
    it: 'La tua città',
    ru: 'Ваш город',
  };

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      placeholder={placeholders[language as string] || placeholders.fr}
    />
  );
}
