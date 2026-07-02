"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["toy-nn"];

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

          <h2 id="architecture">Architecture</h2>
          <p>
            After spending months working with TFLite, RKNN, and ArmNN runtimes, I wanted to understand what actually goes on under the hood. The goal wasn't to compete with production tools, it was purely to understand memory management, operator dispatching, tensor layout, and graph execution.
          </p>
          <p>I designed a simple three-layer architecture to keep the abstraction clean:</p>
          <ol>
            <li><strong>Graph Parser</strong>: reads a simplified JSON model format that describes the node connections and weights.</li>
            <li><strong>Operator Registry</strong>: a mapping system (using function pointers and polymorphism) to route operators like <code>Conv2D</code> to their C++ implementations.</li>
            <li><strong>Executor</strong>: walks the graph in topological order, allocates memory, and dispatches the math.</li>
          </ol>

          <h2 id="tensor">Tensor Class</h2>
          <p>
            The tensor class is the heart of any runtime. Memory layout (NCHW vs NHWC) has a massive impact on cache performance. I implemented a basic N-dimensional tensor tracking its shape dynamically:
          </p>
          <pre><code className="language-cpp">{`template<typename T>
class Tensor {
public:
    Tensor(std::vector<int> shape) : shape_(shape) {
        size_t total = 1;
        for (int dim : shape) total *= dim;
        data_.resize(total);
    }
    T& at(std::vector<int> indices) {
        return data_[flatten(indices)];
    }
private:
    std::vector<T> data_;
    std::vector<int> shape_;
    // ... flattening logic
};`}</code></pre>

          <h2 id="execution">Execution</h2>
          <p>
            Allocating and freeing vectors dynamically on every inference step destroys performance. To fix this, I implemented a basic arena allocator. The runtime pre-calculates the maximum memory required for any two layers during the topological sort, allocates one huge buffer, and ping-pongs between offsets during execution.
          </p>
          <p>
            It successfully ran a simple MNIST classifier. Performance was about 100x slower than TFLite because I didn't use SIMD instructions or thread pools, but seeing the raw floating-point math work end-to-end taught me more about machine learning than any high-level Keras tutorial ever did.
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
