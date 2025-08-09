"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { StarfieldBackground } from "@/components/StarfieldBackground";

export default function AboutPage() {
  return (
    <StarfieldBackground>
      <Navbar />
      <main className="container py-10">
        <section className="py-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">About Me</h1>
            <div className="mx-auto mb-4 h-1 w-20 bg-primary"></div>
            <p className="text-muted-foreground">Everything about me</p>
          </motion.div>

          <div className="grid gap-12 md:grid-cols-2 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 max-w-3xl leading-relaxed"
            >
              <h2 className="text-2xl font-semibold">Who am I?</h2>
              <p className="text-muted-foreground">
              Embedded AI Engineer with expertise in MLOps, Hardware across a range of SoCs and a passion for anything Mathematics. Whether exploring in lab or coding late into the night, I'm excited to tackle any challenging projects.
              </p>
              <p className="text-muted-foreground">
              As an Electronics Major with a focus on Embedded Firmware, Machine Learning and IoT, I specialize in creating real-time, solutions for hardware and edge devices. I have experience in deploying machine learning models on microcontrollers and SBCs like Raspberry Pi, STM32 and ESP32 also Firmware and Middleware, optimizing them for low power and real-time performance. In addition to embedded, I am proficient in MLOps practices, ensuring scalable and reproducible ML workflows through tools such as Docker, GitHub Actions, and model versioning pipelines. 
              </p>
              <p className="text-muted-foreground">
              My academic and project work have also touched on areas like computer vision, signal processing, and hardware-software co-design, enabling me to bridge the gap between high-level ML models and low-level hardware constraints. I also work across the full machine learning lifecycle from data preprocessing and model training to compression, quantization, and deployment using frameworks like TensorFlow Lite, PyTorch, and ONNX. 
              </p>
              <p className="text-muted-foreground">
              My research interests lie at the intersection of LLMs, agentic AI systems, and RAG. I work with open-source models such as LLaMA, Mistral, Qwen, and Molmo, and have hands-on experience with agent frameworks like LangChain, AutoGen, and ModelScope-Agent. My research touches on model alignment, multi-agent collaboration, and deploying large models efficiently on constrained or embedded hardware drawing on insights from transformers, GANs, and embedded AI.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center space-y-10 md:pl-0"
            >
              <div className="relative h-56 w-56 rounded-lg overflow-hidden border-primary md:h-72 md:w-72 mb-10 mx-auto">
                <img
                  src="/images/abhi-about.jpg"
                  alt="Abhinav Kumar"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 max-w-md w-full mx-auto">
                <div>
                  <p className="font-medium text-sm text-muted-foreground/80">Name:</p>
                  <p className="text-base">Abhinav Kumar</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground/80">Major:</p>
                  <p className="text-base">Electrical & Electronics Engineering</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground/80">Location:</p>
                  <p className="text-base">Chennai, Tamil Nadu</p>
                </div>
                <div>
                  <p className="font-medium text-sm text-muted-foreground/80">Institute:</p>
                  <p className="text-base">VIT Chennai</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </StarfieldBackground>
  );
}

