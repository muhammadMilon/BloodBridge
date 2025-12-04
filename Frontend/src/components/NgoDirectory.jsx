import { useMemo, useState } from "react";
import { ngoDirectory } from "../data/platformData";

const NgoDirectory = () => {
  const divisions = useMemo(
    () => ["All Divisions", ...new Set(ngoDirectory.map((item) => item.division))],
    []
  );
  const [division, setDivision] = useState("All Divisions");

  const visibleRows = useMemo(() => {
    if (division === "All Divisions") return ngoDirectory;
    return ngoDirectory.filter((item) => item.division === division);
  }, [division]);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Blood Banks & NGOs</h2>
          <p className="text-slate-600">
            Tap any contact to initiate email or phone. Directory is kept up-to-date with verified partners.
          </p>
        </div>
        <select
          value={division}
          onChange={(e) => setDivision(e.target.value)}
          className="px-4 py-3 border border-rose-200 rounded-xl bg-white font-semibold text-sm"
        >
          {divisions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="glass border border-rose-100 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-rose-50 to-red-50 text-left text-slate-500 uppercase tracking-widest text-xs">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Division</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.name} className="border-t border-rose-100">
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.name}</td>
                  <td className="px-4 py-3 text-slate-600">{row.division}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${row.contact}`} className="text-rose-600 font-semibold">
                      {row.contact}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${row.email}`} className="text-indigo-600 font-semibold">
                      {row.email}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        row.verified
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {row.verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default NgoDirectory;

