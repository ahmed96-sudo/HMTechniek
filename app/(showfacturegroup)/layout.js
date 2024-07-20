import '../globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
    title: 'HM Techniek',
    description: 'GFC Facture',
}

export default function showFactureLayout({ children }) {
    return (
        <html lang="en">
            <body className='bg-[white] m-0 h-[100vh]'>
                {children}
                <Analytics />
            </body>
        </html>
    )
}