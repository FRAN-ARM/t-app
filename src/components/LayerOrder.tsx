import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface LayerOrderProps {
  layers: string[];
  setLayers: React.Dispatch<React.SetStateAction<string[]>>;
}

const LayerOrder: React.FC<LayerOrderProps> = ({ layers, setLayers }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const moveLayer = (index: number, direction: 'up' | 'down') => {
    const newLayers = [...layers];
    if (direction === 'up' && index > 0) {
      [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
    } else if (direction === 'down' && index < layers.length - 1) {
      [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
    }
    setLayers(newLayers);
  };

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const newLayers = [...layers];
    const [removed] = newLayers.splice(sourceIndex, 1);
    newLayers.splice(targetIndex, 0, removed);
    setLayers(newLayers);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="h-full p-4">
      <h2 className="font-semibold mb-4">Layer Order</h2>
      <ul className="space-y-2">
        {layers.map((layer, index) => (
          <li
            key={layer}
            className={`flex items-center justify-between p-2 bg-gray-100 rounded cursor-move relative ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={() => {
              setDraggedIndex(null);
              setDragOverIndex(null);
            }}
          >
            <span>{layer}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => moveLayer(index, 'up')}
                className="p-1 bg-white rounded shadow hover:bg-gray-50"
                disabled={index === 0}
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={() => moveLayer(index, 'down')}
                className="p-1 bg-white rounded shadow hover:bg-gray-50"
                disabled={index === layers.length - 1}
              >
                <ChevronDown size={16} />
              </button>
            </div>
            {dragOverIndex === index && draggedIndex !== index && (
              <div
                className={`absolute left-0 right-0 h-1 bg-orange-400 ${
                  dragOverIndex < draggedIndex! ? 'top-0' : 'bottom-0'
                }`}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LayerOrder;