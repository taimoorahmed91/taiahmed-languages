import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/verify-email")({
  head: () => ({ meta: [{ title: "Verify your email — Lingua" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    email: (search.email as string) || "",
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { email } = Route.useSearch();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <Mail className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
        <p className="text-muted-foreground mb-6">
          We sent a verification link to{" "}
          <span className="text-foreground font-medium">{email || "your inbox"}</span>.
          Click it to activate your account, then sign in.
        </p>
        <Link to="/login" className="text-primary font-medium hover:underline">
          Back to sign in
        </Link>
      </Card>
    </div>
  );
}