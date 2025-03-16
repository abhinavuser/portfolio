"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase } from "lucide-react" // Import the icon we'll use

const experiences = [
  {
    title: "Electronical Intern",
    company: "Thinksemi Infotech",
    period: "Dec 2024 – Jan 2025",
    description: [
      "Learned assembly techniques for converters and PCBs, and worked with terminals such as JST, KET, and MOLEX, which are commonly used in the market.",
      "Gained insight into customer fulfillments through onsite industrial company experience, with hands-on hardware work experience."
    ],
  },
  {
    title: "Web Development Intern",
    company: "nStore Retech",
    period: "June 2024 – Aug 2024",
    description: [
      "Built and integrated order management systems with Node.js/Express.js, API connections, and a configurable UI for stores and delivery partners.",
      "Designed a responsive frontend using Vue.js for order management and tracking, with dynamic components and MOCK APIs for testing.",
      "Worked with POSTMAN for API testing. On-Site Internship Experience."
    ],
  },
  {
    title: "Web Developer",
    company: "Creative Agency",
    period: "2016 - 2018",
    description: [
      "Built responsive websites for various clients using HTML, CSS, and JavaScript.",
      "Worked closely with the design team to ensure high-quality implementations."
    ],
  },
]

export function ExperienceTimeline() {
  return (
    <div className="relative space-y-12 before:absolute before:inset-0 before:left-9 before:ml-px before:h-full before:w-[1px] before:bg-border before:-z-10 md:before:left-1/2 md:before:-ml-px">
      {experiences.map((experience, index) => (
        <div
          key={index}
          className={`flex flex-col ${
            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          } items-center gap-8`}
        >
          <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg"
          >
            <Briefcase className="h-8 w-8 text-primary-foreground" />
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
