import React from 'react';
import { Menu, Save, Settings, Info, Upload } from 'lucide-react';

interface NavbarProps {
  loadFighterFile: (content: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ loadFighterFile }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        loadFighterFile(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button className="hover:bg-gray-700 p-2 rounded">
            <Menu size={20} />
          </button>
          <button className="hover:bg-gray-700 p-2 rounded">
            <Save size={20} />
          </button>
          <label className="hover:bg-gray-700 p-2 rounded cursor-pointer">
            <Upload size={20} />
            <input
              type="file"
              accept=".fighter"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
        <h1 className="text-xl font-bold">2D Animation Editor</h1>
        <div className="flex space-x-4">
          <button className="hover:bg-gray-700 p-2 rounded">
            <Settings size={20} />
          </button>
          <button className="hover:bg-gray-700 p-2 rounded">
            <Info size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;