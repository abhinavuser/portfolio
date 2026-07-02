"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["devices/stm"];

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
            The STM32F303K8 Nucleo-32 is a tiny, Arduino Nano-compatible development board featuring an ARM Cortex-M4F core. It is an excellent platform for learning bare-metal programming and real-time DSP due to its integrated FPU and fast ADCs.
          </p>
          <ul>
            <li><strong>Core:</strong> ARM Cortex-M4 with FPU @ 72MHz</li>
            <li><strong>Memory:</strong> 64KB Flash, 12KB SRAM, 4KB CCM SRAM</li>
            <li><strong>Analog:</strong> Two fast 12-bit ADCs (5 MSPS), three 12-bit DAC channels, four ultra-fast comparators</li>
            <li><strong>Timers:</strong> One high-resolution timer, several general-purpose 16-bit timers</li>
          </ul>

          <h2 id="memory">Memory Map</h2>
          <p>
            The memory architecture is split. Standard SRAM is mapped at <code>0x20000000</code>. However, there is 4KB of Core Coupled Memory (CCM) SRAM mapped at <code>0x10000000</code>. CCM is directly connected to the CPU instruction/data bus, bypassing the AHB matrix. This is incredibly useful for executing critical ISRs with zero wait states or storing the stack of high-priority RTOS tasks.
          </p>

          <h2 id="debugging">Debugging</h2>
          <p>
            The board includes an ST-LINK/V2-1 debugger on the top half of the PCB. This provides a virtual COM port and drag-and-drop programming. For bare-metal debugging, OpenOCD supports the <code>board/st_nucleo_f3.cfg</code> target flawlessly.
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
