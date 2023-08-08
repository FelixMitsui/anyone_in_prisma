"use client"
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { logIn } from "@/redux/features/user";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "@/redux/store";
import SignModal from "../SignModal";

const Header = () => {

    const [isToggleCanvas, setIsToggleCanvas] = useState<boolean>(false);
    const { id: user_id, auth, emails } = useSelector((state: RootState) => state.userReducer.value);
    const userRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { data: session } = useSession();

    const handleToggleCanvas = (event: MouseEvent | React.MouseEvent): void => {
        event.stopPropagation();
        const userCurrent = userRef.current;

        if (!userCurrent?.contains(event.target as Node) &&
            isToggleCanvas || userCurrent?.contains(event.target as Node) &&
            !canvasRef.current?.contains(event.target as Node)) {
            setIsToggleCanvas((prev: boolean) => !prev);
        }

    };

    useEffect(() => {

        if (!session) return;
        const handleSignIn = async () => {
            try {
                const res = await fetch(`${process.env.BASE_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: session?.user?.email as string })
                })

                if (res.ok) {
                    const { id, auth, emails, vote_info } = await res.json();
                    dispatch(logIn({ id, auth, emails, vote_info }));

                } else {
                    try {
                        const res = await fetch(`${process.env.BASE_URL}/api/register`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email: session?.user?.email })
                        });

                        if (res.ok) {
                            const { id, emails, vote_info } = await res.json();
                            dispatch(logIn({ id, auth, emails, vote_info }));
                        } else {
                            console.log('Failed to register');
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
            catch (error) {
                console.error(error);
                return false;
            }
        }
        handleSignIn();
    }, [session, auth, dispatch]);

   
    useEffect(() => {

        document.addEventListener('click', handleToggleCanvas);

        return () => {

            document.removeEventListener('click', handleToggleCanvas);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isToggleCanvas]);

    return (
        <>
            <div data-testid="headerWrapper" className=" z-50 fixed left-0 right-0 bg-rose-500 grid grid-cols-3 items-center justify-items-center">
                <div><h1 className="mx-2 font-title text-3xl text-red-200"><Link href="/">ANYONE VOTE</Link></h1></div>
                <nav className="col-start-2 p-1 mx-2">
                    <ul className="font-nav text-2xl text-slate-300">
                        <li><Link href="/votes" className="">Votes</Link></li>
                    </ul></nav>
                <div data-testid="userCanvas" className="relative  flex rounded bg-slate-300 m-3 p-2 col-start-3 justify-self-end"  ref={userRef} >

                    {isToggleCanvas &&
                        <>
                            <div data-testid="userModal" className="w-max absolute top-10 right-0.5 bg-slate-300 p-3 flex flex-col items-center" ref={canvasRef} >
                                {user_id && <>
                                    <p className="text-xl font-bold">ID :<span className="m-2 text-sky-600">{user_id}</span></p>
                                    <p className="text-xl font-bold">Email :<span className="m-2 text-sky-600">{emails[0].address}</span></p>
                                </>}
                                <hr className="h-1 w-full border-black" />
                                <ul className="p-3 whitespace-nowrap">
                                    {auth & 1 ? <li><i className="bx bxs-edit-alt text-xl"></i><Link href={`/manage`} className="text-2xl font-bold">manage</Link></li> : null}
                                </ul>
                                <SignModal />
                            </div>
                        </>
                    }

                    <button type="button"  className="px-0.5" onClick={(event) => handleToggleCanvas(event)}><i className="text-xl bx bxs-user "></i></button>
                </div>
            </div>
        </>
    )
}


export default Header;