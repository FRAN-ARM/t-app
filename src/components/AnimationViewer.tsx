import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronsLeft, ChevronsRight, Palette, ZoomIn, ZoomOut, Repeat } from 'lucide-react';

interface Animation {
  name: string;
  loopStartFrame: number;
  endFrame: number;
}

interface AnimationViewerProps {
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  totalFrames: number;
  frameTiming: number[];
  selectedAnimation: string | null;
  animations: Animation[];
}

const AnimationViewer: React.FC<AnimationViewerProps> = ({
  currentFrame,
  setCurrentFrame,
  totalFrames,
  frameTiming,
  selectedAnimation,
  animations
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [loopAnimation, setLoopAnimation] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const selectedAnimationData = animations.find(anim => anim.name === selectedAnimation);

  const handlePlay = () => setIsPlaying(!isPlaying);
  const handleZoomIn = () => setZoom((prevZoom) => Math.min(200, prevZoom + 10));
  const handleZoomOut = () => setZoom((prevZoom) => Math.max(50, prevZoom - 10));
  const handleLoopToggle = () => setLoopAnimation(!loopAnimation);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    setZoom((prevZoom) => {
      const newZoom = Math.min(200, Math.max(50, prevZoom + delta * 5));
      return parseFloat(newZoom.toFixed(2));
    });
  };

  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer) {
      viewer.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (viewer) {
        viewer.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && selectedAnimationData) {
      let frameCounter = 0;
      const animate = () => {
        frameCounter++;
        if (frameCounter >= frameTiming[currentFrame]) {
          frameCounter = 0;
          setCurrentFrame((prevFrame) => {
            if (prevFrame === selectedAnimationData.endFrame) {
              return loopAnimation ? selectedAnimationData.loopStartFrame : prevFrame;
            }
            return prevFrame + 1;
          });
        }
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentFrame, frameTiming, loopAnimation, setCurrentFrame, selectedAnimationData]);

  const goToFirstFrame = () => {
    if (selectedAnimationData) {
      setCurrentFrame(selectedAnimationData.loopStartFrame);
    } else {
      setCurrentFrame(0);
    }
  };

  const goToLastFrame = () => {
    if (selectedAnimationData) {
      setCurrentFrame(selectedAnimationData.endFrame);
    } else {
      setCurrentFrame(totalFrames - 1);
    }
  };

  const goToPreviousFrame = () => {
    if (selectedAnimationData) {
      setCurrentFrame((prev) => 
        prev > selectedAnimationData.loopStartFrame ? prev - 1 : selectedAnimationData.endFrame
      );
    } else {
      setCurrentFrame((prev) => (prev > 0 ? prev - 1 : totalFrames - 1));
    }
  };

  const goToNextFrame = () => {
    if (selectedAnimationData) {
      setCurrentFrame((prev) => 
        prev < selectedAnimationData.endFrame ? prev + 1 : selectedAnimationData.loopStartFrame
      );
    } else {
      setCurrentFrame((prev) => (prev < totalFrames - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 p-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="p-2 bg-white rounded shadow hover:bg-gray-50" onClick={goToFirstFrame}>
            <ChevronsLeft size={20} />
          </button>
          <button className="p-2 bg-white rounded shadow hover:bg-gray-50" onClick={goToPreviousFrame}>
            <SkipBack size={20} />
          </button>
          <button className="p-2 bg-white rounded shadow hover:bg-gray-50" onClick={handlePlay}>
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className="p-2 bg-white rounded shadow hover:bg-gray-50" onClick={goToNextFrame}>
            <SkipForward size={20} />
          </button>
          <button className="p-2 bg-white rounded shadow hover:bg-gray-50" onClick={goToLastFrame}>
            <ChevronsRight size={20} />
          </button>
          <button className={`p-2 rounded shadow ${loopAnimation ? 'bg-orange-200' : 'bg-white'} hover:bg-orange-100`} onClick={handleLoopToggle}>
            <Repeat size={20} />
          </button>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 bg-white rounded shadow hover:bg-gray-50">
            <Palette size={20} />
          </button>
          <button className="p-2 bg-white rounded shadow hover:bg-gray-50" onClick={handleZoomOut}>
            <ZoomOut size={20} />
          </button>
          <button className="p-2 bg-white rounded shadow hover:bg-gray-50" onClick={handleZoomIn}>
            <ZoomIn size={20} />
          </button>
          <span className="p-2 bg-white rounded shadow">{zoom.toFixed(0)}%</span>
        </div>
      </div>
      <div 
        ref={viewerRef}
        className="flex-1 bg-white p-4 overflow-hidden flex items-center justify-center"
      >
        <div 
          style={{ 
            transform: `scale(${zoom / 100})`, 
            transition: 'transform 0.1s ease-out',
            transformOrigin: 'center',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }} 
          className="bg-gray-200"
        >
          <p>Animation Viewer (Frame {currentFrame + 1}/{totalFrames})</p>
          <p>Frame Duration: {frameTiming[currentFrame]} frames</p>
          {selectedAnimationData && (
            <p>
              Loop Start: {selectedAnimationData.loopStartFrame + 1}, 
              End: {selectedAnimationData.endFrame + 1}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimationViewer;