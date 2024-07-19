import '../globals.css'

export const metadata = {
    title: 'HM Techniek',
    description: 'GFC Facture',
}

export default function showFactureLayout({ children }) {
    return (
        <html lang="en">
            <body className='bg-[white] m-0 h-[100vh]'>
                {children}
            </body>
        </html>
    )
}