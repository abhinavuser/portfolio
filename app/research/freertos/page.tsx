"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["freertos"];

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

          <h2 id="why">Why Bare-Metal?</h2>
          <p>
            CubeMX is a code generation tool. You pick your chip, configure peripherals in a GUI, and it spits out a project. Fast to start, genuinely useful for complex peripheral setups, and it produces correct code.
          </p>
          <p>But it generates these files silently:</p>
          <ul>
            <li><code>startup_stm32f303x8.s</code> — assembly that runs before your main()</li>
            <li><code>STM32F303K8_FLASH.ld</code> — the linker script that tells gcc where flash and ram are</li>
            <li><code>system_stm32f3xx.c</code> — clock initialisation</li>
            <li><code>FreeRTOSConfig.h</code> — every single RTOS behavioural parameter</li>
            <li>the entire makefile / cmake setup</li>
          </ul>
          <p>
            When you don't write these yourself, you don't know what they do. And when something goes wrong at the hardware level — wrong interrupt priority, stack overflow, hard fault on scheduler start — you're debugging files you've never read. Not a great place to be. Doing it manually means you own every file.
          </p>

          <h2 id="setup">Project Setup</h2>
          <p>
            The CPU jumps to an address it reads from the <strong>vector table</strong> — a table of function pointers at the very start of flash. The reset handler does three things before calling your code:
          </p>
          <ol>
            <li>copies .data from flash to ram</li>
            <li>zeroes out .bss</li>
            <li>calls SystemInit() then main()</li>
          </ol>
          <p>
            Instead of writing raw pointers like <code>*((volatile uint32_t*)0x48000400) |= (1 &lt;&lt; 6);</code>, you write <code>GPIOB-&gt;MODER |= (1 &lt;&lt; 6);</code> using the standard CMSIS headers.
          </p>

          <h2 id="kernel">The Kernel</h2>
          <p>
            FreeRTOS uses three ARM exceptions to implement its scheduler. Without mapping them, the scheduler starts and hard faults immediately:
          </p>
          <pre><code className="language-c">{`#define vPortSVCHandler     SVC_Handler
#define xPortPendSVHandler  PendSV_Handler
#define xPortSysTickHandler SysTick_Handler`}</code></pre>
          <p>
            Everything is available at my GitHub repository. Do it the hard way once, then CubeMX makes sense, because you know what it's generating.
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
