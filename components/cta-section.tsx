import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CtaSection() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="mx-auto max-w-4xl">
        <Card className="relative overflow-hidden p-12 sm:p-16 bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground text-center">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-foreground/10 rounded-full -ml-16 -mb-16" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready To Protect Your Organization?
            </h2>

            <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of organizations using PhishGuard to detect and
              prevent phishing attacks. Start your free trial today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary">
                  Get Started Free
                </Button>
              </Link>
              <Link href="#contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
