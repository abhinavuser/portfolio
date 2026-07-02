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

          <h2 id="problem">The SOC-AML Problem</h2>
          <p>
            Banks run two completely separate teams for catching fraud. The SOC (Security Operations Center) handles cyber threats like phishing and credential stuffing, and the AML (Anti-Money Laundering) team watches transaction patterns for structuring and velocity abuse. Neither team talks to each other in real time, so when a compromised account starts moving money through a mule ring, neither side has the full picture until it is way too late.
          </p>
          <p>
            On top of that, GDPR and India's DPDP Act make it illegal for banks to share raw transaction data with each other. So even if Bank A catches a mule account, Bank B has no way of knowing that the same person has an account there too. CyberFin Nexus was built to solve both of these problems at once.
          </p>

          <h2 id="architecture">Architecture</h2>
          <p>
            The core idea is to represent everything as a heterogeneous graph. Accounts, devices, IP addresses, and transactions all become nodes. Edges represent relationships like "logged in from", "sent money to", or "shares device fingerprint with". This lets us see connections that tabular data simply cannot reveal. A mule ring that routes money through five accounts across two banks looks normal in a spreadsheet. On a graph, it is a very obvious star pattern.
          </p>
          <p>
            The system is split into four main components. The signal fusion layer merges raw cyber logs (device fingerprints, login anomalies, phishing flags) with financial transaction records into a unified 8-dimensional feature vector per node. The GAT model then propagates risk through the graph. The federated learning engine handles cross-bank training without sharing raw data. And the audit trail records every single decision for regulatory forensics.
          </p>
          <Callout type="tip">
            The full codebase is on GitHub at <a href="https://github.com/abhinavuser/cyberfin-nexus" target="_blank" rel="noopener noreferrer">abhinavuser/cyberfin-nexus</a>.
          </Callout>

          <h2 id="gat">Graph Attention Networks</h2>
          <p>
            Standard Graph Convolutional Networks (GCNs) treat all neighbor nodes equally during message passing. For fraud detection this is a problem because not all connections carry the same risk. If an account shares a device with a known malicious endpoint, that edge should matter far more than a legitimate payroll transfer.
          </p>
          <p>
            GATs fix this with masked self-attention. During the feature aggregation step, the model learns attention coefficients for each edge, so it can dynamically weight high-risk connections higher. We used a 3-layer GAT with 4 attention heads for the first two layers and a single head on the output layer. The input features are 8-dimensional vectors encoding things like transaction velocity, average amount, device trust score, login frequency, and known cyber event flags.
          </p>
          <pre><code className="language-python">{`import torch
import torch.nn as nn
import torch_geometric.nn as pyg_nn

class FraudGAT(nn.Module):
    def __init__(self, in_channels, hidden_channels, out_channels, heads=4):
        super().__init__()
        self.conv1 = pyg_nn.GATConv(in_channels, hidden_channels, heads=heads)
        self.conv2 = pyg_nn.GATConv(hidden_channels * heads, hidden_channels, heads=heads)
        self.conv3 = pyg_nn.GATConv(hidden_channels * heads, out_channels, heads=1)

    def forward(self, x, edge_index):
        x = torch.relu(self.conv1(x, edge_index))
        x = torch.relu(self.conv2(x, edge_index))
        x = self.conv3(x, edge_index)
        return x`}</code></pre>

          <h2 id="fl">Federated Learning Engine</h2>
          <p>
            Financial institutions cannot legally share raw transaction data. Full stop. But they can share model weights. CyberFin implements federated learning where each bank trains the GAT model locally on their own isolated graph. After each training round, only the model gradients are sent to a central aggregation server that uses Federated Averaging (FedAvg) to combine them.
          </p>
          <p>
            To add another layer of privacy, we inject calibrated Gaussian noise (differential privacy with epsilon=1.0) into the gradients before they leave the bank. This mathematically guarantees that no individual transaction can be reverse-engineered from the shared weights, even by a malicious aggregation server.
          </p>
          <p>
            In our tests with 5 simulated banks, the federated model achieved an AUC of around 0.88, which is lower than the centralized version (0.965) but still very effective, and it is legally deployable in production, which the centralized version is not.
          </p>

          <h2 id="adversarial">Adversarial RL Simulation</h2>
          <p>
            Static fraud models degrade fast because attackers adapt. If you start flagging high-velocity transfers, the mule ring just slows down. If you flag large amounts, they split into smaller ones. To keep up with this, CyberFin includes a reinforcement learning agent that acts as an adversary.
          </p>
          <p>
            The RL agent learns to generate synthetic mule ring patterns that evade the current GAT model. It has access to three strategy levers: velocity adjustment (slowing down transfer frequency), amount splitting (breaking large transfers into many small ones), and device rotation (cycling through different login devices). After each round of adversarial generation, the GAT is retrained on the new evasion patterns, creating a feedback loop where the detector keeps improving alongside the attacker.
          </p>
          <p>
            This is not purely theoretical. We ran 10 rounds of adversarial training and the model's resilience score (measured as detection rate against novel evasion tactics) stabilized at around 0.90, meaning it maintained 90% detection even against tactics it had never seen during initial training.
          </p>

          <h2 id="dashboard">Dashboard and Audit Trail</h2>
          <p>
            The whole thing runs behind a 7-tab Streamlit dashboard. The main tabs are: real-time risk overview with a live threat heatmap, the interactive graph explorer where you can click on nodes and trace mule chains, federated training monitor showing per-bank convergence, adversarial simulation controls, a full audit log browser, and the regulatory export panel.
          </p>
          <p>
            Every single decision the model makes (flagging an account, raising a risk score, triggering an alert) gets logged to an immutable SHA-256 hash chain. Each entry contains a timestamp, the decision payload, and the hash of the previous entry, so any tampering is immediately detectable. This is not a full blockchain with consensus, but for internal forensic purposes it provides the same tamper-evidence guarantees that regulators require.
          </p>

          <h2 id="results">Results</h2>
          <p>
            On the centralized model (single-bank evaluation): we hit an AUC of 0.983 with 76% precision and 92% recall at the chosen threshold. The federated version landed at 0.88 AUC across 5 simulated banks. The adversarial resilience held at 0.90 after 10 rounds of RL-based attack simulation.
          </p>
          <p>
            In terms of estimated impact, the system prevented an estimated $18.5M in simulated fraud losses across the test dataset. The dashboard processes alerts in under 200ms, fast enough for real-time monitoring during trading hours.
          </p>

          <img src="/images/cyber.png" alt="CyberFin Nexus Dashboard" className="my-8 rounded-xl border border-border shadow-md mx-auto max-h-96 object-contain" />
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
