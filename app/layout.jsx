import './globals.css'
import { Manrope, Fraunces } from 'next/font/google'
import FeedbackToggle from '@/components/FeedbackToggle'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-ui', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' })

export const metadata = {
  title: 'TapIn · Demo',
  description: 'TapIn demo web app: dashboard + booking widget.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body>
        <div className="bg" />
        <FeedbackToggle />
        {children}

        
      </body>
    </html>
  )
}
