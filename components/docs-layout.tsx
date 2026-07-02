"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, Menu, X } from "lucide-react";

/* ───── types ───── */
export interface SidebarItem {
  label: string;
  href?: string;
  children?: SidebarItem[];
}

export interface TOCHeading {
  id: string;
  text: string;
  level: number; // 2 or 3
}

/* ───── sidebar tree ───── */
function SidebarNode({
  item,
  pathname,
  depth = 0,
}: {
  item: SidebarItem;
  pathname: string;
  depth?: number;
}) {
  const isActive = item.href === pathname;
  const hasChildren = item.children && item.children.length > 0;
  const isOpenDefault =
    hasChildren &&
    item.children!.some(
      (c) =>
        c.href === pathname ||
        c.children?.some((cc) => cc.href === pathname)
    );
  const [open, setOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(`sidebar_open_${item.label}`);
      if (saved !== null) return saved === "true";
    }
    return isOpenDefault || false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`sidebar_open_${item.label}`, String(open));
    }
  }, [open, item.label]);

  useEffect(() => {
    if (isOpenDefault) {
      setOpen(true);
    }
  }, [isOpenDefault]);

  return (
    <div>
      {item.href && !hasChildren ? (
        <Link
          href={item.href}
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            isActive
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          {item.label}
        </Link>
      ) : (
        <div
          className={`flex w-full items-center justify-between rounded-md pr-2 text-sm font-medium transition-colors hover:bg-muted ${
            isActive && !item.href ? "text-primary" : "text-foreground"
          }`}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          {item.href ? (
            <Link
              href={item.href}
              className={`flex-1 py-1.5 ${
                isActive ? "text-primary" : "text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ) : (
            <button
              onClick={() => setOpen(!open)}
              className="flex-1 text-left py-1.5 text-foreground"
            >
              {item.label}
            </button>
          )}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setOpen(!open);
              }}
              className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-foreground/10"
            >
              {open ? (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      )}

      <AnimatePresence initial={false}>
        {hasChildren && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {item.children!.map((child) => (
              <SidebarNode
                key={child.label}
                item={child}
                pathname={pathname}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───── right-side TOC ───── */
function TableOfContents({ headings }: { headings: TOCHeading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block">
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          On This Page
        </p>
        <ul className="space-y-1 border-l border-border">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={`block border-l-2 py-1 text-sm transition-colors ${
                  h.level === 3 ? "pl-6" : "pl-3"
                } ${
                  activeId === h.id
                    ? "border-primary font-medium text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/* ───── breadcrumbs ───── */
function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ───── main layout ───── */
export function DocsLayout({
  sidebar,
  breadcrumbs,
  toc,
  children,
  prevPage,
  nextPage,
}: {
  sidebar: SidebarItem[];
  breadcrumbs: { label: string; href?: string }[];
  toc: TOCHeading[];
  children: React.ReactNode;
  prevPage?: { label: string; href: string };
  nextPage?: { label: string; href: string };
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="container relative z-10 flex min-h-[calc(100vh-4rem)] gap-0">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg lg:hidden"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r bg-background/95 backdrop-blur-md pt-20 transition-transform lg:relative lg:inset-auto lg:z-auto lg:w-72 lg:translate-x-0 lg:border-r-0 lg:bg-transparent lg:pt-8 xl:w-80 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto px-2 pb-8">
          <nav className="space-y-0.5">
            {sidebar.map((item) => (
              <SidebarNode key={item.label} item={item} pathname={pathname} />
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 px-4 py-8 md:px-8 lg:px-12">
        <Breadcrumbs items={breadcrumbs} />
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          {children}
        </article>

        {/* Bottom pagination */}
        {(prevPage || nextPage) && (
          <div className="mt-16 flex items-center justify-between border-t pt-6">
            {prevPage ? (
              <Link
                href={prevPage.href}
                className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-0.5" />
                {prevPage.label}
              </Link>
            ) : (
              <div />
            )}
            {nextPage ? (
              <Link
                href={nextPage.href}
                className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {nextPage.label}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </main>

      {/* Right TOC */}
      <TableOfContents headings={toc} />
    </div>
  );
}

/* ───── content card (for listing pages) ───── */
export function ContentCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link href={href} className="group block">
      <motion.div
        whileHover={{ y: -2 }}
        className="rounded-xl border border-border/50 bg-background/50 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
      >
        <div className="flex items-start gap-3">
          {icon && (
            <div className="mt-0.5 text-muted-foreground transition-colors group-hover:text-primary">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-semibold transition-colors group-hover:text-primary">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

/* ───── callout box ───── */
export function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "tip";
  children: React.ReactNode;
}) {
  const styles = {
    info: "border-blue-500/40 bg-blue-500/5 text-blue-200",
    warning: "border-yellow-500/40 bg-yellow-500/5 text-yellow-200",
    tip: "border-green-500/40 bg-green-500/5 text-green-200",
  };

  const icons = {
    info: "💡",
    warning: "⚠️",
    tip: "✅",
  };

  return (
    <div
      className={`my-4 rounded-lg border-l-4 p-4 text-sm ${styles[type]}`}
    >
      <span className="mr-2">{icons[type]}</span>
      {children}
    </div>
  );
}
