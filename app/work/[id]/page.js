"use client";

import Link from 'next/link';
import Styles from './page.module.css';
import { useEffect, useState } from 'react';
import { BASE_URL, endpoints } from '../../api/config';

export default function Home(props) {
    const [work, setWork] = useState({});

    useEffect(() => {
        const fetchWork = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            try {
                const response = await fetch(endpoints.work_to_do, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "assignment_id": props.params.id
                    })
                });

                const data = await response.json();
                setWork(data);

            } catch (error) {
                console.error('Error fetching works:', error);
            }
        };
        fetchWork();
    }, [props.params.id]);

    const handleSubmit = async (e) => {
        const token = localStorage.getItem('token');
        e.preventDefault();

        const formData = new FormData();
        formData.append('assignment_id', props.params.id);

        work.tasks.forEach((task, index) => {
            const ans = document.getElementById(`ans:${index}`).value;
            const fileInput = document.getElementById(`file:${index}`);
            let solvedTaskImg = null;
            if (fileInput && fileInput.files[0]) {
                solvedTaskImg = fileInput.files[0];
            }

            formData.append(`tasks[${index}][task_id]`, task.task_id);
            formData.append(`tasks[${index}][solved_task_ans]`, ans);
            if (solvedTaskImg) {
                formData.append(`tasks[${index}][solved_task_img]`, solvedTaskImg);
            }
        });

        try {
            const response = await fetch(endpoints.create_solved_assignment, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                alert('Работа успешно отправлена!');
                window.location.href = '/profile';
            } else {
                alert('Ошибка при отправке работы');
            }
        } catch (error) {
            console.error('Error submitting solved assignment:', error);
        }
    };

    return (
        <section className={Styles.section}>
            {work.tasks ? (
                <form className={Styles.form} onSubmit={handleSubmit}>
                    <div className={Styles.work__name}>
                        <p className={Styles.work__name__p}>{work.title_work}</p>
                    </div>
                    <div className={Styles.nums}>
                        {work.tasks.map((num, index) => (
                            <div key={index} className={Styles.num}>
                                <div className={Styles.num__name}>
                                    <p className={Styles.num__name__p}>Номер {index + 1}</p>
                                </div>
                                <div className={Styles.num__case}>
                                    <p className={Styles.case__p}>{num.task_text}</p>
                                    {num.task_img && (
                                        <img
                                            src={`${BASE_URL}/uploads/assignments/${work.assignment_id}--${num.task_id}--${num.task_img}`}
                                            className={Styles.case__img}
                                            alt=""
                                        />
                                    )}
                                </div>
                                {num.detailed_ans === "true" && (
                                    <p className={Styles.ans__sol}>Прикрепите файл с решением</p>
                                )}
                                <div className={Styles.num__ans}>
                                    {num.detailed_ans === "true" && (
                                        <input 
                                            type="file" 
                                            className={Styles.ans__file} 
                                            id={`file:${index}`} 
                                            accept="image/*,.pdf"
                                        />
                                    )}
                                    <input 
                                        type="text" 
                                        placeholder="Ваш ответ" 
                                        className={Styles.ans__txt} 
                                        id={`ans:${index}`} 
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={Styles.form__submit}>
                        <button type="submit" className={Styles.submit}>
                            Отправить работу
                        </button>
                    </div>
                </form>
            ) : (
                <p>Загрузка задания...</p>
            )}
        </section>
    );
}