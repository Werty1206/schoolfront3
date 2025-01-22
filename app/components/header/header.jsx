"use client"
import Link from 'next/link';
import Styles from './header.module.css';
import { useEffect } from 'react';
import { useAvatar } from '@/app/context/avatarContext'; // Убедитесь, что путь правильный

export const Header = () => {
    const { avatar } = useAvatar();

    return (
        <header className={Styles.header}>
            <div className={Styles.header__apps}>
                <Link className={Styles.app} href="/class">
                    <img src='../imges/classes.jpg' className={Styles.app__img} alt='Классы'/>
                </Link>
                <Link className={Styles.app} href="/works">
                    <img src='../imges/works.png' className={Styles.app__img} alt='Работы'/>
                </Link>
            </div>
            {avatar?<></>:<Link className={Styles.app2} href="/">
                <button>Войти в аккаунт</button>
            </Link>}
            <div className={Styles.header__acc}>
                <Link className={Styles.acc} href="/acc">
                    <img src={avatar || '../imges/user.jpg'} className={Styles.acc__img} alt='Пользователь'/>
                </Link>
            </div>
        </header>
    );
}
