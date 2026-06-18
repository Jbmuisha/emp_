"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  
  // 1. Single configuration object for text to prevent layout inflation loops
  const textConfig = {
    h1: "Welcome to our web",
    paragraph1: "Let's get started",
    paragraph2: "Don't have an account?"
  };

const formFields: { name: "username" | "password"; label: string; type: string; placeholder: string }[] = [
    { name: "username", label: "Username or Email", type: "email", placeholder: "Username" },
    { name: "password", label: "Password", type: "password", placeholder: "Password" }
  ] ;

  // 2. State management
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

// 3. Dynamic input updater
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

// 4. Form submission handler
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Map username to email for backend
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const useStr=  localStorage.getItem('user');
    if(useStr){
      const user = JSON.parse(useStr)
      
      if(user.role === "admin"){
        router.push('/admin/dashbord')
      }else{
        router.push('/employee/dashbord')
      }
      
    } 
     else {
        router.push('/')
      }


      // Redirect to dashboard or home
      
      
    } catch (errpr) {
      console.error("An error occurred during login")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased">
      {/* ADDED max-w-sm to drastically reduce card width */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 space-y-5">
        
        {/* Fixed Title Layout (No unnecessary loop spacing) */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{textConfig.h1}</h1>
          <p className="text-xs text-slate-500">{textConfig.paragraph1}</p>
        </div>

<form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
              {error}
            </div>
          )}
          
          {formFields.map((field, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <label htmlFor={field.name} className="text-xs font-semibold text-slate-700">
                {field.label}
              </label>
              <input 
                id={field.name}
                name={field.name} 
                type={field.type} 
                placeholder={field.placeholder}  
                value={formData[field.name]}
                onChange={handleChange}
                disabled={loading}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all disabled:opacity-50"
              />
            </div>
          ))}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-sm font-semibold rounded-xl transition-colors shadow-md mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Footer Subtext integration */}
        <p className="text-center text-xs text-slate-500">
          {textConfig.paragraph2}{' '}
          <a href="#" className="font-semibold text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
