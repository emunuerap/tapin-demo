import './globals.css'
import FeedbackToggle from '@/components/FeedbackToggle'

export const metadata = {
  title: 'TapIn · Demo',
  description: 'TapIn demo web app: dashboard + booking widget.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="bg" />
        {children}
        <FeedbackToggle />
      </body>
    </html>
  )
}
