import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
    value: User;
    message: string;
}
type User = {
    id: number;
    auth: number;
    emails: Array<{ address: string }>;
    vote_info: Array<{ vote_id: number }>;
}

const initialState = {
    message:'',
    value: {
        id: 0,
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
            const { id,auth,emails,vote_info} = action.payload;
           
                 return {
                ...state,
                value: {
                    id:id,
                    auth: auth,
                    emails:emails,
                    vote_info:vote_info
                }
            }
        },
        register: (state, action: PayloadAction<{ user: User,message:string }>) => {
            const { user ,message} = action.payload;
           
                 return {
                     ...state,
                     message:message,
                value: {
                    id:user.id,
                    auth: user.auth,
                    emails:user.emails,
                    vote_info: user.vote_info
                }
            }
        },
        sendVote: (state, action: PayloadAction<{ message: string, voteId: number }>) => {
            
            const { voteId,message } = action.payload;
            const cloneVoteInfo = [...state.value.vote_info];

            cloneVoteInfo.push({ vote_id: voteId });

            return {
                message:message,
                value: {
                    ...state.value,
                    vote_info: cloneVoteInfo,
                },
            };
        },
        sendMassage: (state, action: PayloadAction<{ message: string }>) => {
            const { message} = action.payload;
            return {
                ...state,
                message:message
            };
        },
        cleanUserMassage: (state) => {
            return {
                ...state,
                message: ""
            };
        }
    }
});

export const { logIn,register, logOut, sendVote,sendMassage,cleanUserMassage} = user.actions;
export default user.reducer;