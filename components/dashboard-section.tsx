'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChatContainer } from '@/components/chat-container';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function DashboardSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 via-background to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Try PhishGuard Now
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test our URL detection engine instantly. Scan any URL and get detailed analysis.
          </p>
        </div>

        <Card className="overflow-hidden bg-card border-2 border-primary/20 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-96">
            {/* Chat Interface */}
            <div className="lg:col-span-2 bg-background border-r border-border">
              <div className="h-full overflow-hidden">
                <ChatContainer />
              </div>
            </div>

            {/* Info Panel */}
            <div className="flex flex-col justify-between p-8 bg-gradient-to-b from-primary/5 to-background">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  How It Works
                </h3>

                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-semibold text-primary mb-2">Step 1</div>
                    <p className="text-sm text-muted-foreground">
                      Paste or enter any URL you want to check
                    </p>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-primary mb-2">Step 2</div>
                    <p className="text-sm text-muted-foreground">
                      Our AI analyzes the URL in real-time
                    </p>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-primary mb-2">Step 3</div>
                    <p className="text-sm text-muted-foreground">
                      Get instant results with confidence scoring
                    </p>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-primary mb-2">Step 4</div>
                    <p className="text-sm text-muted-foreground">
                      View detailed technical analysis and recommendations
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border">
                <Link href="/dashboard" className="w-full">
                  <Button className="w-full gap-2">
                    Full Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
