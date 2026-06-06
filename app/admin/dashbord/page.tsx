"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function adminDashboard() {
    const router= useRouter()
    useEffect(()=>{
        const useStr = localStorage.getItem('user');
        if(!useStr){
            router.push('/');
            return;
        }
        const user = JSON.parse(useStr);
        const Role = "admin";
        if(user.role !== Role){
            router.push('/')
        }
    },[router]
    );

    const show = [
        { h1: "Welcome to your system admin"
        }
    ];

    return (
        <div>
            {show.map((val, index) => {
                return (
                    <div key={index}>
                        <h1>{val.h1}</h1>
                    </div>
                );
            })}
        </div>
    );
}
