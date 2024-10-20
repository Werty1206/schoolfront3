"use client";
import Link from 'next/link';
import Styles from './Header.module.css';


export const Header = () => {

    return(
        <header className={Styles.header}>
            <div className={Styles.header__apps}>
                <Link className={Styles.app} href="/class">
                    <img src='../imges/1.png' className={Styles.app__img} />
                </Link>
                <Link className={Styles.app} href ="/works">
                    <img src='../imges/1.png' className={Styles.app__img} />
                </Link>
            </div>
            <div className={Styles.header__acc}>
                <Link className={Styles.acc} href="/acc">
                    <img src='../imges/1.png' className={Styles.acc__img} />
                </Link>
            </div>
        </header>
    )
}