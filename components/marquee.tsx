"use client"
import { motion } from "framer-motion"

export function Marquee() {
  const logos = [
    "Machine Learning", "Deep Learning", "Embedded Systems", "Computer Vision", "IoT", 
    "Full Stack Development", "HardWare", "PCB Design", "SMTs", "Assembling", 
    "GradCAM", "Machine Learning", "Deep Learning", "Embedded Systems", "Computer Vision", "IoT", 
    "Full Stack Development", "NLP", "PCB Design", "SMTs", "Assembling", "GradCAM", 
    "Machine Learning", "Deep Learning", "Embedded Systems", "Computer Vision", "IoT", 
    "Full Stack Development", "HardWare", "PCB Design", "SMTs", "Assembling", "GradCAM", 
    "Machine Learning", "Deep Learning", "Embedded Systems", "Computer Vision", "IoT", 
    "Full Stack Development", "NLP", "PCB Design", "SMTs", "Assembling", 
    "GradCAM", "Machine Learning", "Deep Learning", "Embedded Systems", "Computer Vision", "IoT", 
    "Full Stack Development", "HardWare", "PCB Design", "SMTs", "Assembling", "GradCAM", 
    "Machine Learning", "Deep Learning", "Embedded Systems", "Computer Vision", "IoT", 
    "Full Stack Development", "NLP", "PCB Design", "SMTs", "Assembling", "GradCAM"
  ]

  return (
    <div className="relative flex overflow-hidden bg-primary/5 py-10">
      {/* First marquee (left to right) */}
      <motion.div
        className="flex items-center justify-start gap-8 px-2"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ 
          duration: 80, 
          repeat: Number.POSITIVE_INFINITY, 
          ease: "linear", 
          repeatDelay: 1 
        }}
      >
        {logos.map((logo, index) => (
          <div
            key={`logo-${index}`}
            className="flex h-16 w-40 items-center justify-center rounded-lg bg-background p-4 shadow-sm"
          >
            <span className="font-medium text-primary">{logo}</span>
          </div>
        ))}
      </motion.div>

      {/* Second marquee (right to left) */}
      <motion.div
        className="flex items-center justify-start gap-8 px-2"
        animate={{ x: ["100%", "0%"] }}
        transition={{ 
          duration: 140, 
          repeat: Number.POSITIVE_INFINITY, 
          ease: "linear", 
          repeatDelay: 1
        }}
      >
        {logos.map((logo, index) => (
          <div
            key={`logo-duplicate-${index}`}
            className="flex h-16 w-40 items-center justify-center rounded-lg bg-background p-4 shadow-sm"
          >
            <span className="font-medium text-primary">{logo}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
