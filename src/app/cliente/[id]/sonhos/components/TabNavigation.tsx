import React from 'react';
import { LayoutGrid, GitBranch, BarChart3 } from 'lucide-react';

interface Tab {
  id: 'cards' | 'timeline' | 'dashboard';
  label: string;
}

interface TabNavigationProps {
  activeTab: 'cards' | 'timeline' | 'dashboard';
  onTabChange: (tabId: 'cards' | 'timeline' | 'dashboard') => void;
  tabs: Tab[];
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, tabs }) => {
  const getIcon = (tabId: string) => {
    switch (tabId) {
      case 'cards':
        return <LayoutGrid size={20} />;
      case 'timeline':
        return <GitBranch size={20} />;
      case 'dashboard':
        return <BarChart3 size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex space-x-2 bg-[#1e293b] rounded-lg p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          {getIcon(tab.id)}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation; 