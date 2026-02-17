import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-extrabold tracking-tight">Fitness Space</CardTitle>
          <CardDescription className="text-base">UI-only mode: authentication is disabled</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Button asChild className="w-full py-6 text-base font-medium">
            <Link href="/cabinet">Open Member Cabinet</Link>
          </Button>
          <p className="pt-2 text-center text-xs text-muted-foreground">
            Social login and registration flows are removed in this build.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
