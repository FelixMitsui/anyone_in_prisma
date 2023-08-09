"use client"
import React, { FC } from "react";
import { useSelector } from 'react-redux';
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import VoteCard from "../VoteCard";


type VoteProps = {
    votes: Array<vote>;
}
type vote = {
    id: number;
    title: string;
    closing_date: string;
    vote_total: number;
}
const VoteList: FC<VoteProps> = ({ votes }) => {

    const { vote_info } = useSelector((state: RootState) => state.userReducer?.value);

    const { status } = useSession();

    const voteList = votes && votes.map(vote => (

        <VoteCard key={vote.id} vote={vote} vote_info={vote_info} status={status} />
    ))

    return (
        <>
            {voteList}
        </>
    )
}

export default VoteList;
