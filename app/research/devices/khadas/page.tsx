"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["devices/khadas"];

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
            The Khadas Edge2 is a premium, ultra-thin ARM single-board computer based on the Rockchip RK3588S. It is designed for edge AI and maker projects requiring desktop-class performance in a credit-card form factor.
          </p>
          <ul>
            <li><strong>SoC:</strong> Rockchip RK3588S (Quad A76 @ 2.25GHz + Quad A55 @ 1.8GHz)</li>
            <li><strong>NPU:</strong> 6 TOPS Neural Processing Unit</li>
            <li><strong>RAM:</strong> 8GB or 16GB LPDDR4x</li>
            <li><strong>Storage:</strong> 32GB or 64GB eMMC 5.1</li>
            <li><strong>Display:</strong> HDMI 2.1 (8K@60fps), USB-C DP, MIPI-DSI</li>
          </ul>

          <h2 id="npu">RKNN NPU</h2>
          <p>
            The standout feature is the 6 TOPS NPU. Unlike the Google Coral, which is locked to an older TF version and mostly abandoned, the Rockchip NPU is actively supported via the RKNN2 toolkit. You must convert standard ONNX or TFLite models to the proprietary <code>.rknn</code> format using an x86 Linux machine first, after which they can be loaded onto the Edge2 for execution.
          </p>

          <h2 id="linux">Linux Support</h2>
          <p>
            Khadas provides excellent official Ubuntu (OOWOW system) images. The Panfrost open-source GPU drivers are maturing rapidly, though for NPU and hardware video decoding (VPU), you are still heavily reliant on Rockchip's proprietary binary blobs (MPP and RGA libraries).
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
