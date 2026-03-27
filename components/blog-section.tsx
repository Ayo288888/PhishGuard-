import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const articles = [
  {
    title: 'How to Protect Yourself From Phishing Attacks',
    excerpt:
      'Learn the latest techniques cybercriminals use to trick users and how to defend yourself against them.',
    date: 'March 15, 2024',
    readTime: '5 min read',
  },
  {
    title: 'Understanding Advanced Phishing Tactics',
    excerpt:
      'Deep dive into sophisticated phishing strategies and how modern detection systems identify them.',
    date: 'March 10, 2024',
    readTime: '8 min read',
  },
  {
    title: 'Building a Security-First Culture',
    excerpt:
      'How organizations can train employees to recognize and report phishing attempts effectively.',
    date: 'March 5, 2024',
    readTime: '6 min read',
  },
];

export function BlogSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-blue-50/30 to-background dark:via-slate-900/30">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Latest News & Insights
          </h2>
          <p className="text-lg text-muted-foreground">
            Stay informed about phishing threats and security best practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Card key={index} className="overflow-hidden bg-card hover:shadow-lg transition-shadow flex flex-col">
              {/* Placeholder Image */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5" />

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <span>{article.date}</span>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {article.title}
                </h3>

                <p className="text-muted-foreground mb-6 flex-1">
                  {article.excerpt}
                </p>

                <Button variant="ghost" className="self-start gap-2 px-0 text-primary hover:bg-transparent">
                  Read More
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
