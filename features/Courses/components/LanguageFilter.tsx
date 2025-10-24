import React from 'react';
import { useLocale } from '@/lib/LocaleContext';

interface LanguageFilterProps {
  selected: 'en' | 'id' | 'all';
  onChange: (language: 'en' | 'id' | 'all') => void;
}

const LanguageFilter: React.FC<LanguageFilterProps> = ({ selected, onChange }) => {
  const { t } = useLocale();

  const filters = [
    { id: 'all', label: t('language.all'), emoji: '🌍' },
    { id: 'id', label: t('language.indonesian'), emoji: '🇮🇩' },
    { id: 'en', label: t('language.english'), emoji: '🇺🇸' },
  ] as const;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
            selected === filter.id
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
          }`}
        >
          <span className="text-lg">{filter.emoji}</span>
          <span>{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageFilter;
