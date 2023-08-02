import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    value: User;
}
type User = {
    id: number | null;
    auth: number;
    emails: Array<{ address: string }>;
    vote_info: Array<{ vote_id: number }>;
}

const initialState = {
    value: {
        id: null,
        auth: 0,
        emails: [],
        vote_info: []
    } as User,
} as InitialState;

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
        logOut: () => {
            return initialState;
        },
        logIn: (state, action: PayloadAction<User>) => {
            return {
                value: {
                    id: action.payload.id,
                    auth: action.payload.auth,
                    emails: action.payload.emails,
                    vote_info: action.payload.vote_info
                }
            }
        },
        sendVote: (state, action: PayloadAction<{ vote_id: number }>) => {
            const { vote_id } = action.payload;
            const cloneVoteInfo = [...state.value.vote_info];

            cloneVoteInfo.push({ vote_id: vote_id });

            return {
                ...state,
                value: {
                    ...state.value,
                    vote_info: cloneVoteInfo,
                },
            };
        },
    }
});

export const { logIn, logOut, sendVote } = user.actions;
export default user.reducer;