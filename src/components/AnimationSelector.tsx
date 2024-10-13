import React, { useState } from 'react';
import { Circle, CheckCircle2, PlayCircle, Search } from 'lucide-react';
import { Animation, AnimationStatus, AnimationType } from '../App';

interface AnimationSelectorProps {
  animations: Animation[];
  selectedAnimation: string | null;
  setSelectedAnimation: (animation: string) => void;
}

const AnimationSelector: React.FC<AnimationSelectorProps> = ({ 
  animations, 
  selectedAnimation, 
  setSelectedAnimation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<AnimationType | 'all'>('all');

  const getStatusIcon = (status: AnimationStatus) => {
    switch (status) {
      case 'not-started':
        return <Circle size={16} className="text-gray-400" />;
      case 'in-progress':
        return <PlayCircle size={16} className="text-blue-500" />;
      case 'finished':
        return <CheckCircle2 size={16} className="text-green-500" />;
    }
  };

  const filteredAnimations = animations.filter(animation => 
    animation.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || animation.type === filterType)
  );

  return (
    <div className="h-full p-4">
      <h2 className="font-semibold mb-4">Animations</h2>
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <Search size={20} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search animations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as AnimationType | 'all')}
          className="w-full p-2 border rounded"
        >
          <option value="all">All Animations</option>
          <option value="default">Default Animations</option>
          <option value="extra">Extra Animations</option>
        </select>
      </div>
      <ul className="space-y-2">
        {filteredAnimations.map((animation) => (
          <li
            key={animation.name}
            className={`p-2 cursor-pointer rounded flex items-center justify-between ${
              selectedAnimation === animation.name ? 'bg-orange-200' : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedAnimation(animation.name)}
          >
            <span>{animation.name}</span>
            <div className="flex items-center">
              <span className={`mr-2 text-xs ${animation.type === 'extra' ? 'text-purple-500' : 'text-gray-500'}`}>
                {animation.type}
              </span>
              {getStatusIcon(animation.status)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnimationSelector;