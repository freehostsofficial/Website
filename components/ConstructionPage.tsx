import Link from "@/components/NoPrefetchLink";
import { type LucideIcon, Home, Mail, Server, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ConstructionPageProps = {
  icon: LucideIcon;
  title: string;
  message: string;
  progress: number;
};

export default function ConstructionPage({
  icon: Icon,
  title,
  message,
  progress,
}: ConstructionPageProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[700px] items-center px-4 py-12 sm:px-6">
      <Card className="mx-auto w-full">
        <CardContent className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-secondary">
            <Icon className="size-7" />
          </div>
          <h1>{title}</h1>
          <p className="max-w-sm text-muted-foreground">{message}</p>

          <div className="w-full" aria-hidden="true">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Estimated completion: Coming soon</p>
          </div>

          <div className="flex w-full items-center justify-center gap-2" aria-label="Build progress">
            <TimelineStep label="Started" done />
            <TimelineLine />
            <TimelineStep label="In Progress" done />
            <TimelineLine />
            <TimelineStep label="Completed" done={false} />
          </div>

          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Button asChild className="gap-1.5">
              <Link href="/">
                <Home className="size-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-1.5">
              <Link href="/hosts">
                <Server className="size-4" />
                Browse Hosts
              </Link>
            </Button>
            <Button asChild variant="ghost" className="gap-1.5">
              <a href={"mailto:support@" + process.env.EMAIL_DOMAIN}>
                <Mail className="size-4" />
                Contact Us
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function TimelineStep({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full border",
          done ? "border-accent bg-accent/15 text-accent" : "border-border text-muted-foreground",
        )}
      >
        {done && <Check className="size-3" />}
      </span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}

function TimelineLine() {
  return <span className="h-px w-6 bg-border" aria-hidden="true" />;
}
