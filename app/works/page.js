"use client";

import Link from 'next/link';
import Styles from './page.module.css';
import { useEffect, useState } from 'react';
import { endpoints } from '../api/config';

export default function Home() {
    const [works, setWorks] = useState({});

    useEffect(() => {
        const fetchWorks = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await fetch(endpoints.works, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch works');
                }

                const data = await response.json();
                setWorks(data); // предполагается, что в ответе есть словарь `works`
        
            } catch (error) {
                console.error('Error fetching works:', error);
            }
        };

        fetchWorks();
        
    }, []);

    return (
        <>
            <section className={Styles.works__sec}>
                <p className={Styles.works__p}>Ваши работы</p>
                <div className={Styles.works}>
                    {Object.entries(works).map(([classKey, classWorks]) => (
                        <>
                        <p className={Styles.class__name}>Класс: {classKey}</p>
                        <div key={classKey} className={Styles.class__works}>
                            {classWorks.map((work, index) => (
                                <Link key={index} className={Styles.work} href={`/work/${work.assignment_id}`}>
                                    <p className={Styles.work__name}>{work.title_work}</p>
                                    <p className={Styles.work__nums}>Кол-во заданий: {work.tasks.length}</p>
                                    <p className={Styles.work__mark}>Оценка {5}</p>
                                    <p className={Styles.work__nums}>Предмет: {work.subject}</p>
                                    <p className={Styles.work__date}>{work.date}</p>
                                </Link>
                            ))}
                        </div>
                        </>
                    ))}
                </div>
            </section>
        </>
    );
}
