import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Menu, Share2, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

type Page = "home" | "member" | "admin";

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (p: Page) => void;
}

export function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isLoggedIn = loginStatus === "success" && !!identity;

  const handleShare = async () => {
    const shareData = {
      title: "Bugesera Muslim Community App",
      text: "Join the Bugesera Muslim Community App - connect, contribute, and stay informed!",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const navLinks: { label: string; page?: Page; anchor?: string }[] = [
    { label: "Home", page: "home" },
    { label: "About Us", anchor: "#about" },
    { label: "Community Hub", anchor: "#community" },
    { label: "Features", anchor: "#features" },
    ...(isLoggedIn ? [{ label: "My Dashboard", page: "member" as Page }] : []),
    ...(isAdmin ? [{ label: "Admin", page: "admin" as Page }] : []),
    { label: "Contact Us", anchor: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setCurrentPage("home")}
          data-ocid="nav.link"
        >
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-lg font-bold">🕌</span>
          </div>
          <span className="font-bold text-lg" style={{ color: "#0F5B3A" }}>
            BMC App
          </span>
          <span className="hidden sm:block text-xs text-muted-foreground">
            Bugesera Muslim Community
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              data-ocid="nav.link"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                link.page && currentPage === link.page
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => {
                if (link.page) setCurrentPage(link.page);
                else if (link.anchor)
                  document
                    .querySelector(link.anchor)
                    ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {link.label}
              {link.label === "Admin" && isAdmin && (
                <Badge className="ml-1 text-xs bg-accent text-accent-foreground">
                  Admin
                </Badge>
              )}
            </button>
          ))}
        </nav>

        {/* Auth Buttons + Share */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            title={copied ? "Link copied!" : "Share App"}
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors relative"
          >
            <Share2 className="w-5 h-5" />
            {copied && (
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs bg-black text-white rounded px-2 py-0.5 whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>
          {isLoggedIn ? (
            <>
              <span className="text-xs text-muted-foreground mr-2">
                {identity.getPrincipal().toString().slice(0, 8)}...
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={clear}
                data-ocid="nav.link"
                className="border-primary text-primary hover:bg-primary hover:text-white rounded-xl"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                onClick={login}
                disabled={loginStatus === "logging-in"}
                data-ocid="nav.link"
                className="bg-primary text-white hover:bg-primary/90 rounded-xl"
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={login}
                disabled={loginStatus === "logging-in"}
                data-ocid="nav.link"
                className="bg-accent text-white hover:bg-accent/90 rounded-xl"
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile: Share + Menu Toggle */}
        <div className="lg:hidden flex items-center gap-1">
          <button
            type="button"
            onClick={handleShare}
            title={copied ? "Link copied!" : "Share App"}
            className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            data-ocid="nav.toggle"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-border px-4 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              className="text-sm font-medium text-left text-foreground hover:text-primary"
              onClick={() => {
                if (link.page) {
                  setCurrentPage(link.page);
                  setMenuOpen(false);
                } else if (link.anchor) {
                  document
                    .querySelector(link.anchor)
                    ?.scrollIntoView({ behavior: "smooth" });
                  setMenuOpen(false);
                }
              }}
            >
              {link.label}
            </button>
          ))}
          {isLoggedIn ? (
            <Button
              size="sm"
              variant="outline"
              onClick={clear}
              className="rounded-xl"
            >
              Sign Out
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              className="bg-primary text-white rounded-xl"
            >
              Sign In
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
