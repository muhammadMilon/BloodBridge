const QrVerificationInfo = () => {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10 items-center">
        <div className="space-y-5 max-w-xl">
          <p className="text-sm uppercase tracking-[0.4em] text-rose-300 font-semibold">
            QR Verification
          </p>
          <h2 className="text-3xl sm:text-4xl font-black">Scan, Verify, Update Stats</h2>
          <p className="text-slate-300">
            Every donor profile and request now ships with a unique QR signature. Hospitals scan it to confirm donation completion, auto-update statistics, and trigger reward badges.
          </p>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>• QR embedded in donor dashboard & request details</li>
            <li>• Works offline; verification syncs once back online</li>
            <li>• Prevents duplicate or fraudulent submissions</li>
          </ul>
        </div>

        <div className="glass border border-white/10 rounded-3xl p-6 w-full lg:w-1/3 text-center space-y-4">
          <div className="w-full aspect-square rounded-2xl bg-white flex items-center justify-center text-slate-900 font-black text-xl">
            QR Preview
          </div>
          <p className="text-sm text-slate-300">
            Actual QR codes are generated dynamically from donor/request IDs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default QrVerificationInfo;

