import { SidebarItem, TOCHeading } from "@/components/docs-layout";

/* ───── sidebar structure ───── */
export const researchSidebar: SidebarItem[] = [
  {
    label: "Research",
    children: [
      {
        label: "Neural Networks & ML",
        children: [
          {
            label: "ArmNN",
            href: "/research/armnn",
            children: [
              { label: "Using the TFLite Delegate", href: "/research/armnn/tflite-delegate" },
            ],
          },
          {
            label: "RKNN",
            href: "/research/rknn",
            children: [
              { label: "Converting TFLite Models", href: "/research/rknn/tflite-conversion" },
              { label: "Running TFLite Models", href: "/research/rknn/tflite-models" },
            ],
          },
          { label: "1D CNNs on Edge", href: "/research/1d-cnn" },
          { label: "Toy NN Runtime", href: "/research/toy-nn" },
          { label: "CyberFin Nexus", href: "/research/cyberfin" },
          { label: "LLMs on Edge", href: "/research/llm-edge" },
        ],
      },
      {
        label: "Firmware & Bare-Metal",
        children: [
          { label: "FreeRTOS Bare-Metal", href: "/research/freertos" },
          { label: "Xiao RTSP Stream", href: "/research/xiao-rtsp" },
          { label: "V4L2 Zero-Copy", href: "/research/v4l2-pipeline" },
        ],
      },
    ],
  },
  {
    label: "Devices",
    children: [
      { label: "Seeed Studio XIAO", href: "/research/devices/xiao" },
      { label: "STM32 Nucleo", href: "/research/devices/stm" },
      { label: "Raspberry Pi 4B", href: "/research/devices/rpi" },
      { label: "Khadas Edge2", href: "/research/devices/khadas" },
    ],
  },
];

/* ───── content types ───── */
export interface ResearchPageContent {
  title: string;
  description: string;
  breadcrumbs: { label: string; href?: string }[];
  toc: TOCHeading[];
  prevPage?: { label: string; href: string };
  nextPage?: { label: string; href: string };
}

