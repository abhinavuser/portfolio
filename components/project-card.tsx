"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  title: string
  description: string
  image: string
  tags: string[]
  link: string
  github?: string
}

export function ProjectCard({ title, description, image, tags, link, github }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="overflow-hidden rounded-lg"
    >
      <Card className="h-full overflow-hidden">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-6">
          <h3 className="mb-2 text-xl font-bold">{title}</h3>
          <p className="mb-4 text-muted-foreground">{description}</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex space-x-3">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="mr-1 h-4 w-4" /> Live Demo
            </a>
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm font-medium text-primary hover:underline"
              >
                <Github className="mr-1 h-4 w-4" /> Code
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

