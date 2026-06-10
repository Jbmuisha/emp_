export default function UserManagerForm() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-100">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">User Manager Info</h1> 
      
      <form action="" method="post" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Fullname Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullname" className="text-sm font-semibold text-slate-700">Full Name</label>
          <input 
            id="fullname"
            type="text" 
            placeholder="John Doe" 
            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
          />
        </div>

        {/* Username Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="username" className="text-sm font-semibold text-slate-700">Username</label>
          <input 
            id="username"
            type="text" 
            placeholder="johndoe12"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm" 
          /> 
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</label>
          <input 
            id="email"
            type="email" 
            placeholder="john@example.com"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm" 
          /> 
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
          <input 
            id="password"
            type="password" 
            placeholder="••••••••"
            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm" 
          />
        </div>

        {/* Role Selection Field (Spans remaining space on desktop) */}
        <div className="md:col-span-1 lg:col-span-2 flex flex-col gap-1.5">
          <label htmlFor="role" className="text-sm font-semibold text-slate-700">Account Role</label>
          <select 
            id="role"
            name="role" 
            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select> 
        </div>

        {/* Action Button Row (Spans full width) */}
        <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-4 border-t border-slate-100 mt-2">
          <button 
            type="submit" 
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm hover:shadow transition duration-200 ease-in-out cursor-pointer"
          >
            create User
          </button>
        </div>
      </form>
    </div>
  );
}
