import VoteList from '../components/VoteList';


type Vote = {
  id: number
  title: string;
  closing_date: string;
  vote_total: number;

}

async function getFocusData() {
  const result = await fetch(`${process.env.BASE_URL}/api/votes?limit=3&target=vote_total&sorted=DESC`, { next: { revalidate: 300 } })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`votes not found.${res.status}`)
      }
    }).catch(err => console.error(err));
  return result;

}

async function getNewData() {
  const result = await fetch(`${process.env.BASE_URL}/api/votes?limit=3&target=closing_date&sorted=DESC`, { next: { revalidate: 300 } })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`votes not found.${res.status}`)
      }
    }).catch(err => console.error(err));
  return result;

}



export default async function Home() {

  const focusItemsData: Promise<Array<Vote>> = getFocusData();
  const newItemsData: Promise<Array<Vote>> = getNewData();

  const [focusItems, newItems]: [Array<Vote>, Array<Vote>] = await Promise.all([focusItemsData, newItemsData])


  return (
    <section className="z-10 w-full max-w-5xl">
      <div className="flex flex-col">
        <h2 className="text-center text-3xl font-bold font-title">Focus</h2>
        <div className="my-3 grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"><VoteList votes={focusItems} /></div>
      </div>
      <div className="mt-5 flex flex-col">
        <h2 className="text-center text-3xl font-bold font-title">New</h2>
        <div className="my-3 grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"><VoteList votes={newItems} /></div>
      </div>
    </section>
  )
}
