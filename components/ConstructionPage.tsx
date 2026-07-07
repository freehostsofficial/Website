import Link from "@/components/NoPrefetchLink";
import { type LucideIcon, Home, Mail, Server } from "lucide-react";

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
    <main className="wrap">
      <section className="construction-hero">
        <div className="construction-hero-icon">
          <Icon size={48} aria-hidden="true" />
        </div>
        <div className="construction-card">
          <div className="construction-bg-blob" />
          <h1 className="construction-title">{title}</h1>
          <p className="construction-message">{message}</p>

          <div className="construction-progress" aria-hidden="true">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="timeline-label">Estimated completion: Coming soon</p>

          <div className="construction-timeline" aria-label="Build progress">
            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-label">Started</div>
            </div>
            <div className="timeline-line" />
            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-label">In Progress</div>
            </div>
            <div className="timeline-line" />
            <div className="timeline-item">
              <div className="timeline-dot timeline-dot-muted" />
              <div className="timeline-label">Completed</div>
            </div>
          </div>

          <div className="construction-actions">
            <Link className="btn primary" href="/">
              <Home size={14} aria-hidden="true" /> Back to Home
            </Link>
            <Link className="btn" href="/hosts">
              <Server size={14} aria-hidden="true" /> Browse Hosts
            </Link>
            <a className="btn ghost" href={"mailto:support@" + process.env.EMAIL_DOMAIN} >
              <Mail size={14} aria-hidden="true" /> Contact Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
