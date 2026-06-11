'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EmployeeDashboard() {
    const router = useRouter();
    useEffect(()=>{
        const useStr= localStorage.getItem('user');
        if(!useStr){
            router.push('/');
            return;
        }
          const user = JSON.parse(useStr)
          const Role="employee";
          if(user.role !== Role){
            router.push('/')
          }
    },[router]
    )

    
    const paragraph =
    [
        {
            h1:"well comme to employee dashbord"
        }
    ]
    return (
        <div>
            {
                paragraph.map((valeur,index)=>{
                    return(
                        <div key={index}>
                            <div>
                                <h1>{valeur.h1}</h1>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
