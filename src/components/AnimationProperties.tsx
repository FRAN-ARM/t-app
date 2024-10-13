import React from 'react';
import { AnimationStatus } from '../App';

interface Animation {
  name: string;
  status: AnimationStatus;
  loopStartFrame: number;
  endFrame: number;
}

interface AnimationPropertiesProps {
  frameTiming: number[];
  setFrameTiming: React.Dispatch<React.SetStateAction<number[]>>;
  currentFrame: number;
  selectedAnimation: string | null;
  animations: Animation[];
  updateAnimationStatus: (animationName: string, newStatus: AnimationStatus) => void;
  updateAnimationFrames: (animationName: string, loopStartFrame: number, endFrame: number) => void;
  totalFrames: number;
}

const AnimationProperties: React.FC<AnimationPropertiesProps> = ({
  frameTiming,
  setFrameTiming,
  currentFrame,
  selectedAnimation,
  animations,
  updateAnimationStatus,
  updateAnimationFrames,
  totalFrames
}) => {
  const handleFrameTimingChange = (value: number) => {
    const newFrameTiming = [...frameTiming];
    newFrameTiming[currentFrame] = value;
    setFrameTiming(newFrameTiming);
  };

  const selectedAnimationData = animations.find(anim => anim.name === selectedAnimation);

  const handleLoopStartFrameChange = (value: number) => {
    if (selectedAnimationData) {
      updateAnimationFrames(selectedAnimationData.name, value, selectedAnimationData.endFrame);
    }
  };

  const handleEndFrameChange = (value: number) => {
    if (selectedAnimationData) {
      updateAnimationFrames(selectedAnimationData.name, selectedAnimationData.loopStartFrame, value);
    }
  };

  return (
    <div className="h-full p-4">
      <h2 className="font-semibold mb-4">Animation Properties</h2>
      {selectedAnimation ? (
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Frame Duration</h3>
            <div className="flex items-center">
              <span className="w-20">Frame {currentFrame + 1}:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={frameTiming[currentFrame]}
                onChange={(e) => handleFrameTimingChange(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 border rounded"
              />
              <span className="ml-2">frames</span>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Animation Status</h3>
            <select
              value={selectedAnimationData?.status || 'not-started'}
              onChange={(e) => updateAnimationStatus(selectedAnimation, e.target.value as AnimationStatus)}
              className="w-full px-2 py-1 border rounded"
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div>
            <h3 className="font-medium mb-2">Loop Start Frame</h3>
            <input
              type="number"
              min="0"
              max={selectedAnimationData?.endFrame || totalFrames - 1}
              value={selectedAnimationData?.loopStartFrame || 0}
              onChange={(e) => handleLoopStartFrameChange(parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 border rounded"
            />
          </div>
          <div>
            <h3 className="font-medium mb-2">End Frame</h3>
            <input
              type="number"
              min={selectedAnimationData?.loopStartFrame || 0}
              max={totalFrames - 1}
              value={selectedAnimationData?.endFrame || totalFrames - 1}
              onChange={(e) => handleEndFrameChange(parseInt(e.target.value) || totalFrames - 1)}
              className="w-full px-2 py-1 border rounded"
            />
          </div>
        </div>
      ) : (
        <p>Select an animation to view and edit properties.</p>
      )}
    </div>
  );
};

export default AnimationProperties;