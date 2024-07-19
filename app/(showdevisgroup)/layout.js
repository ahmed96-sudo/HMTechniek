import '../globals.css'

export const metadata = {
    title: 'HM Techniek',
    description: 'GFC Devis',
}

export default function showDevisLayout({ children }) {
    return (
        <html lang="en">
            <body className='bg-[white] m-0 h-[100vh]'>
                {children}
            </body>
        </html>
    )
}