"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["1d-cnn"];

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

          <h2 id="context">Context</h2>
          <p>
            When people talk about Convolutional Neural Networks (CNNs), they almost always mean 2D CNNs processing images (like classifying cats vs dogs). But CNNs are mathematically just sliding filters. If you use a 1-dimensional filter, they become incredibly powerful tools for time-series data—accelerometers, gyroscopes, audio waveforms, or ECG signals. 1D CNNs are significantly lighter, faster, and often more robust than recurrent networks like LSTMs.
          </p>

          <h2 id="training">Training</h2>
          <p>
            Training is done offline on a PC using Keras. It looks remarkably similar to an image model, just with <code>Conv1D</code> instead of <code>Conv2D</code>.
          </p>
          <pre><code className="language-python">{`from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv1D, MaxPooling1D, Flatten, Dense

model = Sequential([
    Conv1D(filters=32, kernel_size=5, activation='relu', input_shape=(200, 3)),
    MaxPooling1D(pool_size=2),
    Conv1D(filters=64, kernel_size=3, activation='relu'),
    MaxPooling1D(pool_size=2),
    Flatten(),
    Dense(64, activation='relu'),
    Dense(num_classes, activation='softmax')
])`}</code></pre>

          <h2 id="deployment">Deployment</h2>
          <p>
            The trick to real-time embedded AI is making sure your inference doesn't block your sensor reading. If inference takes 5ms, and you read sensors in the same loop, your sensor timing will jitter. I used Python's <code>threading</code> module: one thread constantly reads the I2C sensor into a circular buffer, and the main thread periodically grabs a copy of that buffer to run inference.
          </p>
          <p>
            On the Raspberry Pi 4B CPU, a forward pass of this model takes roughly 1.5 milliseconds. This means you can comfortably classify high-frequency machinery vibrations or gestures hundreds of times per second with virtually zero CPU load.
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
