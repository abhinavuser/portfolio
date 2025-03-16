"use client";

import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Download, Github, Linkedin } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Marquee } from "@/components/marquee";
import { ProjectCard } from "@/components/project-card";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { SkillsGrid } from "@/components/skills-grid";
import { ContactForm } from "@/components/contact-form";
import { StarfieldBackground } from "@/components/StarfieldBackground"

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <StarfieldBackground>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            AK
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link href="#about" className="hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="#experience" className="hover:text-primary">
                  Experience
                </Link>
              </li>
              <li>
                <Link href="#projects" className="hover:text-primary">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="#skills" className="hover:text-primary">
                  Skills
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden md:flex"
            onClick={() => window.open('https://drive.google.com/file/d/1X15fCbP1bbkULnMiaICCsY5m93n8n4cf/view?usp=sharing', '_blank')}
          >
            <Download className="mr-2 h-4 w-4" />
            Download CV
          </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center space-y-6 md:flex">
        <motion.a
          href="https://github.com/abhinavuser"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2 }}
          className="rounded-full bg-background p-2 shadow-md transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Github className="h-6 w-6" />
        </motion.a>
        <motion.a
          href="https://linkedin.com/in/abhinav-kumar-v"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2 }}
          className="rounded-full bg-background p-2 shadow-md transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          <Linkedin className="h-6 w-6" />
        </motion.a>
      </div>

      <main className="container relative z-10 py-10">
        {/* Hero Section */}
        <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20 md:flex-row md:justify-between md:py-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10 max-w-lg md:mb-0"
          >
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">Abhinav Kumar V</h1>
            <div className="mb-6 h-16 text-2xl font-medium text-primary md:text-3xl">
              <TypeAnimation
                sequence={[
                  "Embedded Electronics Engineer",
                  1000,
                  "Machine Learning Engineer",
                  1000,
                  "Robotics Enthusiast",
                  1000,
                  "Full Stack Developer",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Number.POSITIVE_INFINITY}
              />
            </div>
            <p className="mb-8 text-muted-foreground">
              Welcome to my portfolio!
            </p>
            <div className="flex space-x-4">
            <a href="#contact">
              <Button>Contact Me</Button>
            </a>
            <a href="#projects" >
              <Button variant="outline">View Projects</Button>
            </a>

            </div>
          </motion.div>
          <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative h-64 w-64 overflow-hidden rounded-lg md:h-80 md:w-80"
            >
              <img
              src="/images/abhinav.JPG"
              alt="abhinav" className="h-full w-full object-cover" />
            </motion.div>

        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">About Me</h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-primary"></div>
          </motion.div>

          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-primary md:h-80 md:w-80"
          >
            <img
              src="/images/abhinav.JPG"
              alt="John Doe"
              className="h-full w-full object-cover"  // Ensure it covers the circle fully
            />
          </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-lg ml-auto"
            >
              <h3 className="mb-4 text-2xl font-bold">Who am I?</h3>
              <p className="mb-4">
              Aspiring ML Engineer and Researcher with a knack for ARM SoCs and a passion for anything Mathematics. Whether tinkering in lab or coding late into the night, I'm excited to tackle any challenging projects.
              </p>
              <p className="mb-6">
              My skillset spans a diverse range of fields, from machine learning and deep learning to computer vision, embedded electronics, and ARM SoCs, as well as web development. As a "jack of all trades, master of none," I actually see this as a strength. I enjoy exploring new areas, and whenever I come across an opportunity or something interesting, I dive into it and see where it takes me.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Name:</p>
                  <p className="text-muted-foreground">Abhinav Kumar</p>
                </div>
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-muted-foreground">chipnxv@gmail.com</p>
                </div>
                <div>
                  <p className="font-medium">Location:</p>
                  <p className="text-muted-foreground">Chennai, Tamil Nadu</p>
                </div>
                <div>
                  <p className="font-medium">Institute:</p>
                  <p className="text-muted-foreground">VIT Chennai</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Marquee Section */}
        <Marquee />

        {/* Experience Section */}
        <section id="experience" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">My Experience</h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-primary"></div>
            <p className="text-muted-foreground">My professional journey</p>
          </motion.div>

          <ExperienceTimeline />
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">My Projects</h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-primary"></div>
            <p className="text-muted-foreground">Some of my recent work</p>
          </motion.div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="mx-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="web">Web</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ProjectCard
              title="VESTERN"
              description="All-in-One Financial Assistant-Bringing ease ti Financing & Investing"
              image="/placeholder.svg?height=300&width=500"
              tags={["Jupyter", "Python","RAG","Next.js", "Flutter", "Postresql"]}
              link="https://github.com/abhinavuser/VESTERN"
            />
            <ProjectCard
              title="Oil Detection"
              description="Automated oil spill detection system for early detection of oil spills using ResNet Models- smart india hackothon project"
              image="/images/github.png"
              tags={["Python", "PHP", "Pytorch", "Flask", "HTML", "CSS", "JS"]}
              link="https://github.com/abhinavuser/oil_detection_sih"
            />
            <ProjectCard
              title="Women Safety Software"
              description="Women safety software and SOS detection Model Interface"
              image="/placeholder.svg?height=300&width=500"
              tags={["Python", "Javascript", "Firebase", "Flask", "Flutter"]}
              link="https://github.com/abhinavuser/women-safety"
            />
            <ProjectCard
              title="Network Intrusion"
              description="Network Intrusion and Anomaly Detection via TCP/IP Dump Analysis"
              image="/placeholder.svg?height=300&width=500"
              tags={["Python", "Pandas", "TKinter", "Scikit-learn"]}
              link="https://github.com/abhinavuser/network_intrusion"
            />
            <ProjectCard
              title="nStore Interface"
              description="An Automatic Customizable Order Management System for nStore E-Commerce Company - Internship Project"
              image="/placeholder.svg?height=300&width=500"
              tags={["Vue.js", "Node.js","Express.js", "API Integration","Postman"]}
              link="https://github.com/abhinavuser/nstoreinterface"
            />
            <ProjectCard
              title="Cardiac App"
              description="Real-Time Heart-Rate Tracking Application Using AD8232 ECG Sensor Controlled by ESP32"
              image="/placeholder.svg?height=300&width=500"
              tags={["Flutter", "Arduino IDE", "PyPortal", "ESP32", "Firebase"]}
              link="https://github.com/abhinavuser/cardiac_tracker"
            />
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">My Skills</h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-primary"></div>
            <p className="text-muted-foreground">Technologies I work with</p>
          </motion.div>

          <SkillsGrid />
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">Get In Touch</h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-primary"></div>
            <p className="text-muted-foreground">Let's work together</p>
          </motion.div>

          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-bold">Contact Information</h3>
              <p className="mb-6">
                Feel free to reach out to me for any inquiries, project proposals, or just to say hello!
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-map-pin"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Location</h4>
                    <p className="text-muted-foreground">Chennai, Tamil Nadu</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-mail"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-muted-foreground">chipnxv@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-phone"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-muted-foreground">99949 22460</p>
                  </div>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p>&copy; {new Date().getFullYear()} Abhinav Kumar . All rights reserved.</p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/abhinavuser"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/abhinav-kumar-v"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
      </StarfieldBackground>
  )
}

