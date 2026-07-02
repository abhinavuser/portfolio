"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["xiao-rtsp"];

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

          <h2 id="overview">Overview</h2>
          <p>
            The Seeed Studio XIAO ESP32S3 Sense is ridiculously small—barely larger than a thumb—yet it packs WiFi, BLE, a MicroSD slot, and an OV2640 camera module. I wanted to use it as a tiny hidden IP camera, and the easiest, most widely supported way to stream video over a local network is RTSP (Real Time Streaming Protocol).
          </p>

          <h2 id="config">Camera Config</h2>
          <p>
            The most annoying part of any ESP32 camera project is getting the pinout right. The XIAO has a custom camera board, so standard ESP32-CAM pinouts will not work and will crash the I2C bus. Here is the exact, tested config for the OV2640 on the XIAO:
          </p>
          <pre><code className="language-cpp">{`camera_config_t config;
config.ledc_channel = LEDC_CHANNEL_0;
config.ledc_timer = LEDC_TIMER_0;
config.pin_d0 = 15;
// ... (omitted for brevity)
config.pin_pclk = 13;
config.xclk_freq_hz = 20000000;
config.pixel_format = PIXFORMAT_JPEG;
config.frame_size = FRAMESIZE_VGA;
config.jpeg_quality = 10;
config.fb_count = 2; // dual buffering for smooth streaming`}</code></pre>

          <h2 id="streaming">Streaming</h2>
          <p>
            Once the camera is initialized and WiFi is connected (ideally with a static IP so you don't have to hunt for it), we instantiate the RTSP server on port 8554. In the main loop, we just grab frames and feed them into the broadcast buffer using the <code>Micro-RTSP</code> library.
          </p>
          <p>
            This board gets insanely hot. Pushing VGA frames at 20fps over WiFi continuously means the ESP32 is running near max power draw. If you enclose this in a 3D printed case without ventilation, it will thermal throttle or completely crash within 10 minutes. I recommend adding a tiny 10x10mm heatsink to the metal shield.
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
