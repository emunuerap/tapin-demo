import './globals.css'

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
      </body>
    </html>
  )
}
