"use client";

import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { Github, Linkedin, ArrowRight, BookOpen, FlaskConical, User, Home as HomeIcon } from "lucide-react";
import Link from "next/link";

import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";

const navCards = [
  {
    title: "Blogs",
    description: "Thoughts, writeups & notes",
    href: "/blogs",
    icon: BookOpen,
    delay: 0.2,
  },
  {
    title: "Research",
    description: "Papers, experiments & findings",
    href: "/research",
    icon: FlaskConical,
    delay: 0.3,
  },
  {
    title: "About",
    description: "Projects, experience & skills",
    href: "/about",
    icon: User,
    delay: 0.4,
  },
];

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <StarfieldBackground>
      <Navbar />

      {/* Sidebar social links */}
      <div className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center space-y-6 md:flex">
        <motion.a
          href="https://github.com/abhinavuser"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2 }}
          className="rounded-full bg-background p-2 shadow-md transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Github className="h-6 w-6" />
        </motion.a>
        <motion.a
          href="https://linkedin.com/in/abhinav-kumar-v"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2 }}
          className="rounded-full bg-background p-2 shadow-md transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Linkedin className="h-6 w-6" />
        </motion.a>
      </div>

      <main className="container relative z-10 py-10">
        {/* Hero Section */}
        <section className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center gap-16 py-20 lg:flex-row lg:justify-between lg:gap-24">
          {/* Left side: Name, typing animation, and intro */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            {/* Profile image: visible on mobile, hidden on large screens where it goes to the right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 block lg:hidden"
            >
              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-primary/30 shadow-2xl">
                <img
                  src="/images/abhinav.JPG"
                  alt="Abhinav Kumar"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-2 text-sm font-medium uppercase tracking-widest text-muted-foreground"
            >
              Hello, I&apos;m
            </motion.p>
            <h1 className="mb-4 text-3xl font-bold md:text-5xl">
              Abhinav Kumar V
            </h1>
            <div className="mb-8 h-10 text-lg font-medium text-primary md:text-xl">
              <TypeAnimation
                sequence={[
                  "Embedded Electronics Engineer",
                  1000,
                  "Machine Learning Engineer",
                  1000,
                  "Robotics and Automation Enthusiast",
                  1000,
                  "Full Stack Developer",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Number.POSITIVE_INFINITY}
              />
            </div>

            {/* Navigation Cards */}
            <div className="grid w-full max-w-md grid-cols-1 gap-3">
              {navCards.map((card) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: card.delay }}
                >
                  <Link href={card.href} className="group block">
                    <div className="flex items-center justify-between rounded-xl border border-border bg-card text-card-foreground px-6 py-4 shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                      <div className="flex items-center gap-4">
                        <card.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                        <div>
                          <p className="font-semibold transition-colors group-hover:text-primary">
                            {card.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {card.description}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side: Profile image (large screens only) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div
              className="relative h-64 w-64 overflow-hidden rounded-2xl border border-border/30 shadow-2xl xl:h-80 xl:w-80"
              style={{
                transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
                transition: "transform 0.3s ease-out",
              }}
            >
              <img
                src="/images/abhinav.JPG"
                alt="Abhinav Kumar"
                className="h-full w-full object-cover"
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t bg-background py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p>
              &copy; {new Date().getFullYear()} Abhinav Kumar . All rights
              reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/abhinavuser"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/abhinav-kumar-v"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </StarfieldBackground>
  );
}
