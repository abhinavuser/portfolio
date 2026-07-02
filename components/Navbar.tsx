"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Blogs", href: "/blogs" },
    { label: "Research", href: "/research" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          AK
        </Link>
        <nav className="hidden md:flex flex-grow justify-center">
          <ul className="flex space-x-8 text-sm font-semibold">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`hover:text-primary transition-all duration-300 ease-in-out ${
                    pathname === item.href
                      ? "text-primary font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex"
            onClick={() =>
              window.open(
                "https://docs.google.com/document/d/1QnGajxJsTNjzvL954ZbCgGKa3AqR_TyvvO-TBYoM2MU/edit?usp=sharing",
                "_blank"
              )
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Download CV
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
