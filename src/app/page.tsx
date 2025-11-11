import Link from 'next/link';
import { Building, Wrench, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/layout/Logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/login">Open Application</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-32">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight mb-4">
            Effortless Property Maintenance
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            PropertyCare Pro helps you log, track, and manage maintenance tasks for your rental properties with ease. Stay organized and keep your tenants happy.
          </p>
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/login">Get Started</Link>
          </Button>
        </section>

        <section className="bg-secondary/50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold font-headline text-center mb-12">
              All-in-One Maintenance Solution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/20 rounded-full mb-4">
                    <Building className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle>Property Management</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Easily add and manage all your rental properties in one centralized location.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/20 rounded-full mb-4">
                    <Wrench className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle>Task Tracking</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Assign tasks, set deadlines, and monitor progress from "open" to "completed".</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="p-4 bg-primary/20 rounded-full mb-4">
                    <ClipboardList className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle>Detailed Records</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Keep a log of all maintenance work with photos, comments, and status updates for each task.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PropertyCare Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
