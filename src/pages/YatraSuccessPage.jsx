import { Link, useLocation } from 'react-router-dom';
import { LightPageShell } from '../components/LightPageShell.jsx';

const YatraSuccessPage = () => {
  const location = useLocation();
  const successKind = location.state?.kind || 'booking';
  const title = successKind === 'sponsorship' ? 'Sponsorship Successful!' : 'Booking Successful!';
  const description = successKind === 'sponsorship'
    ? 'Thank you for supporting the monthly bus yatra. Your labharthi selection has been recorded and the team will share confirmation details.'
    : 'Thank you for choosing Shri Girnar Tirth Yatra Group. Your pilgrimage journey is confirmed. A digital ticket has been sent to your Email ID.';
  const primaryLink = successKind === 'sponsorship' ? '/monthly-bus-yatra/sponsorship' : '/monthly-bus-yatra';
  const primaryLabel = successKind === 'sponsorship' ? 'Back to Sponsorship' : 'Back to Yatra List';

  return (
    <LightPageShell>
      <div className="max-w-2xl mx-auto py-24 px-6 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-100/50">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-headline text-gray-900 mb-6">{title}</h1>
        <p className="text-gray-500 text-lg leading-relaxed mb-8">{description}</p>
        
        {successKind === 'booking' && (
          <div className="bg-[#fff3cd] border border-[#ffeeba] text-[#856404] p-6 rounded-md text-left mb-12 max-w-lg mx-auto shadow-sm">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              ⚠️ Important Rules & Updates
            </h3>
            <ul className="list-disc pl-5 space-y-3 text-[15px]">
              <li>Ropeway and food from any shop are <strong className="text-red-600">strictly not allowed</strong>.</li>
              <li>Please join our official WhatsApp group to receive your bus number and seat details: <br/>
                <a href="https://chat.whatsapp.com/InmXFFC98pjI5SF5ugO8pO" target="_blank" rel="noopener noreferrer" className="text-green-700 font-bold hover:text-green-800 hover:underline mt-2 inline-flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider">
                  <span>📱 Join WhatsApp Group</span>
                </a>
              </li>
            </ul>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            to={primaryLink}
            className="px-8 py-5 bg-[#c5a059] text-white font-bold uppercase tracking-widest text-xs hover:bg-[#b08d4a] transition-all"
          >
            {primaryLabel}
          </Link>
          <Link 
            to="/"
            className="px-8 py-5 border border-[#c5a059] text-[#8f6d2f] font-bold uppercase tracking-widest text-xs hover:bg-[#fcf9f2] transition-all"
          >
            Go to Home
          </Link>
        </div>
        
        <div className="mt-16 p-6 bg-gray-50 border border-gray-100 rounded-sm inline-block">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">Booking Reference</p>
          <p className="text-sm font-headline text-gray-900 mt-2">GSG-{Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
        </div>
      </div>
    </LightPageShell>
  );
};

export default YatraSuccessPage;
