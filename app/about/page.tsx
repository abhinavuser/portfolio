"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/marquee";
import { ProjectCard } from "@/components/project-card";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { SkillsGrid } from "@/components/skills-grid";
import { ContactForm } from "@/components/contact-form";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <StarfieldBackground>
      <Navbar />

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

      <main className="container relative z-10 py-4">
        {/* About Section */}
        <section id="about" className="pt-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">About Me</h2>
            <div className="mx-auto mb-4 h-1 w-20 bg-primary"></div>
            <p className="text-muted-foreground">Get to know me</p>
          </motion.div>

          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-primary md:h-80 md:w-80"
            >
              <img
                src="/images/abhi-about.jpg"
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
                Embedded Systems and AI Engineer with expertise in ARM/RISC-V SoCs, Embedded Linux, MLOps, and a passion for anything Mathematics. I work a lot on developing firmware, OT security, computer vision, and image processing models on diverse SBC platforms while also contributing to the open-source community.
              </p>
              <p className="mb-4 text-muted-foreground">
                As an Electronics Major with a focus on Embedded Firmware, Machine Learning and IoT, I specialize in creating real-time, solutions for hardware and edge devices. I have experience in deploying machine learning models on microcontrollers and developing Firmware and Middleware, optimizing them for low power and real-time performance. In addition to embedded, I am proficient in MLOps practices and network security, ensuring scalable and reproducible ML workflows through tools such as Docker, Wireshark, OpenCV and model versioning pipelines.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Name:</p>
                  <p className="text-muted-foreground">Abhinav Kumar</p>
                </div>
                <div>
                  <p className="font-medium">Major:</p>
                  <p className="text-muted-foreground">Electrical & Electronics Engineering</p>
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
            <p className="text-muted-foreground">Some of my works</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ProjectCard
              title="VESTERN"
              description="All-in-One Financial Assistant - Bringing ease to Financing & Investing through fully automated Financial Agent"
              image="/images/vestern.png"
              tags={["Jupyter", "Python", "RAG", "Next.js", "Flutter", "Postresql"]}
              link="https://github.com/abhinavuser/VESTERN"
            />
            <ProjectCard
              title="Oil Detection"
              description="Automated oil spill detection system for early detection of oil spills using ResNet Models- smart india hackothon project"
              image="/images/oil.png"
              tags={["Python", "PHP", "Pytorch", "Flask", "HTML", "CSS", "JS"]}
              link="https://github.com/abhinavuser/oil_detection_sih"
            />
            <ProjectCard
              title="DefenShe"
              description="Women safety software and SOS detection Model Interface"
              image="/images/women.png"
              tags={["Python", "Javascript", "Firebase", "Flask", "Flutter"]}
              link="https://github.com/abhinavuser/women-safety"
            />
            <ProjectCard
              title="Network Intrusion"
              description="Network Intrusion and Anomaly Detection via TCP/IP Dump Analysis"
              image="/images/network.png"
              tags={["Python", "Pandas", "TKinter", "Scikit-learn"]}
              link="https://github.com/abhinavuser/network_intrusion"
            />
            <ProjectCard
              title="nStore Interface"
              description="An Automatic Customizable Order Management System for nStore E-Commerce Company - Internship Project"
              image="/images/nstore.png"
              tags={["Vue.js", "Node.js", "Express.js", "API Integration", "Postman"]}
              link="https://github.com/abhinavuser/nstoreinterface"
            />
            <ProjectCard
              title="Cardiac App"
              description="Real-Time Heart-Rate Tracking Application Using AD8232 ECG Sensor Controlled by ESP32"
              image="/images/cardiac.jpg"
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
  );
}
