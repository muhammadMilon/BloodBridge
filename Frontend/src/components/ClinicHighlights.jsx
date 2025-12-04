import { clinicDirectory } from "../data/platformData";

const ClinicHighlights = () => {
  return (
    <section className="bg-gradient-to-br from-rose-50 via-white to-red-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
            Division-wise Clinics
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Trusted Hematology Clinics & Emergency Units
          </h2>
          <p className="text-slate-600">
            BloodBridge curates the highest-rated clinics per division with facilities, emergency
            contacts, and shortcuts to ambulance and request modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinicDirectory.map((clinic) => (
            <article
              key={clinic.name}
              className="glass border border-rose-100 rounded-2xl p-6 shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-widest text-rose-500 font-bold">
                  {clinic.division}
                </p>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                  ⭐ {clinic.rating.toFixed(1)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{clinic.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{clinic.address}</p>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {clinic.facilities.map((facility) => (
                  <li key={facility} className="flex items-center gap-2">
                    <span className="text-rose-500">•</span>
                    {facility}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={`tel:${clinic.emergencyContact}`}
                  className="flex-1 px-4 py-2 rounded-xl border border-rose-200 text-rose-600 font-semibold text-sm text-center hover:bg-white"
                >
                  Call {clinic.emergencyContact}
                </a>
                <a
                  href="#ambulance"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-sm shadow-md"
                >
                  Request Ambulance
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClinicHighlights;

