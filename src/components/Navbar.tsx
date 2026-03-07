import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/clubs", label: "Clubs" },
    { path: "/events", label: "Events" },
    { path: "https://www.chitkara.edu.in/", label: "About", external: true },
    { path: "/admin", label: "Admin" },
    { path: isAuthenticated ? "/logout" : "/login", label: isAuthenticated ? "Logout" : "Login" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary rounded-lg p-2 transition-transform group-hover:scale-110">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ClubHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              item.external ? (
                <a key={item.path} href={item.path}>
                  <Button variant="ghost" className="transition-all">
                    {item.label}
                  </Button>
                </a>
              ) : (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="transition-all"
                  >
                    {item.label}
                  </Button>
                </Link>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => (
              item.external ? (
                <a key={item.path} href={item.path} onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    {item.label}
                  </Button>
                </a>
              ) : (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    {item.label}
                  </Button>
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
