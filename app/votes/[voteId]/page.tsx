'use client'

import React, { FC, useEffect, Suspense } from "react";
import { Formik, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getVote, setMassage, cleanMassage } from "@/redux/features/vote";
import { sendVote } from "@/redux/features/user";

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
type QuestionForm = {
    questions: Array<{ option?: string }>
}


const voteSchema = Yup.object().shape({
    questions: Yup.array()
        .of(
            Yup.object().shape({
                option: Yup.number().required("Please select an option"),
            })
        )
        .nullable() // Allow 'questions' to be null or undefined
        .test("all-questions-selected", "Please select an option for each question", (questions) => {
            // Check if every question has an option selected
            if (questions && questions.every((question) => question.option !== undefined)) {
                return true;
            } else {
                return new Yup.ValidationError("Please select an option for each question");
            }
        }),
});


const Vote: FC<{ params: { voteId: string } }> = ({ params }) => {

    const router = useRouter();
    const dispatch = useDispatch();
    const { status } = useSession();
    const { id: userId, vote_info } = useSelector((state: RootState) => state.userReducer.value)
    const { votes } = useSelector((state: RootState) => state.voteReducer);

    let vote: Vote = {};
    const targetIndex = votes && votes.findIndex((vote) => vote?.id === Number(params.voteId));
    if (targetIndex !== -1) {
        vote = votes[targetIndex]
    }
    const isVoted = vote_info.some(vote => vote?.vote_id == Number(params.voteId));

    const initialValues: QuestionForm = {
        questions: Array.from({ length: vote.questions ? vote.questions.length : 0 }, () => ({ option: "" })),
    };

    const handleVoteForm = async (values: QuestionForm) => {

        const updateInfo = {
            ...values,
            userId
        }

        const vote = await fetch(`${process.env.BASE_URL}/api/votes/${params.voteId}`,
            {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateInfo),
                method: 'PATCH'
            })
            .then((res: Response) => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(`Vote not found (${res.status})`);
                }
            })
            .catch((err) => console.error(err));

        if (vote) {
            dispatch(sendVote({ vote_id: vote.vote_id }));
            dispatch(setMassage(vote.message));
            setTimeout(() => {
                dispatch(cleanMassage());
            }, 3000)
        }

    };

    useEffect(() => {
        const fetchVote = async () => {
            const vote = await fetch(`${process.env.BASE_URL}/api/votes/${params.voteId}`)
                .then((res: Response) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        throw new Error(`Vote not found (${res.status})`);
                    }
                }).catch(err => console.error(err));
            if (vote) {

                dispatch(getVote(vote));
            }
        }
        fetchVote();

    }, [vote_info])

    return (
        <>
            {vote.questions ?
                <>
                    <h1 className="mb-2 bg-slate-400 w-96 h-12 "></h1>
                    <div className="p-3 w-96 h-full">
                        {[0, 1].map(item => (
                            <div key={item} className="p-3 mb-3 bg-slate-300 w-full h-full flex flex-col justify-center">
                                <h1 className=" bg-slate-400  w-full h-12"></h1>
                                <div className="my-3 bg-slate-400  w-full h-8"></div>
                                <div className="my-3 bg-slate-400  w-full h-8"></div>
                                <div className="my-3 bg-slate-400  w-full h-8"></div>
                            </div>
                        ))}
                    </div>
                </> :
                <>
                    <h1 className="font-bold text-3xl my-2">{vote.title}</h1>
                    <Formik initialValues={initialValues} validationSchema={voteSchema} onSubmit={handleVoteForm}>{({ handleSubmit }) => (
                        <form className="flex flex-col " onSubmit={handleSubmit}>
                            <div>
                                {
                                    vote.questions?.map((item, questionIndex) => {
                                        const { id, name, options } = item;
                                        const totalVote = options.reduce((total, current) => total + current.vote_count, 0);
                                        const voteRatio = 100 / totalVote;
                                        return (
                                            <div key={id} className="shadow-md p-5 px-10 my-4">
                                                <h2 className="font-bold text-2xl mb-2">{name}</h2>

                                                {options.map((item, optionIndex) => {

                                                    const { id, name, vote_count } = item;

                                                    return (
                                                        <div key={id} className="flex my-5 ">
                                                            {isVoted || status != "authenticated" ?
                                                                <>
                                                                    <p className="ml-1  text-xl">{name}</p>
                                                                    <p className="mx-2 text-xl text-sky-600">{vote_count}</p>
                                                                    <div style={{ "width": `${vote_count * voteRatio}%` }} className=" ml-2 text-xl bg-amber-400 flex self-center justify-center">{Math.round(vote_count * voteRatio)}%</div>
                                                                </> :
                                                                <div className="flex flex-col">
                                                                    <div className="">
                                                                        <Field name={`questions[${questionIndex}].option`}>{({ field }: FieldProps) =>
                                                                        (<input
                                                                            type="radio"
                                                                            id={id.toString()}
                                                                            {...field}
                                                                            value={id}
                                                                        />)}
                                                                        </Field>
                                                                        <label htmlFor={id.toString()} className="ml-1 text-xl">{name}</label>
                                                                    </div>
                                                                    <ErrorMessage name={`questions[${questionIndex}].option`}>{(msg: string) => (<p className="font-bold text-xl text-red-500 mx-2 mb-2 text-center ">{msg}</p>)}</ErrorMessage>
                                                                </div>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                            </div>
                            {isVoted || status != "authenticated" ? null : <button type="submit" className="text-xl font-btn p-1 my-2 self-end rounded-md bg-orange-300">Submit</button>}
                        </form>
                    )}</Formik>
                </>
            }



        </>
    )
}

export default Vote;