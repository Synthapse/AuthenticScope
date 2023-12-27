//useFetch.js
import { useState, useEffect, SetStateAction } from 'react';
import axios from 'axios';

function useFetch(url: string) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState<boolean | null | string>(null);
    const [error, setError] = useState<boolean | null | string>(null);

    useEffect(() => {
        setLoading('loading...')
        setData(null);
        setError(null);
        const source = axios.CancelToken.source();
        axios.get(url, { cancelToken: source.token })
            .then((res: any) => {
                setLoading(false);
                //checking for multiple responses for more flexibility 
                //with the url we send in.
                res.data.content && setData(res.data.content);
                res.content && setData(res.content);
            })
            .catch((err: any) => {
                setLoading(false)
                setError('An error occurred. Awkward..')
            })
        return () => {
            source.cancel();
        }
    }, [url])

    return { data, loading, error }

}

export default useFetch;
