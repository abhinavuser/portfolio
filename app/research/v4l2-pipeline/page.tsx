"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["v4l2-pipeline"];

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

          <h2 id="zero-copy">Zero-Copy Memory Paradigms</h2>
          <p>
            In embedded computer vision applications, memory copying is often the silent killer of framerates. Moving a 1080p frame from the camera interface to main memory, then to the NPU for inference, and finally to the GPU for rendering will completely saturate the memory bus on an SoC like the Raspberry Pi or Khadas Edge2. Each copy of a 1920x1080 RGB frame is about 6MB, and doing that 3 times at 30fps means you're pushing over 500MB/s just in copies alone. On LPDDR4 with a shared bus, that does not leave much bandwidth for actual computation.
          </p>
          <p>
            I initially ran into this problem while working on the <a href="https://github.com/abhinavuser/fusion_algorithm" target="_blank" rel="noopener noreferrer">Fusion Algorithm</a> project. On the ESP32 it was not as bad because we were working with tiny 160x120 frames, but when I moved to Linux SBCs for higher-resolution work, the copy overhead became the dominant bottleneck. That is what led me down the V4L2 DMA-BUF rabbit hole.
          </p>

          <h2 id="v4l2">V4L2 Capture</h2>
          <p>
            Video4Linux2 (V4L2) is the Linux kernel's camera capture API. You open /dev/video0, request a set of buffers in a specific format (YUYV, NV12, MJPEG, etc.), queue them to the driver, start streaming, and then dequeue filled buffers as frames arrive from the camera ISP. The standard way is MMAP: the driver allocates kernel-side buffers and you mmap() them into userspace. This works fine but the data lives in kernel-managed pages that cannot be directly shared with other subsystems (like the NPU driver or GPU EGL context) without copying.
          </p>
          <pre><code className="language-c">{`struct v4l2_requestbuffers reqbuf;
memset(&reqbuf, 0, sizeof(reqbuf));
reqbuf.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
reqbuf.memory = V4L2_MEMORY_DMABUF;  // request DMA-capable buffers
reqbuf.count = 4;

ioctl(camera_fd, VIDIOC_REQBUFS, &reqbuf);`}</code></pre>
          <p>
            The key difference is <code>V4L2_MEMORY_DMABUF</code> instead of <code>V4L2_MEMORY_MMAP</code>. With DMABUF, the driver allocates buffers from the CMA (Contiguous Memory Allocator) pool, which are physically contiguous and can be exported as file descriptors using <code>VIDIOC_EXPBUF</code>.
          </p>

          <h2 id="dma">DMA-BUF File Descriptors</h2>
          <p>
            The exported file descriptor is the magic. It represents a handle to a physically contiguous block of memory that any driver in the system can import. So instead of copying pixels from the camera buffer into a new allocation for the NPU, you just pass the file descriptor:
          </p>
          <pre><code className="language-c">{`struct v4l2_exportbuffer expbuf;
memset(&expbuf, 0, sizeof(expbuf));
expbuf.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
expbuf.index = buffer_index;

// Export the camera buffer as a DMA file descriptor
if (ioctl(camera_fd, VIDIOC_EXPBUF, &expbuf) == -1) {
    perror("VIDIOC_EXPBUF failed");
}

// Pass this fd directly to the NPU backend
// No memcpy, no buffer allocation, just a file descriptor
npu_set_input_dma(npu_context, expbuf.fd);

// For GPU rendering, import into EGL
EGLImageKHR egl_img = eglCreateImageKHR(
    egl_display, EGL_NO_CONTEXT,
    EGL_LINUX_DMA_BUF_EXT, NULL, attribs
);`}</code></pre>
          <p>
            The camera writes pixels into the buffer. The NPU reads from the same physical memory. The GPU reads from the same physical memory for display. At no point does the CPU touch the pixel data. The CPU only shuffles around file descriptors and ioctl calls, which are tiny compared to 6MB frame copies.
          </p>

          <h2 id="pipeline">Full Pipeline Architecture</h2>
          <p>
            The complete pipeline looks like this: V4L2 captures into a DMA-BUF buffer, the RKNN NPU imports that buffer for inference (object detection in my case), and the Mali GPU imports the same buffer via EGL for overlay rendering. The only CPU work is the control plane: queueing and dequeueing V4L2 buffers, starting the NPU job, reading the NPU output bounding boxes, and drawing overlay rectangles in the EGL context.
          </p>
          <p>
            There is one important caveat. The CMA pool has to be large enough to hold all your buffers. On the Khadas Edge2 the default CMA allocation is 64MB, which is plenty for 4 buffers at 1080p NV12 (about 3MB each). On the Raspberry Pi 4 the default is smaller and you might need to increase it in the device tree or kernel cmdline (<code>cma=128M</code>).
          </p>

          <h2 id="latency">Latency Results</h2>
          <p>
            By mapping the V4L2 buffers as <code>dma_buf</code> and importing them into the EGL image extension for the GPU, we bypassed CPU-space memcpy entirely. The end-to-end latency from photon hitting the sensor to a prediction overlaid on screen decreased from <strong>85ms to 24ms</strong> on the Khadas Edge2, allowing real-time 40fps inference with GPU overlay on 1080p frames.
          </p>
          <p>
            On the Raspberry Pi 4B (which lacks an NPU, so inference ran on the CPU with TFLite XNNPACK), the zero-copy pipeline still helped significantly because it freed up memory bandwidth for the CPU inference workload. Latency dropped from 120ms to about 65ms. Still not as fast as the Edge2 with its dedicated NPU, but a 2x improvement just from eliminating copies is nothing to ignore.
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
