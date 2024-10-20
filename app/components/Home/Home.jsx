'use client';
import { useState, useEffect } from 'react';
import Styles from "./Home.module.css";
import { endpoints } from '@/app/api/config';
import { useRouter } from 'next/navigation';

export const Main = () => {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [patronymic, setPatronymic] = useState(""); // Состояние для отчества
    const [userClass, setUserClass] = useState("");
    const [password, setPassword] = useState("");
    
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(endpoints.me, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    console.error('Nice');
                } else {
                    // Токен истек или другой статус ошибки
                    localStorage.removeItem('token');
                    router.push('/'); // Переадресовать на страницу логина или ошибку
                }
            } catch (error) {
                console.error('Error:', error);
                localStorage.removeItem('token');
                router.push('/'); // Переадресовать на страницу логина или ошибку
            }
        };

        fetchUserData();
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        const response = await fetch(endpoints.auth, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "first_name": name,
                "last_name": lastName,
                "patronymic": patronymic,
                "user_class": userClass,
                "password": password
            }),
        });

        const data = await response.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('name', name);
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('patronymic', patronymic);
            localStorage.setItem('userClass', userClass);
            localStorage.setItem('role', 'data');

            alert('авторизация успешна');

            router.push('/acc'); // Перенаправление на /acc после успешной авторизации
        } else {
            alert('авторизация не удалась');
        }
    };

    useEffect(() => {
        const checkTokenAndRedirect = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                // Проверьте действительность токена здесь
                try {
                    const response = await fetch(endpoints.me, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        router.push('/acc'); // Перенаправление на /acc, если токен действителен
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    localStorage.removeItem('token');
                }
            }
        };

        checkTokenAndRedirect();
    }, [router]);

    return (
        <>
            <div className={Styles.auth__div}>
                <p className={Styles.auth__txt}>Авторизация</p>
            </div>
            <form className={Styles.auth} onSubmit={handleAuth}>
                <input className={Styles.auth__put} type="text" placeholder='Имя' value={name} onChange={(e) => setName(e.target.value)} />
                <input className={Styles.auth__put} type="text" placeholder='Фамилия' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <input className={Styles.auth__put} type="text" placeholder='Отчество' value={patronymic} onChange={(e) => setPatronymic(e.target.value)} /> 
                <input className={Styles.auth__put} type="text" placeholder='Класс' value={userClass} onChange={(e) => setUserClass(e.target.value)} />
                <input className={Styles.auth__put} type="password" placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className={Styles.sub}>
                    <button type="submit" className={Styles.auth__sub}>Авторизоваться</button>
                </div>
            </form>
        </>
    );
}
