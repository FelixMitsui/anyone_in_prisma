"use client"
import React, { useState } from 'react';
import { signIn } from 'next-auth/react'
import { useSession, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

const SignModal = () => {

    const { data: session } = useSession();
    const [showSignModal, setShowSignModal] = useState<boolean>(false);
    const router = useRouter();

    const handleToggleSign = () => {
        setShowSignModal((prev: boolean) => !prev);
    };

    const handleSignOut = () => {
        signOut();
        router.push('/');
    }
    return (
        <>
            {session ? <button type="button" className="px-1 rounded font-bold border-2 border-slate-500 bg-orange-300 text-xl" onClick={() => handleSignOut()}> <p >Sign out</p> </button> : <button type="button" className="px-1 rounded border-2 bg-orange-300 border-slate-500 text-xl" onClick={handleToggleSign}> <p className="text-xl font-bold" >Sign in</p></button>}
            {showSignModal && <div className="z-20 fixed top-10 left-20 right-20 bottom-10 flex justify-center">
                <div className="relative bg-slate-200 border-y-2 border-rose-500 p-4 m-10  min-h-max flex flex-col">
                    <button type="button" onClick={() => handleToggleSign()} className="bg-rose-500 rounded-full absolute top-0 right-0 m-1"><i className="bx bx-x text-white m-1 text-xl"></i></button>
                    <fieldset disabled={true}>
                        <form className="">
                            <h1 className="text-center font-bold text-xl font-title">Sign in</h1>
                            <div className="flex items-center flex-col">
                                <div className="m-3 flex "><label className="text-left  text-xl w-20 text-center">Email: </label><input type="text" className="ms-1 form-input shadow" /></div>
                                <div className="m-3 flex "><label className="text-left  text-xl w-20 ">Password:</label><input type="text" className="ms-1 form-input shadow" /></div>
                                <button type="submit" disabled className="p-1 my-2 self-end rounded-md bg-orange-300  font-btn">Sign in</button>
                            </div>
                        </form>
                    </fieldset>
                    <hr className=" bg-black h-0.5 w-full" />
                    <p className=" text-xl text-center">more</p>
                    <button type="button" className="p-1 my-2 self-end rounded-md bg-orange-300  font-btn" onClick={() => signIn()}><i className='text-xl bx bxl-google'></i>SignIn of google</button>
                </div>
            </div>}

        </>
    )
};

export default SignModal;