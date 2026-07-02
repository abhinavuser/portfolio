"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["cyberfin"];

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
            CyberFin Nexus is a privacy-first platform that fuses cyber threat telemetry with financial transactions to detect money mule rings and sophisticated fraud. Traditional fraud detection relies heavily on isolated tabular data (amounts, locations, times). By representing accounts, devices, and transactions as a heterogeneous graph, we can trace the actual flow of risk across the network.
          </p>

          <h2 id="gat">Graph Attention Networks</h2>
          <p>
            The core model utilizes Graph Attention Networks (GATs). Unlike standard Graph Convolutional Networks (GCNs) which weight all neighbor nodes equally, GATs use masked self-attention to assign different importances to different neighbors. If an account interacts with a known malicious device, the attention mechanism heavily weighs that edge during the feature aggregation step.
          </p>
          <pre><code className="language-python">{`import torch
import torch.nn as nn
import torch_geometric.nn as pyg_nn

class FraudGAT(nn.Module):
    def __init__(self, in_channels, hidden_channels, out_channels, heads=4):
        super().__init__()
        self.conv1 = pyg_nn.GATConv(in_channels, hidden_channels, heads=heads)
        self.conv2 = pyg_nn.GATConv(hidden_channels * heads, out_channels, heads=1)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index)
        x = torch.relu(x)
        x = self.conv2(x, edge_index)
        return x`}</code></pre>

          <h2 id="fl">Federated Learning Engine</h2>
          <p>
            Financial institutions cannot legally share raw transaction data due to strict privacy regulations (GDPR, CCPA). CyberFin Nexus implements a Federated Learning (FL) engine. Each institution trains the GAT model locally on their isolated graph. Only the model weights (gradients) are securely aggregated via a central server using Secure Multi-Party Computation (SMPC). This allows banks to cooperatively detect cross-institution mule rings without exposing PII.
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
