import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Lock, Cloud, Globe, Key, Database } from 'lucide-react';

const services = [
  {
    icon: Lock,
    title: 'URL Security',
    description: 'Real-time analysis of URLs for phishing attempts, malware, and suspicious content.',
    features: ['Instant scanning', 'Threat classification', 'Risk scoring'],
  },
  {
    icon: Globe,
    title: 'Domain Intelligence',
    description: 'Deep analysis of domain reputation, age, SSL certificates, and historical data.',
    features: ['Domain history', 'Whois lookup', 'SSL analysis'],
  },
  {
    icon: Database,
    title: 'Pattern Recognition',
    description: 'Advanced algorithms detect phishing patterns and social engineering techniques.',
    features: ['ML detection', 'Pattern matching', 'Anomaly detection'],
  },
  {
    icon: Cloud,
    title: 'API Integration',
    description: 'Seamlessly integrate PhishGuard into your security infrastructure and workflows.',
    features: ['REST API', 'Webhooks', 'Real-time alerts'],
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 px-4 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Comprehensive Protection Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our suite of tools provides complete phishing detection and prevention capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="p-8 bg-card hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {service.title}
                    </h3>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-safe flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
