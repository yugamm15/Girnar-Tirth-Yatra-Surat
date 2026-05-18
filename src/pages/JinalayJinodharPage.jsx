import { LightPageShell } from '../components/LightPageShell.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const JinalayJinodharPage = () => {
  const { t } = useLanguage();

  return (
    <LightPageShell>
      <section className="max-w-7xl mx-auto space-y-12 md:space-y-16">
        <header className="light-panel light-panel-left p-6 md:p-10">
          <span className="text-[#c5a059] font-headline text-[10px] tracking-[0.45em] uppercase opacity-80 font-bold">
            Jinalay Seva
          </span>
          <h1 className="text-3xl md:text-5xl font-headline mt-4 text-gray-900 leading-tight max-w-4xl">
            Jinalay Jinodhar
          </h1>
          <p className="mt-5 text-sm md:text-base text-gray-600 max-w-3xl leading-relaxed">
            Our group is dedicated to the restoration and maintenance of sacred Jinalayas. This page will soon feature our ongoing and completed Jinalay projects.
          </p>
        </header>

        <section className="light-panel min-h-[400px] p-10 flex flex-col items-center justify-center bg-white border border-[#ddd2b7] relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-headline text-[#7a5f2d] mb-4 uppercase tracking-widest opacity-80">Coming Soon</h2>
            <p className="text-gray-500 max-w-md mx-auto italic">
              "Every stone restored in a Jinalay is a step closer to preserving our divine heritage."
            </p>
          </div>
        </section>
      </section>
    </LightPageShell>
  );
};

export default JinalayJinodharPage;
