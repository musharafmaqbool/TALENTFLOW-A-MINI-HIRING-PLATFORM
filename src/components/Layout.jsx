import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Users, FileText, LayoutGrid, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

const navigation = [
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Candidates', href: '/candidates', icon: Users },
  { name: 'Kanban', href: '/kanban', icon: LayoutGrid },
  { name: 'Assessments', href: '/assessments', icon: FileText },
];

export function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-gray-200/50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center group">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300 group-hover:scale-110">
                  <Sparkles className="text-white w-5 h-5 absolute animate-pulse" />
                  <span className="text-white font-bold text-xl relative z-10">T</span>
                </div>
                <div>
                  <span className="text-xl font-bold gradient-text">TalentFlow</span>
                  <p className="text-xs text-gray-500 -mt-1">Hiring Platform</p>
                </div>
              </div>
            </Link>

            <nav className="flex gap-2">
              {navigation.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 relative group',
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-indigo-600 text-white shadow-medium'
                        : 'text-gray-600 hover:bg-white hover:text-primary-600 hover:shadow-soft'
                    )}
                  >
                    <Icon size={18} className={isActive ? 'animate-bounce-subtle' : 'group-hover:scale-110 transition-transform'} />
                    <span className="hidden sm:inline">{item.name}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-white rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>

      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
}

