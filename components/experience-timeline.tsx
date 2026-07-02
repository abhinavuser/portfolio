"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase } from "lucide-react" // Fallback icon
import Image from "next/image"

const experiences = [
  {
    title: "Rsearch Intern",
    company: "IIT Madras",
    period: "June 2026 – Present",
    logo: "/images/iitm.jpg",
    description: [
      "Working on the development of firmware for the company's products unit testing unique development boards with different Industry standard Sensors."
    ],
  },
  {
    title: "Embedded Firmware Engineer",
    company: "Ampnics",
    period: "July 2025 – Present",
    logo: "/images/ampnics.jpg",
    description: [
      "Working on the development of firmware for the company's products unit testing unique development boards with different Industry standard Sensors."
    ],
  },
  {
    title: "AI/ML Intern",
    company: "Kshatra Labs",
    period: "Dec 2025 – Apr 2026",
    logo: "/images/kshatra.jpg",
    description: [
      "Integrated multi-agent workflows, AI-powered code generation, and SAP S/4HANA for intelligent automation.",
      "Developed an Agentic LLM framework to automate SAP ABAP development and business processes using Generative AI, and gained hands-on experience in ABAP."
    ],
  },
  {
    title: "AI & SAP Intern",
    company: "HCLTech",
    period: "June 2025 – Aug 2025",
    logo: "/images/hcltech.jpg",
    description: [
      "Integrated multi-agent workflows, AI-powered code generation, and SAP S/4HANA for intelligent automation.",
      "Developed an Agentic LLM framework to automate SAP ABAP development and business processes using Generative AI, and gained hands-on experience in ABAP."
    ],
  },
  {
    title: "Electronics Intern",
    company: "Thinksemi Infotech",
    period: "Dec 2024 – Jan 2025",
    logo: "/images/thinksemi_logo.jpg",
    description: [
      "Learned assembly techniques for converters and PCBs, and worked with terminals such as JST, KET, and MOLEX, which are commonly used in the market.",
      "Gained insight into customer fulfillments through onsite industrial company experience, with hands-on hardware work experience."
    ],
  },
  {
    title: "IT Support Intern",
    company: "nStore Retech",
    period: "June 2024 – Aug 2024",
    logo: "/images/nstoret.jpg",
    description: [
      "Built and integrated order management systems with Node.js/Express.js, API connections, and a configurable UI for stores and delivery partners.",
      "Designed a responsive frontend using Vue.js for order management and tracking, with dynamic components and MOCK APIs for testing.",
      "Worked with POSTMAN for API testing. On-Site Internship Experience."
    ],
  },
  {
    title: "Joint Secretary",
    company: "Havoltz Club",
    period: "Aug 2024 - Present",
    logo: "/images/havoltz.jpg",
    description: [
      "Conducted monthly lectures on core concepts and organized workshops and Hackathons involving industries and external colleges.",
      "Project Lead preparing club members for hackathons and competitions like Meshmerize, Cosmoclench and Robofests."
    ],
  },
  {
    title: "AI/ML Lead",
    company: "Microsoft Innovations Club",
    period: "Oct 2024 - May 2026",
    logo: "/images/mic.jpg",
    description: [
      "AI/ML Lead overseeing AI projects, mentoring team members, and organizing ML events on Kaggle.",
      "Leading the integration of LLMs and ML models, while guiding teams through project development."
    ],
  },
  {
    title: "Technical Team Member",
    company: "Google Developer Groups Club",
    period: "Oct 2024 - Dec2025",
    logo: "/images/gdg.jpg",
    description: [
      "Involved in club meetings and volunteered as the Co-Organizer of DevsHouse’25 MLH hackathon.",
      "Worked on a Data Science project involving studying MIDI Files of Popular Music and trends in melody."
    ],
  },
  {
    title: "Technical Team Member",
    company: "IEEE Computer Society",
    period: "Sep 2024 - Sep 2025",
    logo: "/images/ieee.jpg",
    description: [
      "Worked on developing websites for events like Hackhub’25 and Builders Hut.",
      "Part of the Organizing committee and Technical Support for Events and Hackathons."
    ],
  },
]

export function ExperienceTimeline() {
  return (
    <div className="relative space-y-12 before:absolute before:inset-0 before:left-9 before:ml-px before:h-full before:w-[1px] before:bg-border before:-z-10 md:before:left-1/2 md:before:-ml-px">
      {experiences.map((experience, index) => (
        <div
          key={index}
          className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-center gap-8`}
        >
          <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-border shadow-lg overflow-hidden"
          >
            {experience.logo ? (
              <Image src={experience.logo} alt={`${experience.company} logo`} width={64} height={64} className="object-contain p-2" />
            ) : (
              <Briefcase className="h-8 w-8 text-primary" />
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            viewport={{ once: true }}
            className="w-full md:w-[calc(50%-3rem)]"
          >
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl font-bold">{experience.title}</CardTitle>
                <div className="flex flex-col space-y-1 sm:flex-row sm:justify-between sm:space-y-0">
                  <span className="font-medium text-primary">{experience.company}</span>
                  <span className="text-sm text-muted-foreground">{experience.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 text-muted-foreground">
                  {experience.description.map((point, index) => (
                    <li key={index} className="mb-2">{point}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ))}
    </div>
  )
}
