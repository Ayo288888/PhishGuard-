'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CheckCircle2, AlertTriangle, XCircle, ChevronDown, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BotAnalysisProps {
  analysis: {
    status: 'safe' | 'suspicious' | 'malicious';
    confidence: number;
    ip?: string;
    domainAge?: string;
    redirects?: number;
  } | undefined;
  url: string;
}

export function BotAnalysis({ analysis, url }: BotAnalysisProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!analysis) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusConfig = {
    safe: {
      color: 'bg-safe text-safe-foreground',
      icon: CheckCircle2,
      label: 'Safe',
      description: 'This URL appears to be legitimate and safe to visit.',
    },
    suspicious: {
      color: 'bg-suspicious text-suspicious-foreground',
      icon: AlertTriangle,
      label: 'Suspicious',
      description: 'This URL shows signs of being potentially malicious. Proceed with caution.',
    },
    malicious: {
      color: 'bg-malicious text-malicious-foreground',
      icon: XCircle,
      label: 'Malicious',
      description: 'This URL is likely to be phishing or malware. Do not visit.',
    },
  };

  const config = statusConfig[analysis.status];
  const IconComponent = config.icon;

  return (
    <div className="flex justify-start">
      <Card className="w-full max-w-xl border-border bg-card">
        {/* Status Header */}
        <div className={`${config.color} rounded-t-xl px-6 py-4`}>
          <div className="flex items-start gap-3">
            <IconComponent className="h-6 w-6 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold">{config.label}</h3>
              <p className="mt-1 text-sm opacity-90">{config.description}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 px-6 py-4">
          {/* URL Display */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Scanned URL</p>
            <div className="flex items-start justify-between gap-2 rounded-lg bg-muted/50 p-3">
              <p className="break-all font-mono text-sm text-foreground">{url}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-6 w-6 flex-shrink-0 p-0"
                title="Copy URL"
              >
                {copied ? <Check className="h-4 w-4 text-safe" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">Confidence Score</p>
              <span className="text-sm font-semibold text-foreground">{analysis.confidence}%</span>
            </div>
            <Progress value={analysis.confidence} className="h-2" />
          </div>

          {/* Technical Details */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto w-full justify-between px-0 py-2 text-xs font-medium text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                Technical Details
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 border-t border-border pt-3">
              {analysis.ip && (
                <div className="flex items-start justify-between text-sm">
                  <span className="text-muted-foreground">IP Address</span>
                  <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-foreground">
                    {analysis.ip}
                  </code>
                </div>
              )}
              {analysis.domainAge && (
                <div className="flex items-start justify-between text-sm">
                  <span className="text-muted-foreground">Domain Age</span>
                  <span className="font-medium text-foreground">{analysis.domainAge}</span>
                </div>
              )}
              {analysis.redirects !== undefined && (
                <div className="flex items-start justify-between text-sm">
                  <span className="text-muted-foreground">Redirects Detected</span>
                  <span className={`font-medium ${analysis.redirects > 2 ? 'text-suspicious' : 'text-foreground'}`}>
                    {analysis.redirects}
                  </span>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Card>
    </div>
  );
}
