import { Link, useLocation } from 'react-router-dom';
import { Home, Users, LogIn, Shield, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { MooglePom } from './MooglePom';

export function Navbar() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/members', label: 'Members', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-moogle-lavender/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <MooglePom size="md" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-moogle-purple to-moogle-pink bg-clip-text text-transparent">
              MogTome
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  font-medium transition-all duration-200
                  ${
                    isActive(path)
                      ? 'bg-moogle-lavender text-moogle-purple-deep'
                      : 'text-text hover:bg-moogle-lavender/50 hover:text-moogle-purple-deep'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}

            {/* Auth Section */}
            <div className="ml-2 pl-2 border-l border-moogle-lavender/30">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {user?.isAdmin && (
                    <Link
                      to="/admin"
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-xl
                        font-medium transition-all duration-200
                        ${
                          isActive('/admin')
                            ? 'bg-moogle-gold/30 text-moogle-gold-dark'
                            : 'text-moogle-gold-dark hover:bg-moogle-gold/20'
                        }
                      `}
                    >
                      <Shield className="w-4 h-4" />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-text-light hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl
                    font-medium transition-all duration-200
                    ${
                      isActive('/login')
                        ? 'bg-moogle-purple text-white'
                        : 'text-moogle-purple-deep hover:bg-moogle-lavender/50'
                    }
                  `}
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
