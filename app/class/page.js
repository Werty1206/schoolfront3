"use client";
import { endpoints } from '@/app/api/config';
import Link from 'next/link';
import Styles from './page.module.css';
import { useEffect, useState } from 'react';
export default function Home() {
    const [userClass, setClass] = useState([]);
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
                    console.error('Nice');
                }
                const data = await response.json();
                if (data) {
                    setClass(data)
                    console.log(data)
                } else {
                    console.error('Failed to fetch user data:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
                
            }
        };

        fetchUserData();
    },[]);
    return (
        <section className={Styles.sec}>
            <p className={Styles.class__num}>Ваш класс: 2</p>
            <div className={Styles.classes}>
                {userClass.map((user, index) => (
                    <Link className={Styles.user} href={`/acc_to_see/${user.user_id}`}>
                        <img src='../imges/1.png' className={Styles.user__png} />
                        <p className={Styles.user__name}>{user.first_name}</p>
                        <p className={Styles.user__lastname}>{user.last_name}</p>
                        <p className={Styles.user__mark}>Средняя оценка: 5</p>
                    </Link>
                ))}

            </div>


        </section>
    )

}