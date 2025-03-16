"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Shield, Clock, Users, ArrowRight, Menu, X, Sun, Moon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // useEffect only runs on the client, so we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  const startVerification = () => {
    router.push("/verify/instructions")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">VoteVerify</span>
          </div>

          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#benefits" className="text-sm font-medium hover:text-primary transition-colors">
              Benefits
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <MobileNav startVerification={startVerification} />
            <div className="hidden md:flex gap-4">
              <Button variant="outline" size="sm">
                Contact Us
              </Button>
              <Button size="sm" onClick={startVerification}>
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 md:py-32">
          <div className="container flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Revolutionizing Voting with Faster, Secure Verification
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px] mx-auto md:mx-0">
                Automated voter verification for faster, secure, and accessible elections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="gap-2" onClick={startVerification}>
                  Try the Demo <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <Image
                src="/assets/Secure-voting-verification-illustration.png"
                alt="Secure voting verification illustration"
                width={600}
                height={500}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>

          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        </section>

        <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
                  The Problem
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Current Challenges in Voting Verification
                </h2>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Clock className="h-6 w-6 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Long Waiting Times</p>
                      <p className="text-muted-foreground">
                        Voters often wait hours in line due to manual verification processes.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Shield className="h-6 w-6 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Security Vulnerabilities</p>
                      <p className="text-muted-foreground">
                        Manual systems are prone to human error and potential fraud.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <Users className="h-6 w-6 text-red-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Accessibility Issues</p>
                      <p className="text-muted-foreground">
                        Current systems often create barriers for voters with disabilities.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <Image
                  src="/assets/Long-voting-lines-illustration.png"
                  alt="Long voting lines illustration"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-muted py-12 border-t">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Case Studies
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Webinars
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Partners
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">VoteVerify</span>
            </div>

            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} VoteVerify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function MobileNav({ startVerification }: { startVerification: () => void }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-md p-6 animate-in slide-in-from-top-5">
          <nav className="flex flex-col gap-6">
            <Link
              href="#features"
              className="text-lg font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="text-lg font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Benefits
            </Link>
            <Link
              href="#how-it-works"
              className="text-lg font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-lg font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </Link>

            <div className="flex flex-col gap-4 mt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Contact Us
              </Button>
              <Button
                onClick={() => {
                  setIsOpen(false)
                  startVerification()
                }}
              >
                Try Demo
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9"></div> // Placeholder to prevent layout shift
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  )
}

