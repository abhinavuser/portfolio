"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["devices/xiao"];

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
            The Seeed Studio XIAO ESP32S3 Sense is an ultra-small (21 x 17.5mm) development board based on the ESP32-S3 SoC. It integrates Wi-Fi and Bluetooth 5.0 LE, and uniquely comes with a plug-in camera module (OV2640) and digital microphone.
          </p>
          <ul>
            <li><strong>SoC:</strong> ESP32-S3R8 (Dual-core Xtensa 32-bit LX7 @ 240MHz)</li>
            <li><strong>Memory:</strong> 8MB PSRAM, 8MB Flash</li>
            <li><strong>Wireless:</strong> 2.4GHz Wi-Fi, BLE 5.0</li>
            <li><strong>Camera:</strong> OV2640 (1600x1200)</li>
            <li><strong>Mic:</strong> I2S Digital Microphone (MSM261D3526H1CPM)</li>
          </ul>

          <h2 id="camera">Camera Module</h2>
          <p>
            The camera module attaches via a proprietary B2B connector. The default camera is the OV2640, which supports JPEG output natively—a massive advantage for streaming over Wi-Fi, as the ESP32 doesn't need to encode raw RGB frames to JPEG in software.
          </p>

          <h2 id="quirks">Hardware Quirks</h2>
          <p>
            The biggest quirk is thermal throttling. The ESP32-S3 runs very hot when Wi-Fi and the camera are active simultaneously. There is no integrated heat spreader, meaning the SoC directly dumps heat into the tiny PCB. If used in a 3D-printed enclosure without ventilation, expect kernel panics and brownouts within 15-20 minutes of continuous load.
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
