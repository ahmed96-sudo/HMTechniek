import '../globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: 'HM Techniek Login',
  description: 'GFC Login',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
