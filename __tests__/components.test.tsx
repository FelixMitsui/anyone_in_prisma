import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Header from "../components/Header";
import { Provider } from 'react-redux';
import { logIn } from "@/redux/features/user";
import { SessionProvider } from 'next-auth/react';
import configureMockStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect'

const mockStore = configureMockStore();



const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

const mockSession = {
    data: {
        session: {
            user: {
                name: 'Test User',
                email: 'test@example.com',
            }
        }
    },
    status: 'authenticated',
    expires: new Date().toISOString(),
};


jest.mock('next/navigation', () => ({
    ...jest.requireActual('next/navigation'),
    useRouter: () => ({
        route: '/',
        pathname: '',
        query: '',
        asPath: '',
        push: jest.fn(),
        events: {
            on: jest.fn(),
            off: jest.fn()
        },
        beforePopState: jest.fn(() => null),
        prefetch: jest.fn(() => null)
    })
}));


describe("Header component", () => {

    test('Fetch user data and update the Redux store.', async () => {

        const store = mockStore({
            userReducer: {
                message:'',
                value: {
                    id: null,
                    auth: 3,
                    emails: [{ address: 'test@example.com' }],
                    vote_info: [{ vote_id: 10 }]
                },
            },
        });

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({ id: 1, auth: 3, emails: [{ address: 'test@example.com' }], vote_info: [{ vote_id: 10 }]}),
            }) as Promise<Response>
        );

        render(
            <SessionProvider session={mockSession}>
                <Provider store={store}>
                    <Header />
                </Provider>
            </SessionProvider>
        );

    
        await new Promise((resolve) => setTimeout(resolve, 2050));
        await store.dispatch(logIn({
            id: 1, auth: 3, emails: [{ address: 'test@example.com' }], vote_info: [{ vote_id: 10 }]
        }));
        
        expect(mockDispatch).toHaveBeenCalledWith(
            logIn({
                id: 1, auth: 3, emails: [{ address: 'test@example.com' }], vote_info: [{ vote_id: 10 }]
            })
        );
    });

    test('Can the canvas be displayed when clicking the user icon and that clicking any elements close canvas.', async () => {

         const store = mockStore({
            userReducer: {
                message:'',
                value: {
                    id: 1,
                    auth: 3,
                    emails: [{ address: 'test@example.com' }],
                    vote_info: [{ vote_id: 10 }]
                },
            },
        });

        render(
            <SessionProvider session={mockSession}>
                <Provider store={store}>
                    <Header />
                </Provider>
            </SessionProvider>
        );

        const userCanvas = screen.getByTestId('userCanvas');

            fireEvent.click(userCanvas);
      
     
        const id = screen.getByText(/ID :/i);
        const email = screen.getByText(/Email :/i);
       
        expect(id).toBeInTheDocument();
        expect(email).toBeInTheDocument();

        const headerWrapper = screen.getByTestId('headerWrapper');

  
            fireEvent.click(headerWrapper);
     

        expect(userCanvas).toBeInTheDocument();
    });
})
