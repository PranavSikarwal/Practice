import { useState, useCallback, useEffect } from "react";


let logoutTimer;
export const useAuth = ()=>{
    const [token, setToken] = useState(null);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(null);
    const login = useCallback((uid, token, expirationDate) => {
      setUserId(uid);
      setToken(token);
      const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000*60*60);//date object + 1 hour
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        'userData',
        JSON.stringify({userId: uid, token: token, expiration: tokenExpirationDate.toISOString()})
      );
    }, []);
    
    useEffect(()=>{
      const storedData=JSON.parse(localStorage.getItem('userData'));
      if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
        login(storedData.userId, storedData.token, new Date(storedData.expiration));
      }
    },[login]);
    
    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setTokenExpirationDate(null);
      },[]);
      
      useEffect(()=>{
        if(token && tokenExpirationDate){
          const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
          
          logoutTimer = setTimeout(logout,remainingTime );
        }else{
          clearTimeout(logoutTimer);
        }
      },[token,logout, tokenExpirationDate]);

      return {token, login, logout, userId};

}