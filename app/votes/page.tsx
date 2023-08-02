
import VoteList from '@/components/VoteList';

type FetchData = {
  id: number;
  title: string;
  closing_date: string;
  vote_total: number;
}
async function fetchData() {
  const result = await fetch(`${process.env.BASE_URL}/api/votes`, { next: { revalidate: 300 } })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`Vote not found (${res.status})`);
      }
    }).catch(err => console.error(err));

  return result;
}

export default async function Votes() {

  const votes: Array<FetchData> = await fetchData();

  return (
    <>
      <h1 className="mb-3 font-title text-3xl text-center">Votes</h1>
      <div className="p-5 w-full items-center grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  ">
        <VoteList votes={votes} />
      </div>
    </>
  )
}
