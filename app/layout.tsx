import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"


export const metadata: Metadata = {
  title: 'Abhinav | Portfolio',
  description: 'Personal portfolio of Abhinav',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          storageKey="app-theme"
        >
            {children}
        </ThemeProvider>
      </body>
    </html>
  )
}