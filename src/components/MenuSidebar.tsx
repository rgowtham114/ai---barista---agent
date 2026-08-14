import React, { useState } from 'react';
import { MenuItem } from '../types';
import { MenuItemCard } from './MenuItemCard';
import { Search, Coffee, Sparkles, AlertCircle } from 'lucide-react';

interface MenuSidebarProps {
  items: MenuItem[];
  onSelectPrompt: (prompt: string) => void;
  isLoadingMenu: boolean;
}

export const MenuSidebar: React.FC<MenuSidebarProps> = ({ items, onSelectPrompt, isLoadingMenu }) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const tags = ['all', 'hot', 'cold', 'strong', 'sweet', 'dairy-free', 'bakery', 'vegan'];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesTag =
      selectedTag === 'all' || item.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <aside className="w-full lg:w-96 bg-[#F8F4EE] border-r border-[#EBE3D5] flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#EBE3D5] bg-[#F5EFE6]/80">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#8B5E3C] flex items-center justify-center text-white shadow-xs">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-[#3D2C1E]">
              Coffee Shop Menu
            </h2>
            <p className="text-xs text-[#7A6B60]">Freshly brewed drinks & pastries</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A09083]" />
          <input
            type="text"
            placeholder="Search drinks or ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E3D9CC] rounded-lg text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]/40"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full capitalize shrink-0 transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#8B5E3C] text-white shadow-xs'
                  : 'bg-white text-[#6B5E55] border border-[#E3D9CC] hover:bg-[#F0E8DD]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoadingMenu ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/60 h-28 rounded-xl animate-pulse border border-[#EBE3D5]" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <MenuItemCard key={item.name} item={item} onSelectPrompt={onSelectPrompt} />
          ))
        ) : (
          <div className="text-center py-8 text-[#8C7A6B]">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No menu items match your search or filter.</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#EBE3D5] bg-[#F5EFE6] text-center text-[11px] text-[#7A6B60] flex items-center justify-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-[#8B5E3C]" />
        <span>Ask Barista in chat for personalized suggestions!</span>
      </div>
    </aside>
  );
};
