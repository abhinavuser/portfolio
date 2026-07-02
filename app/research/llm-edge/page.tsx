"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["llm-edge"];

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

          <h2 id="quantization">W4A8 LLM Quantization</h2>
          <p>
            Running Large Language Models (LLMs) on edge NPUs requires extreme quantization to fit both the weights and the KV cache into constrained memory limits. In this research, we deployed a Llama-3-8B variant onto the Rockchip RK3588 (which features a 6 TOPS NPU and 8GB RAM).
          </p>
          <p>
            We utilized mixed precision quantization. The linear layer weights were reduced to 4-bit integer format (W4), while the activations were kept at 8-bit (A8). This W4A8 configuration successfully bypassed the memory bandwidth bottlenecks of the LPDDR4X interface.
          </p>

          <h2 id="npu">NPU Offloading</h2>
          <p>
            Not all transformer operations are heavily optimized for NPUs. Specifically, the softmax and rotary position embeddings (RoPE) were executed faster on the ARM Cortex-A76 cores using NEON intrinsics, while the dense matrix multiplications (GEMM) for the Attention and MLP blocks were offloaded to the NPU using Rockchip's custom compiler.
          </p>
          <pre><code className="language-python">{`# Example mapping logic for heterogeneous execution
for layer in model.layers:
    # Offload matrix multiplications to NPU
    npu_engine.bind(layer.attention.q_proj)
    npu_engine.bind(layer.attention.k_proj)
    npu_engine.bind(layer.mlp.gate_proj)
    
    # Keep RoPE on CPU due to lack of native NPU sin/cos support
    cpu_engine.bind(layer.attention.apply_rotary_emb)`}</code></pre>

          <h2 id="performance">Performance Results</h2>
          <p>
            The resulting pipeline achieved a sustained generation speed of <strong>11.4 tokens per second</strong> at an active power draw of just 6.2 Watts. This proves that edge devices can host fully capable LLMs without cloud dependencies, enabling completely private local assistants.
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
