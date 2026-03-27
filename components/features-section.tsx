import { Card } from '@/components/ui/card';
import { Shield, Zap, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Real-Time Detection',
    description: 'Instantly analyze URLs and identify phishing threats with advanced machine learning algorithms.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get results in milliseconds with our optimized detection engine and global infrastructure.',
  },
  {
    icon: BarChart3,
    title: 'Detailed Reports',
    description: 'Access comprehensive analysis including confidence scores, domain history, and threat indicators.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden p-8 hover:shadow-lg transition-shadow bg-card"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-8 -mt-8" />
                
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
