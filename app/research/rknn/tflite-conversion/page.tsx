"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["rknn/tflite-conversion"];

export default function TFLiteConversionPage() {
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
        >
          <h1>{page.title}</h1>

          <h2 id="introduction">Introduction</h2>
          <p>
            RKNN2 is Rockchip&apos;s software suite to utilize the NPU on their new device
            platforms like the RK3588 and RK3566. The NPU doesn&apos;t directly run models
            as-is, you need to convert them into the custom <code>.rknn</code> format.
          </p>
          <p>
            The RKNN-Toolkit2 lets you analyze, quantize, convert, and see how the model
            would run on the NPU layer-wise.
          </p>

          <h2 id="prerequisites">Prerequisites</h2>
          <p>This guide targets the following platforms:</p>
          <ul>
            <li>RK3566 / RK3568 (1.0 TOPs NPU)</li>
            <li>RK3588 / RK3588S (6.0 TOPs NPU)</li>
          </ul>
          <p>The platform should be running 64-bit Linux firmware.</p>

          <p><strong>To convert models, you need:</strong></p>
          <ul>
            <li>A x86/64 machine, running Ubuntu 22.04/20.04/18.04</li>
            <li>Python3 and pip</li>
            <li>Python libraries (<code>rknn_toolkit2</code>, etc.)</li>
          </ul>
          <div className="not-prose">
            <Callout type="tip">
              Feel free to install the Python packages inside a virtual environment (<code>venv</code>).
            </Callout>
          </div>

          <p><strong>To run models on the target board, you need:</strong></p>
          <ul>
            <li>Python3 and pip</li>
            <li>Python libraries (<code>rknn_toolkit_lite2</code>, <code>numpy</code>, <code>cv2</code>, <code>pillow</code>)</li>
            <li>The right RKNN libs (<code>librknnrt.so</code>)</li>
          </ul>

          <h3 id="install-pip">Install pip</h3>
          <pre><code className="language-bash">{`sudo apt-get install python3-pip`}</code></pre>

          <h3 id="clone-examples">Set up Workspace</h3>
          <pre><code className="language-bash">{`mkdir rknn_workspace
cd rknn_workspace`}</code></pre>

          <h3 id="get-npu-tools">Get the Rockchip NPU Tools</h3>
          <pre><code className="language-bash">{`git clone https://github.com/rockchip-linux/rknn-toolkit2
cd rknn-toolkit2
git checkout b25dadacc24b88eb7dfcaa47c9c525ecca89b319`}</code></pre>

          <h3 id="find-python-version">Find the Appropriate Python Version</h3>
          <pre><code className="language-bash">{`python3 --version`}</code></pre>
          <p>Then set the version variable accordingly:</p>
          <pre><code className="language-bash">{`version=cp311  # for Python 3.11
version=cp310  # for Python 3.10
version=cp39   # for Python 3.9
# etc.`}</code></pre>

          <h3 id="install-toolkit">Install the Requirements and the Toolkit</h3>
          <pre><code className="language-bash">{`pip3 install -r rknn-toolkit2/packages/requirements_$version-*.txt
pip3 install rknn-toolkit2/packages/rknn_toolkit2-*-$version-$version-linux_x86_64.whl
cd ../`}</code></pre>

          <h3 id="downloading-script">Conversion Script</h3>
          <p>Create a python script named <code>convert.py</code> in your workspace.</p>

          <h3 id="convert-model">Convert the Model</h3>
          <p>To convert a file such as <code>model.tflite</code>:</p>
          <pre><code className="language-bash">{`python3 convert.py model`}</code></pre>
          <p>
            Once converted, copy the <code>model.rknn</code> file to your board.
            You can modify the optimization and target platform variables:
          </p>
          <pre><code className="language-python">{`rknn.config(target_platform='rk3588s', optimization_level=0)`}</code></pre>
          <p>
            The <code>target_platform</code> is your device SoC (<code>rk3588</code>, <code>rk3566</code>, <code>rv1103</code>, etc.).
            The <code>optimization_level</code> ranges from <code>0</code> (as-is) to <code>2</code> (maximum quantization).
          </p>

          <hr />

          <h2 id="target-setup">Target Board Setup</h2>

          <h3 id="install-pip-target">Install pip</h3>
          <pre><code className="language-bash">{`sudo apt-get install python3-pip`}</code></pre>

          <h3 id="install-python-packages">Install the Necessary Python Packages</h3>
          <pre><code className="language-bash">{`pip3 install numpy pillow opencv-python librosa sounddevice`}</code></pre>

          <h3 id="get-npu-tools-target">Get the Rockchip NPU Tools</h3>
          <pre><code className="language-bash">{`git clone https://github.com/rockchip-linux/rknn-toolkit2
cd rknn-toolkit2
git checkout b25dadacc24b88eb7dfcaa47c9c525ecca89b319`}</code></pre>

          <h3 id="find-python-version-target">Find the System Python Version</h3>
          <pre><code className="language-bash">{`python3 --version`}</code></pre>

          <h3 id="install-toolkit-wheel">Install the Appropriate Toolkit Wheel</h3>
          <pre><code className="language-bash">{`pip3 install rknn_toolkit_lite2/packages/rknn_toolkit_lite2-*-$version-$version-linux_aarch64.whl`}</code></pre>

          <h3 id="copy-runtime">Copy the Runtime Library</h3>
          <pre><code className="language-bash">{`sudo cp rknpu2/runtime/Linux/librknn_api/aarch64/librknnrt.so /usr/lib/
cd ../`}</code></pre>
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
