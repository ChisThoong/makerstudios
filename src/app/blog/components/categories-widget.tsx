"use client"
import React from 'react';
import { useLanguage } from '../../context/language-context';

interface CategoriesWidgetProps {
  categories: string[];
}

export default function CategoriesWidget({ categories }: CategoriesWidgetProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{t('blogPage.categories')}</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <button
            key={index}
            className="px-4 py-2 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-medium transition-colors"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}