/**
 * Dhikr Page Loading Component
 */

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DhikrLoading() {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-background relative safe-area-top">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" disabled>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <Skeleton className="h-5 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-8 mr-2" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        </div>
      </header>

      {/* Progress Overview */}
      <section className="p-4 bg-gradient-to-br from-chart-3/10 to-chart-1/10">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Sun className="w-5 h-5 text-chart-3" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <Skeleton className="h-2 w-full rounded-full mb-2" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Session Tabs */}
      <section className="px-4">
        <Tabs defaultValue="morning">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="morning">
              <Sun className="w-4 h-4 mr-2" />
              Pagi
            </TabsTrigger>
            <TabsTrigger value="evening">
              <Moon className="w-4 h-4 mr-2" />
              Petang
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </section>

      {/* Dhikr List */}
      <section className="p-4 pb-24">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <Skeleton className="w-8 h-8 rounded-lg" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Arabic Text */}
                <div className="arabic-text">
                  <Skeleton className="h-8 w-full mb-2" />
                  <Skeleton className="h-8 w-3/4" />
                </div>

                {/* Translation */}
                <div>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-2/3" />
                </div>

                {/* Counter */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 mx-4">
                    <Skeleton className="h-6 w-16 mx-auto mb-2" />
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                  <Skeleton className="w-10 h-10 rounded-lg" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <BottomNavigation />
    </div>
  )
}