import { createContext, StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Messages from './pages/Admin/Messages/Messages';

export const Context = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    loading: false,
    setLoading: () => {},
    user: {},
    setUser: () => {},
});

const AppWrapper = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});

    return (
        <Context.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            loading,
            setLoading,
            user,
            setUser,
        }}>
            <App />
        </Context.Provider>
    );
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AppWrapper />
    </StrictMode>,
);
