"use client";

export default function AdminWork() {
  const DAYS = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];
  const DAY_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="max-w-4xl mx-auto p-5 ">
      <div className=" bg-white border border-amber-50 rounded-lg shadow-[0px_13px_27px_-5px_rgba(50,50,93,0.25),0px_8px_16px_-8px_rgba(0,0,0,0.3)]  p-6  ">
        <h1 className="text-2xl text-blue-700 font-bold mb-5">
          A jouter un quart pour horaire de travail
        </h1>

        <form
          action=""
          className="grid grid-col-1 md:grid-col-2 lg:grid-col-3 gap-5"
        >
          <div className=" flex flex-col  gap-1.5 md:col-span-1 lg:col-end-2 ">
            <label htmlFor="" className="text-sm text-black  ">
              {" "}
              department{" "}
            </label>
            <select
              name=""
              id=""
              className="w-full px-3 py-2 rounded-lg text-black border border-slate-100 text-shadow-mauve-900"
            >
              <option value="">chosse the department</option>
              <option value="">{}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-1 lg:col-span-2">
            <label htmlFor="" className="text-sm text-blue-700 font-bold ">
              {" "}
              WORKERS{" "}
            </label>
            <select
              name=""
              id=""
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-black"
            >
              <option value=""> choose employee </option>
              <option value="">{}</option>
            </select>
          </div>
          <div className="grid grid-cols-7 gap-1">
            <label
              htmlFor=""
              className="block text-xs font-semibold text-foreground mb-2 uppercase tracking-wider"
            >
              Jour <span className="text-destructive">*</span>
            </label>

            {DAY_SHORT.map((val, index) => (
              <button
                key={val ?? index}
                className="py-1 rounded-lg text-xs text-blue font-bold transition-all"
              >
                {val}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
