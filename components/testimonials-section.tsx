import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    title: 'Security Director, TechCorp',
    content:
      'PhishGuard has been instrumental in protecting our organization from phishing attacks. The real-time detection is incredibly fast and accurate.',
    rating: 5,
  },
  {
    name: 'James Mitchell',
    title: 'IT Manager, FinanceFlow',
    content:
      'Implementation was seamless and the support team was exceptional. Our security team loves the detailed reports.',
    rating: 5,
  },
  {
    name: 'Maria Rodriguez',
    title: 'CEO, SecureStart',
    content:
      'The confidence scoring system helped us understand threat levels better. Highly recommend PhishGuard to any organization.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Trusted By Security Professionals
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our customers say about PhishGuard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-8 bg-card flex flex-col">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                &quot;{testimonial.content}&quot;
              </p>

              <div>
                <div className="font-semibold text-foreground">
                  {testimonial.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.title}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
