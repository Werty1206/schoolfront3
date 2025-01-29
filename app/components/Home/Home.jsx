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
    
    // Состояние для создания пользователя
    const [isCreatingUser , setIsCreatingUser ] = useState(false);
    const [newUserLogin, setNewUserLogin] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const [newUserName, setNewUserName] = useState("");
    const [newUserLastName, setNewUserLastName] = useState("");
    const [newUserPatronymic, setNewUserPatronymic] = useState("");
    const [newUserIsTeacher, setNewUserIsTeacher] = useState(false);
    const [newUserPass, setNewUserPass] = useState("");
    const [newUserClass, setNewUserClass] = useState("");
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


    const handleCreateUser  = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append("login", newUserLogin);
        formData.append("password_root", newUserPassword);
        formData.append("first_name", newUserName);
        formData.append("last_name", newUserLastName);
        formData.append("patronymic", newUserPatronymic);
        formData.append("password", newUserPass)
        if (newUserIsTeacher){
            formData.append("role", 'teacher');
        }
        formData.append("role", 'student');
        formData.append("user_class", newUserClass);
    
        
    
        const response = await fetch(endpoints.create_teacher, {
            method: 'POST',
            body: formData, // Используем FormData
        });
    
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            alert(`Пользователь успешно создан: имя: ${data[0].first_name}, фамилия: ${data[0].second_name}, отчество: ${data[0].patronymic}, класс: ${data[0].user_class}, пароль: ${data[1]},`);
            setIsCreatingUser(false); // Закрываем форму создания пользователя
        } else {
            alert('Ошибка при создании пользователя');
        }
    };
    



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

            {/* Кнопка для создания пользователя */}
            <button onClick={() => setIsCreatingUser (true)} className={Styles.createUserButton}>Создать пользователя</button>

            {/* Форма для создания пользователя */}
            {isCreatingUser  && (
                <form className={Styles.auth} onSubmit={handleCreateUser }>
                    <input className={Styles.auth__put} type="text" placeholder='Логин' value={newUserLogin} onChange={(e) => setNewUserLogin(e.target.value)} />
                    <input className={Styles.auth__put} type="password" placeholder='Пароль' value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} />
                    <input className={Styles.auth__put} type="text" placeholder='Имя' value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                    <input className={Styles.auth__put} type="text" placeholder='Фамилия' value={newUserLastName} onChange={(e) => setNewUserLastName(e.target.value)} />
                    <input className={Styles.auth__put} type="text" placeholder='Отчество' value={newUserPatronymic} onChange={(e) => setNewUserPatronymic(e.target.value)} />
                    <input className={Styles.auth__put} type="text" placeholder='Класс' value={newUserClass} onChange={(e) => setNewUserClass(e.target.value)} />
                    <input className={Styles.auth__put} type="text" placeholder='Пароль ученика' value={newUserPass} onChange={(e) => setNewUserPass(e.target.value)} />
                    <label>
                        <input type="checkbox" checked={newUserIsTeacher} onChange={(e) => setNewUserIsTeacher(e.target.checked)} />
                        Учитель
                    </label>
                    <div className={Styles.sub}>
                        <button type="submit" className={Styles.auth__sub}>Отправить</button>
                    </div>
                </form>
            )}
        </>
    );
}