"use client"
import { Formik, Field, Form, FieldProps, ArrayHelpers, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { createVote, cleanMassage } from "@/redux/features/vote";

type FormValues = {
  title: string;
  questions: Array<Questions>;
}
type Questions = {
  name: string;
  options: Array<string>;
}

const voteSchema = Yup.object().shape({
  title: Yup.string().required('required!').min(6, 'Cannot be less than 6.').max(40, 'Cannot be over than 40.'),
  questions: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('required!').min(6, 'Cannot be less than 6.').max(30, 'Cannot be over than 30.'),
      options: Yup.array().of(
        Yup.string().required('required!').min(6, 'Cannot be less than 6.').max(35, 'Cannot be over than 35.')  // 設定 options 的驗證條件，這是一個字串陣列
      )
    })
  )
})
export default function Manage() {

  const router = useRouter();
  const { auth } = useSelector((state: RootState) => state.userReducer.value)
  const dispatch = useDispatch();
  const initialValues: FormValues = {
    title: "",
    questions: [{ name: "", options: [""] }]
  }

  const handleFormSubmit = async (values: FormValues) => {

    const result = await fetch(`${process.env.BASE_URL}/api/manage`, { method: 'POST', body: JSON.stringify(values), headers: { 'Content-Type': 'application/json' } })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(`Vote not found (${res.status})`);
        }
      }).catch(err => console.error(err));

    if (result) {
      dispatch(createVote(result));

      router.push('/manage/votes');

      setTimeout(() => {
        dispatch(cleanMassage());
      }, 3000)
    }
  };

  useEffect(() => {
    if (!(auth && auth & 1)) {
      router.push('/');
    }
  }, [auth])

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
                <input data-testid="titleInput" type="text" className="p-1 w-full self-center bg-slate-300" {...field} />
              </div>
            )}
          </Field>
          <ErrorMessage name="title">{(msg: string) => (<p className="font-bold text-xl text-red-500 me-2 mb-2 text-center">{msg}</p>)}</ErrorMessage>
          <FieldArray name="questions">
            {({ push, remove }: ArrayHelpers) => (
              <>
                {values.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="flex flex-col mb-3 w-full">
                    <p className="font-bold text-2xl me-2 mb-2 text-center"> {questionIndex + 1}. Question</p>
                    <div className="flex justify-center">
                      <Field data-testid="questionInput" name={`questions[${questionIndex}].name`} as={inputField} />
                      <button type="button" className="font-btn p-1 my-2 ms-2 rounded-md self-center border-2 border-slate-500 bg-red-400" onClick={() => {
                        if (values.questions.length === 1) return;
                        remove(questionIndex)
                      }}>
                        Remove
                      </button>
                      <ErrorMessage name={`questions[${questionIndex}].name`}>{(msg: string) => (<p className="font-bold text-xl text-red-500 mx-2 mb-2 text-center ">{msg}</p>)}</ErrorMessage>
                    </div>
                    <FieldArray name={`questions[${questionIndex}].options`}>
                      {({ push, remove }: ArrayHelpers) => (
                        <>
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex flex-col mb-3 w-full">
                              <p className="font-bold text-2xl me-2 mb-2 text-center ">{optionIndex + 1}. Option</p>

                              <div className="flex justify-center">
                                <Field data-testid="optionInput" name={`questions[${questionIndex}].options[${optionIndex}]`} as={inputField} />
                                <button type="button" className="font-btn p-1 my-2 ms-2 self-center rounded-md border-2 border-slate-500 bg-red-400" onClick={() => {
                                  if (question.options.length === 1) return;
                                  remove(optionIndex)
                                }}>
                                  Remove
                                </button>
                                <ErrorMessage name={`questions[${questionIndex}].options[${optionIndex}]`}>{(msg: string) => (<p className="font-bold text-xl text-red-500 mx-2 mb-2 text-center ">{msg}</p>)}</ErrorMessage>
                              </div>
                            </div>
                          ))}
                          <button type="button" className="font-btn p-1 my-2 self-center rounded-md border-2 border-slate-500 bg-sky-300" onClick={() => {
                            if (question.options.length >= 4) return;
                            push("")
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

const inputField: React.FC<any> = ({ field, form, ...props }) => (
  <input {...field} {...props} className="p-1 self-center w-full bg-slate-300" />
);