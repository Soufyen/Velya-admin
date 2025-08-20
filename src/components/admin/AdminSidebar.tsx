import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  MessageSquare,
  Settings,
  Users,
  Tags,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: BarChart3,
  },
  {
    title: 'Hero Section',
    url: '/hero',
    icon: Home,
  },
  {
    title: 'Formations',
    url: '/formations',
    icon: GraduationCap,
  },
  {
    title: 'Préinscriptions',
    url: '/registrations',
    icon: Users,
  },
  {
    title: 'Blog',
    url: '/blog',
    icon: FileText,
  },
  {
    title: 'Catégories',
    url: '/categories',
    icon: Tags,
  },
  {
    title: 'Témoignages',
    url: '/testimonials',
    icon: MessageSquare,
  },
];

export const AdminSidebar: React.FC = () => {
  const { state } = useSidebar();
  const { logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path)
      ? 'bg-primary text-primary-foreground font-medium hover:bg-primary/90'
      : 'hover:bg-accent text-accent-foreground';
  };

  return (
    <Sidebar className={collapsed ? 'w-16' : 'w-64'} collapsible="icon">
      <SidebarContent className="bg-card border-r">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-primary">Velya Admin</h2>
                <p className="text-xs text-muted-foreground">www.velyacademy.com</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          
           <SidebarGroupContent>
             <SidebarMenu className="space-y-2">
               {navigationItems.map((item) => (
                 <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton asChild className="w-full">
                     <NavLink
                       to={item.url}
                       end={item.url === '/admin'}
                       className={`${getNavClassName(item.url)} flex items-center gap-4 px-4 py-4 rounded-lg transition-colors`}
                     >
                       <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                          <span className="font-medium">{item.title}</span>
                        )}
                     </NavLink>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))}
             </SidebarMenu>
           </SidebarGroupContent>
         </SidebarGroup>
       </SidebarContent>

       <SidebarFooter className="p-4 border-t">
         <SidebarMenuButton 
           onClick={handleLogout}
           className="w-full flex items-center gap-4 px-4 py-4 rounded-lg transition-colors hover:bg-destructive/10 text-destructive hover:text-destructive"
         >
           <LogOut className="w-5 h-5 flex-shrink-0" />
           {!collapsed && (
             <span className="font-medium">Déconnexion</span>
           )}
         </SidebarMenuButton>
       </SidebarFooter>
     </Sidebar>
  );
};