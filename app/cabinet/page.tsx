import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getCompany,
  getCustomers,
  getPushPressCustomerByEmail,
  getUpcomingClasses,
} from "@/lib/pushpress";
import Link from "next/link";
import PaymentsHistory from "@/components/PaymentsHistory";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Activity, CreditCard, User, TrendingUp, ChevronRight } from "lucide-react";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";

export default async function CabinetPage() {
  const session = await auth();
  const email = session?.user?.email;

  const company = await getCompany();
  if (!company) return <div>Error loading profile</div>;

  const customers = await getCustomers(company.id);
  const data = customers?.data;
  if (!data) return <div>Error loading profile</div>;
  const resultArray = data?.resultArray;

  const customer = resultArray?.find((customer) => customer.email === email);
  if (!customer) return <div>Error loading profile</div>;
  if (!email) return <div>Error loading profile</div>;

  const [member, upcomingClasses, dbUser, payments] = await Promise.all([
    getPushPressCustomerByEmail(email),
    getUpcomingClasses(),
    db.user.findUnique({
      where: { email },
      select: { id: true }
    }),
    db.payment.findMany({
      where: { user: { email } },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  if (!member) {
    return (
      <div className="container py-8">
        <Card className="max-w-md mx-auto p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">
            Could not retrieve PushPress data.
          </p>
        </Card>
      </div>
    );
  }

  // Filter upcoming classes (future only) and get stats
  const now = Date.now();
  const futureClasses = upcomingClasses.filter(cls => (cls.start * 1000) > now);
  const nextClasses = futureClasses.slice(0, 3);
  const thisWeek = futureClasses.filter(cls => {
    const classDate = new Date(cls.start * 1000);
    const weekFromNow = new Date(now + 7 * 24 * 60 * 60 * 1000);
    return classDate <= weekFromNow;
  });

  // Member since date
  const memberSince = member.membershipDetails?.initialMembershipStartDate
    ? new Date(member.membershipDetails.initialMembershipStartDate)
    : null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <header className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {customer.name.first}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your fitness journey
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/cabinet/schedule">
              <Calendar className="h-4 w-4 mr-2" />
              View Schedule
            </Link>
          </Button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Membership Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Membership
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{member.role}</div>
            {memberSince && (
              <p className="text-xs text-muted-foreground mt-1">
                Member since {memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Classes This Week */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              This Week
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeek.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {thisWeek.length === 1 ? 'class' : 'classes'} scheduled
            </p>
          </CardContent>
        </Card>

        {/* Total Upcoming */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Classes
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{futureClasses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready to book
            </p>
          </CardContent>
        </Card>


      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your membership and bookings</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="outline" className="h-auto py-4 justify-start">
            <Link href="/cabinet/schedule">
              <Calendar className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Book a Class</div>
                <div className="text-xs text-muted-foreground">Browse schedule</div>
              </div>
            </Link>
          </Button>

          <Button asChild variant="outline" className="h-auto py-4 justify-start">
            <Link href="/cabinet/plans">
              <Activity className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Browse Plans</div>
                <div className="text-xs text-muted-foreground">View memberships</div>
              </div>
            </Link>
          </Button>


        </CardContent>
      </Card>

      <Separator />

      {/* Upcoming Classes Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Next Classes
            </h2>
            <p className="text-sm text-muted-foreground">
              Your upcoming sessions
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/cabinet/schedule">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {nextClasses.length === 0 ? (
          <Card className="p-12 text-center border-dashed bg-muted/5">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              No upcoming classes booked yet
            </p>
            <Button asChild>
              <Link href="/cabinet/schedule">Browse Schedule</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {nextClasses.map((cls) => {
              const startDate = new Date(cls.start * 1000); // Fix: Convert Unix seconds to milliseconds
              const endDate = new Date(cls.end * 1000); // Fix: Convert Unix seconds to milliseconds
              const isToday = startDate.toDateString() === new Date().toDateString();
              const isTomorrow = startDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

              let dateLabel = startDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              });
              if (isToday) dateLabel = 'Today';
              if (isTomorrow) dateLabel = 'Tomorrow';

              return (
                <Card
                  key={cls.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="bg-primary/5 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{cls.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {cls.assistantCoachUuid || 'Instructor TBA'}
                        </CardDescription>
                      </div>
                      {(isToday || isTomorrow) && (
                        <Badge variant="secondary" className="ml-2">
                          {dateLabel}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {!isToday && !isTomorrow && dateLabel}
                        {(isToday || isTomorrow) && startDate.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {startDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })} - {endDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      Cancel Booking
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Separator />

      {/* Payment History */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Recent Payments</h2>
          <p className="text-sm text-muted-foreground">Your recent transactions via JCC</p>
        </div>
        <PaymentsHistory payments={payments || []} />
      </section>

      <PwaInstallPrompt />
    </div>
  );
}

