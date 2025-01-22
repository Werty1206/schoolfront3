"use client"; // Убедитесь, что этот код выполняется на клиенте

import React, { createContext, useContext, useState, useEffect } from 'react';

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        // Проверяем наличие токена в localStorage
        const token = localStorage.getItem('token');
        if (token) {
            // Если токен существует, проверяем наличие аватара
            const storedAvatar = localStorage.getItem('ava');
            if (storedAvatar) {
                setAvatar(storedAvatar);
            }
        } else {
            // Если токена нет, можно сбросить аватар или выполнить другую логику
            setAvatar(null); // Пример сброса аватара
        }
    }, []); // Пустой массив зависимостей, чтобы выполнить только один раз при монтировании

    return (
        <AvatarContext.Provider value={{ avatar, setAvatar }}>
            {children}
        </AvatarContext.Provider>
    );
};

export const useAvatar = () => useContext(AvatarContext);
