import React from 'react';

interface Animation {
  name: string;
  loopStartFrame: number;
  endFrame: number;
}

interface TimelineProps {
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  totalFrames: number;
  frameTiming: number[];
  selectedAnimation: string | null;
  animations: Animation[];
}

const Timeline: React.FC<TimelineProps> = ({ 
  currentFrame, 
  setCurrentFrame, 
  totalFrames, 
  frameTiming,
  selectedAnimation,
  animations
}) => {
  const selectedAnimationData = animations.find(anim => anim.name === selectedAnimation);

  return (
    <div className="h-full p-4">
      <h2 className="font-semibold mb-2">Timeline</h2>
      <div className="flex justify-center items-center h-[calc(100%-2rem)]">
        <div className="flex space-x-1 overflow-x-auto max-w-full">
          {Array.from({ length: totalFrames }).map((_, index) => (
            <div
              key={index}
              className={`flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center border ${
                currentFrame === index ? 'bg-orange-200 border-orange-400' : 
                selectedAnimationData && index === selectedAnimationData.loopStartFrame ? 'bg-green-200 border-green-400' :
                selectedAnimationData && index === selectedAnimationData.endFrame ? 'bg-red-200 border-red-400' :
                'bg-gray-100 border-gray-300'
              } cursor-pointer relative`}
              onClick={() => setCurrentFrame(index)}
            >
              <div>{index + 1}</div>
              <div className="text-xs mt-1">{frameTiming[index]} frames</div>
              {selectedAnimationData && index === selectedAnimationData.loopStartFrame && (
                <div className="absolute top-0 left-0 w-0 h-0 border-t-8 border-l-8 border-t-green-500 border-l-transparent"></div>
              )}
              {selectedAnimationData && index === selectedAnimationData.endFrame && (
                <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-t-red-500 border-r-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;