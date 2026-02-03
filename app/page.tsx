import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/PublicNav";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      <PublicNav />

      {/* Hero Section */}
      <section className="text-center py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4">
            Experience the Premium Fitness Lifestyle
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Manage your membership, book classes, and track your progress. Everything you need for your fitness journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto text-lg h-12 sm:h-14 px-10 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Link href="/register">Book a Class</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-lg h-12 sm:h-14 px-10 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Link href="/login">Member Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-card border rounded-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-3">Personal Training</h3>
              <p className="text-muted-foreground">
                Achieve your goals faster with personalized training programs designed just for you by our expert coaches.
              </p>
            </div>
            <div className="p-8 bg-card border rounded-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-3">Group Classes</h3>
              <p className="text-muted-foreground">
                Join our diverse range of group fitness classes, from high-energy cardio to strength and flexibility.
              </p>
            </div>
            <div className="p-8 bg-card border rounded-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-semibold mb-3">Wellness Programs</h3>
              <p className="text-muted-foreground">
                Explore holistic wellness programs including nutrition guidance, mindfulness, and recovery sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12">
            Why Choose Fit Space
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345h5.584a.563.563 0 01.321.988l-4.204 3.055a.563.563 0 00-.182.557l1.528 4.702a.562.562 0 01-.828.63l-4.203-3.055a.563.563 0 00-.58 0l-4.204 3.055a.562.562 0 01-.828-.63l1.528-4.702a.563.563 0 00-.182-.557l-4.204-3.055a.563.563 0 01.321-.988h5.584a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Coaching</h3>
              <p className="text-muted-foreground">Our certified coaches provide personalized guidance to help you reach your full potential.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Supportive Community</h3>
              <p className="text-muted-foreground">Join a motivating community that inspires you to stay active and achieve your best.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">State-of-the-Art Facilities</h3>
              <p className="text-muted-foreground">Train in a modern, fully equipped environment designed for your comfort and success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary border-t">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Fit Space. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}