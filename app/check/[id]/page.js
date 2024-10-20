"use client";

import Link from 'next/link';
import Styles from './page.module.css';
import { useEffect, useState } from 'react';
import { endpoints } from '@/app/api/config';
export default function Home(props) {
    const [assignment, setAssignment] = useState({})
 
    useEffect(() => {
        const fetchWork = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }
            try {
                const response = await fetch(endpoints.get_check_assignment, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "solved_assignment_id": props.params.id
                    })
                });

                if (!response.ok) {
                    console.error('Error fetching works:', response.statusText);
                    return;
                }

                const data = await response.json();
                setAssignment(data);
                
            } catch (error) {
                console.error('Error fetching works:', error);
            }
        }
        fetchWork();
    }, []);

    const handleSubmit = async (e) => {
        const token = localStorage.getItem('token');
        e.preventDefault();
        let total_score = 0;
        const massSroreNums = assignment.tasks.map((num, index) =>{
            let score2 = 0
            if(document.getElementById(`ans:${index + 1}`)!== null){
                const score = document.getElementById(`ans:${index + 1}`).value;
                total_score+=score;
                score2 = score
            }
            
            total_score += num.score;
            score2+=num.score
            return {
                task_id: num.task_id,
                score: score2
            };
        })
        
        const solved_assignment = {
            "solved_assignment_id": assignment.solved_assignment_id,
            "assignment_id": assignment.assignment_id,
            "nums": massSroreNums,
            "total_score": total_score
        };

        try {
            const response = await fetch(endpoints.post_check_assignment, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(solved_assignment)
            });

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
            {assignment.tasks ?
                <form className={Styles.form} onSubmit={handleSubmit}>
                    <div className={Styles.work__name}>
                        <p className={Styles.work__name__p}>{assignment.title_work}</p>
                        <p className={Styles.work__name__user}>{`${assignment.student_name} ${assignment.student_last_name} ${assignment.student_class}`}</p>
                    </div>
                    <div className={Styles.nums}>
                        {assignment.tasks.map((num, index) => (
                            <div className={Styles.num} key={num.solved_task_id}>
                                <div className={Styles.num__name}>
                                    <p className={Styles.num__name__p}>Номер {index + 1}</p>
                                </div>
                                <div className={Styles.num__case}>
                                    <p className={Styles.case__p}>{num.task_text}</p>
                                    {num.task_img? <img src={num.task_img} alt='' className={Styles.case__img} />:<></>}
                                    
                                </div>
                                <div className={Styles.num__ans}>
                                    <div className={Styles.ans__check}>
                                        {num.detailed_ans == "true" && (
                                            //num.solved_task_img?
                                            <div className={Styles.check__img}>
                                                    <Link href='../imges/1.png'><img src={num.solved_task_img} alt='' className={Styles.ans__img} /></Link>
                                                <div className={Styles.check}>
                                                    <p className={Styles.check__p}>Введите кол-во баллов за решение</p>
                                                    <input className={Styles.txt__input} type="number" min="0" max="2" placeholder={0} id={`ans:${index}`}/>
                                                </div>
                                            </div>//:<></>
                                            
                                        )}
                                        <div className={Styles.check__txt}>
                                            <p className={Styles.user__ans}>Ответ: {num.solved_task_ans}</p>
                                            <div className={Styles.check1}>
                                                <p className={Styles.check__p}>Кол-во баллов за ответ</p>
                                                <p className={Styles.ch__p}>{num.score}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={Styles.form__submit}>
                        <input type="submit" className={Styles.submit} />
                    </div>
                </form>:<></>
            }

        </section>
    )
}