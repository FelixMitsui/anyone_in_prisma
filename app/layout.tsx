import React from 'react'
import dynamic from 'next/dynamic';
import '@/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ReduxProvider = dynamic(() => import('@/redux/provider'), { ssr: false });
const MassageModal = dynamic(() => import('@/components/MassageModal'), { ssr: false });

const metadata = {
    title: 'Anyone_vote',
    description: 'About vote Activity.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content={metadata.description} />
                <title>{metadata.title}</title>
                <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
            </head>
            <body>
                <ReduxProvider>
                    <Header />
                    <MassageModal />
                    <main className="py-24 px-8 min-h-screen flex flex-col items-center">
                        {children}
                    </main>
                </ReduxProvider>
                <Footer />
            </body>
        </html>
    )
}