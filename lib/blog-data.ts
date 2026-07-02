import { SidebarItem } from "@/components/docs-layout";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "freertos-stm32-baremetal",
    title: "writing FreeRTOS from scratch on STM32 (without CubeMX)",
    date: "June 12, 2026",
    description:
      "a deep dive into setting up FreeRTOS on an STM32 microcontroller using purely bare-metal registers and Makefiles, completely ditching HAL and CubeMX.",
    tags: ["embedded", "stm32", "freertos", "bare-metal"],
  },
  {
    slug: "toy-nn-runtime",
    title: "building a minimalist neural network inference engine",
    date: "August 9, 2025",
    description:
      "exploring the fundamentals of inference engines by building a toy neural network runtime from scratch in C++.",
    tags: ["machine-learning", "c++", "runtime", "neural-networks"],
  },
  {
    slug: "xiao-esp32s3-rtsp-stream",
    title: "RTSP video streaming on the Seeed Studio XIAO ESP32S3",
    date: "May 28, 2025",
    description:
      "a quick guide on how to set up an RTSP video stream using the OV2640 camera on the tiny Seeed Studio XIAO ESP32S3 Sense.",
    tags: ["streaming", "esp32s3", "xiao", "camera"],
  },
  {
    slug: "rpi4-1d-cnn",
    title: "running a 1D CNN for time-series on Raspberry Pi 4B",
    date: "March 15, 2025",
    description:
      "how to deploy a lightweight 1D convolutional neural network on a Raspberry Pi 4B to process real-time sensor data.",
    tags: ["machine-learning", "raspberry-pi", "1d-cnn", "time-series"],
  },
];

export const blogSidebar: SidebarItem[] = [
  {
    label: "blog posts",
    children: [
      { label: "freertos bare-metal", href: "/blogs/freertos-stm32-baremetal" },
      { label: "toy c++ nn runtime", href: "/blogs/toy-nn-runtime" },
      { label: "xiao esp32s3 rtsp stream", href: "/blogs/xiao-esp32s3-rtsp-stream" },
      { label: "rpi 4b 1d cnn", href: "/blogs/rpi4-1d-cnn" },
    ],
  },
];
