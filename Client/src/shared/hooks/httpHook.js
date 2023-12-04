import { useEffect } from "react";
import { useRef } from "react";
import {useState, useCallback} from "react";

export const useHttpClient = ()=>{
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError]= useState();
    
    //we handle such request which remain active even after page is redirected
    //such request must be cancelled
    //useRef keeps activeHttpRequest array protect its value in re-renders.
    const activeHttpRequest = useRef([])

    const sendRequest = useCallback(async(url, method = 'GET', body = null, headers={})=>{

        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequest.current.push(httpAbortCtrl);
        const response = await fetch(url,{
            method,
            body,
            headers,
            signal: httpAbortCtrl.signal
        });
        try{
            const responseData = await response.json();
            activeHttpRequest.current = activeHttpRequest.current.filter(reqCtrl=> reqCtrl!==httpAbortCtrl);
        //custom throw error for 400ish and 500ish responses as they are not treated as error in for try-catch here
        if( !response.ok){
            throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
        }catch(err){
            setError(err.message);
            setIsLoading(false);
            throw err;
        }
        
    },[]);

    const clearError=()=>{
        setError(null);
    }

    //return works as cleanup funciton
    useEffect(()=>{

        
        return ()=>{
            activeHttpRequest.current.forEach(abortCtrl => {abortCtrl.abort()});
        };
    },[]);

    return {isLoading, error, sendRequest, clearError};
}