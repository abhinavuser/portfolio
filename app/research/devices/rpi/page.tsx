"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["devices/rpi"];

export default function ResearchContentPage() {
  if (!page) return <div>Page not found</div>;

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
          className="pb-48"
        >
          <h1>{page.title}</h1>

          <h2 id="specs">Specifications</h2>
          <p>
            The Raspberry Pi 4 Model B represents a massive architectural leap over the Pi 3, moving to a modern Cortex-A72 architecture and introducing PCIe (albeit internally) for full-throughput USB 3.0 and Gigabit Ethernet.
          </p>
          <ul>
            <li><strong>SoC:</strong> Broadcom BCM2711 (Quad-core Cortex-A72 @ 1.5GHz/1.8GHz)</li>
            <li><strong>RAM:</strong> 2GB, 4GB, or 8GB LPDDR4-3200</li>
            <li><strong>Networking:</strong> True Gigabit Ethernet, Dual-band 802.11ac Wi-Fi, BT 5.0</li>
            <li><strong>IO:</strong> 2x USB 3.0, 2x USB 2.0, 40-pin GPIO</li>
          </ul>

          <h2 id="ai">AI Acceleration</h2>
          <p>
            While the Pi 4 lacks a dedicated NPU, the Cortex-A72 cores implement the ARMv8-A architecture, which includes NEON SIMD instructions. Using TFLite with the XNNPACK delegate, the Pi 4 can run lightweight CNNs (like MobileNetV2) and 1D CNNs for sensor processing at impressive speeds (often &lt;10ms per inference).
          </p>

          <h2 id="power">Power & Thermals</h2>
          <p>
            The BCM2711 runs extremely hot. Without a heatsink, the CPU will thermal throttle (reduce clock speed from 1.5GHz to 1.0GHz or lower) at 80°C under sustained load. A passive aluminum case (like the Flirc case) or a small active fan is practically mandatory for ML workloads. Power delivery requires a 5V 3A USB-C supply; cheap cables will cause severe voltage drops and trigger the under-voltage warning (lightning bolt icon).
          </p>
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
