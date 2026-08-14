import React from 'react';
import { MenuItem } from '../types';
import { AlertTriangle, Coffee, MessageSquarePlus } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onSelectPrompt?: (prompt: string) => void;
  compact?: boolean;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelectPrompt, compact = false }) => {
  return (
    <div
      id={`menu-item-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
      className={`bg-white rounded-xl border border-[#EBE3D5] p-3.5 transition-all duration-200 hover:border-[#8B5E3C]/40 hover:shadow-xs flex flex-col justify-between ${
        compact ? 'text-xs' : ''
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-[#3D2C1E] text-sm leading-snug flex items-center gap-1.5">
            <Coffee className="w-3.5 h-3.5 text-[#8B5E3C] shrink-0" />
            {item.name}
          </h3>
          <span className="font-bold text-[#6F4E37] bg-[#F5EFE6] px-2 py-0.5 rounded-full text-xs shrink-0">
            ${item.price.toFixed(2)}
          </span>
        </div>

        <p className="text-xs text-[#6B5E55] leading-relaxed mb-2.5">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                  tag === 'dairy-free' || tag === 'vegan'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : tag === 'strong'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : tag === 'cold'
                    ? 'bg-sky-50 text-sky-700 border border-sky-200'
                    : tag === 'sweet'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-[#F5EFE6] text-[#6B5E55]'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Allergens */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-amber-800 font-medium bg-amber-50/70 p-1.5 rounded-md mb-2 border border-amber-200/50">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>Contains: {item.allergens.join(', ')}</span>
          </div>
        )}
      </div>

      {onSelectPrompt && (
        <button
          onClick={() => onSelectPrompt(`Tell me more about ${item.name}`)}
          className="w-full mt-1.5 text-xs font-medium text-[#8B5E3C] bg-[#FBF8F3] hover:bg-[#8B5E3C] hover:text-white border border-[#E5D7C5] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          Ask Barista
        </button>
      )}
    </div>
  );
};
