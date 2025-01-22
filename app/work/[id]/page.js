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

                if (!response.ok) {
                    console.error('Error fetching works:', response.statusText);
                    return;
                }

                const data = await response.json();
                setWork(data);
                console.log(data)

            } catch (error) {
                console.error('Error fetching works:', error);
            }
        }
        fetchWork();
    }, []);

    const handleSubmit = async (e) => {
        const token = localStorage.getItem('token');
        e.preventDefault();

        const formData = new FormData();
        formData.append('assignment_id', props.params.id);

        const solvedTasksMass = work.tasks.map((task, index) => {
            const ans = document.getElementById(`ans:${index + 1}`).value;
            const fileInput = document.getElementById(`file:${index + 1}`);
            let solvedTaskImg = null;
            if(fileInput !== null){
                solvedTaskImg = fileInput.files[0]; // Получаем файл из input
            }
            console.log(solvedTaskImg)

            if (!ans) {
                console.error(`Task ${index + 1} is missing an answer.`);
                return null; // Пропускаем, если ответ не предоставлен
            }

            // Добавляем данные задачи в FormData
            formData.append(`solved_tasks_mass[${index}][task_id]`, task.task_id);
            formData.append(`solved_tasks_mass[${index}][solved_task_ans]`, ans);
            if (solvedTaskImg) {
                formData.append(`solved_tasks_mass[${index}][solved_task_img]`, solvedTaskImg);
            }
            console.log(solvedTaskImg)

            return {
                task_id: task.task_id,
                solved_task_ans: ans,
                solved_task_img: solvedTaskImg ? solvedTaskImg.name : null,
                score: 0 };
        }).filter(Boolean); // Удаляем null элементы 
        if (solvedTasksMass.length === 0) {
            console.error('No tasks were solved.');
            return;
        }

        

        formData.append('final_grade', -1);
        formData.append('total_score', 0);
        formData.append('is_checked', false);

        try {
            const response = await fetch(endpoints.create_solved_assignment, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData});

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to submit solved assignment: ${response.status} ${errorText}`);
            }
            console.log('Assignment submitted successfully');
        } catch (error) {
            console.error('Error submitting solved assignment:', error);
        }
    }

    return (
        <section className={Styles.section}>
            {work.tasks ?
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
                                    <img src={`${BASE_URL}/uploads/assignments/${work.assignment_id}--${num.task_id}--${num.task_img}`} className={Styles.case__img} alt='' />
                                </div>
                                {num.detailed_ans === "true" && (
                                    <p className={Styles.ans__sol}>Прикрепите файл с решением, т.к. это номер с развернутым ответом</p>
                                )}
                                <div className={Styles.num__ans}>
                                    {num.detailed_ans === "true" && (
                                        <input type="file" className={Styles.ans__file} id={`file:${index + 1}`} />
                                    )}
                                    <input type="text" placeholder='Ваш ответ' className={Styles.ans__txt} id={`ans:${index + 1}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={Styles.form__submit}>
                        <input type="submit" className={Styles.submit} />
                    </div>
                </form> : <></>
            }
        </section>
    )
}
