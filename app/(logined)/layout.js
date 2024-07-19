import '../globals.css'
import FooterMenu from '../_components/Footer'

export const metadata = {
    title: 'HM Techniek',
    description: 'GFC Dashboard',
}

export default function loginedLayout({ children }) {
    return (
        <html lang="en">
            <body className='bg-[#F5F5FF] m-0 h-[100vh] flex flex-col'>
                {children}
                <FooterMenu />
            </body>
        </html>
    )
}