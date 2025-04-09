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
        e.preventDefault(); // Предотвращаем стандартное поведение формы 
    
        // Отправляем POST-запрос на сервер для авторизации
        const response = await fetch(endpoints.auth, { // endpoints.auth — это URL для авторизации
            method: 'POST', // Указываем метод запроса (POST)
            headers: {
                'Content-Type': 'application/json', // Указываем, что данные отправляются в формате JSON
            },
            body: JSON.stringify({ // Преобразуем объект с данными пользователя в JSON-строку
                "first_name": name, // Имя пользователя
                "last_name": lastName, // Фамилия пользователя
                "patronymic": patronymic, // Отчество пользователя
                "user_class": userClass, // Класс пользователя (например, 10 "Б")
                "password": password // Пароль пользователя
            }),
        });
    
        // Получаем ответ от сервера и преобразуем его в JSON
        const data = await response.json();
    
        // Проверяем, есть ли в ответе токен (признак успешной авторизации)
        if (data.token) {
            // Сохраняем токен и данные пользователя в локальном хранилище браузера
            localStorage.setItem('token', data.token); // Токен для авторизации
            localStorage.setItem('name', name); // Имя пользователя
            localStorage.setItem('lastName', lastName); // Фамилия пользователя
            localStorage.setItem('patronymic', patronymic); // Отчество пользователя
            localStorage.setItem('userClass', userClass); // Класс пользователя
            localStorage.setItem('role', 'data'); // Роль пользователя (в данном случае 'data')
    
            alert('Авторизация успешна'); // Показываем сообщение об успешной авторизации
    
            router.push('/acc'); // Перенаправляем пользователя на страницу /acc
        } else {
            alert('Авторизация не удалась'); // Показываем сообщение об ошибке авторизации
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