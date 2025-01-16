import React, { createContext, useContext, useState } from 'react';
import Spinner from './components/Spinner';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
            {isLoading && <Spinner />}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);