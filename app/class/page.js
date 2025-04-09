"use client";
import { endpoints, BASE_URL } from '@/app/api/config';
import Link from 'next/link';
import Styles from './page.module.css';
import { useEffect, useState } from 'react';
export default function Home() {
    const [userClasses, setUserClasses] = useState([]);
    const [createUserBool, setCreateUserBool] = useState(false);
    const [createUser, setCreateUser] = useState({
        first_name: '',
        last_name: '',
        patronymic: '',
        user_class: '',
        password: '',
        role: 'student', // Предполагается, что роль по умолчанию - студент
        subjects: [] // Можно добавить, если нужно
    });
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(endpoints.class, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    const classesArray = Object.entries(data).map(([className, students]) => ({
                        class_name: className,
                        students: students
                    }));
                    setUserClasses(classesArray);
                    console.log(classesArray);
                } else {
                    console.error('Failed to fetch user data:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchUserData();
    }, []);
    const isCreateUser = () => {
        setCreateUserBool(!createUserBool);

    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCreateUser((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        const formData = new FormData();
        formData.append('first_name', createUser.first_name);
        formData.append('last_name', createUser.last_name);
        formData.append('patronymic', createUser.patronymic);
        formData.append('user_class', createUser.user_class);
        formData.append('password', createUser.password);
        formData.append('role', createUser.role);
        // Если у вас есть предметы, вы можете добавить их в formData
        // createUser .subjects.forEach(subject => formData.append('subjects', subject));
        try {
            const response = await fetch(endpoints.create_user, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData // Отправляем данные в формате FormData
            });
            if (response.ok) {
                const result = await response.json();
                console.log('User  created successfully:', result);
                // Логика для обновления состояния или уведомления пользователя
            } else {
                const errorData = await response.json();
                console.error('Error creating user:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <section className={Styles.sec}>
            <p className={Styles.class__num}>Ваш класс: 2</p>
            <div className={Styles.classes}>
                {Array.isArray(userClasses) && userClasses.map((userClass, classIndex) => (
                    <div key={classIndex} className={Styles.class}>
                        <h2 className={Styles.class__name}>{userClass.class_name}</h2>
                        <div className={Styles.students_class}>
                            {Array.isArray(userClass.students) && userClass.students.map((user) => (
                                <Link key={user.user_id} className={Styles.user} href={`/acc_to_see/${user.user_id}`}>
                                <img
                                    src={`${BASE_URL}/uploads/users/${user.avatar}`}
                                    className={Styles.user__png}
                                    alt={`${user.first_name} ${user.last_name}`}
                                    onError={(e) => {
                                        e.target.src = '../imges/user.png'; // Устанавливаем изображение по умолчанию
                                    }}
                                />
                                <p className={Styles.user__name}>{user.first_name}</p>
                                <p className={Styles.user__lastname}>{user.last_name}</p>
                                <p className={Styles.user__mark}>Средняя оценка: {user.average_grade}</p>
                            </Link>
                            ))}
                        </div>
                        {localStorage.getItem('role') === 'teacher' && (
                            <div className={Styles.add__users}>
                                <button>Добавить существующего ученика</button>
                                <button onClick={isCreateUser}>Создать ученика</button>
                            </div>
                        )}
                        {createUserBool && (
                            <form onSubmit={handleSubmit}>
                                <input name="first_name" placeholder='Имя ученика' onChange={handleChange} required />
                                <input name="last_name" placeholder='Фамилия ученика' onChange={handleChange} required />
                                <input name="patronymic" placeholder='Отчество ученика' onChange={handleChange} />
                                <input name="user_class" placeholder={`Класс ученика`} onChange={handleChange} required />
                                <input name="password" type="password" placeholder='Пароль ученика' onChange={handleChange} required />
                                <div className={Styles.work__sub}>
                                    <input className={Styles.submit} type="submit" value="Создать ученика" />
                                </div>
                            </form>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
