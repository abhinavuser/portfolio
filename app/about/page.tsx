"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/marquee";
import { ProjectCard } from "@/components/project-card";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { SkillsGrid } from "@/components/skills-grid";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <StarfieldBackground>
      <Navbar />

      {/* Sidebar */}
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

      <main className="container relative z-10 py-4">
        {/* About Section */}
        <section id="about" className="pt-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">About Me</h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-primary"></div>
            <p className="text-muted-foreground">Get to know me</p>
          </motion.div>

          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-primary md:h-80 md:w-80"
            >
              <img
                src="/images/abhi-about.jpg"
                alt="Abhinav Kumar"
                className="h-full w-full object-cover"  // Ensure it covers the circle fully
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-lg ml-auto"
            >
              <h3 className="mb-4 text-2xl font-bold">Who am I?</h3>
              <p className="mb-4">
                Embedded Systems and AI Engineer with expertise in ARM/RISC-V SoCs, Embedded Linux, MLOps, and a passion for anything Mathematics. I work a lot on developing firmware, OT security, computer vision, and image processing models on diverse SBC platforms while also contributing to the open-source community.
              </p>
              <p className="mb-4 text-muted-foreground">
                As an Electronics Major with a focus on Embedded Firmware, Machine Learning and IoT, I specialize in creating real-time, solutions for hardware and edge devices. I have experience in deploying machine learning models on microcontrollers and developing Firmware and Middleware, optimizing them for low power and real-time performance. In addition to embedded, I am proficient in MLOps practices and network security, ensuring scalable and reproducible ML workflows through tools such as Docker, Wireshark, OpenCV and model versioning pipelines.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Name:</p>
                  <p className="text-muted-foreground">Abhinav Kumar</p>
                </div>
                <div>
                  <p className="font-medium">Major:</p>
                  <p className="text-muted-foreground">Electrical & Electronics Engineering</p>
                </div>
                <div>
                  <p className="font-medium">Location:</p>
                  <p className="text-muted-foreground">Chennai, Tamil Nadu</p>
                </div>
                <div>
                  <p className="font-medium">Institute:</p>
                  <p className="text-muted-foreground">VIT Chennai</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Marquee Section */}
        <Marquee />

        {/* Projects Section */}
        <section id="projects" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">My Projects</h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-primary"></div>
            <p className="text-muted-foreground">Some of my works</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ProjectCard
              title="CyberFin Nexus"
              description="Fuses cyber threat intel with financial transaction graphs to catch money mule rings using GATs and Federated Learning. Includes a 7-tab Streamlit dashboard with adversarial RL testing and blockchain audit trail."
              image="/images/cyber.png"
              tags={["Python", "PyTorch", "GNN", "Federated Learning", "Streamlit"]}
              link="https://github.com/abhinavuser/cyberfin-nexus"
            />
            <ProjectCard
              title="FreeRTOS From Scratch"
              description="Built FreeRTOS firmware from scratch on STM32 Nucleo covering task scheduling, semaphores, mutexes and interrupt handling. The whole point was learning RTOS internals without relying on CubeIDE generated code."
              image="/images/cardiac.jpg"
              tags={["C", "FreeRTOS", "STM32", "ARM Cortex-M", "Makefile"]}
              link="https://github.com/abhinavuser/freertos-from-scratch"
            />
            <ProjectCard
              title="Cluster Stat"
              description="C++ dashboard for embedded Linux devices using LVGL to monitor cluster health metrics in real-time. Built it as a lightweight alternative to heavy web dashboards on resource constrained SBCs."
              image="/images/lvgl.jpg"
              tags={["C", "C++", "LVGL", "Embedded Linux", "CMake", "Python"]}
              link="https://github.com/abhinavuser/cluster-stat"
            />
            <ProjectCard
              title="VESTERN"
              description="All-in-one AI financial assistant that uses Agentic RAG for automated stock trading and investment analysis. Backend runs fine-tuned LLMs with blockchain secured transactions and anonymous Aadhar verification."
              image="/images/vestern.png"
              tags={["Python", "Next.js", "Flutter", "RAG", "Blockchain", "PostgreSQL"]}
              link="https://github.com/abhinavuser/vestern"
            />
            <ProjectCard
              title="Fusion Algorithm"
              description="Exposure fusion running on a XIAO ESP32-S3 with OV2640 camera. Captures three different exposures and fuses them into one well-exposed image right on the microcontroller with per-pixel weighting."
              image="/images/xiao.jpg"
              tags={["C++", "ESP32", "PlatformIO", "MATLAB", "Python", "Processing"]}
              link="https://github.com/abhinavuser/fusion_algorithm"
            />
            <ProjectCard
              title="RakshiQ"
              description="Electric fence detection system built for SIH 2025. Uses TDR analysis for fault location with ±2m accuracy, LSTM models for 24hr voltage spike prediction, and RCD monitoring for instant safety disconnection."
              image="/images/rakshi.webp"
              tags={["Next.js", "Flutter", "Python", "MATLAB", "LSTM", "IEC 61850"]}
              link="https://github.com/abhinavuser/electric_fence_sih"
            />
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">My Experience</h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-primary"></div>
            <p className="text-muted-foreground">My professional journey</p>
          </motion.div>

          <ExperienceTimeline />
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">My Skills</h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-primary"></div>
            <p className="text-muted-foreground">Technologies I work with</p>
          </motion.div>

          <SkillsGrid />
        </section>


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
