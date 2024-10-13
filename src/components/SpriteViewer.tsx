import React from 'react';
import { Grid, List } from 'lucide-react';

interface SpriteViewerProps {
  selectedSprite: string | null;
  setSelectedSprite: (sprite: string) => void;
}

const SpriteViewer: React.FC<SpriteViewerProps> = ({ selectedSprite, setSelectedSprite }) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const sprites = ['Sprite 1', 'Sprite 2', 'Sprite 3', 'Sprite 4', 'Sprite 5'];

  return (
    <div className="h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Sprites</h2>
        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          className="text-gray-600 hover:text-gray-800"
        >
          {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
        </button>
      </div>
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
        {sprites.map((sprite) => (
          <div
            key={sprite}
            className={`p-2 cursor-pointer rounded ${
              selectedSprite === sprite ? 'bg-orange-200' : 'hover:bg-gray-100'
            } ${viewMode === 'list' ? 'flex items-center' : ''}`}
            onClick={() => setSelectedSprite(sprite)}
          >
            <div className="w-10 h-10 bg-gray-300 rounded mr-2"></div>
            <span>{sprite}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpriteViewer;