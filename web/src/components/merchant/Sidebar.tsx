'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Package,
  Wallet,
  CreditCard,
  BarChart3,
  Settings,
  Plus,
  Home,
  ShoppingCart
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Checkout', href: '/checkout', icon: ShoppingCart },
  { name: 'Wallet Config', href: '/wallet', icon: Wallet },
  { name: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
  { name: 'Transactions', href: '/transactions', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn('flex h-full w-56 flex-col bg-card border-r border-border', className)}>
      {/* Logo */}
      <div className="flex h-14 items-center px-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg"></div>
          <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Elza
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-xs font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-3 border-t border-border">
        <Link
          href="/products/new"
          className="flex items-center justify-center w-full px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md hover:from-purple-700 hover:to-blue-700 transition-colors"
        >
          <Plus className="mr-1 h-3 w-3" />
          New Product
        </Link>
      </div>
    </div>
  );
}
