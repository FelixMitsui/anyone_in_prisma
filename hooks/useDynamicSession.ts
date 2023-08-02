'use client'
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const useDynamicSession = () => {
    const [sessionValue, setSessionValue] = useState({});
    const { data, status } = useSession();

    useEffect(() => {
        setSessionValue({ data, status });
    }, []);

    return sessionValue;
};
export default useDynamicSession;












