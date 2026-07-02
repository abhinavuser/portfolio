"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, BookText, Cpu, FileCode2, NotebookPen } from "lucide-react";
import Link from "next/link";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, ContentCard } from "@/components/docs-layout";
import { researchSidebar } from "@/lib/research-data";

export default function ResearchPage() {
  return (
    <StarfieldBackground>
      <Navbar />

      <DocsLayout
        sidebar={researchSidebar}
        breadcrumbs={[{ label: "Research" }]}
        toc={[
          { id: "ml", text: "Neural Networks & ML", level: 2 },
          { id: "firmware", text: "Firmware & Bare-Metal", level: 2 },
          { id: "devices", text: "Devices", level: 2 },
        ]}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Research & Devices</h1>
          <p className="lead">
            A collection of technical deep dives, machine learning research, and hardware device notes.
          </p>

          <h2 id="ml">Neural Networks & ML</h2>
          <p>Detailed technical writeups on ML inference engines and models.</p>
          <div className="not-prose grid gap-4 md:grid-cols-2">
            <ContentCard
              title="ArmNN"
              description="ML inference engine for ARM Cortex-A CPUs and Mali GPUs"
              href="/research/armnn"
              icon={<Cpu className="h-5 w-5" />}
            />
            <ContentCard
              title="RKNN"
              description="Rockchip's NPU software suite for RK3588 and RK3566"
              href="/research/rknn"
              icon={<FileCode2 className="h-5 w-5" />}
            />
            <ContentCard
              title="1D CNNs on Edge"
              description="Running time-series ML models on constrained hardware"
              href="/research/1d-cnn"
              icon={<Cpu className="h-5 w-5" />}
            />
            <ContentCard
              title="Toy NN Runtime"
              description="Building a minimalist neural network engine in C++"
              href="/research/toy-nn"
              icon={<FileCode2 className="h-5 w-5" />}
            />
            <ContentCard
              title="CyberFin Nexus"
              description="GNN-based platform fusing cyber threat telemetry with financial transactions"
              href="/research/cyberfin"
              icon={<Cpu className="h-5 w-5" />}
            />
            <ContentCard
              title="Quantized LLM Inference"
              description="Deploying W4A8 quantized Llama-3 models natively on Rockchip NPUs"
              href="/research/llm-edge"
              icon={<Cpu className="h-5 w-5" />}
            />
          </div>

          <h2 id="firmware">Firmware & Bare-Metal</h2>
          <p>Low-level embedded engineering and hardware architectures.</p>
          <div className="not-prose grid gap-4 md:grid-cols-2">
            <ContentCard
              title="FreeRTOS Bare-Metal"
              description="Setting up FreeRTOS without CubeMX on STM32"
              href="/research/freertos"
              icon={<FileCode2 className="h-5 w-5" />}
            />
            <ContentCard
              title="Xiao RTSP Stream"
              description="Streaming video via RTSP using the XIAO ESP32S3"
              href="/research/xiao-rtsp"
              icon={<BookText className="h-5 w-5" />}
            />
            <ContentCard
              title="V4L2 Zero-Copy Embedded Vision"
              description="Building zero-copy DMA-BUF memory pipelines for edge computer vision"
              href="/research/v4l2-pipeline"
              icon={<FileCode2 className="h-5 w-5" />}
            />
          </div>

          <h2 id="devices">Devices</h2>
          <p>Tidbits, pinouts, and hardware notes for various SBCs and MCUs.</p>
          <div className="not-prose grid gap-4 md:grid-cols-2">
            <ContentCard
              title="Seeed Studio XIAO"
              description="Notes on the XIAO ESP32S3 Sense"
              href="/research/devices/xiao"
              icon={<NotebookPen className="h-5 w-5" />}
            />
            <ContentCard
              title="STM32 Nucleo"
              description="Notes on the STM32F303K8 Nucleo board"
              href="/research/devices/stm"
              icon={<NotebookPen className="h-5 w-5" />}
            />
            <ContentCard
              title="Raspberry Pi 4B"
              description="Notes on the Raspberry Pi 4 Model B"
              href="/research/devices/rpi"
              icon={<NotebookPen className="h-5 w-5" />}
            />
            <ContentCard
              title="Khadas Edge2"
              description="Notes on the Khadas Edge2 Rockchip RK3588S SBC"
              href="/research/devices/khadas"
              icon={<NotebookPen className="h-5 w-5" />}
            />
          </div>
        </motion.div>
      </DocsLayout>

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
