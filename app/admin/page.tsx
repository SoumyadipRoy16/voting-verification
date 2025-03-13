"use client"

import { useState, useEffect } from "react"
import { Shield, Users, BarChart3, Clock, AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for the admin dashboard
const mockPollingStations = [
  { id: "ps-1", name: "Central Library", status: "active", voters: 342, capacity: 500, waitTime: 5 },
  { id: "ps-2", name: "Washington High School", status: "active", voters: 187, capacity: 300, waitTime: 12 },
  { id: "ps-3", name: "Riverside Community Center", status: "active", voters: 256, capacity: 400, waitTime: 8 },
  { id: "ps-4", name: "Oak Street Elementary", status: "warning", voters: 289, capacity: 350, waitTime: 25 },
  { id: "ps-5", name: "Meadowbrook Church", status: "active", voters: 124, capacity: 250, waitTime: 3 },
]

const mockRecentVerifications = [
  { id: "v-1", time: "10:23 AM", status: "success", station: "Central Library", duration: "8s" },
  { id: "v-2", time: "10:21 AM", status: "success", station: "Washington High School", duration: "6s" },
  { id: "v-3", time: "10:19 AM", status: "failed", station: "Oak Street Elementary", duration: "12s" },
  { id: "v-4", time: "10:17 AM", status: "success", station: "Riverside Community Center", duration: "7s" },
  { id: "v-5", time: "10:15 AM", status: "success", station: "Meadowbrook Church", duration: "5s" },
]

const mockSystemStatus = {
  uptime: "8h 23m",
  verificationSuccess: 98.7,
  averageVerificationTime: "7.2s",
  activePollingStations: 5,
  totalVotersProcessed: 1198,
  systemLoad: 42,
}

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-12 w-12 text-primary animate-spin" />
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">VoteVerify Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Election Monitoring Dashboard</h1>

        {/* System Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Voters Processed</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSystemStatus.totalVotersProcessed}</div>
              <p className="text-xs text-muted-foreground">+24 in the last hour</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verification Success Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSystemStatus.verificationSuccess}%</div>
              <Progress value={mockSystemStatus.verificationSuccess} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Verification Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSystemStatus.averageVerificationTime}</div>
              <p className="text-xs text-muted-foreground">-0.3s from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Load</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockSystemStatus.systemLoad}%</div>
              <Progress value={mockSystemStatus.systemLoad} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="polling-stations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="polling-stations">Polling Stations</TabsTrigger>
            <TabsTrigger value="verifications">Recent Verifications</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
          </TabsList>

          <TabsContent value="polling-stations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Polling Station Status</CardTitle>
                <CardDescription>Overview of all active polling stations and their current status.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Station Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Current Voters</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Wait Time</TableHead>
                      <TableHead>Load</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPollingStations.map((station) => (
                      <TableRow key={station.id}>
                        <TableCell className="font-medium">{station.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${
                                station.status === "active"
                                  ? "bg-green-500"
                                  : station.status === "warning"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            />
                            {station.status === "active"
                              ? "Active"
                              : station.status === "warning"
                                ? "High Volume"
                                : "Issue Detected"}
                          </div>
                        </TableCell>
                        <TableCell>{station.voters}</TableCell>
                        <TableCell>{station.capacity}</TableCell>
                        <TableCell>
                          {station.waitTime > 20 ? (
                            <span className="text-red-500 font-medium">{station.waitTime} min</span>
                          ) : station.waitTime > 10 ? (
                            <span className="text-yellow-500 font-medium">{station.waitTime} min</span>
                          ) : (
                            <span>{station.waitTime} min</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className={
                            station.voters / station.capacity > 0.8
                              ? "bg-red-500"
                              : station.voters / station.capacity > 0.6
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }>
                            <Progress
                              value={(station.voters / station.capacity) * 100}
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Verifications</CardTitle>
                <CardDescription>The latest voter verification attempts across all polling stations.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Polling Station</TableHead>
                      <TableHead>Processing Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRecentVerifications.map((verification) => (
                      <TableRow key={verification.id}>
                        <TableCell>{verification.time}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${
                                verification.status === "success" ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                            {verification.status === "success" ? "Success" : "Failed"}
                          </div>
                        </TableCell>
                        <TableCell>{verification.station}</TableCell>
                        <TableCell>{verification.duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current status of the verification system and infrastructure.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">System Uptime</span>
                      <span>{mockSystemStatus.uptime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Polling Stations</span>
                      <span>{mockSystemStatus.activePollingStations}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Status</span>
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                        <span>Healthy</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Response Time</span>
                      <span>124ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storage Usage</span>
                      <span>34%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last System Update</span>
                      <span>Today, 6:30 AM</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">System Alerts</h4>
                  <div className="rounded-md border p-4 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">High wait time at Oak Street Elementary</p>
                      <p className="text-sm text-muted-foreground">
                        Wait time has exceeded 20 minutes. Consider redirecting voters to nearby stations.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}