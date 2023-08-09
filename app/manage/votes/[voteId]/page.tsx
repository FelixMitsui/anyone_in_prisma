
"use client"
import React, { useEffect } from "react"
import { Formik, Field, Form, FieldProps, ArrayHelpers, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { cleanMassage, updateVote } from "@/redux/features/vote";


type FormValues = {
    title: string;
    questions: Array<Question>;
}
type Question = {
    id: number;
    name: string;
    options: Array<{ id: number | undefined, name: string }>;
}

const voteSchema = Yup.object().shape({
    title: Yup.string().required('required!').min(4, 'Cannot be less than 4.').max(40, 'Cannot be over than 40.'),
    questions: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required('required!').min(4, 'Cannot be less than 4.').max(35, 'Cannot be over than 35.'),
            options: Yup.array().of(
                Yup.object().shape({
                    name: Yup.string().required('required!').min(1, 'Cannot be less than 1.').max(35, 'Cannot be over than 35.')
                })
            )
        })
    )
})
export default function Vote({ params }: { params: { voteId: string } }) {


    const { votes } = useSelector((state: RootState) => state?.voteReducer);
    const targetIndex = votes?.findIndex((vote) => vote.id === Number(params.voteId));
    const { title, questions } = votes[targetIndex];
    const router = useRouter();
    const { auth } = useSelector((state: RootState) => state.userReducer.value)
    const dispatch = useDispatch();
    const initialValues: FormValues = {
        title: title && title || "",
        questions: questions && questions || []
    }

    const handleFormSubmit = async (values: FormValues) => {

        const result = await fetch(`${process.env.BASE_URL}/api/manage/votes/${params.voteId}`, { method: 'PATCH', body: JSON.stringify(values), headers: { 'Content-Type': 'application/json' } })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(`Vote not found (${res.status})`);
                }

            }).catch(err =>
                console.error(err)
            )
        if (result) {
            dispatch(updateVote(result));
        }
        router.push('/manage/votes');
        setTimeout(() => {
            dispatch(cleanMassage());
        }, 3000)
    };

    useEffect(() => {
        if (!(auth && auth & 1)) {
            router.push('/');
        }
    }, [auth, router])

    return (

        <Formik initialValues={initialValues} validationSchema={voteSchema} onSubmit={handleFormSubmit}>
            {({ values, handleSubmit }) => (
                <Form
                    className="flex flex-col items-center my-2 p-5 py-5 border border-slate-600"
                    onSubmit={handleSubmit}
                >
                    <Field name="title">
                        {({ field }: FieldProps) => (
                            <div className="flex flex-col mb-3 w-full">
                                <p className="font-bold text-2xl me-2 mb-2 text-center">Title</p>
                                <input type="text" className="p-1 w-full self-center bg-slate-300" {...field} />
                            </div>
                        )}
                    </Field>
                    <ErrorMessage name="title">{(msg: string) => (<p className="font-bold text-xl text-red-500 me-2 mb-2 text-center">{msg}</p>)}</ErrorMessage>
                    <FieldArray name="questions">
                        {({ push, remove }: ArrayHelpers) => (
                            <>
                                {values.questions.map((question, questionIndex) => (
                                    <div key={question.id} className="flex flex-col mb-3 w-full">
                                        <p className="font-bold text-2xl me-2 mb-2 text-center"> {questionIndex + 1}. Question</p>
                                        <div className="flex justify-center flex-col">
                                            <div className="flex">
                                                <Field name={`questions[${questionIndex}].name`} as={inputField} />
                                                <button type="button" className="font-btn p-1 my-2 ml-2 rounded-md self-center border-2 border-slate-500 bg-red-400" onClick={() => {
                                                    if (values.questions.length === 1) return;
                                                    remove(questionIndex)
                                                }}>
                                                    Remove
                                                </button>
                                            </div>
                                            <ErrorMessage name={`questions[${questionIndex}].name`}>{(msg: string) => (<p className="flex-wrap font-bold text-xl text-red-500 mx-2 mb-2 text-center ">{msg}</p>)}</ErrorMessage>
                                        </div>
                                        <FieldArray name={`questions[${questionIndex}].options`}>
                                            {({ push, remove }: ArrayHelpers) => (
                                                <>
                                                    {question.options.map((option, optionIndex) => (
                                                        <div key={option.id} className="flex flex-col mb-3 w-full">
                                                            <p className="font-bold text-2xl me-2 mb-2 text-center ">{optionIndex + 1}. Option</p>
                                                            <div className="flex flex-col justify-center ">
                                                                <div className="flex">
                                                                    <Field name={`questions[${questionIndex}].options[${optionIndex}].name`} type="text">
                                                                        {({ field }: FieldProps) => (<input {...field} value={option.name} className="p-1 self-center w-full bg-slate-300" />)}
                                                                    </Field>
                                                                    <button type="button" className="font-btn p-1 my-2 ml-2 self-center rounded-md border-2 border-slate-500 bg-red-400" onClick={() => {
                                                                        if (question.options.length === 1) return;
                                                                        remove(optionIndex)
                                                                    }}>
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                                <ErrorMessage name={`questions[${questionIndex}].options[${optionIndex}].name`}>{(msg: string) => (<p className="font-bold text-xl text-red-500 mx-2 mb-2 text-center ">{msg}</p>)}</ErrorMessage>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button type="button" className="font-btn p-1 my-2 self-center rounded-md border-2 border-slate-500 bg-sky-300" onClick={() => {
                                                        if (question.options.length >= 4) return;
                                                        push({ id: 0, name: "" })
                                                    }
                                                    }>
                                                        Add option
                                                    </button>
                                                </>
                                            )}
                                        </FieldArray>
                                    </div>
                                ))}
                                <button type="button" className="font-btn p-1 mt-5 self-end rounded-md border-2 border-slate-500 bg-sky-300" onClick={() => {
                                    if (values.questions.length >= 3) return;
                                    push({ name: "", options: [""] })
                                }}>
                                    Add question
                                </button>
                            </>
                        )}
                    </FieldArray>
                    <button type="submit" className="font-btn p-1 mt-5 text-xl self-end rounded-md border-2  border-slate-500 bg-orange-300">Submit</button>
                </Form>
            )}
        </Formik>
    );
}

const inputField: React.FC<any> = ({ field,  ...props }) => (
    <input {...field} {...props} value={props.value} className="p-1 self-center w-full bg-slate-300" />
);