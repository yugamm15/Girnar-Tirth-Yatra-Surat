const tr = (en, gu, hi) => ({ en, gu, hi });

export const upashrays = [
  {
    slug: 'vagad',
    status: 'completed',
    coverImage: '/images/Vagad after.webp',
    images: {
      before: ['/images/Vagad Before.webp'],
      process: ['/images/Vagad work in progree.webp'],
      after: ['/images/Vagad after.webp'],
    },
    name: tr('Vagad Upashray', 'વાગડ ઉપાશ્રય', 'वागड उपाश्रय'),
    place: tr('Vagad, Gujarat', 'વાગડ, ગુજરાત', 'वागड, गुजरात'),
    pincode: '364730',
    distanceNote: tr(
      'On the Surat-Girnar vihar route; frequently used as a rest and sadhana halt.',
      'સુરત-ગિરનાર વિહાર માર્ગ પર આવેલ; આરામ અને સાધના માટે વારંવાર ઉપયોગમાં લેવાતો વિરામસ્થળ.',
      'सूरत-गिरनार विहार मार्ग पर स्थित; विश्राम और साधना के लिए प्रायः उपयोग में आने वाला ठहराव स्थल।',
    ),
    mulnayak: tr(
      'Shri Neminath Bhagwan (local sangh reference; verify before print material)',
      'શ્રી નેમિનાથ ભગવાન (સ્થાનિક સંઘ સંદર્ભ; છાપકામ પહેલાં ખાતરી કરવી)',
      'श्री नेमिनाथ भगवान (स्थानीय संघ संदर्भ; मुद्रण से पहले पुष्टि करें)',
    ),
    upashrayCount: tr('1 main campus', '1 મુખ્ય પરિસર', '1 मुख्य परिसर'),
    description: tr(
      'Vagad Upashray has been refreshed with practical improvements for yatri comfort, basic cleanliness, and ritual readiness.',
      'વાગડ ઉપાશ્રયમાં યાત્રિક સુવિધા, સ્વચ્છતા અને વિધિ-તૈયારી માટે જરૂરી સુધાર કાર્ય કરવામાં આવ્યું છે.',
      'वागड उपाश्रय में यात्री सुविधा, स्वच्छता और अनुष्ठान तैयारी हेतु आवश्यक सुधार कार्य किया गया है।',
    ),
    locationText: tr(
      'Approachable from the main road with easy entry for sangh movement and halt logistics.',
      'મુખ્ય માર્ગથી સરળ પહોંચ, સંઘ ગતિ અને વિરામ વ્યવસ્થા માટે અનુકૂળ પ્રવેશ.',
      'मुख्य मार्ग से सहज पहुंच, संघ गमन और ठहराव व्यवस्था के लिए अनुकूल प्रवेश।',
    ),
    mapUrl: 'https://maps.google.com/?q=Vagad%20Gujarat',
    futureAnimation: {
      enabled: false,
      note: tr(
        'Route animation placeholder reserved for future media.',
        'ભવિષ્યના મીડિયા માટે રૂટ એનિમેશન સ્થાન અનામત.',
        'भविष्य मीडिया हेतु रूट एनीमेशन स्थान आरक्षित।',
      ),
    },
  },
  {
    slug: 'ranpur',
    status: 'inProgress',
    coverImage: '/images/Ranpur work in progress.webp',
    images: {
      before: ['/images/ranpur before.webp'],
      process: ['/images/Ranpur work in progress.webp'],
      after: ['/images/Ranpur after.webp'],
    },
    name: tr('Ranpur Upashray', 'રાણપુર ઉપાશ્રય', 'राणपुर उपाश्रय'),
    place: tr('Ranpur, Gujarat', 'રાણપુર, ગુજરાત', 'राणपुर, गुजरात'),
    pincode: '382245',
    distanceNote: tr(
      'A key midpoint stop on the wider vihar corridor connecting seva routes.',
      'વિવિધ સેવા માર્ગોને જોડતા વિશાળ વિહાર માર્ગનો મહત્વપૂર્ણ મધ્ય વિરામ.',
      'विभिन्न सेवा मार्गों को जोड़ने वाले विस्तृत विहार कॉरिडोर का महत्वपूर्ण मध्य पड़ाव।',
    ),
    mulnayak: tr(
      'Shri Adinath Bhagwan (local reference; subject to final sangh confirmation)',
      'શ્રી આદિનાથ ભગવાન (સ્થાનિક સંદર્ભ; અંતિમ સંઘ પુષ્ટિ બાકી)',
      'श्री आदिनाथ भगवान (स्थानीय संदर्भ; अंतिम संघ पुष्टि शेष)',
    ),
    upashrayCount: tr('1 active renovation site', '1 સક્રિય સુધાર સ્થળ', '1 सक्रिय सुधार स्थल'),
    description: tr(
      'Ranpur Upashray is in active renovation with structural cleanup, utility updates, and pilgrim-friendly reorganization.',
      'રાણપુર ઉપાશ્રયમાં હાલ સક્રિય જીર્ણોધ્ધાર ચાલી રહ્યો છે, જેમાં માળખાકીય સફાઈ, સુવિધા સુધારા અને યાત્રિક અનુકૂળ આયોજન થાય છે.',
      'राणपुर उपाश्रय में वर्तमान में सक्रिय जीर्णोद्धार चल रहा है, जिसमें संरचनात्मक सफाई, सुविधा उन्नयन और यात्री-अनुकूल पुनर्संयोजन शामिल है।',
    ),
    locationText: tr(
      'Located within easy village access and suitable for phased work execution.',
      'ગામ વિસ્તારમાં સરળ પહોંચ સાથે તબક્કાવાર કાર્ય માટે અનુકૂળ સ્થાન.',
      'ग्राम्य क्षेत्र में आसान पहुंच के साथ चरणबद्ध कार्यान्वयन हेतु उपयुक्त स्थान।',
    ),
    mapUrl: 'https://maps.google.com/?q=Ranpur%20Gujarat',
    futureAnimation: {
      enabled: false,
      note: tr(
        'Process timeline animation can be attached in future updates.',
        'ભવિષ્યના અપડેટમાં પ્રગતિ ટાઈમલાઈન એનિમેશન જોડાશે.',
        'भविष्य अपडेट में प्रगति टाइमलाइन एनीमेशन जोड़ा जा सकता है।',
      ),
    },
  },
  {
    slug: 'umrala',
    status: 'planned',
    coverImage: '/images/umarala working in progress.webp',
    images: {
      before: ['/images/umarala before.webp'],
      process: ['/images/umarala working in progress.webp'],
      after: ['/images/umarala after.webp'],
    },
    name: tr('Umrala Upashray', 'ઉમરાળા ઉપાશ્રય', 'उमराला उपाश्रय'),
    place: tr('Umrala, Gujarat', 'ઉમરાળા, ગુજરાત', 'उमराला, गुजरात'),
    pincode: '364330',
    distanceNote: tr(
      'Strategically placed for onward travel support toward major tirth routes.',
      'મુખ્ય તીર્થ માર્ગ તરફ આગળની યાત્રા માટે વ્યૂહાત્મક રીતે અનુકૂળ સ્થાન.',
      'मुख्य तीर्थ मार्गों की ओर आगे की यात्रा सहयोग हेतु रणनीतिक रूप से स्थित।',
    ),
    mulnayak: tr(
      'Shri Parshvanath Bhagwan (to be reconfirmed with local sangh records)',
      'શ્રી પાર્શ્વનાથ ભગવાન (સ્થાનિક સંઘ રેકોર્ડ સાથે પુનઃપુષ્ટિ કરવી)',
      'श्री पार्श्वनाथ भगवान (स्थानीय संघ अभिलेख से पुनः पुष्टि अपेक्षित)',
    ),
    upashrayCount: tr('1 planned enhancement block', '1 આયોજનબદ્ધ સુધાર બ્લોક', '1 योजनाबद्ध सुधार ब्लॉक'),
    description: tr(
      'Umrala Upashray planning includes sanitation upgrades, flow management, and readiness for future sangh stays.',
      'ઉમરાળા ઉપાશ્રય આયોજનમાં સ્વચ્છતા સુધારા, ગતિ વ્યવસ્થાપન અને ભાવિ સંઘ નિવાસ માટેની તૈયારીનો સમાવેશ થાય છે.',
      'उमराला उपाश्रय योजना में स्वच्छता उन्नयन, संचलन प्रबंधन और भविष्य के संघ-निवास हेतु तैयारी शामिल है।',
    ),
    locationText: tr(
      'Village-facing access with space for phased renovation and service logistics.',
      'ગામ તરફથી સરળ પ્રવેશ સાથે તબક્કાવાર જીર્ણોધ્ધાર અને સેવા વ્યવસ્થા માટે યોગ્ય જગ્યા.',
      'गांव की ओर से सहज पहुंच, चरणबद्ध जीर्णोद्धार और सेवा व्यवस्थापन के लिए पर्याप्त स्थान।',
    ),
    mapUrl: 'https://maps.google.com/?q=Umrala%20Gujarat',
    futureAnimation: {
      enabled: false,
      note: tr(
        'Future route storytelling media is reserved for this record.',
        'આ રેકોર્ડ માટે ભાવિ રૂટ-સ્ટોરી મીડિયા અનામત છે.',
        'इस रिकॉर्ड हेतु भविष्य रूट-स्टोरी मीडिया आरक्षित है।',
      ),
    },
  },
];

export const getUpashrayBySlug = (slug) => upashrays.find((item) => item.slug === slug);
