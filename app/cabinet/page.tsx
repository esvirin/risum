import { auth } from "@/lib/auth";
import { getCompany, getCustomers, getPushPressMemberByEmail, getUpcomingClasses } from "@/lib/pushpress";
import Link from "next/link";
import PaymentButton from "@/components/PaymentButton";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

    console.log(customer)

    const [member, upcomingClasses] = await Promise.all([
        getPushPressMemberByEmail(email),
        getUpcomingClasses(),
    ]);


    console.log(member)

    const myClasses = upcomingClasses.slice(0, 2);


    if (!member) {
        return (
            <div className="container py-8">
                <Card className="max-w-md mx-auto p-8 text-center">
                    <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
                    <p className="text-muted-foreground">Could not retrieve PushPress data.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Hello, {customer.name.first} {customer.name.last}</h1>
                <p className="text-muted-foreground">Welcome to your personal dashboard {customer.email}</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Membership Status Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Membership</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-1">{member.planName}</div>
                        <div className="flex items-center justify-between mt-4">
                            <Badge variant={member.membershipStatus === 'active' ? 'default' : 'destructive'}
                                className={member.membershipStatus === 'active' ? 'bg-primary/20 text-primary hover:bg-primary/30 shadow-none' : ''}>
                                {member.membershipStatus.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                {member.classesRemaining > 1000 ? "Unlimited" : `${member.classesRemaining} credits left`}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / Payment */}
                <Card className="flex flex-col justify-between">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">€0.00</div>
                        <p className="text-sm text-muted-foreground mt-1">Next billing cycle: 01 Feb</p>
                    </CardContent>
                    <CardFooter>
                        <PaymentButton />
                    </CardFooter>
                </Card>
            </div>

            <Separator />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold tracking-tight">Upcoming Classes</h2>
                    <Button asChild variant="secondary">
                        <Link href="/cabinet/schedule">View Full Schedule</Link>
                    </Button>
                </div>

                {myClasses.length === 0 ? (
                    <Card className="p-12 text-center text-muted-foreground border-dashed bg-muted/5">
                        No upcoming classes booked.
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {myClasses.map((cls) => (
                            <Card key={cls.id} className="flex items-center justify-between p-6">
                                <div>
                                    <div className="text-lg font-semibold">{cls.title}</div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {new Date(cls.start).toLocaleDateString()} at {new Date(cls.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Cancel</Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
