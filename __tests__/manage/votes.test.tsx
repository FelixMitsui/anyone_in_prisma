import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Manage from "@/app/manage/page";
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import configureMockStore from 'redux-mock-store';
import { createVote } from "@/redux/features/vote";

const mockStore = configureMockStore();

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

global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({
        vote: {
            id: 6,
            title: 'a little title input value',
            closing_date: '8/8 12:00',
            vote_total: 6,
            questions: [{
                id: 1,
                name: 'a little question input value',
                options: [{
                    id: 1,
                    name: 'a little option input value',
                    vote_count: 10
                }]
            }
            ]
        },
        message: 'nothing'
    })
});

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



describe("Manage page", () => {

    test('render page.', async () => {

        render(
            <SessionProvider session={mockSession}>
                <Provider store={store}>
                    <Manage />
                </Provider>
            </SessionProvider>

        );
        const title = screen.getByText('Title');
        expect(title).toBeInTheDocument();
        screen.debug(title)
    });

    test('Clicking the Add Question button and the Add Option button should display input elements.', async () => {

        render(
            <SessionProvider session={mockSession}>
                <Provider store={store}>
                    <Manage />
                </Provider>
            </SessionProvider>

        );
        const option = screen.getByText('Add option');

        act(() =>
            fireEvent.click(option)
        )
        const newOption = screen.getByText(/2. Option/);
        screen.debug(newOption)
        expect(newOption).toBeInTheDocument();

        const question = screen.getByText('Add question');

        act(() =>
            fireEvent.click(question)
        );
        const newQuestion = screen.getByText(/2. Question/);

        expect(newQuestion).toBeInTheDocument();

    });

    test('Can the form be submitted successfully.', async () => {

        render(
            <SessionProvider session={mockSession}>
                <Provider store={store}>
                    <Manage />
                </Provider>
            </SessionProvider>

        );
        const titleInput = screen.getByTestId('titleInput');
        const questionInput = screen.getByTestId('questionInput');
        const optionInput = screen.getByTestId('optionInput');
        fireEvent.change(titleInput, { target: { value: 'a little title input value' } });
        fireEvent.change(questionInput, { target: { value: 'a little question input value' } });
        fireEvent.change(optionInput, { target: { value: 'a little option input value' } });

        const submit = screen.getByText('Submit');

        act(() =>
            fireEvent.click(submit)
        )
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/manage'), {
                method: 'POST',
                body: JSON.stringify({ title: 'a little title input value', questions: [{ name: 'a little question input value', options: ['a little option input value'] }] }),
                headers: { 'Content-Type': 'application/json' }
            });

        })

        expect(mockDispatch).toHaveBeenCalledWith(
            createVote({
                vote: {
                    id: 6,
                    title: 'a little title input value',
                    closing_date: '8/8 12:00',
                    vote_total: 6,
                    questions: [{
                        id: 1,
                        name: 'a little question input value',
                        options: [{
                            id: 1,
                            name: 'a little option input value',
                            vote_count: 10
                        }]
                    }
                    ]
                },
                message: 'nothing'
            })
        );
    });
});