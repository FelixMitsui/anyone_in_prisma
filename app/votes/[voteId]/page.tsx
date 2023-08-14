
import React,{FC} from "react";
import VoteForm from "@/components/VoteForm";

type FetchVote = {
    vote: Vote;
    message: string;
}
type Vote = {
    id?: number;
    title?: string;
    closing_date?: string;
    questions?: Array<Questions>;
}
type Questions = {
    id: number;
    name: string;
    options: Array<Options>;
}
type Options = {
    id: number;
    name: string;
    vote_count: number;
}

const fetchVote = async (voteId:string) => {
    const vote = await fetch(`${process.env.BASE_URL}/api/votes/${voteId}`,{next:{revalidate:300}})
        .then((res: Response) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(`Vote not found (${res.status})`);
            }
        }).catch(err => console.error(err));
      console.log(vote)
    return vote;
  
}


const VotesPage: FC<{ params: { voteId: string } }> =async ({ params }) => {

    const voteData: FetchVote  = await fetchVote(params.voteId);

    return (
        <>
            <VoteForm voteData={voteData} />
        </>
    )
}
export default VotesPage;