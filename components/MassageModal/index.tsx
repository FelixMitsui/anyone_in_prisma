'use client'
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const MassageModal = () => {

    const { message } = useSelector((state: RootState) => state.voteReducer);

    return (
        <>
            {message &&
                <div className="fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-rose-500 rounded p-3 flex flex-col">
                    <h1 className="text-3xl font-bold text-white text-3xl">{message}</h1>
                </div>}
        </>

    );
};

export default MassageModal;