"use client";

import { useState } from 'react';
import Styles from './page.module.css';
import { endpoints } from '@/app/api/config';

export default function Home() {
    const [questions, setQuestions] = useState([{ id: 1, condition: '', answer: '', task_img: null, detailed_ans: false }]);
    const [titleWork, setTitleWork] = useState('');
    const [userClass, setUserClass] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [subject, setSubject] = useState(''); // Добавлено состояние для subject

    const handleAddQuestion = () => {
        setQuestions([...questions, { id: questions.length + 1, condition: '', answer: '', task_img: null, detailed_ans: false }]);
    };

    const handleInputChange = (e, index, field) => {
        const newQuestions = [...questions];
        if (field === 'task_img') {
            newQuestions[index][field] = e.target.files[0];
        } else if (field === 'detailed_ans') {
            newQuestions[index][field] = e.target.checked;
        } else {
            newQuestions[index][field] = e.target.value;
        }
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const formData = new FormData();
        
        formData.append('title_work', titleWork);
        formData.append('user_class', userClass);
        formData.append('date', dueDate);
        formData.append('subject', subject); // Добавлено поле subject

        questions.forEach((q, index) => {
            formData.append(`tasks[${index}][number_task]`, index + 1);
            formData.append(`tasks[${index}][task]`, q.condition);
            formData.append(`tasks[${index}][task_img]`, q.task_img || '');
            formData.append(`tasks[${index}][correct_ans]`, q.answer);
            formData.append(`tasks[${index}][detailed_ans]`, q.detailed_ans);
        });

        try {
            const response = await fetch(endpoints.assignments, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Ошибка: ${errorData.error}`);
            } else {
                alert('Работа успешно отправлена!');
                setTitleWork('');
                setQuestions([{ id: 1, condition: '', answer: '', task_img: null, detailed_ans: false }]);
                setUserClass('');
                setDueDate('');
                setSubject(''); // Сбросить поле subject
            }
        } catch (error) {
            alert(`Произошла ошибка при отправке работы. Попробуйте еще раз.`);
            console.log(error);
        }
    };

    return (
        <section className={Styles.section}>
            <form className={Styles.form} onSubmit={handleSubmit}>
                <div className={Styles.work__title}>
                    <input
                        className={Styles.input}
                        placeholder="Введите название работы"
                        value={titleWork}
                        onChange={(e) => setTitleWork(e.target.value)}
                    />
                </div>
                <div className={Styles.nums}>
                    {questions.map((question, index) => (
                        <div key={index} className={Styles.num}>
                            <div className={Styles.num__title}>
                                <p className={Styles.num__title__p}>Номер {index + 1}</p>
                            </div>
                            <div className={Styles.num__case}>
                                <textarea
                                    type="text"
                                    className={Styles.num__input}
                                    placeholder="Введите условие"
                                    value={question.condition}
                                    onChange={(e) => handleInputChange(e, index, 'condition')}
                                />
                                <p className={Styles.num__p}>Добавьте картинку, если она нужна</p>
                                <input
                                    className={Styles.num__png}
                                    type="file"
                                    onChange={(e) => handleInputChange(e, index, 'task_img')}
                                />
                            </div>
                            <div className={Styles.num__ans}>
                                <div className={Styles.does}>
                                    <p className={Styles.does__p}>Номер с развернутым ответом?</p>
                                    <input
                                        type="checkbox"
                                        className={Styles.does__switch}
                                        checked={question.detailed_ans}
                                        onChange={(e) => handleInputChange(e, index, 'detailed_ans')}
                                    />
                                </div>
                                <input
                                    className={Styles.ans__input}
                                    placeholder="Введите правильный ответ на этот номер"
                                    value={question.answer}
                                    onChange={(e) => handleInputChange(e, index, 'answer')}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className={Styles.div__add}>
                    <button
                        className={Styles.add__button}
                        type="button"
                        onClick={handleAddQuestion}
                    >
                        Добавить еще номер
                    </button>
                </div>
                <div className={Styles.work__class}>
                    <input
                        className={Styles.class__input}
                        placeholder="Какому классу вы хотите дать эту работу"
                        value={userClass}
                        onChange={(e) => setUserClass(e.target.value)}
                    />
                </div>
                <div className={Styles.work__class}>
                    <input
                        className={Styles.class__input}
                        placeholder="По какому предмету эта работа?" // Исправлено поле
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)} // Исправлен обработчик
                    />
                </div>
                <div className={Styles.work__class}>
                    <p>До какого времени ученики могут решать эту работу</p>
                    <input
                        className={Styles.class__input}
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>
                <div className={Styles.work__sub}>
                    <input className={Styles.submit} type="submit" value="Отправить работу" />
                </div>
            </form>
        </section>
    );
}
