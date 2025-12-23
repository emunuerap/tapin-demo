'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="container">
      <div className="panel hero">
        <div className="heroTop">
          <div className="brandRow">
            <img
              src="/brand/tapin_logo.png"
              alt="TapIn"
              className="brandLogo"
            />
            <div className="brandMeta">
              <div className="brandName">TapIn</div>
              <div className="brandTag">Hospitality Booking · Operations Dashboard · Embeddable Widget</div>
            </div>
          </div>

          <div className="prefsLink">
            <Link className="btn" href="/dashboard/settings">Settings</Link>
          </div>
        </div>

        <div className="heroGrid">
          <div className="heroCopy">
            <motion.h1
              className="h1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              A functional demo for frictionless reservations and restaurant operations.
            </motion.h1>

            <motion.p
              className="lead"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.06 }}
            >
              This demonstrator showcases a modern booking flow, a lightweight back-office dashboard,
              and an embeddable widget designed for fast conversions with minimal friction.
            </motion.p>

            <motion.div
              className="heroActions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
            >
              <Link className="btn btnPrimary" href="/dashboard">Open dashboard</Link>
              <Link className="btn" href="/widget">Widget preview</Link>
              <Link className="btn" href="/embed/widget">Open embed</Link>
            </motion.div>

            <div className="hr" />

            <div className="tfgBlock">
              <div className="tfgTitle">TFG (UOC) · Demonstrator context</div>
              <div className="tfgText">
                Developed as part of the Final Degree Project (UOC) to validate UX decisions, interaction patterns,
                and a cohesive visual system for a hospitality booking experience. Data and availability are simulated
                in memory for demonstration purposes.
              </div>
            </div>
          </div>

          <div className="heroCards">
            <DemoCard
              title="Restaurant Dashboard"
              desc="Operational overview: arrivals, statuses, and quick scanning for service."
              href="/dashboard"
              tag="Back-office"
              icon="▦"
            />
            <DemoCard
              title="Web Widget"
              desc="A fast booking interface designed to be embedded in restaurant websites."
              href="/widget"
              tag="Conversion UX"
              icon="◉"
            />
            <DemoCard
              title="Embed Route"
              desc="Embeddable endpoint with query parameters (restaurant, accent, compact)."
              href="/embed/widget"
              tag="Integration"
              icon="⌁"
            />
          </div>
        </div>
      </div>
    </main>
  )
}

function DemoCard({ title, desc, href, tag, icon }) {
  return (
    <motion.div
      className="card3d"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Link href={href} className="cardLink">
        <div className="cardHead">
          <div className="cardIcon">{icon}</div>
          <span className="badge badgeGlow">{tag}</span>
        </div>
        <div className="cardTitle">{title}</div>
        <div className="cardDesc">{desc}</div>
        <div className="cardCta">
          <span>Open</span>
          <span className="arrow">↗</span>
        </div>
      </Link>
    </motion.div>
  )
}
