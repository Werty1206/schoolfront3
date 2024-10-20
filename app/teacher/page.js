"use client";

import Link from 'next/link';
import Styles from './page.module.css';
import { useEffect, useState } from 'react';
export default function Home(){
    return(
        <>
        <div className={Styles.user}>
            <div className={Styles.user__description}>
                <div className={Styles.user__img}>
                    <img className={Styles.img__png} src='../imges/1.png'/>
                </div>
                <div className={Styles.user__info}>
                    <div className={Styles.info__name}>
                        <p className={Styles.name}>Борис</p>
                    </div>
                    <div className={Styles.info__name}>
                        <p className={Styles.name}>Ельцин</p>
                    </div>
                </div>
            </div>
            <div className={Styles.create__div}>
                <Link className={Styles.create} href='/create'>Создать работу</Link>
            </div>
            <div className={Styles.user__works}>
                <p className={Styles.works__p}>Ваши работы:</p>
                <div className={Styles.works}>
                    <div className={Styles.work}>
                        <p className={Styles.work__name}>площадь многоугольника</p>
                        
                        <p className={Styles.work__date}>12.04.2027</p>
                    </div>
                    <div className={Styles.work}>
                        <p className={Styles.work__name}>Работа 2</p>
                        
                        <p className={Styles.work__date}>14.04.2027</p>
                    </div>
                    <div className={Styles.work}>
                        <p className={Styles.work__name}>Работа 1</p>
                        
                        <p className={Styles.work__date}>12.04.2027</p>
                    </div>
                    <div className={Styles.work}>
                        <p className={Styles.work__name}>Работа 2</p>
                        
                        <p className={Styles.work__date}>14.04.2027</p>
                    </div>
                    <div className={Styles.work}>
                        <p className={Styles.work__name}>Работа 1</p>
                        
                        <p className={Styles.work__date}>12.04.2027</p>
                    </div>
                    
                </div>
            </div>
            <div className={Styles.user__works}>
                <p className={Styles.works__p}>Непроверенные работы:</p>
                <div className={Styles.works}>
                    <div className={Styles.work}>
                        <p className={Styles.work__name}>площадь многоугольника</p>
                        <div className={Styles.work__user}>
                            <p className={Styles.work__user__info}>Иосиф</p>
                            <p className={Styles.work__user__info}>Иосиф</p>
                        </div>
                        <p className={Styles.work__date}>12.04.2027</p>
                        
                    </div>
                    <div className={Styles.work}>
                        <p className={Styles.work__name}>Работа 2</p>
                        
                        <p className={Styles.work__date}>14.04.2027</p>
                    </div>
                    <div className={Styles.work}>
                        <p className={Styles.work__name}>Работа 1</p>
                        
                        <p className={Styles.work__date}>12.04.2027</p>
                    </div>
                    <div className={Styles.work}>
                        <p className={Styles.work__name}>Работа 2</p>
                        
                        <p className={Styles.work__date}>14.04.2027</p>
                    </div>
                    <div className={Styles.work}>
                        <p className={Styles.work__name}>Работа 1</p>
                        
                        <p className={Styles.work__date}>12.04.2027</p>
                    </div>
                    
                </div>
            </div>
            <div className={Styles.user__class}>
                <p className={Styles.class__p}>Классы:</p>
                <div className={Styles.class}>
                    <div className={Styles.class__user}>
                        <img className={Styles.class__user__png} src='../imges/1.png'/>
                        <div className={Styles.class__user__info}>
                            <p className={Styles.class__user__name}>10 ы</p>
                            
                        </div>
                    </div>
                    <div className={Styles.class__user}>
                        <img className={Styles.class__user__png} src='../imges/1.png'/>
                        <div className={Styles.class__user__info}>
                            <p className={Styles.class__user__name}>8 б</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}