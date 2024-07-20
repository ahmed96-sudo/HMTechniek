import '../globals.css'
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
    title: 'HM Techniek',
    description: 'GFC Devis',
}

export default function showDevisLayout({ children }) {
    return (
        <html lang="en">
            <body className='bg-[white] m-0 h-[100vh]'>
                {children}
                <Analytics />
            </body>
        </html>
    )
}