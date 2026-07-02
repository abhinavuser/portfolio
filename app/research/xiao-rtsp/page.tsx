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
            The Seeed Studio XIAO ESP32S3 Sense is ridiculously small (barely larger than a thumb) yet it packs WiFi, BLE, a MicroSD slot, and an OV2640 camera module. I wanted to use it as a tiny hidden IP camera, and the easiest, most widely supported way to stream video over a local network is RTSP (Real Time Streaming Protocol). Any VLC client on any device can connect to it without special apps.
          </p>
          <p>
            This board is also the same one I used for the <a href="https://github.com/abhinavuser/fusion_algorithm" target="_blank" rel="noopener noreferrer">Fusion Algorithm</a> project where I run exposure fusion directly on the ESP32-S3. The RTSP streaming work here was really the foundation for understanding the camera pipeline on this chip before doing any image processing on it.
          </p>

          <h2 id="config">Camera Config</h2>
          <p>
            The most annoying part of any ESP32 camera project is getting the pinout right. The XIAO has a custom camera board connected via a proprietary B2B connector, so standard ESP32-CAM pinouts (like the AI-Thinker board) will not work and will crash the I2C bus. Here is the exact, tested config for the OV2640 on the XIAO:
          </p>
          <pre><code className="language-cpp">{`camera_config_t config;
config.ledc_channel = LEDC_CHANNEL_0;
config.ledc_timer = LEDC_TIMER_0;
config.pin_d0 = 15;
config.pin_d1 = 17;
config.pin_d2 = 18;
config.pin_d3 = 16;
config.pin_d4 = 14;
config.pin_d5 = 12;
config.pin_d6 = 11;
config.pin_d7 = 48;
config.pin_xclk = 10;
config.pin_pclk = 13;
config.pin_vsync = 38;
config.pin_href = 47;
config.pin_sccb_sda = 40;   // I2C data
config.pin_sccb_scl = 39;   // I2C clock
config.pin_pwdn = -1;       // not connected
config.pin_reset = -1;      // not connected
config.xclk_freq_hz = 20000000;
config.pixel_format = PIXFORMAT_JPEG;
config.frame_size = FRAMESIZE_VGA;
config.jpeg_quality = 10;   // 0-63, lower = better quality
config.fb_count = 2;        // dual buffering for smooth streaming`}</code></pre>
          <p>
            The dual frame buffer (<code>fb_count = 2</code>) is important. Without it, the camera driver has to wait for the current frame to be consumed before capturing the next one, which cuts your effective framerate roughly in half. With dual buffering, the camera writes to buffer A while the RTSP server reads from buffer B, then they swap.
          </p>
          <p>
            The JPEG quality setting at 10 gives a good balance between image quality and frame size. Going lower (better quality) produces frames too large for the ESP32's WiFi stack to push at reasonable framerates. Going higher (worse quality) makes the stream look bad. VGA at quality 10 produces frames around 20-30KB each, which the WiFi can push at roughly 15-20fps.
          </p>

          <h2 id="streaming">Streaming</h2>
          <p>
            Once the camera is initialized and WiFi is connected (use a static IP so you don't have to hunt for it on your router), we instantiate the RTSP server on port 8554. In the main loop, we grab frames from the camera buffer and feed them into the broadcast using the <code>Micro-RTSP</code> library. On the client side you just open VLC and point it at <code>rtsp://192.168.x.x:8554/mjpeg/1</code>.
          </p>
          <pre><code className="language-cpp">{`WiFi.begin(SSID, PASSWORD);
WiFi.config(IPAddress(192, 168, 1, 50), gateway, subnet);

OV2640 cam;
cam.init(config);

WiFiServer rtspServer(8554);
rtspServer.begin();
CStreamer *streamer = nullptr;

void loop() {
    if (!streamer) {
        WiFiClient client = rtspServer.accept();
        if (client) {
            streamer = new CRtspSession(client, &cam);
        }
    }
    if (streamer) {
        streamer->handleRequests(0);
        streamer->broadcastCurrentFrame(millis());
    }
}`}</code></pre>

          <h2 id="thermal">Thermal Issues</h2>
          <p>
            This board gets insanely hot. Pushing VGA frames at 15-20fps over WiFi continuously means the ESP32-S3 is running near max power draw on both the camera interface and the WiFi radio simultaneously. The SoC has no heatsink or heat spreader, so all that thermal energy dumps directly into the tiny PCB.
          </p>
          <p>
            If you enclose this in a 3D printed case without ventilation, it will thermal throttle or completely crash within 10-15 minutes. I found that sticking a small 10x10mm aluminum heatsink directly onto the metal RF shield gets the temperature down enough for continuous operation. For longer sessions (like using it as a security camera), active airflow or a larger enclosure with ventilation holes is necessary.
          </p>
          <p>
            Reducing the resolution from VGA to QVGA and dropping the quality to 15 significantly reduces power consumption and heat, at the cost of a noticeably grainier stream. For most surveillance use cases this tradeoff is worth it since you mainly need to see movement, not read fine text.
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
