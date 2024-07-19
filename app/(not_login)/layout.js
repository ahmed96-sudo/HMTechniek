import '../globals.css'

export const metadata = {
  title: 'HM Techniek Login',
  description: 'GFC Login',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
