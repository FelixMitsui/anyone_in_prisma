"use client"

export default function Loading() {

    return (
        <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-rose-500 rounded p-3 flex z-50">
            <div className="me-2 flex">
                <i className="bx bx-loader self-center bx-flip-vertical mr-2 text-2xl animate-spin"></i>
            </div>
            <h1 className="text-3xl font-bold text-white">Loading...</h1>
        </div>
    )
}



