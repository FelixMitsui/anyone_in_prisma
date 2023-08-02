import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    votes: Array<Vote>;
    message: string;
}

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
    options: Array<Option>
}
type Option = {
    id: number,
    name: string,
    vote_count: number
}
const initialState = {
    votes: [],
    message: ""
} as InitialState;

export const vote = createSlice({
    name: "vote",
    initialState,
    reducers: {
        cleanMassage: (state) => {
            return {
                ...state,
                message: ""
            };
        },
        setMassage: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                message: action.payload
            };
        },
        getVote: (state, action: PayloadAction<Vote>) => {

            const cloneState = [...state.votes];
            const currentIndex = cloneState.findIndex((vote) => vote.id === action.payload.id);

            if (currentIndex !== -1) {
                cloneState[currentIndex] = action.payload;
            } else {
                cloneState.push(action.payload);
            }
            return {
                ...state,
                votes: cloneState,
            }
        },
        getAllVotes: (state, action: PayloadAction<Array<Vote>>) => {
            return {
                ...state,
                votes: action.payload,
            }
        },
        createVote: (state, action: PayloadAction<{ vote: Vote; message: string }>) => {
            const { message, vote } = action.payload;
            const cloneState = [...state.votes];

            cloneState.push(vote);

            return {
                ...state,
                message: message,
                votes: cloneState,
            };
        },
        updateVote: (state, action: PayloadAction<{ vote: Vote, message: string }>) => {
            const { message, vote } = action.payload;
            const { id: voteId } = vote;
            const cloneState = [...state.votes];
            const currentIndex = cloneState.findIndex((vote) => vote.id === voteId);

            if (currentIndex !== -1) {
                cloneState[currentIndex] = vote;
            };

            return {
                ...state,
                message: message,
                votes: cloneState,
            }
        },

        deleteVote: (state, action: PayloadAction<number>) => {
            const cloneState = [...state.votes];
            const currentIndex = cloneState.findIndex((vote) => vote.id === action.payload);

            if (currentIndex !== -1) {
                cloneState.splice(currentIndex, 1);
            };

            return {
                ...state,
                votes: cloneState
            }
        }
    },
}
);

export const { cleanMassage, setMassage, getAllVotes, getVote, deleteVote, updateVote, createVote } = vote.actions;
export default vote.reducer;