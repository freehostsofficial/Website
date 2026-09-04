import Link from 'next/link'
import { ArrowLeft, Home, Server, X } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Host Not Found',
  description: 'The host you are looking for does not exist or has been removed.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function HostNotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-icon">
          <Server size={48} aria-hidden="true" />
          <div className="not-found-icon-overlay">
            <X size={20} aria-hidden="true" />
          </div>
        </div>
        <h1 className="not-found-title">404 - Host Not Found</h1>
        <p className="not-found-text">The host you&apos;re looking for doesn&apos;t exist or may have been removed from our directory.</p>
        <div className="not-found-actions">
          <Link href="/hosts" className="not-found-btn primary"><ArrowLeft size={14} aria-hidden="true" /> Back to All Hosts</Link>
          <Link href="/" className="not-found-btn secondary"><Home size={14} aria-hidden="true" /> Go to Homepage</Link>
        </div>
      </div>
    </main>
  )
}
