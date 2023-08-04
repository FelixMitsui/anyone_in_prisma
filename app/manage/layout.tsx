'use client'
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Link from 'next/link';
import '@/globals.css';
import { useMatch } from 'react-router-dom';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    const managePath = useMatch('/manage');
    const votesPath = useMatch('/manage/votes');

    const [focusBtn, setFocusBtn] = useState<{ create: boolean, votes: boolean }>({ create: true, votes: false });

    useEffect(() => {
        if (managePath) {
            setFocusBtn({ create: true, votes: false });
        } else if (votesPath) {
            setFocusBtn({ create: false, votes: true });
        }
    }, [])

    return (
        <div className="min-w-full flex flex-col">
            <h1 className="font-title text-3xl col-span-3 my-2">Manage</h1>
            <div className="flex">
                <Link href="/manage"><button type="button" onClick={() => setFocusBtn({ create: true, votes: false })} className={`mr-2 bg-${focusBtn?.create ? 'white' : 'slate-500'} z-30 font-bold rounded-tl rounded-tr p-2 relative top-px text-2xl border-2  border-b-0 border-slate-500`}>Create</button></Link>
                <Link href="/manage/votes"><button type="button" onClick={() => setFocusBtn({ create: false, votes: true })} className={`mr-2 bg-${focusBtn?.votes ? 'white' : 'slate-500'} z-30 font-bold rounded-tl rounded-tr p-2 relative top-px text-2xl border-2  border-b-0 border-slate-500`}>View votes</button></Link>
            </div>
            <div className="bg-white border-2 border-slate-500 p-10">
                {children}
            </div>
        </div>
    )
}