import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Activity, User, TrendingUp } from "lucide-react";
import PaymentsHistory from "@/components/PaymentsHistory";
import { mockClasses, mockPayments } from "@/lib/mock-data";

export default function CabinetPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">Member cabinet UI preview (backend disabled)</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membership</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">Demo member</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockClasses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">classes available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge>UI only</Badge>
            <p className="text-xs text-muted-foreground mt-1">No bookings or payments are processed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Navigate the prototype screens</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Button asChild variant="outline" className="justify-start h-auto py-4">
            <Link href="/cabinet/schedule"><Calendar className="h-5 w-5 mr-3" />Open Schedule</Link>
          </Button>
          <Button asChild variant="outline" className="justify-start h-auto py-4">
            <Link href="/cabinet/plans"><Activity className="h-5 w-5 mr-3" />View Plans</Link>
          </Button>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Recent Payments</h2>
          <p className="text-sm text-muted-foreground">Demo transactions</p>
        </div>
        <PaymentsHistory payments={mockPayments} />
      </section>
    </div>
  );
}
