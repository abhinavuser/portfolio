"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, FileCode2 } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, ContentCard } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["rknn"];

export default function RKNNPage() {
  return (
    <StarfieldBackground>
      <Navbar />

      <DocsLayout
        sidebar={researchSidebar}
        breadcrumbs={page.breadcrumbs}
        toc={page.toc}
        prevPage={page.prevPage}
        nextPage={page.nextPage}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>{page.title}</h1>
          <p>
            RKNN2 is Rockchip&apos;s software suite to utilize the NPU on their device platforms 
            like the RK3588 and RK3566.
          </p>
          <p>
            The NPU doesn&apos;t directly run models as-is, you need to convert them into the
            custom <code>.rknn</code> format using the RKNN-Toolkit2.
          </p>

          <h2 id="guides">Guides</h2>
          <div className="not-prose grid gap-4">
            <ContentCard
              title="Converting TFLite Models with RKNN2"
              description="How to convert TFLite models for Rockchip's RKNN2 platform"
              href="/research/rknn/tflite-conversion"
              icon={<FileCode2 className="h-5 w-5" />}
            />
            <ContentCard
              title="Running TFLite Models with RKNN2"
              description="How to run converted models on the Rockchip NPU"
              href="/research/rknn/tflite-models"
              icon={<FileCode2 className="h-5 w-5" />}
            />
          </div>
        </motion.div>
      </DocsLayout>

      <footer className="border-t bg-background py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p>&copy; {new Date().getFullYear()} Abhinav Kumar . All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="https://github.com/abhinavuser" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/in/abhinav-kumar-v" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </StarfieldBackground>
  );
}
