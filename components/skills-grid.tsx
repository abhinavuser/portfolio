"use client"

import { motion } from "framer-motion"
import { Code2, Cpu, Database, Wrench } from "lucide-react" // Using Lucide icons

const skillCategories = [
  {
    title: "Programming Languages",
    icon: <Code2 className="h-6 w-6" />,
    skills: ["Python", "C++", "JavaScript", "TypeScript", "PHP", "MATLAB"],
    color: "from-blue-500/20 to-cyan-500/20 dark:from-blue-500/10 dark:to-cyan-500/10"
  },
  {
    title: "Development Tools",
    icon: <Wrench className="h-6 w-6" />,
    skills: ["Git", "Docker", "Jupyter", "Arduino", "VSCode", "EasyEDA", "OnShape", "LTspice", "LabVIEW", "Postman"],
    color: "from-purple-500/20 to-pink-500/20 dark:from-purple-500/10 dark:to-pink-500/10"
  },
  {
    title: "Frameworks & Skills",
    icon: <Cpu className="h-6 w-6" />,
    skills: ["PyTorch", "TensorFlow", "OpenCV", "Scikit-learn", "React", "Next.js", "Vue.js", "Node.js", "Express.js", "Flask", "Flutter"],
    color: "from-green-500/20 to-emerald-500/20 dark:from-green-500/10 dark:to-emerald-500/10"
  },
  {
    title: "Databases",
    icon: <Database className="h-6 w-6" />,
    skills: ["MongoDB", "MySQL", "PostgreSQL", "SQLite", "Firebase"],
    color: "from-orange-500/20 to-red-500/20 dark:from-orange-500/10 dark:to-red-500/10"
  }
]

export function SkillsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skillCategories.map((category, idx) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          viewport={{ once: true }}
          className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${category.color} p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-background/80 backdrop-blur-sm">
              {category.icon}
            </div>
            <h3 className="text-lg font-semibold">{category.title}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}