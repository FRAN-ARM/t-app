import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AnimationSelector from './components/AnimationSelector';
import AnimationProperties from './components/AnimationProperties';
import AnimationViewer from './components/AnimationViewer';
import SpriteViewer from './components/SpriteViewer';
import LayerOrder from './components/LayerOrder';
import Timeline from './components/Timeline';
import ElementAdder from './components/ElementAdder';

export type AnimationStatus = 'not-started' | 'in-progress' | 'finished';
export type AnimationType = 'default' | 'extra';

export interface Animation {
  name: string;
  status: AnimationStatus;
  type: AnimationType;
  loopStartFrame: number;
  endFrame: number;
  frames: AnimationFrame[];
}

export interface AnimationFrame {
  imgMain?: ImageData;
  imgOther?: ImageData;
  imgOtherB?: ImageData;
  vfxA?: ImageData;
  vfxB?: ImageData;
  vfxindA?: ImageData;
  vfxindB?: ImageData;
  hurtboxes?: Hurtbox[];
  placeholderBody?: PlaceholderData;
  placeholderParticleA?: PlaceholderData;
  placeholderParticleB?: PlaceholderData;
  placeholderItem?: PlaceholderItemData;
}

interface ImageData {
  id: number;
  spriteName: string;
  imageIndex: number;
  xoff: number;
  yoff: number;
  rotation: number;
  xscale: number;
  yscale: number;
  alpha: number;
  blendMode: string;
}

interface Hurtbox {
  left: number;
  top: number;
  right: number;
  bottom: number;
  state: string;
}

interface PlaceholderData {
  xoff: number;
  yoff: number;
  rotation: number;
}

interface PlaceholderItemData extends PlaceholderData {
  id: number;
}

const App: React.FC = () => {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
  const [selectedSprite, setSelectedSprite] = useState<string | null>(null);
  const [layers, setLayers] = useState(['Layer 1', 'Layer 2', 'Layer 3']);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(10);
  const [frameTiming, setFrameTiming] = useState(Array(totalFrames).fill(0).map(() => Math.floor(Math.random() * 5) + 1));

  const updateAnimationStatus = (animationName: string, newStatus: AnimationStatus) => {
    setAnimations(prevAnimations =>
      prevAnimations.map(anim =>
        anim.name === animationName ? { ...anim, status: newStatus } : anim
      )
    );
  };

  const updateAnimationFrames = (animationName: string, loopStartFrame: number, endFrame: number) => {
    setAnimations(prevAnimations =>
      prevAnimations.map(anim =>
        anim.name === animationName ? { ...anim, loopStartFrame, endFrame } : anim
      )
    );
  };

  const loadFighterFile = (content: string) => {
    try {
      const data = JSON.parse(content);
      const newAnimations: Animation[] = Object.entries(data).map(([name, animData]: [string, any]) => ({
        name,
        status: 'not-started',
        type: 'default',
        loopStartFrame: animData.loop_and_end[0],
        endFrame: animData.loop_and_end[1],
        frames: Object.entries(animData).filter(([key]) => key !== 'loop_and_end').map(([_, frameData]: [string, any]) => ({
          imgMain: frameData.img_main ? {
            id: frameData.img_main[0],
            spriteName: frameData.img_main[1],
            imageIndex: frameData.img_main[2],
            xoff: frameData.img_main[3],
            yoff: frameData.img_main[4],
            rotation: frameData.img_main[5],
            xscale: frameData.img_main[6],
            yscale: frameData.img_main[7],
            alpha: frameData.img_main[8],
            blendMode: frameData.img_main[9],
          } : undefined,
          // Add other image properties (imgOther, imgOtherB, etc.) similarly
          hurtboxes: frameData.hurtboxes?.map((hurtbox: number[]) => ({
            left: hurtbox[0],
            top: hurtbox[1],
            right: hurtbox[2],
            bottom: hurtbox[3],
            state: hurtbox[4],
          })),
          placeholderBody: frameData.placeholder_body ? {
            xoff: frameData.placeholder_body[0],
            yoff: frameData.placeholder_body[1],
            rotation: frameData.placeholder_body[2],
          } : undefined,
          // Add other placeholder properties similarly
          placeholderItem: frameData.placeholder_item ? {
            id: frameData.placeholder_item[0],
            xoff: frameData.placeholder_item[1],
            yoff: frameData.placeholder_item[2],
            rotation: frameData.placeholder_item[3],
          } : undefined,
        })),
      }));

      setAnimations(newAnimations);
      setTotalFrames(Math.max(...newAnimations.map(anim => anim.endFrame)) + 1);
      setFrameTiming(Array(Math.max(...newAnimations.map(anim => anim.endFrame)) + 1).fill(1));
    } catch (error) {
      console.error('Error parsing .fighter file:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar loadFighterFile={loadFighterFile} />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col w-1/4 min-w-[200px] max-w-[300px] border-r border-gray-200">
          <div className="flex-1 overflow-auto">
            <AnimationSelector
              animations={animations}
              selectedAnimation={selectedAnimation}
              setSelectedAnimation={setSelectedAnimation}
            />
          </div>
          <div className="flex-1 overflow-auto border-t border-gray-200">
            <AnimationProperties
              frameTiming={frameTiming}
              setFrameTiming={setFrameTiming}
              currentFrame={currentFrame}
              selectedAnimation={selectedAnimation}
              animations={animations}
              updateAnimationStatus={updateAnimationStatus}
              updateAnimationFrames={updateAnimationFrames}
              totalFrames={totalFrames}
            />
          </div>
          <div className="flex-1 overflow-auto border-t border-gray-200">
            <LayerOrder layers={layers} setLayers={setLayers} />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-auto">
            <AnimationViewer 
              currentFrame={currentFrame} 
              setCurrentFrame={setCurrentFrame}
              totalFrames={totalFrames}
              frameTiming={frameTiming}
              selectedAnimation={selectedAnimation}
              animations={animations}
            />
          </div>
          <div className="h-40 border-t border-gray-200">
            <Timeline 
              currentFrame={currentFrame} 
              setCurrentFrame={setCurrentFrame}
              totalFrames={totalFrames}
              frameTiming={frameTiming}
              selectedAnimation={selectedAnimation}
              animations={animations}
            />
          </div>
        </div>
        <div className="flex flex-col w-1/4 min-w-[200px] max-w-[300px] border-l border-gray-200">
          <div className="flex-1 overflow-auto">
            <SpriteViewer
              selectedSprite={selectedSprite}
              setSelectedSprite={setSelectedSprite}
            />
          </div>
          <div className="flex-1 overflow-auto border-t border-gray-200">
            <ElementAdder />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;