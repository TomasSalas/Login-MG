/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';

export const LoginContext = createContext();

export function LoginProvider({ children }) {
  const [rol, setRol] = useState(localStorage.getItem('rol'));
  const [empresa, setEmpresa] = useState(localStorage.getItem('idEmpresa'));


  useEffect(() => {
    setRol(localStorage.getItem('rol'));
    setEmpresa(localStorage.getItem('idEmpresa'));
  }, []);

  return (
    <LoginContext.Provider value={{ rol, setRol , empresa , setEmpresa }}>
      {children}
    </LoginContext.Provider>
  );
}
