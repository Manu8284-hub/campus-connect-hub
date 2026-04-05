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
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-2.5 transition-transform group-hover:scale-110 shadow-lg">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ClubHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {navItems.map((item) => (
              item.external ? (
                <a key={item.path} href={item.path} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="transition-all font-medium hover:text-primary">
                    {item.label}
                  </Button>
                </a>
              ) : (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="transition-all font-medium"
                  >
                    {item.label}
                  </Button>
                </Link>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors hover:bg-secondary/80"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-in slide-in-from-top-2 border-t border-border/40">
            {navItems.map((item) => (
              item.external ? (
                <a key={item.path} href={item.path} onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" className="w-full justify-start font-medium hover:text-primary transition-all">
                    {item.label}
                  </Button>
                </a>
              ) : (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start font-medium transition-all"
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
