import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Header from "../components/Header";
import { Provider } from 'react-redux';
import { logIn } from "@/redux/features/user";
import { SessionProvider } from 'next-auth/react';
import configureMockStore from 'redux-mock-store';
import '@testing-library/jest-dom/extend-expect'

const mockStore = configureMockStore();

const store = mockStore({

    userReducer: {
        value: {
            id: 1,
            auth: 3,
            emails: [{ address: 'test@example.com' }],
            vote_info: [{ vote_id: 10 }]
        },
    },
});

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


describe("Header component", () => {

    test('Fetch user data and update the Redux store.', async () => {

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({ id: 1, auth: 3, emails: [{ address: 'test@example.com' }], vote_info: [{ vote_id: 10 }] }),
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

        expect(mockDispatch).toHaveBeenCalledWith(
            logIn({ id: 1, auth: 3, emails: [{ address: 'test@example.com' }], vote_info: [{ vote_id: 10 }] })
        );

    });

    test('Can the canvas be displayed when clicking the user icon and that clicking any elements close canvas.', () => {
        render(
            <SessionProvider session={mockSession}>
                <Provider store={store}>
                    <Header />
                </Provider>
            </SessionProvider>
        );
        const userCanvas = screen.getByTestId('userCanvas');


        act(() => {
            fireEvent.click(userCanvas);
        });

        const id = screen.getByText(/ID :/i);
        const email = screen.getByText(/Email :/i);
        // 在模态框内进行断言
        expect(id).toBeInTheDocument();
        expect(email).toBeInTheDocument();

        const headerWrapper = screen.getByTestId('headerWrapper');

        act(() => {
            fireEvent.click(headerWrapper);
        });

        expect(userCanvas).toBeInTheDocument();
    });
})
