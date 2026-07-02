"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["rknn/tflite-models"];

export default function RKNNTFLiteModelsPage() {
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
          
          <h2 id="introduction">Introduction</h2>
          <p>
            Once you have converted your TFLite model using the RKNN toolkit, you can run inference natively on Rockchip boards like the RK3588.
          </p>

          <h2 id="running-model">Running the Model</h2>
          <p>We use the <code>rknn.api</code> package on the target device.</p>
          
          <h3 id="import-libraries">Import Libraries</h3>
          <pre><code className="language-python">{`import cv2
import numpy as np
from rknnlite.api import RKNNLite`}</code></pre>

          <h3 id="define-paths">Define Paths</h3>
          <pre><code className="language-python">{`MODEL_PATH = 'converted_model.rknn'
IMG_PATH = 'test_image.jpg'`}</code></pre>

          <h3 id="create-image">Create Image Object</h3>
          <pre><code className="language-python">{`img = cv2.imread(IMG_PATH)
img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
img = np.expand_dims(img, 0)`}</code></pre>

          <h3 id="create-rknn">Create RKNN Object</h3>
          <pre><code className="language-python">{`rknn = RKNNLite()
rknn.load_rknn(MODEL_PATH)
rknn.init_runtime(core_mask=RKNNLite.NPU_CORE_0)`}</code></pre>

          <h3 id="run-inference">Run Inference</h3>
          <pre><code className="language-python">{`outputs = rknn.inference(inputs=[img])`}</code></pre>

          <h3 id="get-results">Get Results</h3>
          <pre><code className="language-python">{`print("Inference results:", outputs[0])`}</code></pre>

          <h2 id="example-run">Example Run</h2>
          <p>The inference should take ~3-4ms on the RK3588's 6 TOPS NPU, vastly outperforming CPU inference.</p>
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
