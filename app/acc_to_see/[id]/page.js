"use client";
import { endpoints } from '@/app/api/config';
import Link from 'next/link';
import Styles from './page.module.css';
import { useEffect, useState } from 'react';

export default function Home(props) {
    const [user, setUser] = useState([]);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5000/users/name', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "user_id": props.params.id })
                });
                if (response.ok) {
                    console.error('Nice');
                }
                const data = await response.json();
                if (data) {
                    setUser(data)
                    console.log(data)
                } else {
                    console.error('Failed to fetch user data:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);

            }
        };

        fetchUserData();
    }, []);

    return (
        <>
            <p>{user.first_name}</p>
            <p>{user.last_name}</p>
            <p>{user.user_class}</p>
        </>

    )
}