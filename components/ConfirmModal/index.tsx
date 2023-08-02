import React from "react";


const ConfirmModal = ({ massage, setIsToggleModal, onDeleteVote }: { massage: string, setIsToggleModal: any, onDeleteVote: () => void }) => {

    return (
        <div className="fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-rose-500 rounded p-3 flex flex-col">
            <h1 className="text-3xl font-bold text-white text-2xl">{massage}</h1>
            <div className="me-2 mt-3">
                <button type="button" onClick={() => onDeleteVote()} className="p-1 mx-2 bg-slate-300 text-xl font-bold rounded">Confirm</button>
                <button type="button" onClick={() => setIsToggleModal((toggle: boolean) => !toggle)} className="p-1 mx-2 bg-slate-300 text-xl font-bold  rounded">Cancel</button>
            </div>
        </div>
    );
};

export default ConfirmModal;