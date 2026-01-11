import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
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
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="navbar bg-base-100/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm border-b border-base-200"
    >
      <div className="navbar-start">
        {/* Mobile menu */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52">
            {navItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <Link to={path} className={isActive(path) ? 'active' : ''}>
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Logo */}
        <Link to="/" className="btn btn-ghost text-xl gap-2 hover:bg-transparent">
          <MooglePom size="sm" />
          <span className="font-bold gradient-text-moogle">MogTome</span>
        </Link>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`rounded-xl font-medium ${isActive(path) ? 'bg-primary/20 text-primary' : ''}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Auth section */}
      <div className="navbar-end gap-2">
        {isAuthenticated ? (
          <>
            {user?.isAdmin && (
              <Link
                to="/admin"
                className={`btn btn-sm ${isActive('/admin') ? 'btn-accent' : 'btn-ghost'}`}
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="btn btn-sm btn-ghost text-error hover:bg-error/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={`btn btn-sm ${isActive('/login') ? 'btn-primary' : 'btn-ghost'}`}
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
