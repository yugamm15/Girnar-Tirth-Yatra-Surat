const tr = (en, gu, hi) => ({ en, gu, hi });

export const languageStorageKey = 'girnar-site-language';

export const supportedLanguages = [
  { code: 'en', label: tr('English', 'English', 'English') },
  { code: 'gu', label: tr('Gujarati', 'ગુજરાતી', 'गुजराती') },
  { code: 'hi', label: tr('Hindi', 'હિન્દી', 'हिंदी') },
];

export const siteCopy = {
  brandName: tr('Girnar Tirth Yatra', 'ગિરનાર તીર્થ યાત્રા', 'गिरनार तीर्थ यात्रा'),
  brandLocation: tr('Surat', 'સુરત', 'सूरत'),
  navItems: [
    { key: 'home', path: '/', label: tr('Home', 'મુખપૃષ્ઠ', 'होम') },
    {
      key: 'about',
      path: '#',
      label: tr('About Girnar', 'ગિરનાર વિષે', 'गिरनार परिचय'),
      dropdown: [
        {
          key: 'bhavyatra',
          path: '/about-girnar',
          label: tr('Girnar Bhavyatra', 'ગિરનાર ભાવયાત્રા', 'गिरनार भावयात्रा'),
        },
        {
          key: '14jinalaya',
          path: '/14-jinalaya',
          label: tr('14 Jinalaya', '૧૪ જિનાલય', '14 जिनालय'),
        },
        {
          key: 'sahesavan',
          path: '/sahesavan-tirth',
          label: tr('Sahesavan Tirth', 'સહેસાવન તીર્થ', 'सहेसावन तीर्थ'),
        },
      ],
    },
    {
      key: 'jirnodhar',
      path: '#',
      label: tr('Jirnodhar', 'જીર્ણોદ્ધાર', 'जीर्णोद्धार'),
      dropdown: [
        {
          key: 'upashray',
          path: '/upashray-jirnodhar',
          label: tr('Upashray Jirnodhar', 'ઉપાશ્રય જીર્ણોદ્ધાર', 'उपाश्रय जीर्णोद्धार'),
        },
        {
          key: 'jinalay',
          path: '/jinalay-jirnodhar',
          label: tr('Jinalay Jirnodhar', 'જિનાલય જીર્ણોદ્ધાર', 'जिनालय जीर्णोद्धार'),
        },
      ],
    },
    {
      key: 'bus',
      path: '/monthly-bus-yatra',
      label: tr('Monthly Bus Yatra', 'માસિક બસ યાત્રા', 'मासिक बस यात्रा'),
    },
    { key: 'events', path: '/events', label: tr('Events', 'કાર્યક્રમો', 'कार्यक्रम') },
    { key: 'contact', path: '/contact-us', label: tr('Contact Us', 'સંપર્ક કરો', 'संपर्क करें') },
  ],
  common: {
    readMore: tr('Read More', 'વધુ વાંચો', 'और पढ़ें'),
    viewDetails: tr('View Details', 'વિગતો જુઓ', 'विवरण देखें'),
    getDirections: tr('Get Directions', 'દિશા જુઓ', 'दिशा देखें'),
    openNavigationMenu: tr('Open navigation menu', 'મેનૂ ખોલો', 'नेविगेशन मेनू खोलें'),
    languageSwitcher: tr('Language switcher', 'ભાષા પસંદગી', 'भाषा चयन'),
    loadingPage: tr('Loading page...', 'પૃષ્ઠ લોડ થઈ રહ્યું છે...', 'पेज लोड हो रहा है...'),
    status: tr('Status', 'સ્થિતિ', 'स्थिति'),
    backToList: tr('Back to Upashray List', 'ઉપાશ્રય યાદી પર પાછા જાઓ', 'उपाश्रय सूची पर वापस जाएं'),
    location: tr('Location', 'સ્થાન', 'स्थान'),
    pincode: tr('Pincode', 'પિનકોડ', 'पिनकोड'),
    mulnayak: tr('Mulnayak', 'મૂળનાયક', 'मूलनायक'),
    upashrayCount: tr('Upashray Count', 'ઉપાશ્રય સંખ્યા', 'उपाश्रय संख्या'),
    routeNote: tr('Route Note', 'માર્ગ નોંધ', 'मार्ग टिप्पणी'),
  },
  statuses: {
    completed: tr('Completed', 'પૂર્ણ', 'पूर्ण'),
    inProgress: tr('In Progress', 'પ્રગતિમાં', 'प्रगति पर'),
    planned: tr('Planned', 'આયોજિત', 'योजनाबद्ध'),
  },
  home: {
    scenes: [
      { id: 'taleti', label: tr('Taleti', 'તળેટી', 'तलेटी') },
      { id: 'intro', label: tr('About Girnar', 'ગિરનાર વિષે', 'गिरनार परिचय') },
      { id: 'work1', label: tr('Bus Yatra', 'બસ યાત્રા', 'बस यात्रा') },
      { id: 'work2', label: tr('Upashray', 'ઉપાશ્રય', 'उपाश्रय') },
      { id: 'workj', label: tr('Jinalay', 'જિનાલય', 'जिनालय') },
      { id: 'work3', label: tr('Pathsala', 'પાઠશાળા', 'पाठशाला') },
      { id: 'work4', label: tr('Aarti & Abhishek', 'આરતી અને અભિષેક', 'आरती और अभिषेक') },
      { id: 'join', label: tr('Join Us', 'જોડાઓ', 'जुड़ें') },
    ],
    hero: {
      badge: tr('Shri Neminathaya Namah', 'શ્રી નેમિનાથાય નમઃ', 'श्री नेमिनाथाय नमः'),
      lineOne: tr('Welcome to', 'સ્વાગત છે', 'स्वागत है'),
      lineTwo: tr('Girnar Tirth Yatra Group - Surat', 'ગિરનાર તીર્થ યાત્રા ગ્રુપ - સુરત', 'गिरनार तीर्थ यात्रा समूह - सूरत'),
      subtitle: tr(
        'With the spirit of "Divinity in every soul" and the essential mission of friendship with all living beings, join the Girnar Group as we walk together on the path of universal compassion.',
        '"દરેક જીવમાં ઈશ્વર" ની ભાવના સાથે,અને દરેક કાર્ય કરતા પૂર્વે દરેક જીવ સાથે મૈત્રી એ સૌથી જરૂરી છે એવા જીવમૈત્રીના ઉદેશ્ય સાથે આગળ વધી રહેલ ગિરનાર ગ્રુપ સાથે ચાલો જીવમૈત્રીના પથ પર સાથે ચાલીએ..',
        '"हर जीव में ईश्वर" की भावना और हर जीव के साथ मैत्री के पावन उद्देश्य के साथ, आइए गिरनार ग्रुप के साथ जीव-मैत्री के पथ पर साथ चलें।',
      ),
      scrollHint: tr('Scroll to explore', 'અન્વેષણ માટે સ્ક્રોલ કરો', 'देखने के लिए स्क्रॉल करें'),
    },
    intro: {
      acharyaBadge: tr('The Spiritual Guide', 'આધ્યાત્મિક માર્ગદર્શન', 'आध्यात्मिक मार्गदर्शक'),
      acharyaTitle: tr('P.P. Acharya Hemvallabh M.S.', 'પ.પૂ. આચાર્ય હેમવલ્લભ મ.સા.', 'पू. आचार्य हेमवल्लभ म.सा.'),
      acharyaParagraphs: [
        tr(
          'Roughly two years after his diksha, Acharya Hemvallabh M.S. was sent to Girnarji and served in the guidance of P.P. Himanshusuri Dada for thirteen formative years.',
          'દીક્ષા પછી આશરે બે વર્ષમાં આચાર્ય હેમવલ્લભ મ.સા. ગિરનારજી પધાર્યા અને પ.પૂ. હિમાન્શુસૂરિ દાદાના માર્ગદર્શન હેઠળ તેર સાધનાભર્યા વર્ષ વ્યતીત કર્યા.',
          'दीक्षा के लगभग दो वर्ष बाद आचार्य हेमवल्लभ म.सा. गिरनारजी पधारे और पू. हिमांशुसूरि दादा के मार्गदर्शन में तेरह साधना-पूर्ण वर्ष बिताए।',
        ),
        tr(
          'His journey reflects determination, devotion, selflessness, and simplicity in service to Girnar and the Jain sangh.',
          'તેમની યાત્રા ગિરનાર અને જૈન સંઘ પ્રત્યેની અડગ નિષ્ઠા, ભક્તિ, નિસ્વાર્થતા અને સાદગીનો જીવંત દાખલો છે.',
          'उनकी यात्रा गिरनार और जैन संघ के प्रति अटल निष्ठा, भक्ति, निस्वार्थता और सरलता का जीवंत उदाहरण है।',
        ),
        tr(
          'He continues to work tirelessly to restore Girnarji’s glory and bring its spiritual closeness to every devotee.',
          'તેઓ આજે પણ ગિરનારજીની મહિમા પુનઃસ્થાપિત કરવા અને દરેક ભાવિકને તે પવિત્રતા સાથે જોડવા માટે અવિરત સેવા કરી રહ્યા છે.',
          'वे आज भी गिरनारजी की महिमा पुनर्स्थापित करने और हर श्रद्धालु को उस पवित्रता से जोड़ने हेतु निरंतर सेवा कर रहे हैं।',
        ),
      ],
      quote: tr(
        '"His search for innocent gochari tested him many times, yet his dedication only deepened with each step."',
        '"નિર્દોષ ગોચરીની તેમની સાધનાએ અનેક પરીક્ષાઓ લીધી, છતાં દરેક પ્રસંગે તેમની તપસ્યા વધુ ઊંડી બનતી ગઈ."',
        '"निर्दोष गोचरी की साधना ने उन्हें कई बार परखा, फिर भी हर अवसर पर उनकी तपस्या और गहरी होती गई।"',
      ),
      spiritualMasters: [
        {
          name: tr(
            'P.P. Acharya Bhagwant Shri Hemprabhasurishwarji M.S.',
            'પૂ. આચાર્ય ભગવંત શ્રી હેમપ્રભસૂરીશ્વરજી મ.સા.',
            'पू. आचार्य भगवंत श्री हेमप्रभसूरीश्वरजी म.सा.'
          ),
          image: '/images/upashrayjinalaya/1.JPG',
        },
        {
          name: tr(
            'P.P. Acharya Bhagwant Shri Hemvallabhsurishwarji M.S.',
            'પૂ. આચાર્ય ભગવંત શ્રી હેમવલ્લભસૂરીશ્વરજી મ.સા.',
            'पू. आचार्य भगवंत श्री हेमवल्लभसूरीश्वरजी म.सा.'
          ),
          image: '/images/upashrayjinalaya/2.jpeg',
        },
        {
          name: tr(
            'P.P. Acharya Bhagwant Shri Munichandrasurishwarji M.S.',
            'પૂ. આચાર્ય ભગવંત શ્રી મુનિચંદ્રસૂરીશ્વરજી મ.સા.',
            'पू. आचार्य भगवंत श्री मुनिचन्द्रसूरीश्वरजी म.सा.'
          ),
          image: '/images/upashrayjinalaya/3.jpeg',
        },
      ],
      groupBadge: tr('Group Seva Mission', 'સમૂહ સેવા મિશન', 'समूह सेवा मिशन'),
      groupTitle: tr('A Community Built on Seva', 'સેવાને કેન્દ્રમાં રાખતો સમૂહ', 'सेवा केंद्रित समुदाय'),
      groupParagraphs: [
        tr(
          'Shri Girnar Tirth Yatra Group began in 2018 with the blessings of Acharya Hemvallabh M.S. and has grown into a coordinated seva network.',
          'શ્રી ગિરનાર તીર્થ યાત્રા ગ્રુપની શરૂઆત 2018માં આચાર્ય હેમવલ્લભ મ.સા.ના આશીર્વાદથી થઈ અને આજે તે સુવ્યવસ્થિત સેવા જાળમાં વિકસ્યું છે.',
          'श्री गिरनार तीर्थ यात्रा समूह की शुरुआत 2018 में आचार्य हेमवल्लभ म.सा. के आशीर्वाद से हुई और आज यह एक सुव्यवस्थित सेवा नेटवर्क बन चुका है।',
        ),
        tr(
          'From yatra planning to upashray renewal and educational support, devotees contribute together in one spiritual direction.',
          'યાત્રા આયોજનથી લઈને ઉપાશ્રય જીર્ણોદ્ધાર અને શૈક્ષણિક સહાય સુધી, સેવકો એક જ આધ્યાત્મિક દિશામાં સાથે કાર્ય કરે છે.',
          'यात्रा आयोजन से लेकर उपाश्रय जीर्णोद्धार और शैक्षिक सहयोग तक, सेवक एक ही आध्यात्मिक दिशा में साथ काम करते हैं।',
        ),
      ],
    },
    monthlyBus: {
      badge: tr('Sacred Transit · 01', 'પવિત્ર પ્રવાસ · ૦૧', 'पवित्र यात्रा · 01'),
      title: tr('Monthly Bus Yatra', 'માસિક બસ યાત્રા', 'मासिक बस यात्रा'),
      paragraph: tr(
        'Serving over 10,000 pilgrims for the last 8 years, this service of pilgrimage from Surat to Girnar continues uninterrupted.',
        'છેલ્લા ૮ વર્ષથી ૧૦,૦૦૦થી વધુ યાત્રિકોને સેવા અર્પી, સુરતથી ગિરનારની તીર્થયાત્રાનો આ સેવાયજ્ઞ અવિરત ચાલુ છે.',
        'पिछले 8 वर्षों से 10,000 से अधिक यात्रियों को सेवा प्रदान करते हुए, सूरत से गिरनार की यह तीर्थयात्रा सेवा निरंतर जारी है।',
      ),
      frequencyLabel: tr('Frequency', 'આવર્તન', 'आवृत्ति'),
      frequencyValue: tr('2 Buses per Month', 'દર મહિને 2 બસ', 'प्रति माह 2 बसें'),
      experienceLabel: tr('Experience', 'અનુભવ', 'अनुभव'),
      experienceValue: tr(
        'Collective spiritual experience with all yatriks',
        'બધા યાત્રિકો સાથે સમૂહ આધ્યાત્મિક અનુભવ',
        'सभी यात्रियों के साथ सामूहिक आध्यात्मिक अनुभव',
      ),
    },
    upashray: {
      badge: tr('Architecture · 02', 'જીર્ણોદ્ધાર · ૦૨', 'जीर्णोद्धार · 02'),
      title: tr('Upashray Jirnodhar', 'ઉપાશ્રય જીર્ણોદ્ધાર', 'उपाश्रय जीर्णोद्धार'),
      paragraph: tr(
        'Through the renovation of sacred Upashrays for the last 4 years, we are making a humble effort to maintain the grandeur and sanctity of religious places.',
        'છેલ્લા ૪ વર્ષથી પવિત્ર ઉપાશ્રયોના જીર્ણોદ્ધાર દ્વારા અમે ધર્મસ્થાનોની ભવ્યતા અને પવિત્રતા જાળવવાનો નમ્ર પ્રયાસ કરી રહ્યા છીએ.',
        'पिछले 4 वर्षों से पवित्र उपाश्रयों के जीर्णोद्धार के माध्यम से, हम धार्मिक स्थलों की भव्यता और पवित्रता बनाए रखने का एक विनम्र प्रयास कर रहे हैं।',
      ),
      countLabel: tr('Total Upashrays Renovated till date', 'હાલ સુધી સુધારાયેલા ઉપાશ્રયો', 'अब तक नवीनीकृत उपाश्रय'),
      countValue: tr('80+', '80+', '80+'),
      currentFocus: tr('Current Focus: Pavagadh Upashrays', 'હાલનું કેન્દ્ર: પાવાગઢ ઉપાશ્રયો', 'वर्तमान केंद्र: पावागढ़ उपाश्रय'),
    },
    jinalayHome: {
      badge: tr('Architecture · 02.1', 'જીર્ણોદ્ધાર · ૦૨.૧', 'जीर्णोद्धार · 02.1'),
      title: tr('Jinalay Jirnodhar', 'જિનાલય જીર્ણોદ્ધાર', 'जिनालय जीर्णोद्धार'),
      paragraph: tr(
        'Along with Upashrays, our group is dedicated to the restoration of sacred Jinalayas. Total 14 Jinalayas have been renovated to preserve our divine heritage.',
        'ઉપાશ્રયોની સાથે, અમારું ગ્રુપ પવિત્ર જિનાલયોના જીર્ણોદ્ધાર માટે પણ સમર્પિત છે. અત્યાર સુધીમાં કુલ ૧૪ જિનાલયોનો જીર્ણોદ્ધાર કરવામાં આવ્યો છે.',
        'उपाश्रयों के साथ-साथ, हमारा समूह पवित्र जिनालयों के जीर्णोद्धार के लिए भी समर्पित है। अब तक कुल 14 जिनालयों का जीर्णोद्धार किया जा चुका है।',
      ),
      countLabel: tr('Total Jinalayas Renovated', 'કુલ જીર્ણોદ્ધાર થયેલ જિનાલયો', 'कुल नवीनीकृत जिनालय'),
      countValue: tr('14', '૧૪', '14'),
    },
    pathsala: {
      badge: tr('Education · 03', 'શૈક્ષણિક સેવા · ૦૩', 'शैक्षिक सेवा · 03'),
      title: tr('Pathsala Seva', 'પાઠશાળા સેવા', 'पाठशाला सेवा'),
      paragraph: tr(
        'We support Samkit group pathsalas in Surat so the next generation remains connected to Jain values and practices.',
        'સુરતની સમકિત ગ્રુપ પાઠશાળાઓ સાથે સેવા દ્વારા નવી પેઢી જૈન સંસ્કારો સાથે જોડાયેલી રહે તે માટે પ્રયાસ થાય છે.',
        'सूरत की समकित समूह पाठशालाओं के सहयोग से नई पीढ़ी जैन संस्कारों से जुड़ी रहे, यही हमारा प्रयास है।',
      ),
    },
    rituals: {
      badge: tr('Divine Rituals · 04', 'દિવ્ય વિધિઓ · ૦૪', 'दिव्य अनुष्ठान · 04'),
      title: tr('Maha Aarti & Abhishek', 'મહા આરતી અને અભિષેક', 'महा आरती और अभिषेक'),
      paragraph: tr(
        'By realizing the divine experience of Abhishek and Aarti performed on the holy peaks of Girnar in various Jinalayas, we make a humble effort to bring those sacred waves of devotion to you.',
        'ગિરનારના પાવન શિખરો પર થતા અભિષેક અને આરતીની દિવ્ય અનુભૂતિને વિવિધ જિનાલયોમાં સાકાર કરી, અમે ભક્તિના એ પવિત્ર તરંગોને આપની સમક્ષ લાવવાનો એક નમ્ર પ્રયાસ કરીએ છીએ.',
        'गिरनार के पवित्र शिखरों पर होने वाले अभिषेक और आरती के दिव्य अनुभव को विभिन्न जिनालयों में साकार करते हुए, हम भक्ति की उन पवित्र तरंगों को आपके समक्ष लाने का एक विनम्र प्रयास कर रहे हैं।',
      ),
      contacts: tr('Contact: Milanbhai 99798 58710 / Sandipbhai 98241 55255', 'સંપર્ક: મિલનભાઈ 99798 58710 / સંદિપભાઈ 98241 55255', 'संपर्क: मिलनभाई 99798 58710 / संदीपभाई 98241 55255')
    },
    join: {
      title: tr('Be A Part Of Our Journey', 'અમારી પવિત્ર યાત્રામાં સહભાગી બનો', 'हमारी इस यात्रा का हिस्सा बनें'),
      joinButton: tr('Join the Yatra', 'યાત્રામાં જોડાઓ', 'यात्रा में जुड़ें'),
      supportButton: tr('Support Our Work', 'અમારી સેવા સહાય કરો', 'हमारे कार्य का सहयोग करें'),
    },
  },
  aboutPage: {
    heroBadge: tr('About Girnar', 'ગિરનાર પરિચય', 'गिरनार परिचय'),
    heroTitle: tr('Acharya-Led Journey of Faith and Seva', 'આચાર્ય પ્રેરિત શ્રદ્ધા અને સેવાની યાત્રા', 'आचार्य प्रेरित श्रद्धा और सेवा की यात्रा'),
    heroDescription: tr(
      'A step-by-step introduction to the sacred pilgrimage of Girnar Tirth.',
      'ગિરનાર તીર્થની પવિત્ર યાત્રાનો ક્રમશઃ પરિચય.',
      'गिरनार तीर्थ की पवित्र यात्रा का चरणबद्ध परिचय।',
    ),
    pilgrimageSteps: [
      {
        id: 'aadinath-jinalay',
        title: tr('1. Shri Aadinath Jinalay', '૧. શ્રી આદિનાથ જિનાલય', '1. श्री आदिनाथ जिनालय'),
        description: tr(
          'Salutations at the feet of Lord Aadinath, the King of Kings. The auspicious beginning of the Girnar pilgrimage starts with the darshan of Lord Aadinath\'s temple. This is the sacred place where the first Tirthankara, Lord Aadinath, showers his grace upon the pilgrims. Beholding the smile and peaceful countenance of the Lord brings wonderful peace to the heart. Let us pray to Him, "O Lord! By Your blessings, may this Girnar pilgrimage become the best and most soul-purifying journey of my life."',
          '"રાજ રાજેશ્વર એવા આદિનાથ દાદાના ચરણોમાં વંદન" ગિરનારની યાત્રાનો મંગલારંભ આદિનાથ દાદાના દેરાસરના દર્શનથી થાય છે. આ એ પાવન સ્થાન છે જ્યાં પ્રથમ તીર્થંકર પ્રભુ આદિનાથની કૃપા દ્રષ્ટિ યાત્રાળુઓ પર પડે છે. દાદાના સ્મિત અને શાંત મુદ્રાના દર્શન કરતા જ હૃદયમાં એક અદભુત શાંતિ પ્રસરે છે. દાદાને વિનંતી કરીએ કે, "હે પ્રભુ! આપના આશીર્વાદથી આ ગિરનારની યાત્રા મારા જીવનની શ્રેષ્ઠ અને આત્મકલ્યાણકારી યાત્રા બની રહે."',
          '"राज राजेश्वर आदिनाथ दादा के चरणों में वंदन।" गिरनार की यात्रा का मंगलारंभ आदिनाथ दादा के मंदिर के दर्शन से होता है। यह वह पावन स्थान है जहाँ प्रथम तीर्थंकर प्रभु आदिनाथ की कृपा दृष्टि यात्रियों पर पड़ती है। दादा की मुस्कान और शांत मुद्रा के दर्शन करते ही हृदय में एक अद्भुत शांति छा जाती है। दादा से प्रार्थना करें कि, "हे प्रभु! आपके आशीर्वाद से यह गिरनार की यात्रा मेरे जीवन की श्रेष्ठ और आत्मकल्याणकारी यात्रा बनी रहे।"'
        ),
        image: '/images/about-girnar/shri aadinath jinalay.JPG'
      },
      {
        id: 'taleti',
        title: tr('2. Girnar Taleti', '૨. ગિરનાર તળેટી', '2. गिरनार तलेटी'),
        description: tr(
          'A million bows to the feet of Girnarji, the great holy Siddha Kshetra. This is the sacred land where infinite souls have attained salvation at every step. Before starting the journey, let us bow our heads to the Taleti and resolve to climb the holy Giriraj with energy and devotion.',
          'મહાન પવિત્ર સિદ્ધક્ષેત્ર ગિરનારજીના ચરણોમાં કોટિ-કોટિ વંદન. આ એ પાવન ભૂમિ છે જ્યાં ડગલે ને પગલે અનંત આત્માઓ મોક્ષે ગયા છે. યાત્રાની શરૂઆત કરતાં પહેલાં આપણે તળેટીને મસ્તક નમાવી, ઉર્જા અને ભક્તિભાવ સાથે પાવન ગિરિરાજ ચડવાના સંકલ્પ કરીએ.',
          'महान पवित्र सिद्धक्षेत्र गिरनारजी के चरणों में कोटि-कोटि वंदन। यह वह पावन भूमि है जहाँ कदम-कदम पर अनंत आत्माएं मोक्ष को प्राप्त हुई हैं। यात्रा शुरू करने से पहले, आइए हम तलेटी के सामने अपना सिर झुकाएं और ऊर्जा और भक्ति के साथ पवित्र गिरिराज पर चढ़ने का संकल्प लें।'
        ),
        image: '/images/about-girnar/girnar-taleti.jpeg'
      },
      {
        id: 'first-step',
        title: tr('3. Girnar First Step', '૩. ગિરનાર પ્રથમ પગથિયું', '3. गिरनार प्रथम सोपान'),
        description: tr(
          'Let us bow our heads at the first step with the chant of "Jai Girnari". O Giriraj! Give me the strength so that my emotional journey is completed without any obstacles and my karmas are destroyed. Every step takes us upwards towards liberation from the world and towards devotion to God.',
          '"જય ગિરનારી" ના નાદ સાથે પ્રથમ પગથિયે મસ્તક ઝુકાવીએ. હે ગિરિરાજ! મારી આ ભાવયાત્રા નિર્વિઘ્ને પૂર્ણ થાય અને મારા કર્મોનો ક્ષય થાય તેવી શક્તિ આપજો. દરેક પગથિયું આપણને સંસારથી મુક્તિ તરફ અને પ્રભુ ભક્તિ તરફ ઉપર લઈ જાય છે.',
          '"जय गिरनारी" के उद्घोष के साथ पहले कदम पर अपना सिर झुकाएं। हे गिरिराज! मुझे वह शक्ति दें कि मेरी यह भाव यात्रा बिना किसी बाधा के पूर्ण हो और मेरे कर्मों का क्षय हो। हर कदम हमें संसार से मुक्ति और प्रभु भक्ति की ओर ऊपर ले जाता है।'
        ),
        image: '/images/about-girnar/first-step.jpg'
      },
      {
        id: 'ambika',
        title: tr('4. Ambika Mata Mandir', '૪. અંબિકા માતા મંદિર', '4. अम्बिका माता मंदिर'),
        description: tr(
          'Bows at the feet of Shri Ambika Mataji, the presiding deity of Girnar Tirth. Mataji always protects the Jain Shasan and the devotees coming to the journey of Girnar. Let us pray to Mataji that our devotion remains unbroken and we get the strength to serve the Shasan.',
          'ગિરનાર તીર્થના અધિષ્ઠાયિકા દેવી શાસનદેવી શ્રી અંબિકા માતાજીના ચરણોમાં વંદન. માતાજી હંમેશા જૈન શાસનની અને ગિરનારની યાત્રાએ આવતા ભક્તોની રક્ષા કરે છે. માતાજી પાસે પ્રાર્થના કરીએ કે આપણી ભક્તિ અખંડ રહે અને શાસનની સેવા કરવાની શક્તિ મળે.',
          'गिरनार तीर्थ की अधिष्ठायिका देवी शासनदेवी श्री अम्बिका माताजी के चरणों में वंदन। माताजी सदैव जैन शासन और गिरनार की यात्रा पर आने वाले भक्तों की रक्षा करती हैं। आइए माताजी से प्रार्थना करें कि हमारी भक्ति अखंड रहे और हमें शासन की सेवा करने की शक्ति मिले।'
        ),
        image: '/images/about-girnar/ambika-mata-mandir.jpg'
      },
      {
        id: 'neminath-2750',
        title: tr('5. Neminath Bhagvan at 2750 Step', '૫. ૨૭૫૦ પગથિયે નેમિનાથ ભગવાન', '5. 2750 सीढ़ी पर नेमिनाथ भगवान'),
        description: tr(
          'Located right next to the path at the 2750th step, this small shrine often remains unnoticed by many devotees. Due to lack of knowledge, many pilgrims move ahead without stopping here, but in reality, this place is a wonderful center for experiencing the proximity of the Lord. Beholding the sacred footprints of Lord Neminath here is a direct experience of detachment. These footprints remind us that this is the very path through which the Tirthankara Lord embarked on the journey to salvation. Therefore, pay special attention while climbing Girnar and definitely stop at this small shrine. Let us bow our heads and pray at the Lord\'s feet, "O Lord! I have been blessed with the fortune of walking on the path where Your holy feet have trodden. May my emotional journey be completed without any obstacles until Your feet, and may my soul attain supreme peace."',
          '૨૭૫૦ પગથિયાં ચડતા માર્ગની બરાબર બાજુમાં આવેલી આ નાનકડી દેરી ઘણા ભક્તોની નજરથી અજાણી રહી જાય છે. અજ્ઞાનતાને કારણે ઘણા યાત્રાળુઓ અહીં રોકાયા વિના આગળ વધી જાય છે, પરંતુ ખરેખર તો આ સ્થાન પ્રભુની નિકટતા અનુભવવાનું એક અદભુત કેન્દ્ર છે. અહીં બિરાજમાન પ્રભુ નેમિનાથના પાવન પગલાંના દર્શન એટલે સાક્ષાત્ વૈરાગ્યનો અનુભવ. આ પગલાં આપણને યાદ અપાવે છે કે આ એ જ માર્ગ છે જેના પરથી તીર્થંકર પરમાત્માએ મોક્ષના પંથે પ્રયાણ કર્યું હતું. તેથી, ગિરનાર ચડતી વખતે ખાસ ધ્યાન રાખજો અને આ નાનકડી દેરી પાસે અચૂક થોભજો. મસ્તક નમાવીને પ્રભુના ચરણોમાં એટલી જ પ્રાર્થના કરીએ કે, "હે પ્રભુ! આપના આ ચરણો જ્યાં જ્યાં પડ્યા છે, તે માર્ગ પર ચાલવાનું સૌભાગ્ય મને મળ્યું છે. મારી આ ભાવયાત્રા આપના ચરણો સુધી નિર્વિઘ્ને પૂર્ણ થાય અને મારા આત્માને પરમ શાંતિ પ્રાપ્ત થાય."',
          '२७५० सीढ़ियां चढ़ते समय मार्ग के ठीक बगल में स्थित यह छोटी सी देरी कई भक्तों की नजर से ओझल रह जाती है। अज्ञानता के कारण कई यात्री यहाँ रुके बिना आगे बढ़ जाते हैं, लेकिन वास्तव में यह स्थान प्रभु की निकटता अनुभव करने का एक अद्भुत केंद्र है। यहाँ विराजमान प्रभु नेमिनाथ के पावन चरणों (पगलों) के दर्शन यानी साक्षात् वैरागी का अनुभव। ये पगले हमें याद दिलाते हैं कि यह वही मार्ग है जिससे तीर्थंकर परमात्मा ने मोक्ष के पथ पर प्रस्थान किया था। इसलिए, गिरनार चढ़ते समय विशेष ध्यान रखें और इस छोटी सी देरी पर अवश्य रुकें। मस्तक झुकाकर प्रभु के चरणों में बस इतनी ही प्रार्थना करें कि, "हे प्रभु! आपके ये चरण जहाँ-जहाँ पड़े हैं, उस मार्ग पर चलने का सौभाग्य मुझे मिला है। मेरी यह भाव यात्रा आपके चरणों तक निर्विघ्न पूर्ण हो और मेरी आत्मा को परम शांति प्राप्त हो।"'
        ),
        image: '/images/about-girnar/girnar-2750.jpeg'
      },
      {
        id: 'main-gate',
        title: tr('6. Girnar Tonk Main Gate', '૬. ગિરનાર ટૂંક મુખ્ય દરવાજો', '6. गिरनार टोंक मुख्य द्वार'),
        description: tr(
          'This is the holy gate, the anticipation of which makes the journey of thousands of steps successful. When we stand in front of this gate, there is no fatigue in the mind, only a wonderful ocean of peace and devotion overflowing. Crossing this gate means leaving behind all the attachments and aversions of the world and entering the light of the Lord\'s detachment. Touching this entrance, one feels that I am not just entering a stone gate, but opening the doors of my inner soul. Waves of joy should overflow while entering the sacred aura of this entrance to the 14 Jinalayas. May the fatigue of this journey shed away here as the burden of my karmas, and may I enter Your presence with only the pure feeling of Your devotion. Let us enter this gate with the feeling: "O Lord! Now I am Yours, and You are mine." Come, let us bow our heads to this gate of devotion and immerse ourselves in the infinite compassion of the Lord.',
          'આ એ પવિત્ર દ્વાર છે, જેની રાહ જોતા હજારો પગથિયાંની યાત્રા સફળ થઈ જાય છે. જ્યારે આ દ્વારની સામે આવીને ઉભો રહીએ, ત્યારે મનમાં કોઈ થાક નથી હોતો, માત્ર એક અદભુત શાંતિ અને ભક્તિનો સાગર છલકાતો હોય છે. આ દ્વાર પાર કરવું એટલે સંસારના તમામ રાગ-દ્વેષને બહાર મૂકીને પ્રભુના વૈરાગ્યના તેજમાં પ્રવેશવું. આ પ્રવેશદ્વારને સ્પર્શતા જ અનુભવાય છે કે હું માત્ર એક પથ્થરના દ્વારમાં નથી જઈ રહ્યો, પણ મારા અંદરના આત્માના દ્વાર ખોલી રહ્યો છું. ૧૪ જિનાલયોના આ પ્રવેશ દ્વારના પાવન ઓરામાં પ્રવેશતા આનંદ ની લહેરો છલકાવી જોઈએ. આ યાત્રાનો જે થાક છે તે મારા કર્મોનો ભાર બનીને અહીં જ ખરી જાય અને હું માત્ર તમારી ભક્તિનો નિર્મળ ભાવ લઈને આપના સાનિધ્યમાં પ્રવેશું. એવા ભાવ સાથે આ દ્વારમાં પ્રવેશીએ, અહીંયા એક જ ભાવ રમતો હોય: "હે પ્રભુ! હવે હું તમારો, અને તમે મારા." ચાલો, આ ભક્તિના દ્વારને મસ્તક નમાવીએ અને પ્રભુની અનંત કરુણામાં લીન થઈ જઈએ.',
          'यह वह पवित्र द्वार है, जिसकी प्रतीक्षा में हजारों सीढ़ियों की यात्रा सफल हो जाती है। जब हम इस द्वार के सामने खड़े होते हैं, तब मन में कोई थकान नहीं होती, केवल अद्भुत शांति और भक्ति का सागर उमड़ रहा होता है। इस द्वार को पार करने का अर्थ है संसार के सभी राग-द्वेष को बाहर छोड़कर प्रभु के वैराग्य के तेज में प्रवेश करना। इस प्रवेश द्वार को छूते ही अनुभव होता है कि मैं केवल एक पत्थर के द्वार में नहीं जा रहा हूँ, बल्कि अपने भीतर की आत्मा के द्वार खोल रहा हूँ। १४ जिनालयों के इस प्रवेश द्वार के पावन ओरा में प्रवेश करते समय आनंद की लहरें उमड़नी चाहिए। इस यात्रा की जो थकान है, वह मेरे कर्मों का भार बनकर यहीं झड़ जाए और मैं केवल आपकी भक्ति का निर्मल भाव लेकर आपके सान्निध्य में प्रवेश करूँ। ऐसे भाव के साथ इस द्वार में प्रवेश करें, जहाँ केवल एक ही भाव हो: "हे प्रभु! अब मैं आपका, और आप मेरे।" आइए, भक्ति के इस द्वार पर मस्तक झुकाएं और प्रभु की अनंत करुणा में लीन हो जाएं।'
        ),
        image: '/images/about-girnar/tonk-main-gate.jpg'
      },
      {
        id: 'tonk',
        title: tr('7. Girnar Tonk-gate', '૭. ગિરનાર ટૂંક દરવાજો', '7. गिरनार टोंक द्वार'),
        description: tr(
          '"Silence your speech while entering this holy gate. Keep the feeling that, "O Lord! I came with ego, worries, and the burden of the world, but now I am entering Your court as a pure soul, leaving everything outside." If tears of joy come to the eyes while entering, understand that our feeling has reached the Lord. Pray with gratitude in your heart: "O Lord! My soul, wandering for many births, has finally reached Your presence today. Infinite thanks to You for giving me this good fortune." Moving towards the sanctum sanctorum, surrender at the Lord\'s feet with an open heart: "O Lord! I have returned from the path of the world and finally come to Your feet. As I enter this gate, may all the doors of my ignorance close and Your light of infinite knowledge kindle in my heart. O Lord, dye me in the color of Your devotion."',
          '"આ પવિત્ર દ્વારે પ્રવેશતી વખતે તમારી વાણીને મૌન કરી દો. અહીં એવો ભાવ રાખો કે, "હે પ્રભુ! હું અહંકાર, ચિંતાઓ અને સંસારના ભાર સાથે આવ્યો હતો, પણ હવે તમારા દરબારમાં આ બધું જ બહાર છોડીને, એક શુદ્ધ આત્મા તરીકે પ્રવેશ કરી રહ્યો છું." પ્રવેશતી વખતે જો આંખમાં હર્ષના આંસુ આવે, તો સમજવું કે આપણો આ ભાવ પ્રભુ સુધી પહોંચી ગયો છે. મનમાં કૃતજ્ઞતા સાથે પ્રાર્થના કરો: "હે પ્રભુ! અનેક જન્મોથી ભટકતી મારી આત્મા આજે તમારા સાનિધ્યમાં આવીને ટકરાઈ છે, આ સૌભાગ્ય મને આપવા બદલ આપનો અનંત આભાર." ગર્ભગૃહ તરફ આગળ વધતા, નિખાલસ ભાવે પ્રભુના ચરણોમાં સમર્પિત થાઓ: "હે પ્રભુ! હું સંસારના માર્ગેથી ફરીને અંતે આપના ચરણોમાં આવ્યો છું. આ દ્વારમાં પ્રવેશતાની સાથે જ મારા અજ્ઞાનનાં તમામ દ્વાર બંધ થઈ જાય અને આપની અનંત જ્ઞાનરૂપી જ્યોત મારા હૃદયમાં પ્રગટે. હે પ્રભુ, મને આપની ભક્તિના રંગમાં રંગી લો."',
          '"इस पवित्र द्वार पर प्रवेश करते समय अपनी वाणी को मौन कर दें। यहाँ ऐसा भाव रखें कि, "हे प्रभु! मैं अहंकार, चिंताओं और संसार के भार के साथ आया था, लेकिन अब आपके दरबार में यह सब बाहर छोड़कर, एक शुद्ध आत्मा के रूप में प्रवेश कर रहा हूँ।" प्रवेश करते समय यदि आँखों में हर्ष के आँसू आ जाएँ, तो समझें कि हमारा यह भाव प्रभु तक पहुँच गया है। मन में कृतज्ञता के साथ प्रार्थना करें: "हे प्रभु! अनेक जन्मों से भटकती मेरी आत्मा आज आपके सान्निध्य में आकर थमी है, यह सौभाग्य मुझे देने के लिए आपका अनंत आभार।" गर्भगृह की ओर बढ़ते हुए, निश्छल भाव से प्रभु के चरणों में समर्पित हों: "हे प्रभु! मैं संसार के मार्ग से लौटकर अंततः आपके चरणों में आया हूँ। इस द्वार में प्रवेश करने के साथ ही मेरे अज्ञान के सभी द्वार बंद हो जाएँ और आपकी अनंत ज्ञानरूपी ज्योति मेरे हृदय में प्रज्वलित हो। हे प्रभु, मुझे अपनी भक्ति के रंग में रंग लें।"'
        ),
        image: '/images/about-girnar/girnar-tonk.jpeg'
      },
      {
        id: 'derashar',
        title: tr('8. Karnavihar Prasad jinalaya', '૮. કર્ણવિહાર પ્રાસાદ જિનાલય', '8. कर्णविहार प्रासाद जिनालय'),
        description: tr(
          'When one beholds the "Karnavihar Prasad" on the sky-touching peaks of Girnar, it feels as if one is entering another world from this one. Containing thousands of years of history and the detachment of countless souls, this palace is a living symbol of the realization of Lord Neminath. Reaching here is not just a physical journey, but the pinnacle of an "emotional journey". The peace we set out to find will be felt today in every stone of this Karnavihar Prasad.',
          'ગિરનારના ગગનચુંબી શિખરો પર જ્યારે આ "કર્ણવિહાર પ્રાસાદ" ના દર્શન થાય, ત્યારે એવું લાગે કે જાણે આ લોકમાંથી પરલોકમાં પ્રવેશ કરી રહ્યા છીએ. હજારો વર્ષોના ઈતિહાસ અને અસંખ્ય આત્માઓના વૈરાગ્યને પોતાની અંદર સમાવી લેનાર આ પ્રાસાદ એટલે પ્રભુ નેમિનાથના સાક્ષાત્કારનું જીવંત પ્રતિક. અહીં પહોંચવું એ માત્ર શારીરિક યાત્રા નથી, પણ એક "ભાવયાત્રા" ની ચરમસીમા છે. જે શાંતિની શોધમાં નીકળ્યા છીએ, તે શાંતિ આજે આ કર્ણવિહાર પ્રાસાદની પ્રત્યેક શીલામાં અનુભવાશે.',
          'गिरनार के गगनचुंबी शिखरों पर जब इस "कर्णविहार प्रासाद" के दर्शन होते हैं, तब ऐसा लगता है मानो इस लोक से परलोक में प्रवेश कर रहे हों। हजारों वर्षों के इतिहास और असंख्य आत्माओं के वैराग्य को अपने भीतर समाहित करने वाला यह प्रासाद यानी प्रभु नेमिनाथ के साक्षात्कार का जीवंत प्रतीक। यहाँ पहुँचना केवल एक शारीरिक यात्रा नहीं है, बल्कि एक "भाव यात्रा" की चरम सीमा है। जिस शांति की खोज में हम निकले हैं, वह शांति आज इस कर्णविहार प्रासाद के प्रत्येक पत्थर में अनुभव होगी।'
        ),
        image: '/images/about-girnar/derashar.jpg'
      },
      {
        id: 'neminath-bhagvan',
        title: tr('9. Neminath Bhagvan', '૯. નેમિનાથ ભગવાન', '9. नेमिनाथ भगवान'),
        description: tr(
          '"When one beholds the calm, gentle, and compassionate countenance of Lord Neminath seated in the sanctum sanctorum of Karnavihar Prasad, it feels as if time has stood still and one\'s gaze cannot be removed from the Lord. At this moment, only one feeling arises: "O Lord, I have not come here on my own, but You Yourself have called me."',
          '"જ્યારે કર્ણ વિહાર પ્રસાદના ગર્ભગૃહમાં બિરાજમાન પ્રભુ નેમિનાથની શાંત, સૌમ્ય અને કરુણાપૂર્ણ મુદ્રાના દર્શન થાય, ત્યારે એવું લાગે કે સમય થંભી ગયો છે અને બસ એ દાદા પરથી નજર જ ના હટે. આ ક્ષણે માત્ર એક જ ભાવ આવે કે હે પ્રભુ, હું અહીં આવ્યો નથી, પણ પ્રભુ આપે જ મને બોલાવ્યો છે."',
          '"जब कर्ण विहार प्रासाद के गर्भगृह में विराजमान प्रभु नेमिनाथ की शांत, सौम्य और करुणापूर्ण मुद्रा के दर्शन होते हैं, तब ऐसा लगता है कि समय थम गया है और बस उन दादा से नजर ही नहीं हटती। इस क्षण केवल एक ही भाव आता है कि "हे प्रभु, मैं यहाँ आया नहीं हूँ, बल्कि प्रभु आपने ही मुझे बुलाया है।"'
        ),
        image: '/images/about-girnar/neminath.jpg'
      },
      {
        id: 'sahesavan',
        title: tr('10. Sahesavan', '૧૦. સહેસાવન', '10. सहेसावन'),
        description: tr(
          'Sahesavan, the heart of Girnar, is not just a place, but the sacred land of the spiritual elevation of Lord Neminath. This is the very place where two precious and divine Kalyanaks of Lord Neminath\'s life were completed. 1. Diksha Kalyanak: On this land of Sahesavan, Lord Neminath renounced all worldly attachments and material pleasures and embraced Diksha (initiation). In the holy place where the Lord renounced the world and adopted the path of "Aparigraha" (non-possessiveness), waves of detachment are still felt today. Standing here, let us pray, "O Lord! Give me also some vision and strength to walk on this path of Your detachment." 2. Kevalgyan Kalyanak (Attainment of Omniscience): In this very Sahesavan, Lord Neminath destroyed his Ghati karmas and attained infinite knowledge—Kevalgyan. The infinite power to know and see the entire universe was attained by the Lord here. Stepping onto this place, one feels as if the darkness of our ignorance is being removed and the light of knowledge is dawning.',
          'ગિરનારના હૃદય સમાન સહસાવન એ માત્ર એક સ્થાન નથી, પરંતુ તે પ્રભુ નેમિનાથના આત્મિક ઉત્કર્ષની પાવન ભૂમિ છે. આ જ એ સ્થાન છે જ્યાં પ્રભુ નેમિનાથના જીવનના બે અમૂલ્ય અને દિવ્ય કલ્યાણકો સંપન્ન થયા હતા. ૧.દીક્ષા કલ્યાણક : સહસાવનની આ ભૂમિ પર પ્રભુ નેમિનાથે સંસારના તમામ રાગ-દ્વેષ અને ભૌતિક સુખ-વૈભવનો ત્યાગ કરી દીક્ષા અંગીકાર કરી હતી. જે પવિત્ર સ્થાને પ્રભુએ સંસારનો ત્યાગ કરી "અપરિગ્રહ" નો માર્ગ અપનાવ્યો, ત્યાં આજે પણ વૈરાગ્યની લહેરો અનુભવાય છે. અહીં ઊભા રહીને આપણે પ્રાર્થના કરીએ કે, "હે પ્રભુ! આપના આ વૈરાગ્યના પંથે ચાલવાની મને પણ થોડી દ્રષ્ટિ અને શક્તિ આપજો." ૨.કેવળજ્ઞાન કલ્યાણક (સર્વજ્ઞતાની પ્રાપ્તિ): આ જ સહસાવનમાં પ્રભુ નેમિનાથે ઘાતી કર્મોનો ક્ષય કરી અનંત જ્ઞાન—કેવળજ્ઞાન પ્રાપ્ત કર્યું હતું. લોકાલોકને જાણવાની અને જોવાની અસીમ શક્તિ પ્રભુને અહીં પ્રાપ્ત થઈ હતી. આ સ્થાન પર પગ મૂકતા જ એવી અનુભૂતિ થાય છે કે જાણે આપણા અજ્ઞાનનો અંધકાર દૂર થઈ રહ્યો હોય અને જ્ઞાનનું તેજ પ્રગટી રહ્યું હોય.',
          'गिरनार के हृदय के समान सहसावन केवल एक स्थान नहीं है, बल्कि यह प्रभु नेमिनाथ के आत्मिक उत्थान की पावन भूमि है। यह वही स्थान है जहाँ प्रभु नेमिनाथ के जीवन के दो बहुमूल्य और दिव्य कल्याणक संपन्न हुए थे। १. दीक्षा कल्याणक: सहसावन की इस भूमि पर प्रभु नेमिनाथ ने संसार के सभी राग-द्वेष और भौतिक सुख-वैभव का त्याग कर दीक्षा अंगीकार की थी। जिस पवित्र स्थान पर प्रभु ने संसार का त्याग कर "अपरिग्रह" का मार्ग अपनाया, वहाँ आज भी वैराग्य की लहरें अनुभव की जाती हैं। यहाँ खड़े होकर हम प्रार्थना करें कि, "हे प्रभु! आपके इस वैराग्य के पथ पर चलने की मुझे भी थोड़ी दृष्टि और शक्ति प्रदान करें।" २. केवलज्ञान कल्याणक (सर्वज्ञता की प्राप्ति): इसी सहसावन में प्रभु नेमिनाथ ने घाती कर्मों का क्षय कर अनंत ज्ञान—केवलज्ञान प्राप्त किया था। लोकालोक को जानने और देखने की असीम शक्ति प्रभु को यहाँ प्राप्त हुई थी। इस स्थान पर पैर रखते ही ऐसी अनुभूति होती है जैसे हमारे अज्ञान का अंधकार दूर हो रहा हो और ज्ञान का तेज प्रकट हो रहा हो।'
        ),
        image: '/images/about-girnar/sahesavan.jpg'
      }
    ],
    supportHeading: tr('How the Group Serves', 'સમૂહ કેવી રીતે સેવા આપે છે', 'समूह कैसे सेवा करता है'),
    supportCards: [
      {
        title: tr('Yatra Coordination', 'યાત્રા સંકલન', 'यात्रा समन्वय'),
        body: tr(
          'Monthly planning, registrations, route support, and group care for yatris from Surat.',
          'દર મહિને આયોજન, નોંધણી, માર્ગ સહાય અને સુરતથી આવતા યાત્રિકોની સંભાળ.',
          'मासिक योजना, पंजीकरण, मार्ग सहयोग और सूरत से आने वाले यात्रियों की देखभाल।',
        ),
      },
      {
        title: tr('Upashray Restoration', 'ઉપાશ્રય જીર્ણોદ્ધાર', 'उपाश्रय जीर्णोद्धार'),
        body: tr(
          'Renovation-focused seva keeps travel halts hygienic, safe, and spiritually suitable for sangh movement.',
          'જીર્ણોદ્ધાર આધારિત સેવા દ્વારા વિરામસ્થળોને સ્વચ્છ, સુરક્ષિત અને સંઘવિહાર માટે યોગ્ય બનાવવામાં આવે છે.',
          'जीर्णोद्धार सेवा के माध्यम से विश्राम स्थलों को स्वच्छ, सुरक्षित और संघ-विहार के अनुकूल बनाया जाता है।',
        ),
      },
      {
        title: tr('Community Participation', 'સમૂહ સહભાગિતા', 'समुदाय सहभागिता'),
        body: tr(
          'Families, volunteers, and donors join hands in a shared spiritual responsibility.',
          'પરિવારો, સેવકો અને દાતાઓ એક જ આધ્યાત્મિક જવાબદારીમાં જોડાય છે.',
          'परिवार, स्वयंसेवक और दाता एक साझा आध्यात्मिक जिम्मेदारी में भाग लेते हैं।',
        ),
      },
    ],
  },
  upashrayPage: {
    heroBadge: tr('Upashray Jirnodhar', 'ઉપાશ્રય જીર્ણોદ્ધાર', 'उपाश्रय जीर्णोद्धार'),
    heroTitle: tr('Route-Wise Upashray Restoration', 'માર્ગ મુજબ ઉપાશ્રય સુધાર કાર્ય', 'मार्ग-आधारित उपाश्रय सुधार कार्य'),
    heroDescription: tr(
      'A data-driven listing of Upashrays being planned, upgraded, and completed by the group.',
      'સમૂહ દ્વારા યોજાયેલા, પ્રગતિમાં અને પૂર્ણ થયેલા ઉપાશ્રયોનું ડેટા આધારિત પ્રદર્શન.',
      'समूह द्वारा योजनाबद्ध, प्रगति पर और पूर्ण हुए उपाश्रयों की डेटा-आधारित सूची।',
    ),
    reservedBlockTitle: tr('Reserved for Future Vihar Route Animation / Video', 'ભવિષ્યના વિહાર રૂટ એનિમેશન/વિડિઓ માટે અનામત', 'भविष्य के विहार मार्ग एनीमेशन/वीडियो हेतु आरक्षित'),
    reservedBlockBody: tr(
      'This hero block is intentionally reserved for a future animated route or cinematic travel video.',
      'આ હીરો વિભાગ ભવિષ્યમાં રૂટ એનિમેશન અથવા સિનેમેટિક યાત્રા વિડિઓ માટે ખાસ અનામત રાખવામાં આવ્યો છે.',
      'यह हीरो ब्लॉक भविष्य में रूट एनीमेशन या सिनेमैटिक यात्रा वीडियो हेतु जानबूझकर आरक्षित रखा गया है।',
    ),
    supabasePhaseTitle: tr('Admin Phase (Later - Supabase)', 'એડમિન ચરણ (પછી - Supabase)', 'एडमिन चरण (बाद में - Supabase)'),
    supabasePhaseBullets: [
      tr('upashrays table for core and i18n text fields', 'મૂલભૂત અને i18n લખાણ માટે upashrays ટેબલ', 'कोर और i18n टेक्स्ट फ़ील्ड हेतु upashrays टेबल'),
      tr('upashray_media table for before / process / after assets', 'before / process / after એસેટ્સ માટે upashray_media ટેબલ', 'before / process / after मीडिया हेतु upashray_media टेबल'),
      tr('Storage bucket for uploads and responsive media variants', 'અપલોડ અને રિસ્પોન્સિવ મીડિયા માટે સ્ટોરેજ બકેટ', 'अपलोड और रेस्पॉन्सिव मीडिया वेरिएंट हेतु स्टोरेज बकेट'),
      tr('Admin-only authentication and edit permissions', 'એડમિન માટે મર્યાદિત લોગિન અને સંપાદન અધિકાર', 'केवल एडमिन हेतु प्रमाणन और संपादन अनुमति'),
    ],
  },
  upashrayDetailPage: {
    notFoundTitle: tr('Upashray Not Found', 'ઉપાશ્રય મળ્યો નથી', 'उपाश्रय नहीं मिला'),
    notFoundBody: tr(
      'The requested Upashray record does not exist in the current local data source.',
      'આ ઉપાશ્રયનો રેકોર્ડ હાલની સ્થાનિક ડેટા સૂચિમાં ઉપલબ્ધ નથી.',
      'मांगा गया उपाश्रय रिकॉर्ड वर्तमान स्थानीय डेटा स्रोत में उपलब्ध नहीं है।',
    ),
    futureAnimationTitle: tr('Future Animation', 'ભાવિ એનિમેશન', 'भविष्य एनीमेशन'),
    sections: {
      before: tr('Before', 'પહેલાં', 'पहले'),
      process: tr('In Process', 'પ્રગતિ દરમિયાન', 'कार्य प्रगति में'),
      after: tr('After', 'પછી', 'बाद में'),
      description: tr('Description', 'વર્ણન', 'विवरण'),
      locationDetails: tr('Location Details', 'સ્થાન વિગતો', 'स्थान विवरण'),
    },
  },
  monthlyBusPage: {
    heroBadge: tr('Monthly Bus Yatra', 'માસિક બસ યાત્રા', 'मासिक बस यात्रा'),
    heroTitle: tr('Seamless Monthly Yatra from Surat to Girnar', 'સુરતથી ગિરનાર સુધીની સુવ્યવસ્થિત માસિક યાત્રા', 'सूरत से गिरनार तक सुव्यवस्थित मासिक यात्रा'),
    heroDescription: tr(
      'A spiritually centered, service-driven, and accessible yatra format for devotees of all ages.',
      'દરેક વયના ભાવિકો માટે આધ્યાત્મિક કેન્દ્રિત, સેવાભાવી અને સુલભ યાત્રા આયોજન.',
      'सभी आयु के श्रद्धालुओं के लिए आध्यात्मिक, सेवाभावी और सुलभ यात्रा व्यवस्था।',
    ),
    ctaPrimary: tr('Join Upcoming Yatra', 'આગામી યાત્રામાં જોડાઓ', 'आगामी यात्रा में जुड़ें'),
    ctaSecondary: tr('Contact Seva Team', 'સેવા ટીમનો સંપર્ક કરો', 'सेवा टीम से संपर्क करें'),
    highlightCards: [
      {
        title: tr('Guided Group Travel', 'માર્ગદર્શિત સમૂહ યાત્રા', 'मार्गदर्शित समूह यात्रा'),
        body: tr(
          'Organized departures from Surat with coordinated halts and support throughout the route.',
          'સુરતથી સુનિયોજિત પ્રસ્થાન, માર્ગમાં સહાયક વિરામ અને સતત સંકલન સાથે.',
          'सूरत से सुव्यवस्थित प्रस्थान, मार्ग में सहायक ठहराव और निरंतर समन्वय के साथ।',
        ),
      },
      {
        title: tr('Devotional Atmosphere', 'ભક્તિપૂર્ણ માહોલ', 'भक्ति से भरा वातावरण'),
        body: tr(
          'Satsang, discipline, and shared intention make each yatra spiritually uplifting.',
          'સત્સંગ, શિસ્ત અને સમૂહભાવના દરેક યાત્રાને આધ્યાત્મિક રીતે ઉન્નત બનાવે છે.',
          'सत्संग, अनुशासन और सामूहिक भावना प्रत्येक यात्रा को आध्यात्मिक रूप से उन्नत बनाती है।',
        ),
      },
      {
        title: tr('Service at Fair Cost', 'યોગ્ય ખર્ચે સેવા', 'उचित लागत પર સેવા'),
        body: tr(
          'The format is designed to stay affordable while preserving quality and safety.',
          'ગુણવત્તા અને સુરક્ષા જાળવીને યાત્રા સામાન્ય પરિવારો માટે પણ પરવડી શકે તેવી રાખવામાં આવે છે.',
          'गुणवत्ता और सुरक्षा बनाए रखते हुए यात्रा को सामान्य परिवारों के लिए भी सुलभ रखा जाता है।',
        ),
      },
    ],
    upcomingYatrasTitle: tr('Upcoming Yatra Dates', 'આગામી યાત્રાની તારીખો', 'आगामी यात्रा की तिथियां'),
    sponsorshipTitle: tr('Labharthi & Sponsorship', 'લાભાર્થી અને પ્રાયોજકતા', 'लाभार्थी और प्रायोजन'),
    sponsorshipDescription: tr(
      'Choose a sponsorship scheme and continue to payment after selecting the trips you want to support.',
      'તમને જે યાત્રાઓને સહાય કરવી હોય તે પસંદ કર્યા પછી પ્રાયોજકતા યોજના પસંદ કરો અને પછી ચુકવણી કરો.',
      'जिन यात्राओं का आप समर्थन करना चाहते हैं उन्हें चुनने के बाद एक प्रायोजन योजना चुनें और फिर भुगतान करें।',
    ),
    sponsorshipLoading: tr('Loading sponsorship schemes...', 'પ્રાયોજક યોજનાઓ લોડ થઈ રહી છે...', 'प्रायोजन योजनाएँ लोड हो रही हैं...'),
    sponsorshipEmpty: tr(
      'Sponsorship schemes will appear here once they are created in the admin panel.',
      'એડમિન પેનલમાં બનાવ્યા પછી પ્રાયોજક યોજનાઓ અહીં દેખાશે.',
      'प्रायोजन योजनाएँ एडमिन पैनल में बनाने के बाद यहाँ दिखाई देंगी।',
    ),
    sponsorshipPerBus: tr('Per Bus', 'દર બસ', 'प्रति बस'),
    sponsorshipButton: tr('Sponsor This Trip', 'આ યાત્રાને પ્રાયોજિત કરો', 'इस यात्रा को प्रायोजित करें'),
    yatraSeatsFilled: tr('seats filled', 'સીટ ભરાઈ', 'सीटें भरी'),
    yatraRegistrations: tr('registrations', 'નોંધણીઓ', 'पंजीकरण'),
    yatraSeatsLeft: tr('Seats Left', 'સીટ બાકી', 'सीट शेष'),
    yatraBookNow: tr('Book Now', 'હવે બુક કરો', 'अभी बुक करें'),
    yatraClosed: tr('Closed', 'બંધ', 'बंद'),
    yatraUpcoming: tr('Upcoming', 'આગામી', 'आगामी'),
    yatraFull: tr('Full', 'પૂર્ણ', 'पूर्ण'),
    yatraComingSoon: tr('Coming Soon', 'ટૂંક સમયમાં', 'जल्द आ रहा है'),
    yatraMaxCapacityReached: tr('Max Capacity Reached', 'મહત્તમ ક્ષમતા પૂર્ણ થઈ', 'अधिकतम क्षमता पूर्ण हो गई'),
    yatraGotItThanks: tr('Got it, thanks!', 'સમજાયું, આભાર!', 'समझ गया, धन्यवाद!'),
    yatraContactBelow: tr(
      'Please contact the numbers below.',
      'કૃપા કરીને નીચે આપેલા નંબર પર સંપર્ક કરો.',
      'कृपया नीचे दिए गए नंबरों पर संपर्क करें.',
    ),
    yatraFullNotice: tr(
      'Sorry, max capacity reached for',
      'માફ કરશો, આ યાત્રા માટે મહત્તમ ક્ષમતા પૂર્ણ થઈ ગઈ છે',
      'क्षमा करें, इस यात्रा के लिए अधिकतम क्षमता पूरी हो गई है',
    ),
    yatraCheckBackSoon: tr(
      'Bookings for',
      'આ યાત્રા માટે બુકિંગ',
      'इस यात्रा के लिए बुकिंग',
    ),
    yatraNotStartedYet: tr(
      "haven't started yet. Please check back soon to secure your seat!",
      'હજી શરૂ થઈ નથી. તમારી જગ્યા સુનિશ્ચિત કરવા માટે કૃપા કરીને થોડા સમયમાં ફરી તપાસો!',
      'अभी शुरू नहीं हुई है। अपनी सीट सुरक्षित करने के लिए कृपया थोड़ी देर बाद फिर जांचें!',
    ),
    refreshingYatraDates: tr('Refreshing yatra dates', 'યાત્રા તારીખો તાજી થઈ રહી છે', 'यात्रा तिथियाँ ताज़ा की जा रही हैं'),
    yatraEmptyTitle: tr('New Dates Coming Soon', 'નવાં તારીખો ટૂંક સમયમાં આવશે', 'नई तिथियाँ जल्द आ रही हैं'),
    yatraEmptyBody: tr(
      'We are planning the next batch of spiritual journeys. Please check back later.',
      'આગામી આધ્યાત્મિક યાત્રાઓનું આયોજન ચાલી રહ્યું છે. કૃપા કરીને થોડા સમય પછી ફરી તપાસો.',
      'हम अगली आध्यात्मिक यात्राओं की योजना बना रहे हैं। कृपया बाद में फिर जांचें।',
    ),
    yatraDates: [],
    registrationForm: {
      title: tr('Yatra Registration', 'યાત્રા નોંધણી', 'यात्रा पंजीकरण'),
      subtitle: tr('Fill in details for:', 'વિગતો ભરો:', 'विवरण भरें:'),
      firstName: tr('First Name', 'પ્રથમ નામ', 'पहला नाम'),
      lastName: tr('Last Name', 'અટક', 'अंतिम नाम'),
      phone: tr('Contact Number', 'સંપર્ક નંબર', 'संपर्क नंबर'),
      altPhone: tr('Alternative Contact Number', 'વૈકલ્પિક સંપર્ક નંબર', 'वैकल्पिक संपर्क नंबर'),
      age: tr('Age', 'ઉંમર', 'आयु'),
      gender: tr('Gender', 'જાતિ', 'लिंग'),
      remarks: tr('Remarks', 'નોંધ / શેરો', 'टिप्पणी'),
      genderOptions: {
        male: tr('Male', 'પુરુષ', 'पुरुष'),
        female: tr('Female', 'સ્ત્રી', 'महिला'),
        other: tr('Other', 'અન્ય', 'अन्य')
      },
      addAnother: tr('Add Another Yatrik Details', 'બીજા યાત્રિકની વિગતો ઉમેરો', 'अन्य यात्री का विवरण जोड़ें'),
      submit: tr('Submit the Details', 'વિગતો સબમિટ કરો', 'विवरण जमा करें'),
      cancel: tr('Cancel', 'રદ કરો', 'रद्द करें'),
      success: tr('Your yatra is booked, admin will contact you for payment details. Thank you.', 'તમારી યાત્રા બુક થઈ ગઈ છે, પેમેન્ટની વિગતો માટે એડમિન તમારો સંપર્ક કરશે. આભાર.', 'आपकी यात्रा बुक हो गई है, भुगतान विवरण के लिए एडमिन आपसे संपर्क करेंगे। धन्यवाद।'),
      yatrikCount: tr('Yatrik #', 'યાત્રિક #', 'यात्री #'),
    }
  },
  eventsPage: {
    heroBadge: tr('Events & Seva', 'કાર્યક્રમો અને સેવા', 'कार्यक्रम और सेवा'),
    heroTitle: tr('Pathsala, Rituals, and Community Support', 'પાઠશાળા, વિધિ અને સમૂહ સહકાર', 'पाठशाला, अनुष्ठान और सामुदायिक सहयोग'),
    heroDescription: tr(
      'All public event initiatives are grouped here: Pathsala Seva, Maha Aarti & Abhishek, and participation support.',
      'બધા જાહેર સેવા કાર્યક્રમો અહીં એકત્રિત છે: પાઠશાળા સેવા, મહા આરતી-અભિષેક અને સહભાગીતા સહકાર.',
      'सभी सार्वजनिक सेवा पहल यहां संकलित हैं: पाठशाला सेवा, महा आरती-अभिषेक और सहभागिता सहयोग।',
    ),
    sections: [
      {
        title: tr('Pathsala Seva', 'પાઠશાળા સેવા', 'पाठशाला सेवा'),
        points: [
          tr('Book and educational material distribution', 'પુસ્તકો અને શૈક્ષણિક સામગ્રી વિતરણ', 'पुस्तक और शैक्षिक सामग्री वितरण'),
          tr('Student encouragement through gifts and recognition', 'વિદ્યાર્થી પ્રોત્સાહન માટે ભેટ અને સન્માન', 'छात्र प्रोत्साहन हेतु उपहार और सम्मान'),
          tr('Survey and support planning for local pathsalas', 'સ્થાનિક પાઠશાળાઓ માટે સર્વે અને સહાય યોજના', 'स्थानीय पाठशालाओं हेतु सर्वे और सहयोग योजना'),
        ],
      },
      {
        title: tr('Maha Aarti & Abhishek', 'મહા આરતી અને અભિષેક', 'महा आरती और अभिषेक'),
        points: [
          tr('Ritual seva with devotional discipline', 'શિસ્તબદ્ધ ભક્તિ સાથે વિધિ સેવા', 'अनुशासित भक्ति के साथ अनुष्ठान सेवा'),
          tr('Spiritual connection to Girnar tradition in local Jinalayas', 'સ્થાનિક જિનાલયોમાં ગિરનાર પરંપરાની આધ્યાત્મિક અનુભૂતિ', 'स्थानीय जिनालयों में गिरनार परंपरा का आध्यात्मिक अनुभव'),
          tr('Community participation for shared bhakti', 'સમૂહ ભક્તિ માટે સક્રિય સહભાગિતા', 'सामूहिक भक्ति के लिए सक्रिय सहभागिता'),
        ],
        contacts: tr('Contact: Milanbhai 99798 58710', 'સંપર્ક: મિલનભાઈ 99798 58710 / સંદિપભાઈ 98241 55255', 'संपर्क: मिलनभाई 99798 58710 / संदीपभाई 98241 55255')
      },
    ],
    ctaTitle: tr('Join or Support Seva', 'સેવામાં જોડાઓ અથવા સહાય કરો', 'सेवा से जुड़ें या सहयोग करें'),
    ctaBody: tr(
      'Whether you want to volunteer, sponsor, or participate, our team will guide you.',
      'તમે સેવક તરીકે જોડાવા માંગતા હો, સહાય કરવા માંગતા હો કે કાર્યક્રમમાં ભાગ લેવા માંગતા હો - અમારી ટીમ માર્ગદર્શન આપશે.',
      'चाहे आप स्वयंसेवा करना चाहें, सहयोग देना चाहें या कार्यक्रम में भाग लेना चाहें, हमारी टीम आपका मार्गदर्शन करेगी।',
    ),
    ctaButton: tr('Reach Out Now', 'હમણાં સંપર્ક કરો', 'अभी संपर्क करें'),
  },
  contactPage: {
    heroBadge: tr('Contact Us', 'સંપર્ક કરો', 'संपर्क करें'),
    heroTitle: tr('Get in Touch', 'અમારો સંપર્ક કરો', 'हमसे जुड़ें'),
    heroDescription: tr(
      'Questions about yatra registration, seva support, or Upashray updates are always welcome.',
      'યાત્રા નોંધણી, સેવા સહાય અથવા ઉપાશ્રય માહિતી અંગેના પ્રશ્નો માટે અમારો સંપર્ક કરો.',
      'यात्रा पंजीकरण, सेवा सहयोग या उपाश्रय जानकारी हेतु हमसे संपर्क करें।',
    ),
    info: {
      locationLabel: tr('Our Location', 'અમારું સ્થાન', 'हमारा स्थान'),
      locationValue: tr('407, The Bouleward, Near Pratham Circle, Pal, Surat, 395009', '૪૦૭, ધ બુલેવર્ડ, પ્રથમ સર્કલ પાસે, પાલ, સુરત, ૩૯૫૦૦૯', '407, द बुलेवार्ड, प्रथम सर्कल के पास, पाल, सूरत, 395009'),
      emailLabel: tr('Email', 'ઇમેઇલ', 'ईमेल'),
      emailValue: tr('Girnaryatrasurat@gmail.com', 'Girnaryatrasurat@gmail.com', 'Girnaryatrasurat@gmail.com'),
      phoneLabel: tr('Contact Numbers', 'સંપર્ક નંબર', 'संपर्क नंबर'),
      phoneValue: tr('Milanbhai: 99798 58710 / Sandipbhai: 98241 55255', 'મિલનભાઈ: 99798 58710 / સંદિપભાઈ: 98241 55255', 'मिलनभाई: 99798 58710 / संदीपभाई: 98241 55255'),
    },
    form: {
      fullName: tr('Full Name', 'પૂર્ણ નામ', 'पूरा नाम'),
      phone: tr('Phone Number', 'ફોન નંબર', 'फ़ोन नंबर'),
      email: tr('Email Address', 'ઇમેઇલ સરનામું', 'ईमेल पता'),
      message: tr('Message', 'સંદેશ', 'संदेश'),
      submit: tr('Send Message', 'સંદેશ મોકલો', 'संदेश भेजें'),
      sending: tr('Sending...', 'મોકલાઈ રહ્યું છે...', 'भेजा जा रहा है...'),
      success: tr('Message sent successfully. We will contact you soon.', 'સંદેશ સફળતાપૂર્વક મોકલાયો. અમે જલ્દી સંપર્ક કરીશું.', 'संदेश सफलतापूर्वक भेजा गया। हम जल्द संपर्क करेंगे।'),
      error: tr('Something went wrong. Please try again later.', 'કંઈક ખોટું થયું. કૃપા કરીને ફરી પ્રયાસ કરો.', 'कुछ गलत हुआ। कृपया बाद में पुनः प्रयास करें।'),
      validation: {
        fullNameRequired: tr('Full Name is required', 'પૂર્ણ નામ ફરજિયાત છે', 'पूरा नाम आवश्यक है'),
        fullNameShort: tr('Name must be at least 3 characters', 'નામ ઓછામાં ઓછું 3 અક્ષરનું હોવું જોઈએ', 'नाम कम से कम 3 अक्षरों का होना चाहिए'),
        phoneRequired: tr('Phone Number is required', 'ફોન નંબર ફરજિયાત છે', 'फ़ोन नंबर आवश्यक है'),
        phoneInvalid: tr('Please enter a valid 10-digit phone number', 'કૃપા કરીને માન્ય 10 અંકનો ફોન નંબર દાખલ કરો', 'कृपया मान्य 10 अंकों का फ़ोन नंबर दर्ज करें'),
        emailRequired: tr('Email Address is required', 'ઇમેઇલ સરનામું ફરજિયાત છે', 'ईमेल पता आवश्यक है'),
        emailInvalid: tr('Please enter a valid email address', 'કૃપા કરીને માન્ય ઇમેઇલ સરનામું દાખલ કરો', 'कृपया मान्य ईमेल पता दर्ज करें'),
        messageRequired: tr('Message is required', 'સંદેશ ફરજિયાત છે', 'संदेश आवश्यक है'),
        messageShort: tr('Message should be at least 10 characters', 'સંદેશ ઓછામાં ઓછા 10 અક્ષરનો હોવો જોઈએ', 'संदेश कम से कम 10 अक्षरों का होना चाहिए'),
      },
    },
  },
  footer: {
    copyright: tr(
      '© 2026 Shri Girnar Tirth Yatra Group · Surat',
      '© 2026 શ્રી ગિરનાર તીર્થ યાત્રા ગ્રુપ · સુરત',
      '© 2026 श्री गिरनार तीर्थ यात्रा समूह · सूरत',
    ),
    privacy: tr('Privacy', 'ગોપનીયતા', 'गोपनीयता'),
    rituals: tr('Rituals', 'વિધિઓ', 'अनुष्ठान'),
    contact: tr('Contact', 'સંપર્ક', 'संपर्क'),
  },
  fourteenJinalayaPage: {
    heroBadge: tr('14 Jinalaya · Darshan', '૧૪ જિનાલય · દર્શન', '14 जिनालय · दर्शन'),
    heroTitle: tr('14 Jinalaya Girnar Tirth Darshan', '૧૪ જિનાલય ગિરનાર તીર્થ દર્શન', '14 जिनालय गिरनार तीर्थ दर्शन'),
    heroDescription: tr(
      'Detailed information, divine history, and spiritual significance of the sacred 14 Jinalayas on Shri Giriraj will be published here very soon.',
      'શ્રી ગિરિરાજ પર આવેલા પવિત્ર ૧૪ જિનાલયોની વિગતવાર માહિતી, દિવ્ય ઈતિહાસ અને આધ્યાત્મિક મહત્વ ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
      'श्री गिरिराज पर स्थित पवित्र 14 जिनालयों की विस्तृत जानकारी, दिव्य इतिहास और आध्यात्मिक महत्व जल्द ही यहाँ प्रस्तुत किया जाएगा।'
    ),
    comingSoonNote: tr(
      'Our research and documentation team is compiling detailed steps and high-resolution darshan of all 14 Jinalayas.',
      'અમારી સંશોધન અને દસ્તાવેજીકરણ ટીમ તમામ ૧૪ જિનાલયોના વિગતવાર પગથિયાં અને હાઈ-રિઝોલ્યુશન દર્શન સંકલિત કરી રહી છે.',
      'हमारी शोध और दस्तावेज़ीकरण टीम सभी 14 जिनालयों के विस्तृत चरण और हाई-रेज़ोल्यूशन दर्शन संकलित कर रही है।'
    ),
    jinalayasList: [
      {
        id: 'neminath-bhagwan-toonk',
        title: tr('1. NEMINATH BHAGWAN TOONK', '૧. શ્રી નેમિનાથજીની ટૂંક', '1. श्री नेमिनाथजी की टोंक'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of Shri Neminath Bhagwan Toonk will be updated soon.',
          'શ્રી નેમિનાથજીની ટૂંકનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'श्री नेमिनाथजी की टोंक का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/1.neminath.jpg',
      },
      {
        id: 'merakvasi-toonk',
        title: tr('2. MERAKVASI TOONK', '૨. મેરકવાસી ટૂંક', '2. मेरकवासी टोंक'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of Merakvasi Toonk will be updated soon.',
          'મેરકવાસી ટૂંકનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'मेरकवासी टोंक का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/2.merakvasi.jpg',
      },
      {
        id: 'sangram-soni-toonk',
        title: tr('3. SANGRAM SONI’S TOONK', '૩. સંગરામસોની ની ટૂંક', '3. संग्रामसोनी की टोंक'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of Sangram Soni’s Toonk will be updated soon.',
          'સંગરામસોની ની ટૂંકનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'संग्रामसोनी की टोंक का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/3..SANGRAM SONI.jpg',
      },
      {
        id: 'kumarpal-toonk',
        title: tr('4. KUMARPAL’S TOONK', '૪. કુમારપાળની ટૂંક', '4. कुमारपाल की टोंक'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of Kumarpal’s Toonk will be updated soon.',
          'કુમારપાળની ટૂંકનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'कुमारपाल की टोंक का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/4.KUMARPAL.jpg',
      },
      {
        id: 'chandraprabha-swami-temple',
        title: tr('5. CHANDRAPRABHA SWAMI TEMPLE', '૫. શ્રી ચન્દ્રપ્રભસ્વામીનું જિનાલય', '5. श्री चन्द्रप्रभस्वामी का जिनालय'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of Chandraprabha Swami Temple will be updated soon.',
          'શ્રી ચન્દ્રપ્રભસ્વામીના જિનાલયનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'श्री चन्द्रप्रभस्वामी के जिनालय का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/5.CHANDRAPRABHA SWAMI.JPG',
      },
      {
        id: 'masingh-bhojraj-temple',
        title: tr('6. MASINGH BHOJRAJ TEMPLE', '૬. માનસંગ ભોજરાજનું જિનાલય', '6. मानसंग भोजराज का जिनालय'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of Masingh Bhojraj Temple will be updated soon.',
          'માનસંગ ભોજરાજના જિનાલયનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'मानसंग भोजराज के जिनालय का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/6.MASINGH BHOJRAJ.jpg',
      },
      {
        id: 'vastupal-tejpal-temple',
        title: tr('7. VASTUPAL – TEJPAL TEMPLE', '૭. વસ્તુપાલ – તેજપાલનું જિનાલય', '7. वस्तुपाल – तेजपाल का जिनालय'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of Vastupal – Tejpal Temple will be updated soon.',
          'વસ્તુપાલ – તેજપાલના જિનાલયનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'वस्तुपाल – तेजपाल के जिनालय का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/7.VASTUPAL – TEJPAL.jpg',
      },
      {
        id: 'gumastan-temple',
        title: tr('8. GUMASTAN TEMPLE', '૮. ગુમાસ્તાનું દેરાસર', '8. गुमास्ता का देरासर'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of Gumastan Temple will be updated soon.',
          'ગુમાસ્તાના દેરાસરનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'गुमास्ता के देरासर का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/8.gumastan.jpg',
      },
      {
        id: 'king-samprati-temple',
        title: tr('9. KING SAMPRATI’S TEMPLE', '૯. સંપ્રતિ રાજાની ટૂંક', '9. संप्रति राजा की टोंक'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of King Samprati’s Temple will be updated soon.',
          'સંપ્રતિ રાજાની ટૂંકનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'संप्रति राजा की टोंक का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/9.KING SAMPRATI.jpg',
      },
      {
        id: 'gyanvav-temple',
        title: tr('10. GYANVAV TEMPLE', '૧૦. જ્ઞાનવાવનું જિનાલય', '10. ज्ञानवाव का जिनालय'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of Gyanvav Temple will be updated soon.',
          'જ્ઞાનવાવના જિનાલયનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'ज्ञानवाव के जिनालय का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/10.GYANVAV.JPG',
      },
      {
        id: 'dharmsinh-hemchand-temple',
        title: tr('11. DHARMSHRI HEMCHAND TEMPLE', '૧૧. શેઠ ધરમચંદ હેમચંદનું જિનાલય', '11. सेठ धरमचंद हेमचंद का जिनालय'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of Dharmsinh Hemchand Temple will be updated soon.',
          'શેઠ ધરમચંદ હેમચંદના જિનાલયનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'सेठ धरमचंद हेमचंद के जिनालय का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/11.DHARMSHRI HEMCHAND.JPG',
      },
      {
        id: 'mallavalu-temple',
        title: tr('12. MALLAVALU TEMPLE', '૧૨. મલ્લવાળુ જિનાલય', '12. मल्लवालु जिनालय'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of Mallavalu Temple will be updated soon.',
          'મલ્લવાળુ જિનાલયનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'मल्लवालु जिनालय का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/12.MALLAVALU.JPG',
      },
      {
        id: 'chaumukhji-temple',
        title: tr('13. CHAUMUKHJI TEMPLE', '૧૩. ચૌમુખજીનું જિનાલય', '13. चौमुखजी का जिनालय'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of Chaumukhji Temple will be updated soon.',
          'ચૌમુખજીના જિનાલયનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'चौमुखजी के जिनालय का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/13.CHAUMUKHJI.jpeg',
      },
      {
        id: 'rahnemi-temple',
        title: tr('14. RAHNEMI TEMPLE', '૧૪. રહનેમિનું જિનાલય', '14. रहनेमि का जिनालय'),
        description: tr(
          'Detailed history, architectural grandeur, and spiritual glory of Rahnemi Temple will be updated soon.',
          'રહનેમિના જિનાલયનો દિવ્ય ઈતિહાસ, શિલ્પકલા અને આધ્યાત્મિક મહિમા ટૂંક સમયમાં અહીં રજૂ કરવામાં આવશે.',
          'रहनेमि के जिनालय का दिव्य इतिहास, वास्तुकला और आध्यात्मिक महिमा जल्द ही यहाँ प्रस्तुत की जाएगी।'
        ),
        image: '/images/14 jinalaya/14.RAHNEMI.jpg',
      },
    ],
  },
  sahesavanTirthPage: {
    heroBadge: tr('Sahesavan Tirth · Sacred Heritage', 'સહેસાવન તીર્થ · પાવન ધરોહર', 'सहेसावन तीर्थ · पावन धरोहर'),
    heroTitle: tr('Shri Sahesavan Tirth Bhavyatra', 'શ્રી સહેસાવન તીર્થ ભાવયાત્રા', 'श्री सहेसावन तीर्थ भावयात्रा'),
    heroDescription: tr(
      'The holy land of Lord Neminath\'s Diksha and Kevalgyan Kalyanaks. Explore the sacred shrines and holy spots along the serene slopes of Sahesavan.',
      'પ્રભુ નેમિનાથના દીક્ષા અને કેવળજ્ઞાન કલ્યાણકની પાવન ભૂમિ. સહેસાવન તીર્થના પવિત્ર સ્થાનો અને જિનાલયોનાં ભાવદર્શન કરો.',
      'प्रभु नेमिनाथ के दीक्षा और केवलज्ञान कल्याणक की पावन भूमि। सहेसावन तीर्थ के पवित्र स्थानों और जिनालयों के भावदर्शन करें।'
    ),
    comingSoonNote: tr(
      'Detailed historical documentation and high-resolution darshan photographs for these holy spots are coming soon.',
      'આ પાવન સ્થાનોનો વિસ્તૃત ઇતિહાસ અને ઉચ્ચ ગુણવત્તાવાળા દર્શન ફોટોગ્રાફ્સ ટૂંક સમયમાં ઉપલબ્ધ થશે.',
      'इन पावन स्थानों का विस्तृत इतिहास और उच्च गुणवत्ता वाले दर्शन फोटोग्राफ्स जल्द ही उपलब्ध होंगे।'
    ),
    spotsList: [
      {
        id: 1,
        title: tr('Sahesavan Tirth', 'સહેસાવન તીર્થ', 'सहेसावन तीर्थ'),
        description: tr(
          'Detailed spiritual significance, history, and divine darshan details of this holy spot are coming soon.',
          'આ પાવન સ્થાનનો આધ્યાત્મિક મહિમા અને ઇતિહાસ ટૂંક સમયમાં રજૂ કરવામાં આવશે.',
          'इस पावन स्थान की आध्यात्मिक महिमा और इतिहास जल्द ही प्रस्तुत किया जाएगा।'
        ),
        image: '/images/sahesavan/sahesavan-tirth.jpg',
      },
      {
        id: 2,
        title: tr('Samavasaran Tirth', 'સમવસરણ તીર્થ', 'समवसरण तीर्थ'),
        description: tr(
          'Detailed spiritual significance, history, and divine darshan details of this holy spot are coming soon.',
          'આ પાવન સ્થાનનો આધ્યાત્મિક મહિમા અને ઇતિહાસ ટૂંક સમયમાં રજૂ કરવામાં આવશે.',
          'इस पावन स्थान की आध्यात्मिक महिमा और इतिहास जल्द ही प्रस्तुत किया जाएगा।'
        ),
        image: '/images/sahesavan/samavasaran-tirth.jpg',
      },
      {
        id: 3,
        title: tr("Jivit Swami's Pratima", 'જીવિત સ્વામીની પ્રતિમા', 'जीवित स्वामी की प्रतिमा'),
        description: tr(
          'Detailed spiritual significance, history, and divine darshan details of this holy spot are coming soon.',
          'આ પાવન સ્થાનનો આધ્યાત્મિક મહિમા અને ઇતિહાસ ટૂંક સમયમાં રજૂ કરવામાં આવશે.',
          'इस पावन स्थान की आध्यात्मिक महिमा और इतिहास जल्द ही प्रस्तुत किया जाएगा।'
        ),
        image: '/images/sahesavan/jivit-swami-pratima.jpg',
      },
      {
        id: 4,
        title: tr('Diksha Kalyanak', 'દીક્ષા કલ્યાણક', 'दीक्षा कल्याणक'),
        description: tr(
          'Detailed spiritual significance, history, and divine darshan details of this holy spot are coming soon.',
          'આ પાવન સ્થાનનો આધ્યાત્મિક મહિમા અને ઇતિહાસ ટૂંક સમયમાં રજૂ કરવામાં આવશે.',
          'इस पावन स्थान की आध्यात्मिक महिमा और इतिहास जल्द ही प्रस्तुत किया जाएगा।'
        ),
        image: '/images/sahesavan/diksha-kalyanak.jpg',
      },
      {
        id: 5,
        title: tr('Moksh Kalyanak', 'મોક્ષ કલ્યાણક', 'मोक्ष कल्याणक'),
        description: tr(
          'Detailed spiritual significance, history, and divine darshan details of this holy spot are coming soon.',
          'આ પાવન સ્થાનનો આધ્યાત્મિક મહિમા અને ઇતિહાસ ટૂંક સમયમાં રજૂ કરવામાં આવશે.',
          'इस पावन स्थान की आध्यात्मिक महिमा और इतिहास जल्द ही प्रस्तुत किया जाएगा।'
        ),
        image: '/images/sahesavan/moksh-kalyanak.jpg',
      },
      {
        id: 6,
        title: tr("Himanshu Suri Dada's Charan Paduka", 'હિમાંશુસૂરિ દાદાની ચરણ પાદુકા', 'हिमांशुसूरि दादा की चरण पादुका'),
        description: tr(
          'Detailed spiritual significance, history, and divine darshan details of this holy spot are coming soon.',
          'આ પાવન સ્થાનનો આધ્યાત્મિક મહિમા અને ઇતિહાસ ટૂંક સમયમાં રજૂ કરવામાં આવશે.',
          'इस पावन स्थान की आध्यात्मिक महिमा और इतिहास जल्द ही प्रस्तुत किया जाएगा।'
        ),
        image: '/images/sahesavan/himanshusuri-dada-charan-paduka.jpg',
      },
    ],
  },
};

export const supabaseRoadmap = {
  title: tr('Future Supabase Admin Plan', 'ભવિષ્ય Supabase એડમિન યોજના', 'भविष्य Supabase एडमिन योजना'),
  body: tr(
    'Public pages currently read from local structured content. In the next phase this will switch to Supabase tables and storage without a UI rewrite.',
    'હાલ જાહેર પેજો સ્થાનિક માળખાકીય કન્ટેન્ટ પરથી ચલાવે છે. આગામી ચરણમાં UI બદલ્યા વિના Supabase ટેબલ અને સ્ટોરેજ પર પરિવર્તન થશે.',
    'वर्तमान में सार्वजनिक पेज स्थानीय संरचित कंटेंट से चलते हैं। अगले चरण में UI बदले बिना इसे Supabase टेबल और स्टोरेज पर स्विच किया जाएगा।',
  ),
};

export const isTranslationObject = (value) => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  return 'en' in value || 'gu' in value || 'hi' in value;
};

export const getLocalizedValue = (value, language) => {
  if (value == null) {
    return value;
  }
  if (isTranslationObject(value)) {
    return value[language] ?? value.en ?? value.gu ?? value.hi ?? '';
  }
  return value;
};
