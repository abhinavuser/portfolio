"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["armnn/tflite-delegate"];

export default function TFLiteDelegatePage() {
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
            The ArmNN library makes use of TFLite&apos;s experimental delegate to provide a bridge
            for Neural-Network models to run on the delegate device. The delegate consists of
            accelerated backends for the CPU (<code>CpuAcc</code>) and GPU (<code>GpuAcc</code>).
          </p>
          <p>
            These delegates can make use of the computation power available through various ARM
            technologies like NEON-SIMD, the GPU compute units, etc. It seems like the TFLite
            operations are transpiled into OpenCL kernels which are then run on the devices, as seen here:{" "}
            <a href="https://github.com/ARM-software/ComputeLibrary/tree/main/compute_kernel_writer" target="_blank" rel="noopener noreferrer">
              ComputeLibrary/compute_kernel_writer
            </a>
          </p>
          <p>
            Each backend has its own advantages and disadvantages. When limitations hit, the ArmNN
            library switches to using the <code>CpuRef</code> backend reliant on XNNPACK, so it
            ensures all sections of your model can run.
          </p>

          <h2 id="prerequisites">Prerequisites</h2>
          <p>This guide is in regards to running on any ARM64 Linux platform. Your system will need:</p>
          <ul>
            <li>The right Mali GPU libs (<code>libmali.so</code>)</li>
            <li>OpenCL compiler (<code>ocl-icd-opencl-dev</code>)</li>
            <li>Python3 and pip</li>
            <li>Python libraries (<code>numpy</code>, <code>cv2</code>, <code>pillow</code>, etc.)</li>
          </ul>
          <div className="not-prose">
            <Callout type="tip">
              Feel free to install the Python packages inside a virtual environment (<code>venv</code>),
              if you don&apos;t want to trash the system-installed packages.
            </Callout>
          </div>
          <p>You also need to install the <code>tflite_runtime</code>:</p>
          <pre><code className="language-bash">{`pip3 install --extra-index-url https://google-coral.github.io/py-repo/ tflite_runtime`}</code></pre>

          <h2 id="getting-armnn-delegate">Getting the ArmNN Delegate Libraries</h2>
          <p>Download the packages from the ArmNN GitHub releases and unpack them into a <code>libs</code> folder:</p>
          <pre><code className="language-bash">{`wget -O ArmNN-aarch64.tgz https://github.com/ARM-software/armnn/releases/download/v23.08/ArmNN-linux-aarch64.tar.gz
mkdir ArmNN-aarch64
tar -xvf ArmNN-aarch64.tgz -C libs`}</code></pre>
          <p>For the ArmNN runtime you only need two main library files:</p>
          <ul>
            <li><code>libarmnn.so</code></li>
            <li><code>libarmnnDelegate.so</code></li>
          </ul>
          <p>Inside the unpacked folder, these files are symlinks to the actual files:</p>
          <pre><code className="language-bash">{`libarmnn.so -> libarmnn.so.33
libarmnnDelegate.so -> libarmnnDelegate.so.29`}</code></pre>
          <p>
            When you run your Python program to leverage the delegates, make sure these files
            are in the same location as the code.
          </p>

          <h2 id="building-model">Building the Model</h2>
          <p>
            Let&apos;s use a CNN model that predicts digits from the popular MNIST dataset.
            Check out the example at{" "}
            <a href="https://github.com/sravansenthiln1/armnn_tflite/tree/main/digit_recognize" target="_blank" rel="noopener noreferrer">
              armnn_tflite/digit_recognize
            </a>
            , or use the{" "}
            <a href="https://github.com/sravansenthiln1/armnn_tflite/blob/main/digit_recognize/digit_recognize_28.tflite" target="_blank" rel="noopener noreferrer">
              pre-trained model
            </a>.
          </p>

          <h2 id="running-delegate">Running the Delegate</h2>
          <p>Let&apos;s run through the example script and see what each part does.</p>

          <h3 id="import-libraries">Import the Essential Libraries</h3>
          <pre><code className="language-python">{`import numpy as np
import tflite_runtime.interpreter as tflite
from PIL import Image`}</code></pre>

          <h3 id="define-file-paths">Define the File Paths</h3>
          <p>
            Define the backends. Using <code>CpuAcc</code> with <code>CpuRef</code> as fallback:
          </p>
          <pre><code className="language-python">{`BACKENDS = 'CpuAcc,CpuRef'`}</code></pre>
          <p>Set the path to the runtime delegate (POSIX relative paths):</p>
          <pre><code className="language-python">{`DELEGATE_PATH = "./libarmnnDelegate.so.29"`}</code></pre>
          <p>Set the path to the TFLite model:</p>
          <pre><code className="language-python">{`MODEL_PATH = "./digit_recognize_28.tflite"`}</code></pre>
          <p>Define the input image:</p>
          <pre><code className="language-python">{`IMAGE_PATH = "./digit7.png"`}</code></pre>

          <h3 id="create-image-object">Create the Image Object</h3>
          <p>
            Open the image, resize to 28×28, and convert to grayscale:
          </p>
          <pre><code className="language-python">{`img = Image.open(IMAGE_PATH).resize((28, 28))
img = img.convert("L")`}</code></pre>

          <h3 id="load-delegate">Load the Delegate and Create the Interpreter</h3>
          <pre><code className="language-python">{`armnn_delegate = tflite.load_delegate(
    library = DELEGATE_PATH,
    options = {
        "backends": BACKENDS,
        "logging-severity": "info"
    }
)

interpreter = tflite.Interpreter(
    model_path = MODEL_PATH,
    experimental_delegates = [armnn_delegate]
)

interpreter.allocate_tensors()`}</code></pre>

          <h3 id="input-output-params">Get the Input and Output Parameters</h3>
          <pre><code className="language-python">{`input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

input_type = input_details[0]['dtype']
output_type = output_details[0]['dtype']`}</code></pre>

          <h3 id="convert-input">Convert the Input Tensor Data</h3>
          <p>Convert the image to a NumPy array with the right dimensions:</p>
          <pre><code className="language-python">{`np_features = np.array(img)
np_features = np_features.astype(input_type)

# Shape: (28,28) -> (1, 28, 28)
np_features = np.expand_dims(np_features, axis=0)

# Shape: (1, 28, 28) -> (1, 28, 28, 1)
np_features = np.expand_dims(np_features, axis=-1)

print(np_features.shape)`}</code></pre>

          <h3 id="run-inference">Set the Inputs and Run Inference</h3>
          <pre><code className="language-python">{`interpreter.set_tensor(input_details[0]['index'], np_features)
interpreter.invoke()
output = interpreter.get_tensor(output_details[0]['index'])`}</code></pre>

          <h3 id="obtain-results">Obtain the Results</h3>
          <pre><code className="language-python">{`prediction = np.argmax(output.astype(output_type)[0])
print('Predicted digit: ', prediction)`}</code></pre>
          <div className="not-prose">
            <Callout type="info">
              Remember: the model, delegate library, and image files should all be in the same path as this script.
            </Callout>
          </div>

          <h2 id="example-run">Example Run</h2>
          <p>
            Here is an example running on the{" "}
            <a href="https://www.khadas.com/edge2" target="_blank" rel="noopener noreferrer">
              Khadas Edge2
            </a>:
          </p>
          <pre><code className="language-text">{`Info: ArmNN v33.0.0
arm_release_ver of this libmali is 'g6p0-01eac0', rk_so_ver is '6'.
Info: Initialization time: 6.06 ms.
INFO: TfLiteArmnnDelegate: Created TfLite ArmNN delegate.
Info: ArmnnSubgraph creation
Info: Parse nodes to ArmNN time: 0.09 ms
Info: Optimize ArmnnSubgraph time: 0.49 ms
Info: Load ArmnnSubgraph time: 0.28 ms
Info: Overall ArmnnSubgraph creation time: 0.97 ms

Info: Execution time: 0.51 ms.
Predicted digit: 7

Info: Shutdown time: 1.17 ms.`}</code></pre>
          <p>Not bad, the inference runs pretty fast.</p>

          <h2 id="notes">Notes</h2>
          <ul>
            <li>
              For the GPU, kernel compilation takes time, creating a &ldquo;long&rdquo; startup time before kernels can be executed.
            </li>
            <li>
              Certain operations aren&apos;t supported (e.g., &ldquo;fully connected&rdquo; / &ldquo;Dense&rdquo; layers). The workaround is that kernels are executed in runtime priority, so they always fall back to the <code>CpuRef</code> backend.
            </li>
            <li>
              For older OpenCL versions, mixed work group sizes are not supported, this is only addressable with CL Drivers 2.1 or newer.
            </li>
          </ul>
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
