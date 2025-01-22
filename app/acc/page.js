"use client";

import Styles from './page.module.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { endpoints, BASE_URL } from '@/app/api/config';
import axios from 'axios';
import { useAvatar } from '@/app/context/avatarContext'; // Убедитесь, что путь правильный


export default function Home() {
    const { setAvatar } = useAvatar();
    const [userData, setUserData] = useState({});
    const [uncheckedAssignments, setUncheckedAssignments] = useState([]);
    const [myCreatedAssignments, setMyCreatedAssignments] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(5);
    const [showChangeBio, setShowChangeBio] = useState(false);
    const [showAva, setShowAva] = useState(false);
    

    const [formData, setFormData] = useState({
        avatar: null,
        first_name: '',
        last_name: '',
        patronymic: '',
        password: ''
    });
    // Обработчик изменения полей формы
    const handleChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'avatar') {
            setFormData({
                ...formData,
                avatar: files[0] // Сохраняем файл
            });
        } else {
            setFormData({
                ...formData,
                [name]: value // Сохраняем текстовые поля
            });
        }
    };
    // Обработчик отправки формы
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData();
        
        // Добавляем поля из formData в FormData объект
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        try {
            const response = await axios.put(endpoints.change_user, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    // Добавьте здесь заголовок авторизации, если необходимо
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log('Успех:', response.data);
        } catch (error) {
            console.error('Ошибка при обновлении данных:', error);
        }
    };
    const exitAca = () => {
        localStorage.removeItem('token')
    }

    const handleShowMore = () => {
        setShowMore(!showMore);
        const setIt = showMore ? Math.min(myCreatedAssignments.length, 5) : myCreatedAssignments.length; // 4 элемента в первом ряду
        setItemsToShow(setIt)
    };
    const handleChangeBio = () => {
        setShowChangeBio(!showChangeBio)
        
    }
    // Определяем количество элементов для отображения
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
                    const data = await response.json();
                    setUserData(data);
                    localStorage.setItem("role", data.role)
                    console.log(data)
                    
                } else {
                    console.error('Failed to fetch user data:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        const fetchUncheckedAssignments = async () => {
            try {
                const response = await fetch(endpoints.unchecked_assignments, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUncheckedAssignments(data); // сохраняем данные о непроверенных работах
                } else {
                    console.error('Failed to fetch unchecked assignments:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        const fetchMyCreatedWorks = async () => {
            try {
                const response = await fetch(endpoints.my_created_assignments, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setMyCreatedAssignments(data); // сохраняем данные о непроверенных работах
                    console.log(data)
                } else {
                    console.error('Failed to fetch unchecked assignments:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };
        

        fetchUserData();
        fetchUncheckedAssignments();
        fetchMyCreatedWorks();
    }, []); // Пустой массив означает, что эффект сработает только при монтировании компонента

    useEffect(() => {
        if (userData) {
            setShowAva(!showAva)
            const newAvatarUrl = `${BASE_URL}/uploads/users/user:${userData.user_id}--${userData.avatar}`;
            localStorage.setItem('ava', newAvatarUrl);
            setAvatar(newAvatarUrl);
        }
    }, [userData]);
    return (
        <>
            {userData.role === 'teacher' ?

                <div className={Styles.user}>
                    <div className={Styles.user__description}>
                        {showAva?<div className={Styles.user__img}>
                            <img className={Styles.img__png} src={`${BASE_URL}/uploads/users/user:${userData.user_id}--${userData.avatar}`} />
                        </div>:<div className={Styles.user__img}>
                            <img className={Styles.img__png} src='../imges/user.jpg' alt="User" />
                        </div>}
                        {showChangeBio ?
                            <form onSubmit={handleSubmit}>
                                <p>Фото профиля</p>
                                <input name="avatar" placeholder='Фото профиля' onChange={handleChange} type="file"/>
                                <input name="first_name" placeholder='Имя' onChange={handleChange}/>
                                <input name="last_name" placeholder='Фамилия' onChange={handleChange}/>
                                <input name="patronymic" placeholder='Отчество' onChange={handleChange}/>
                                <input name="password" type="password" placeholder='Пароль' onChange={handleChange}/>
                                <div className={Styles.work__sub}>
                                    <input className={Styles.submit} type="submit" value="Сохранить изменения" />
                                </div>
                            </form> :
                            <></>}
                        <div className={Styles.user__info}>
                            <button onClick={handleChangeBio}>
                                Изменить профиль
                            </button>
                            <div className={Styles.info__name}>
                                <p className={Styles.name}>{userData.first_name}</p>
                            </div>
                            <div className={Styles.info__name}>
                                <p className={Styles.name}>{userData.last_name}</p>
                            </div>
                            <div className={Styles.info__name}>
                                <p className={Styles.name}>{userData.user_class}</p>
                                <Link className={Styles.usersClass} href='/class'>Редактировать класс</Link>
                            </div>
                            <Link onClick={exitAca} href='/'>
                                <button>Выйти из аккаунта</button>
                            </Link>
                        </div>
                    </div>
                    <div className={Styles.create__div}>
                        <Link className={Styles.create} href='/create'>Создать работу</Link>
                    </div>
                    <div className={Styles.user__works}>
                        <button onClick={handleShowMore}>
                            {showMore ? 'Скрыть' : 'Показать больше'}
                        </button>
                        <p className={Styles.works__p}>Ваши работы:</p>
                        <div className={Styles.works}>
                            {myCreatedAssignments.length >= 1 ? (
                                myCreatedAssignments.slice(0, itemsToShow).map((assignment) => (
                                    <Link className={Styles.work} key={assignment.solved_assignment_id} href={`/check/${assignment.solved_assignment_id}`}>
                                        <p className={Styles.work__name}>{assignment.title}</p>
                                        <p className={Styles.work__name}>{assignment.subject}</p>
                                        <p className={Styles.work__date}>{assignment.date}</p>
                                    </Link>
                                ))
                            ) : (<p>У вас нет созданых работ</p>)}

                        </div>
                    </div>
                    <div className={Styles.user__works}>
                        <p className={Styles.works__p}>Непроверенные работы:</p>
                        <div className={Styles.works}>
                            {uncheckedAssignments.length >= 1 ? (
                                uncheckedAssignments.map((assignment, index) => (
                                    <Link key={assignment.solved_assignment_id} href={`/check/${assignment.solved_assignment_id}`} className={Styles.work}>
                                        <p className={Styles.work__name}>{assignment.assignment_name}</p>
                                        <div className={Styles.work__user}>
                                            <p className={Styles.work__user__info}>{assignment.first_name}</p>
                                            <p className={Styles.work__user__info}>{assignment.last_name}</p>
                                            <p className={Styles.work__user__info}>{assignment.user_class}</p>
                                        </div>
                                        <p className={Styles.work__date}>{assignment.date}</p>
                                    </Link>
                                ))
                            ) : (
                                <p>Нет непроверенных работ</p>
                            )}
                        </div>
                    </div>
                    <div className={Styles.user__class}>
                        <p className={Styles.class__p}>Классы:</p>
                        <div className={Styles.class}>
                            <div className={Styles.class__user}>
                                <img className={Styles.class__user__png} src='../imges/1.png' />
                                <div className={Styles.class__user__info}>
                                    <p className={Styles.class__user__name}>10 ы</p>

                                </div>
                            </div>
                            <div className={Styles.class__user}>
                                <img className={Styles.class__user__png} src='../imges/1.png' />
                                <div className={Styles.class__user__info}>
                                    <p className={Styles.class__user__name}>8 б</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className={Styles.user}>
                    <div className={Styles.user__description}>
                        <div className={Styles.user__img}>
                            <img className={Styles.img__png} src='../imges/user.jpg' alt="User" />
                        </div>
                        <div className={Styles.user__info}>
                            <div className={Styles.info__name}>
                                <p className={Styles.name}>{userData.first_name}</p>
                            </div>
                            <div className={Styles.info__name}>
                                <p className={Styles.name}>{userData.last_name}</p>
                            </div>
                            <div className={Styles.info__name}>
                                <p className={Styles.name}>{userData.user_class}</p>
                            </div>
                        </div>
                    </div>
                    <div className={Styles.user__works}>
                        <p className={Styles.works__p}>Ваши работы</p>
                        <div className={Styles.works}>
                            <div className={Styles.work}>
                                <p className={Styles.work__name}>площадь многоугольника</p>
                                <p className={Styles.work__mark}>4</p>
                                <p className={Styles.work__date}>12.04.2027</p>
                            </div>
                            <div className={Styles.work}>
                                <p className={Styles.work__name}>Работа 2</p>
                                <p className={Styles.work__not__done}>Не выполнено</p>
                                <p className={Styles.work__date}>14.04.2027</p>
                            </div>
                            <div className={Styles.work}>
                                <p className={Styles.work__name}>Работа 1</p>
                                <p className={Styles.work__mark}>4</p>
                                <p className={Styles.work__date}>12.04.2027</p>
                            </div>
                            <div className={Styles.work}>
                                <p className={Styles.work__name}>Работа 2</p>
                                <p className={Styles.work__not__done}>Не выполнено</p>
                                <p className={Styles.work__date}>14.04.2027</p>
                            </div>
                            <div className={Styles.work}>
                                <p className={Styles.work__name}>Работа 1</p>
                                <p className={Styles.work__mark}>4</p>
                                <p className={Styles.work__date}>12.04.2027</p>
                            </div>
                        </div>
                    </div>
                    <div className={Styles.user__class}>
                        <p className={Styles.class__p}>Ваши одноклассники</p>
                        <div className={Styles.class}>
                            <div className={Styles.class__user}>
                                <img className={Styles.class__user__png} src='../imges/1.png' alt="Classmate 1" />
                                <div className={Styles.class__user__info}>
                                    <p className={Styles.class__user__name}>Иосиф</p>
                                    <p className={Styles.class__user__name}>Сталин</p>
                                </div>
                            </div>
                            <div className={Styles.class__user}>
                                <img className={Styles.class__user__png} src='../imges/1.png' alt="Classmate 2" />
                                <div className={Styles.class__user__info}>
                                    <p className={Styles.class__user__name}>Александр</p>
                                    <p className={Styles.class__user__name}>Македонский</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            }

        </>
    );
}