/* ───── page metadata ───── */
export const researchPages: Record<string, ResearchPageContent> = {
  "armnn": {
    title: "ArmNN",
    description: "Arm NN is the most performant machine learning (ML) inference engine for Android and Linux, accelerating ML on Arm Cortex-A CPUs and Arm Mali GPUs.",
    breadcrumbs: [
      { label: "Research", href: "/research" },
      { label: "Guides", href: "/research" },
      { label: "ArmNN" },
    ],
    toc: [{ id: "guides", text: "Guides", level: 2 }],
    nextPage: { label: "Using the TFLite Delegate", href: "/research/armnn/tflite-delegate" },
  },
  "armnn/tflite-delegate": {
    title: "Using the TFLite Delegate",
    description: "Using the ArmNN TFLite delegate in Python with the tflite.interpreter",
    breadcrumbs: [
      { label: "Research", href: "/research" },
      { label: "Guides", href: "/research" },
      { label: "ArmNN", href: "/research/armnn" },
      { label: "TFLite Delegate" },
    ],
    toc: [
      { id: "introduction", text: "Introduction", level: 2 },
      { id: "prerequisites", text: "Prerequisites", level: 2 },
      { id: "getting-armnn-delegate", text: "Getting the ArmNN Delegate Libraries", level: 2 },
      { id: "building-model", text: "Building the Model", level: 2 },
      { id: "running-delegate", text: "Running the Delegate", level: 2 },
      { id: "import-libraries", text: "Import the Essential Libraries", level: 3 },
      { id: "define-file-paths", text: "Define the File Paths", level: 3 },
      { id: "create-image-object", text: "Create the Image Object", level: 3 },
      { id: "load-delegate", text: "Load the Delegate", level: 3 },
      { id: "input-output-params", text: "Get Input & Output Parameters", level: 3 },
      { id: "convert-input", text: "Convert the Input Tensor", level: 3 },
      { id: "run-inference", text: "Run Inference", level: 3 },
      { id: "obtain-results", text: "Obtain the Results", level: 3 },
      { id: "example-run", text: "Example Run", level: 2 },
      { id: "notes", text: "Notes", level: 2 },
    ],
    prevPage: { label: "ArmNN", href: "/research/armnn" },
    nextPage: { label: "Converting TFLite Models with RKNN2", href: "/research/rknn/tflite-conversion" },
  },
  "rknn": {
    title: "RKNN",
    description: "RKNN2 is Rockchip's software suite to utilize the NPU on their device platforms like the RK3588 and RK3566.",
    breadcrumbs: [
      { label: "Research", href: "/research" },
      { label: "Guides", href: "/research" },
      { label: "RKNN" },
    ],
    toc: [{ id: "guides", text: "Guides", level: 2 }],
    prevPage: { label: "Using the TFLite Delegate", href: "/research/armnn/tflite-delegate" },
    nextPage: { label: "Converting TFLite Models", href: "/research/rknn/tflite-conversion" },
  },
  "rknn/tflite-conversion": {
    title: "Converting TFLite Models with RKNN2",
    description: "Converting TFLite models for Rockchip's RKNN2 platform",
    breadcrumbs: [
      { label: "Research", href: "/research" },
      { label: "Guides", href: "/research" },
      { label: "RKNN", href: "/research/rknn" },
      { label: "Converting TFLite Models" },
    ],
    toc: [
      { id: "introduction", text: "Introduction", level: 2 },
      { id: "prerequisites", text: "Prerequisites", level: 2 },
      { id: "install-pip", text: "Install pip", level: 3 },
      { id: "clone-examples", text: "Clone the Examples Repository", level: 3 },
      { id: "get-npu-tools", text: "Get Rockchip NPU Tools", level: 3 },
      { id: "find-python-version", text: "Find Python Version", level: 3 },
      { id: "install-toolkit", text: "Install the Toolkit", level: 3 },
      { id: "downloading-script", text: "Downloading the Script", level: 3 },
      { id: "convert-model", text: "Convert the Model", level: 3 },
      { id: "target-setup", text: "Target Board Setup", level: 2 },
      { id: "install-pip-target", text: "Install pip (Target)", level: 3 },
      { id: "install-python-packages", text: "Install Python Packages", level: 3 },
      { id: "get-npu-tools-target", text: "Get NPU Tools (Target)", level: 3 },
      { id: "find-python-version-target", text: "Find Python Version (Target)", level: 3 },
      { id: "install-toolkit-wheel", text: "Install Toolkit Wheel", level: 3 },
      { id: "copy-runtime", text: "Copy Runtime Library", level: 3 },
    ],
    prevPage: { label: "Using the TFLite Delegate", href: "/research/armnn/tflite-delegate" },
    nextPage: { label: "Running TFLite Models", href: "/research/rknn/tflite-models" },
  },
  "rknn/tflite-models": {
    title: "Running TFLite Models with RKNN2",
    description: "Running TFLite models with Rockchip's RKNN2 platform",
    breadcrumbs: [
      { label: "Research", href: "/research" },
      { label: "Research", href: "/research" },
      { label: "RKNN", href: "/research/rknn" },
      { label: "Running TFLite Models" },
    ],
    toc: [
      { id: "introduction", text: "Introduction", level: 2 },
      { id: "running-model", text: "Running the Model", level: 2 },
      { id: "import-libraries", text: "Import Libraries", level: 3 },
      { id: "define-paths", text: "Define Paths", level: 3 },
      { id: "create-image", text: "Create Image Object", level: 3 },
      { id: "create-rknn", text: "Create RKNN Object", level: 3 },
      { id: "run-inference", text: "Run Inference", level: 3 },
      { id: "get-results", text: "Get Results", level: 3 },
      { id: "example-run", text: "Example Run", level: 2 },
    ],
    prevPage: { label: "Converting TFLite Models", href: "/research/rknn/tflite-conversion" },
  },

  /* ───── NEW DEEP DIVES ───── */
  "freertos": {
    title: "FreeRTOS Bare-Metal",
    description: "Deep dive into setting up FreeRTOS from scratch without CubeMX on STM32.",
    breadcrumbs: [{ label: "Research", href: "/research" }, { label: "FreeRTOS" }],
    toc: [
      { id: "why", text: "Why Bare-Metal?", level: 2 },
      { id: "setup", text: "Project Setup", level: 2 },
      { id: "linker", text: "The Linker Script", level: 2 },
      { id: "config", text: "FreeRTOSConfig.h", level: 2 },
      { id: "kernel", text: "Kernel Integration", level: 2 },
      { id: "tasks", text: "Tasks and Synchronization", level: 2 },
    ],
  },
  "1d-cnn": {
    title: "1D CNNs on Edge",
    description: "Running a 1D Convolutional Neural Network for time-series data on an edge device.",
    breadcrumbs: [{ label: "Research", href: "/research" }, { label: "1D CNN" }],
    toc: [
      { id: "context", text: "Context", level: 2 },
      { id: "training", text: "Training", level: 2 },
      { id: "deployment", text: "Deployment", level: 2 },
    ],
  },
  "xiao-rtsp": {
    title: "Xiao RTSP Stream",
    description: "Streaming real-time video via RTSP using the Seeed Studio XIAO ESP32S3.",
    breadcrumbs: [{ label: "Research", href: "/research" }, { label: "Xiao RTSP" }],
    toc: [
      { id: "overview", text: "Overview", level: 2 },
      { id: "config", text: "Camera Config", level: 2 },
      { id: "streaming", text: "Streaming", level: 2 },
      { id: "thermal", text: "Thermal Issues", level: 2 },
    ],
  },
  "toy-nn": {
    title: "Toy NN Runtime",
    description: "Building a minimalist neural network inference engine from scratch in C++.",
    breadcrumbs: [{ label: "Research", href: "/research" }, { label: "Toy NN Runtime" }],
    toc: [
      { id: "architecture", text: "Architecture", level: 2 },
      { id: "tensor", text: "Tensor Class", level: 2 },
      { id: "execution", text: "Execution", level: 2 },
    ],
  },
  "cyberfin": {
    title: "CyberFin Nexus",
    description: "Privacy-first platform fusing cyber threat telemetry with financial transactions using GNNs.",
    breadcrumbs: [{ label: "Research", href: "/research" }, { label: "CyberFin Nexus" }],
    toc: [
      { id: "problem", text: "The SOC-AML Problem", level: 2 },
      { id: "architecture", text: "Architecture", level: 2 },
      { id: "gat", text: "Graph Attention Networks", level: 2 },
      { id: "fl", text: "Federated Learning Engine", level: 2 },
      { id: "adversarial", text: "Adversarial RL Simulation", level: 2 },
      { id: "dashboard", text: "Dashboard and Audit Trail", level: 2 },
      { id: "results", text: "Results", level: 2 },
    ],
  },
  "llm-edge": {
    title: "Quantized LLM Inference on Edge",
    description: "Deploying a W4A8 quantized LLM natively on the RK3588 NPU using heterogeneous execution.",
    breadcrumbs: [{ label: "Research", href: "/research" }, { label: "LLMs on Edge" }],
    toc: [
      { id: "quantization", text: "W4A8 LLM Quantization", level: 2 },
      { id: "npu", text: "NPU Offloading", level: 2 },
      { id: "performance", text: "Performance Results", level: 2 },
    ],
  },
  "v4l2-pipeline": {
    title: "V4L2 Zero-Copy Embedded Vision",
    description: "Building zero-copy memory pipelines in Linux using DMA-BUF and V4L2 for latency reduction.",
    breadcrumbs: [{ label: "Research", href: "/research" }, { label: "V4L2 Zero-Copy" }],
    toc: [
      { id: "zero-copy", text: "Zero-Copy Memory Paradigms", level: 2 },
      { id: "v4l2", text: "V4L2 Capture", level: 2 },
      { id: "dma", text: "DMA-BUF File Descriptors", level: 2 },
      { id: "pipeline", text: "Full Pipeline Architecture", level: 2 },
      { id: "latency", text: "Latency Results", level: 2 },
    ],
  },

  /* ───── NEW DEVICES ───── */
  "devices/xiao": {
    title: "Seeed Studio XIAO",
    description: "Notes on the XIAO ESP32S3 Sense.",
    breadcrumbs: [{ label: "Research", href: "/research" }, { label: "Devices", href: "/research" }, { label: "XIAO" }],
    toc: [
      { id: "specs", text: "Specifications", level: 2 },
      { id: "camera", text: "Camera Module", level: 2 },
      { id: "quirks", text: "Hardware Quirks", level: 2 },
    ],
  },
  "devices/stm": {
    title: "STM32 Nucleo",
    description: "Notes on the STM32F303K8 Nucleo board.",
    breadcrumbs: [{ label: "Research", href: "/research" }, { label: "Devices", href: "/research" }, { label: "STM32" }],
    toc: [
      { id: "specs", text: "Specifications", level: 2 },
      { id: "memory", text: "Memory Map", level: 2 },
      { id: "debugging", text: "Debugging", level: 2 },
    ],
  },
  "devices/rpi": {
    title: "Raspberry Pi 4B",
    description: "Notes on the Raspberry Pi 4 Model B.",
    breadcrumbs: [{ label: "Research", href: "/research" }, { label: "Devices", href: "/research" }, { label: "RPi 4B" }],
    toc: [
      { id: "specs", text: "Specifications", level: 2 },
      { id: "ai", text: "AI Acceleration", level: 2 },
      { id: "power", text: "Power & Thermals", level: 2 },
    ],
  },
  "devices/khadas": {
    title: "Khadas Edge2",
    description: "Notes on the Khadas Edge2 Rockchip RK3588S SBC.",
    breadcrumbs: [{ label: "Research", href: "/research" }, { label: "Devices", href: "/research" }, { label: "Khadas Edge2" }],
    toc: [
      { id: "specs", text: "Specifications", level: 2 },
      { id: "npu", text: "RKNN NPU", level: 2 },
      { id: "linux", text: "Linux Support", level: 2 },
    ],
  },
};
