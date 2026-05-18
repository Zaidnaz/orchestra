"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/input", label: "New Case" },
  { href: "/agent-flow", label: "Architecture" }
];

export function SiteNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/agent-flow") return pathname.startsWith("/agents/") || pathname.startsWith("/agent-flow");
    return pathname.startsWith(href);
  };

  return (
    <header className="site-nav-wrap">
      <nav className="site-nav shell">
        <Link href="/" className="brand">
          <span className="brand-dot" />
          New Horizon
        </Link>
        <div className="nav-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? "nav-link active" : "nav-link"}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
