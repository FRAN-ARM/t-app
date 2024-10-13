import React from 'react';
import { Image, Square, Shield, Bookmark } from 'lucide-react';

const ElementAdder: React.FC = () => {
  return (
    <div className="h-full p-4">
      <h2 className="font-semibold mb-4">Add Elements</h2>
      <div className="grid grid-cols-2 gap-2">
        <button className="flex items-center justify-center p-2 bg-gray-100 rounded hover:bg-gray-200">
          <Image size={20} className="mr-2" />
          Sprite
        </button>
        <button className="flex items-center justify-center p-2 bg-gray-100 rounded hover:bg-gray-200">
          <Square size={20} className="mr-2" />
          Hitbox
        </button>
        <button className="flex items-center justify-center p-2 bg-gray-100 rounded hover:bg-gray-200">
          <Shield size={20} className="mr-2" />
          Hurtbox
        </button>
        <button className="flex items-center justify-center p-2 bg-gray-100 rounded hover:bg-gray-200">
          <Bookmark size={20} className="mr-2" />
          Placeholder
        </button>
      </div>
    </div>
  );
};

export default ElementAdder;