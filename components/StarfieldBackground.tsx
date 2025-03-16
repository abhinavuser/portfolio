"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"
import { useTheme } from "next-themes"
import gsap from "gsap"

interface StarfieldBackgroundProps {
  children: React.ReactNode
}

export function StarfieldBackground({ children }: StarfieldBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const scene = new THREE.Scene()

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    )
    camera.position.z = 800

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Starfield creation
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 7000
    const starPositions = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 2000
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3)
    )

    const starMaterial = new THREE.PointsMaterial({
      color: theme === "dark" ? 0xffffff : 0x000000,
      size: 1.5,
      transparent: true,
      opacity: theme === "dark" ? 0.8 : 0.5,
    })

    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // Mouse movement effect
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth - 0.5) * 2
      const mouseY = (event.clientY / window.innerHeight - 0.5) * 2

      gsap.to(camera.rotation, {
        x: -mouseY * 0.1,
        y: -mouseX * 0.1,
        duration: 0.7,
        ease: "power1.out",
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animate stars
    const animateStars = () => {
      const positions = stars.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.1 // Vertical movement speed
        if (positions[i + 1] < -1000) {
          positions[i + 1] = 1000
        }
      }
      stars.geometry.attributes.position.needsUpdate = true
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      stars.rotation.y += 0.0002
      stars.rotation.x += 0.0001
      animateStars()
      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
    }
  }, [theme])

  return (
    <div className="relative min-h-screen">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}