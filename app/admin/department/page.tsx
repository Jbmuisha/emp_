'use client'
import { IDepartment } from "@/app/types/department";
import { IUser } from "@/app/types/Users";
import { Search, UserPlus } from "lucide-react";
import { useState } from "react";

export default function AdminDepartment() {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [employee,setEmployeer]=useState<IUser[]>([]);
 
  const [globalFilter, setGlobalFilter] = useState('');
  const[userselected,setUserSelected]=useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  
  
  

  return (
    <div className="max-w-7xl mx-auto p-5 sm:*:px-6 lg:px-8">
      <div className=" bg-white rounded-xl border border-slate-100 p-6">
        <h1 className="text-xl  font-bold mb-6"> Asseign department to employers</h1>

        <form action="" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="">
            <label htmlFor="" className="block text-sm  upercase tracking-wider text-slate-900">target emplyeers</label>
            <div className=" W-full text-sm bg-slate-200  font-medium text-black rounded-lg p-2.5">
              {userselected ? `${userselected.username}(${userselected.email})`:"no woker selected"}

            </div>

          </div>
       {/* Department Selection Selector */}

          <div className="block text-sm  upercase tracking-wider text-slate-900 mb-3">
            <select name="" id=""
            disabled={!userselected}
            value={selectedDepartmentId}
            onChange={(e)=>setSelectedDepartmentId(e.target.value)}  
            >
              <option value="" className="" > choose department 
                {
                  departments.map((dept)=>(
                    <option value={dept.name} key={dept._id}> {dept.name}</option>
                  ))
                }
              </option>
            
            </select>

          </div>

          <button disabled={!userselected || !selectedDepartmentId}
           className="bg-black  hover:to-blue-600 text-amber-800 disabled:bg-slate-100 font-semibold text-sm py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:cursor-not-allowed"
           >
            <UserPlus className="w-4 h-4"/>
            Commit Assignment Changes
          </button>
          

        

        </form>

{/* SECTION B: CORE DIRECTORY INFRASTRUCTURE */}

      </div>
    <div className="bg-white rounded-xl border border-slate-100 p-5">

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"> 

     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Department Management Directory</h2>
            <p className="text-xs text-slate-400 font-medium">Active roster calculations matching parameters</p>
          </div>

     </div>
        <div className=" relative w-full max-w-sm ">
          <Search className="absolute left-3 top-3.5 w-4 h-4  text-black"/>
          <input type="text"
          value={globalFilter}
          onChange={(e)=>setGlobalFilter(e.target.value)}
          placeholder="Search employers to assign department"
          className=" w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm border border-black pl-9 pr-4 py-2.5"
          />

        </div>
          

         </div>

         <div className=" overflow-x-auto rounded-lg border border-amber-50 ">

           <table className="w-full text-left text-sm text-slate-600 border-collapse">

             <thead className="font-bold text-slate-950 uppercase tracking-wider ">
               <tr>
               <th className="p-4">Employee Identity</th>
                <th className="p-4">Contact Coordinates</th>
                <th className="p-4">Assigned Department</th>
                <th className="p-4 text-right">Operational Actions</th>

               </tr>
             </thead>

             <tbody className="divide-y divide-slate-100">
              

              
             </tbody>

           </table>

         </div>

      </div>
     
    </div>
  );
}
