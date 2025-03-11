"use client"

import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import {
  Shield,
  Clock,
  CheckCircle,
  Fingerprint,
  BarChart,
  Lock,
  Users,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  // useEffect only runs on the client, so we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

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
            <Link href="/verification" className="text-sm font-medium hover:text-primary transition-colors">
              Verify Now
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <MobileNav />
            <div className="hidden md:flex gap-4">
              <Button variant="outline" size="sm">
                Contact Us
              </Button>
              <Button size="sm">Try Demo</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
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
                <Button size="lg" className="gap-2" asChild>
                  <Link href="/verification">
                    Try the Demo <ArrowRight className="h-4 w-4" />
                  </Link>
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

        {/* Problem Statement */}
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

        {/* Solution Overview */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900">
          <div className="container text-center">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6">
              Our Solution
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
              Automated Verification for Faster, Secure, and Accessible Elections
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Our automated system uses biometric verification and blockchain technology to ensure fast, secure, and
              tamper-proof voting.
            </p>
            <Image
              src="/assets/Voting-verification-system-overview.png"
              alt="Voting verification system overview"
              width={800}
              height={300}
              className="rounded-lg shadow-lg mx-auto"
            />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6">
                Key Features
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Advanced Technology for Modern Elections
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our system combines cutting-edge technologies to create a seamless voting experience.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Fingerprint className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Biometric Verification</h3>
                  <p className="text-muted-foreground">
                    Secure fingerprint and facial recognition for instant voter identification.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Blockchain Security</h3>
                  <p className="text-muted-foreground">
                    Immutable record-keeping ensures votes cannot be altered or tampered with.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Real-Time Monitoring</h3>
                  <p className="text-muted-foreground">
                    Live dashboards for election officials to monitor turnout and system status.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Accessibility Focus</h3>
                  <p className="text-muted-foreground">
                    Designed for all voters, including those with disabilities or language barriers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="py-16 md:py-24 bg-blue-50 dark:bg-gray-900">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6">
                Benefits
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Transforming the Voting Experience</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our system delivers significant advantages for both voters and election officials.
              </p>
            </div>

            <Tabs defaultValue="voters" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="voters">For Voters</TabsTrigger>
                <TabsTrigger value="officials">For Election Officials</TabsTrigger>
              </TabsList>
              <TabsContent value="voters" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4 items-start">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 mt-1">
                      <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Reduced Waiting Times</h3>
                      <p className="text-muted-foreground">
                        Verification in seconds instead of minutes means shorter lines and faster voting.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 mt-1">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Enhanced Security</h3>
                      <p className="text-muted-foreground">
                        Biometric verification ensures only eligible voters can cast ballots.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 mt-1">
                      <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Improved Accessibility</h3>
                      <p className="text-muted-foreground">
                        Multiple verification options accommodate voters with different needs.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="rounded-full bg-green-100 dark:bg-green-900 p-2 mt-1">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Increased Confidence</h3>
                      <p className="text-muted-foreground">
                        Transparent process builds trust in the integrity of election results.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="officials" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex gap-4 items-start">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 mt-1">
                      <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Real-Time Analytics</h3>
                      <p className="text-muted-foreground">
                        Monitor turnout, wait times, and system performance from a central dashboard.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 mt-1">
                      <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Fraud Prevention</h3>
                      <p className="text-muted-foreground">
                        Advanced security measures prevent duplicate voting and identity fraud.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 mt-1">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Operational Efficiency</h3>
                      <p className="text-muted-foreground">
                        Reduce staffing needs and administrative costs with automated processes.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 mt-1">
                      <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">Auditable Records</h3>
                      <p className="text-muted-foreground">
                        Secure, immutable blockchain records simplify post-election audits.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6">
                Process
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A simple, secure process from start to finish.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[39px] top-0 h-full w-[2px] bg-muted md:left-1/2 md:-ml-[1px]"></div>

                {/* Steps */}
                <div className="space-y-12 md:space-y-24">
                  {/* Step 1 */}
                  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4">
                    <div className="mb-6 flex items-center space-x-4 md:mb-0 md:justify-end md:space-x-reverse md:space-x-8">
                      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                        <span className="text-xl font-bold">1</span>
                      </div>
                      <div className="md:text-right">
                        <h3 className="text-xl font-bold">ID Verification</h3>
                        <p className="text-muted-foreground max-w-xs">
                          Voter scans their government-issued ID at the polling station.
                        </p>
                      </div>
                    </div>
                    <div className="md:w-1/2">
                      <Image
                        src="/assets/ID-scanning-process.png"
                        alt="ID scanning process"
                        width={300}
                        height={200}
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex flex-col md:flex-row-reverse md:items-center md:justify-between md:space-x-reverse md:space-x-4">
                    <div className="mb-6 flex items-center space-x-4 md:mb-0 md:space-x-8">
                      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                        <span className="text-xl font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Biometric Confirmation</h3>
                        <p className="text-muted-foreground max-w-xs">
                          Quick fingerprint or facial scan confirms voter identity.
                        </p>
                      </div>
                    </div>
                    <div className="md:w-1/2 md:text-right">
                      <Image
                        src="/assets/Biometric-verification-process.png"
                        alt="Biometric verification process"
                        width={300}
                        height={200}
                        className="rounded-lg shadow-md ml-auto"
                      />
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4">
                    <div className="mb-6 flex items-center space-x-4 md:mb-0 md:justify-end md:space-x-reverse md:space-x-8">
                      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                        <span className="text-xl font-bold">3</span>
                      </div>
                      <div className="md:text-right">
                        <h3 className="text-xl font-bold">Ballot Issuance</h3>
                        <p className="text-muted-foreground max-w-xs">
                          System issues the correct ballot based on voter's registered precinct.
                        </p>
                      </div>
                    </div>
                    <div className="md:w-1/2">
                      <Image
                        src="/assets/Ballot-issuance-process.png"
                        alt="Ballot issuance process"
                        width={300}
                        height={200}
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative flex flex-col md:flex-row-reverse md:items-center md:justify-between md:space-x-reverse md:space-x-4">
                    <div className="mb-6 flex items-center space-x-4 md:mb-0 md:space-x-8">
                      <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                        <span className="text-xl font-bold">4</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Secure Recording</h3>
                        <p className="text-muted-foreground max-w-xs">
                          Vote is securely recorded on the blockchain, ensuring immutability.
                        </p>
                      </div>
                    </div>
                    <div className="md:w-1/2 md:text-right">
                      <Image
                        src="/assets/Secure-vote-recording-process.png"
                        alt="Secure vote recording process"
                        width={300}
                        height={200}
                        className="rounded-lg shadow-md ml-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950"
        >
          <div className="container">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6">
                Testimonials
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">What People Are Saying</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Feedback from voters and election officials who have experienced our system.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src="/assets/sarah.png"
                      alt="Sarah Johnson"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-bold">Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">Voter, Chicago</p>
                    </div>
                  </div>
                  <p className="italic text-muted-foreground">
                    "I was in and out in under 5 minutes! The verification was quick and I felt confident that my vote
                    was secure."
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src="/assets/michael.png"
                      alt="Michael Rodriguez"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-bold">Michael Rodriguez</h3>
                      <p className="text-sm text-muted-foreground">Election Official, Miami</p>
                    </div>
                  </div>
                  <p className="italic text-muted-foreground">
                    "This system has transformed how we manage elections. Fewer staff needed, shorter lines, and much
                    easier auditing."
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src="/assets/aisha.png"
                      alt="Aisha Williams"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-bold">Aisha Williams</h3>
                      <p className="text-sm text-muted-foreground">County Clerk, Atlanta</p>
                    </div>
                  </div>
                  <p className="italic text-muted-foreground">
                    "The real-time monitoring dashboard gives us unprecedented visibility into turnout and any issues
                    that arise."
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" className="gap-2">
                Read More Testimonials <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 max-w-2xl mx-auto">
              Ready to Transform Your Election Process?
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Join the growing number of election authorities using our system to create faster, more secure voting
              experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <Link href="/verification">
                  Request a Demo <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
              >
                Contact Sales
              </Button>
            </div>

            <div className="max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex h-10 w-full rounded-md border border-input bg-white/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button variant="secondary">Subscribe</Button>
                </div>
                <p className="text-xs mt-2 opacity-80">We respect your privacy. Unsubscribe at any time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Case Study */}
        <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6">
                  Case Study
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Success in Riverside County</h2>
                <p className="text-muted-foreground mb-6">
                  Riverside County implemented our system in the 2024 local elections, resulting in:
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">73% reduction in average wait times</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">98.7% voter satisfaction rating</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-medium">15% increase in voter turnout</p>
                    </div>
                  </li>
                </ul>
                <Button className="gap-2">
                  Read Full Case Study <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Image
                  src="/assets/Riverside-County-election.png"
                  alt="Riverside County election"
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

            <div className="flex gap-6">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
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
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">LinkedIn</span>
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
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
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
                  className="h-5 w-5"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground mt-4 md:mt-0">
              &copy; {new Date().getFullYear()} VoteVerify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background p-6 animate-in slide-in-from-top-5">
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
            <Link
              href="/verification"
              className="text-lg font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Verify Now
            </Link>

            <div className="flex flex-col gap-4 mt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Contact Us
              </Button>
              <Button onClick={() => setIsOpen(false)}>Try Demo</Button>
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

