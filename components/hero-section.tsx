import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-amber-50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 px-4 py-20 sm:py-32">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-40 h-40 rounded-full border-4 border-primary/20 pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full border-4 border-primary/20 pointer-events-none" />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-8 inline-block">
          <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Advanced URL Protection
          </span>
        </div>

        <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
          Phishing Detection With Advanced AI
        </h1>

        <p className="text-balance text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Protect yourself and your organization from phishing attacks with PhishGuard. Real-time URL analysis, confidence scoring, and actionable insights in seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2">
              Start Scanning
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>

        <div className="mt-16 pt-12 border-t border-border/30">
          <p className="text-sm text-muted-foreground mb-6">Trusted by security professionals worldwide</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="font-semibold text-foreground">SecureNet</div>
            <div className="font-semibold text-foreground">CyberShield</div>
            <div className="font-semibold text-foreground">TrustGuard</div>
            <div className="font-semibold text-foreground">SafeCloud</div>
          </div>
        </div>
      </div>
    </section>
  );
}
