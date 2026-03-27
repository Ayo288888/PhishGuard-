import { Card } from '@/components/ui/card';

const stats = [
  { value: '50M+', label: 'URLs Analyzed' },
  { value: '99.9%', label: 'Detection Accuracy' },
  { value: '500+', label: 'Global Partners' },
  { value: '24/7', label: 'Support Available' },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Phishing Protection <span className="text-primary">Made Simple</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              PhishGuard combines cutting-edge AI with cybersecurity expertise to detect phishing attempts before they cause damage. Our platform is trusted by thousands of organizations worldwide.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Every day, millions of phishing emails are sent targeting individuals and organizations. Our real-time detection engine analyzes URLs instantly, protecting you from sophisticated attacks.
            </p>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-8 text-center bg-card hover:shadow-lg transition-shadow">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
