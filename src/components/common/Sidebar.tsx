import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Ticket, 
  Plus, 
  MessageSquare, 
  Settings
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar: React.FC = () => {
  const { role, isPremium } = useAuth();

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['ADMIN', 'MANAGER', 'DEVELOPER', 'CLIENT'],
      },
      {
        name: 'All Tickets',
        href: '/tickets',
        icon: Ticket,
        roles: ['ADMIN', 'MANAGER', 'DEVELOPER', 'CLIENT'],
      },
    ];

    const roleSpecificItems = [];

    if (role === 'CLIENT') {
      roleSpecificItems.push({
        name: 'Create Ticket',
        href: '/tickets/create',
        icon: Plus,
        roles: ['CLIENT'],
      });
    }

    if (isPremium) {
      roleSpecificItems.push({
        name: 'AI Assistant',
        href: '/ai-chat',
        icon: MessageSquare,
        roles: ['ADMIN', 'MANAGER', 'DEVELOPER', 'CLIENT'],
      });
    }

    if (role === 'ADMIN') {
      roleSpecificItems.push({
        name: 'Settings',
        href: '/settings',
        icon: Settings,
        roles: ['ADMIN'],
      });
    }

    return [...baseItems, ...roleSpecificItems].filter(item => 
      item.roles.includes(role!)
    );
  };

  const navigationItems = getNavigationItems();

  return (
    <aside className="fixed left-0 top-0 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            IntelliDesk
          </span>
        </div>
      </div>
      
      <nav className="px-4 pb-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
