import React, { useState } from 'react';
import type { LinksModuleProps } from '../../types';

export const LinksModule: React.FC<LinksModuleProps> = ({
  links,
  onAdd,
  onRemoveLink,
  onUpdate,
  onClose,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const handleAdd = () => {
    if (newLinkTitle && newLinkUrl) {
      onAdd(newLinkTitle, newLinkUrl);
      setNewLinkTitle('');
      setNewLinkUrl('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <div
          key={link.id}
          className="bg-black/20 backdrop-blur-sm rounded-2xl px-5 py-4 
            border border-white/20 hover:bg-black/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🔗</span>
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={link.title}
                onChange={(e) => onUpdate(link.id, e.target.value, link.url)}
                placeholder="Link title"
                className="w-full bg-transparent outline-none text-white placeholder-white/60"
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => onUpdate(link.id, link.title, e.target.value)}
                placeholder="https://..."
                className="w-full bg-transparent outline-none text-white/70 placeholder-white/50 text-sm"
              />
            </div>
            <button
              onClick={() => onRemoveLink(link.id)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}

      {isAdding ? (
        <div
          className="bg-black/20 backdrop-blur-sm rounded-2xl px-5 py-4 
          border border-white/20 space-y-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🔗</span>
            <input
              type="text"
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              placeholder="Link title"
              className="flex-1 bg-transparent outline-none text-white placeholder-white/60"
            />
          </div>
          <input
            type="url"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-transparent outline-none text-white placeholder-white/60 pl-11"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-lg bg-white/30 hover:bg-white/40 text-white transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-4 px-5 rounded-2xl bg-black/20 backdrop-blur-sm 
            border border-white/20 hover:bg-black/30 transition-colors
            text-white/80 flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>Add another link</span>
        </button>
      )}

      {/* Close/Remove Module Button (if needed, or just let users toggle via Quick Links) */}
      <div className="flex justify-end pt-2">
        <button
          onClick={onClose}
          className="text-white/40 hover:text-white/60 text-sm flex items-center gap-1 transition-colors"
        >
          <span>Close Links</span>
        </button>
      </div>
    </div>
  );
};
