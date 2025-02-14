import { createContext, StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'


export const Context = createContext({isAuthenticated: false});



const AppWrapper = ()=>{
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [User, setUser] = useState({});


 return(
  <Context.Provider value={{isAuthenticated, setIsAuthenticated, User, setUser}}>
    <App />
  </Context.Provider>
 )

};


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
)
