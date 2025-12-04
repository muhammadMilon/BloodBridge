import { useMemo, useState } from "react";
import { hematologyDoctors } from "../data/platformData";

const DoctorSuggestions = () => {
  const divisions = useMemo(
    () => ["All Divisions", ...new Set(hematologyDoctors.map((doc) => doc.division))],
    []
  );
  const [division, setDivision] = useState("All Divisions");

  const visibleDoctors = useMemo(() => {
    if (division === "All Divisions") return hematologyDoctors;
    return hematologyDoctors.filter((doc) => doc.division === division);
  }, [division]);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Division-wise Hematology Experts
          </h2>
          <p className="text-slate-600 mt-2">
            Verified specialists with direct contact details, curated for urgent consults and follow-up appointments.
          </p>
        </div>
        <select
          className="border border-rose-200 rounded-xl px-5 py-3 font-semibold text-sm bg-white"
          value={division}
          onChange={(e) => setDivision(e.target.value)}
        >
          {divisions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleDoctors.map((doctor) => (
          <article
            key={doctor.name}
            className="glass border border-rose-100 rounded-2xl p-6 shadow-lg flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-rose-500">
                  {doctor.division}
                </p>
                <h3 className="text-xl font-bold text-slate-900">{doctor.name}</h3>
                <p className="text-sm text-slate-500">{doctor.hospital}</p>
              </div>
              {doctor.verified && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  Verified
                </span>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                Specialties:
                <span className="text-slate-500 font-normal"> {doctor.specialties.join(", ")}</span>
              </p>
              <a
                href={`tel:${doctor.contact}`}
                className="inline-flex items-center gap-2 text-rose-600 font-semibold"
              >
                📞 {doctor.contact}
              </a>
            </div>
            <button className="mt-auto px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold text-sm shadow-md">
              Request Appointment
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DoctorSuggestions;

