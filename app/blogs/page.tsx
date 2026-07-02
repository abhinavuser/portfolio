"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Calendar, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { blogPosts } from "@/lib/blog-data";

export default function BlogsPage() {
  return (
    <StarfieldBackground>
      <Navbar />

      <main className="container relative z-10 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Blogs</h1>
          <div className="mx-auto mb-6 h-1 w-20 bg-primary"></div>
        </motion.div>

        {/* Blog post listing */}
        <div className="mx-auto max-w-3xl space-y-6">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/blogs/${post.slug}`} className="group block">
                <article className="rounded-xl border border-border/50 bg-background/50 p-4 sm:p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-background/80 hover:-translate-y-1 hover:shadow-md hover:shadow-primary/5">
                  <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{post.date}</span>
                  </div>

                  <h2 className="mb-2 text-lg font-semibold transition-colors group-hover:text-primary md:text-xl">
                    {post.title}
                  </h2>

                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{post.description}</p>

                  <div className="flex items-center text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
                    read more <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t bg-background py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p>&copy; {new Date().getFullYear()} Abhinav Kumar . All rights reserved.</p>
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
