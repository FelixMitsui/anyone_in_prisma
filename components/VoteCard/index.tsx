'use client'
import React, { FC } from 'react'
import { useRouter } from 'next/navigation';

type VoteCardProps = {
    vote: vote;
    vote_info?: Array<{ vote_id: number }>;
    status: string;
}

type vote = {
    id: number;
    title: string;
    closing_date: string;
    vote_total: number;
}
const VoteCard: FC<VoteCardProps> = ({ vote, vote_info, status }) => {

    const { id, title, closing_date, vote_total } = vote;

    const isVoted = vote_info?.some(info => info.vote_id == id);
    const router = useRouter();

    const baseTime = new Date(Date.parse(closing_date));

    const threeDaysInSeconds = 14 * 24 * 60 * 60;

    const targetTime = baseTime.getTime() + threeDaysInSeconds * 1000;

    const currentTime = new Date();

    const remainingSeconds = Math.floor((targetTime - currentTime.getTime()) / 1000);
    const remainingDays = Math.floor(remainingSeconds / (24 * 60 * 60));
    const remainingHours = Math.floor((remainingSeconds % (24 * 60 * 60)) / (60 * 60));
    const remainingMinutes = Math.floor((remainingSeconds % (60 * 60)) / 60);

    return (
        <article className="p-5 me-3 pb-2 bg-slate-200 shadow-md flex flex-col">
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-xl">Closing date:{remainingMinutes <= 0 ? <span className="ml-2 text-red-500">ended</span> : <span className="ml-2">{remainingDays <= 0 ? null : `${remainingDays} Day`} {remainingHours <= 0 ? null : `${remainingHours} Hour`} {remainingMinutes <= 0 ? null : `${remainingMinutes} Min`}</span>}</p>
            <p className="text-xl">Total vote:<span className="ml-2">{vote_total}</span></p>
            <button
                type="button"
                className="p-1 my-2 self-end rounded-md bg-orange-300  border-slate-500 font-btn text-xl"
                onClick={() => router.push(`/votes/${id}`)}
            >{isVoted || status != "authenticated" ? "View results" : "To vote"}</button>
        </article>
    )
}

export default VoteCard;