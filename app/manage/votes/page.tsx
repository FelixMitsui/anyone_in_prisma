'use client'
import React, { useEffect, useState, memo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/redux/store";
import { getAllVotes, deleteVote, cleanMassage } from '@/redux/features/vote';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from "next/navigation";

const ConfirmModal = dynamic(() => import('@/components/ConfirmModal'));

type Vote = {
  id: number;
  title: string;
  closing_date: string;
  vote_total: number;
  questions: Array<Question>
}
type Question = {
  id: number;
  name: string;
  options: Array<{ id: number, name: string, vote_count: number }>
}

const Votes = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { votes } = useSelector((state: RootState) => state.voteReducer);
  const { id: userId,auth } = useSelector((state: RootState) => state.userReducer.value);
  const [isToggleModal, setIsToggleModal] = useState<boolean>(false);
  const voteIdRef = useRef<number>(0);

  useEffect(() => {

    async function fetchData() {
      const result: Array<Vote> = await fetch(`${process.env.BASE_URL}/api/votes`)
        .then((res) => {

          if (res.ok) {
            return res.json();
          } else {
            throw new Error(`Vote not found (${res.status})`);
          }
        }).catch(err => console.error(err));

      if (result) {
        dispatch(getAllVotes(result));
      }
    }
    fetchData();

  }, [dispatch])

  useEffect(() => {
    if (!(auth & 1)) {
      router.push('/');
    }
  }, [auth, router])
  
  const handleConfirmModal = (voteId: number) => {
    voteIdRef.current = voteId;
    setIsToggleModal(toggle => !toggle);
  }

  const handleDeleteVote = async () => {

    setIsToggleModal(toggle => !toggle);

    const result = await fetch(`${process.env.BASE_URL}/api/manage/votes/${voteIdRef.current}`,
      {
        method: 'DELETE',
        body: JSON.stringify(userId),
        headers: { 'Content-Type': 'application/json' }
      })
      .then((res) => {
        if (res.ok) {
          return res.text();
        } else {
          throw new Error(`Vote not found (${res.status})`);
        }
      })
      .catch((err) => {
        console.error(err);
      })

    if (result) {
      dispatch(deleteVote({voteId:voteIdRef.current,message: result }));

      setTimeout(() => {
        dispatch(cleanMassage());
      }, 3000)
    }
  };

  return (
    <>
      {isToggleModal && <ConfirmModal massage="confirm delete?" setIsToggleModal={setIsToggleModal} onDeleteVote={handleDeleteVote} />}
      <h1 className="mb-3 font-title text-3xl text-center">Votes</h1>
      <div className="flex justify-center">
        <table >
          <thead className="border-5 text-3xl">
            <tr>
              <th className='border-2 border-slate-500 px-3 '>ID</th>
              <th className='border-2 border-slate-500 px-3'>Title</th>
              <th className='border-2 border-slate-500 px-3 truncate'>Closing date</th>
              <th className='border-2 border-slate-500 px-3 truncate'>Vote total</th>
              <th className='border-2 border-slate-500 px-3'>Edit</th>
            </tr>
          </thead>
          <tbody>
            {votes?votes.map((vote) => (
              <tr key={vote.id}>
                <td className='border-2 border-slate-500 px-2 text-2xl'>{vote.id}</td>
                <td className='border-2 border-slate-500 px-2 text-2xl'>{vote.title}</td>
                <td className='border-2 border-slate-500 px-2 text-2xl'>{vote.closing_date.replace(/T|\.000Z/g, ' ')}</td>
                <td className='border-2 border-slate-500 px-2 text-2xl'>{vote.vote_total}</td>
                <td className='border-2 border-slate-500 px-2 text-2xl p-1'>
                  <Link href={`/manage/votes/${vote.id}`}><button type="button" className="mr-1 p-1 bg-orange-400 rounded">Modify</button></Link>
                  <button type="button" className="p-1 text-white bg-red-500 rounded" onClick={() => handleConfirmModal(vote.id)}>Delete</button>
                </td>
              </tr>
            )) : [1,2,3,4,5,6,7,8].map((_,index) => (
              <tr key={index}>
                <td className='border-2 border-slate-500 px-2 text-2xl '><div className="p-3 bg-slate-300 h-8 w-14"></div></td>
                <td className='border-2 border-slate-500 px-2 text-2xl '><div className="p-3 bg-slate-300 h-8 w-32"></div></td>
                <td className='border-2 border-slate-500 px-2 text-2xl '><div className="p-3 bg-slate-300 h-8 w-32"></div></td>
                <td className='border-2 border-slate-500 px-2 text-2xl '><div className="p-3 bg-slate-300 h-8 w-32"></div></td>
                <td className='border-2 border-slate-500 px-2 text-2xl p-1 '>
                <div className="p-2 bg-slate-300 h-8 w-32"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default memo(Votes);