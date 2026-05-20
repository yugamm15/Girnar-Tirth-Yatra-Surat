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
    { key: 'about', path: '/about-girnar', label: tr('About Girnar', 'ગિરનાર વિષે', 'गिरनार परिचय') },
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
      { id: 'work3', label: tr('Pathsala', 'પાઠશાળા', 'पाठशाला') },
      { id: 'work4', label: tr('Aarti & Abhishek', 'આરતી અને અભિષેક', 'आरती और अभिषेक') },
      { id: 'join', label: tr('Join Us', 'જોડાઓ', 'जुड़ें') },
    ],
    hero: {
      badge: tr('Shri Neminathaya Namah', 'શ્રી નેમિનાથાય નમઃ', 'श्री नेमिनाथाय नमः'),
      lineOne: tr('Welcome to', 'સ્વાગત છે', 'स्वागत है'),
      lineTwo: tr('Girnar Tirth Yatra Group - Surat', 'ગિરનાર તીર્થ યાત્રા ગ્રુપ - સુરત', 'गिरनार तीर्थ यात्रा समूह - सूरत'),
      subtitle: tr(
        'A cinematic journey from the heart of Surat to the sacred peaks of Girnar mountain.',
        'સુરતના હૃદયમાંથી ગિરનારના પવિત્ર શિખરો સુધીની એક ભાવસભર યાત્રા.',
        'सूरत के हृदय से गिरनार की पवित्र चोटियों तक की एक भावपूर्ण यात्रा।',
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
        'Every month, dedicated buses depart from Surat to Girnar and Ambika Mata Mandir, keeping the pilgrimage accessible for all devotees.',
        'દર મહિને સુરતથી ગિરનાર અને અંબિકા માતા મંદિર સુધી ભક્તિભરી બસ યાત્રા યોજાય છે જેથી દરેક ભાવિક માટે યાત્રા સરળ બને.',
        'हर महीने सूरत से गिरनार और अम्बिका माता मंदिर तक भक्ति-पूर्ण बस यात्रा आयोजित होती है, जिससे यात्रा सभी श्रद्धालुओं के लिए सुलभ रहे।',
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
        'On the routes of Girnar and Palitana, Upashray spaces are renewed into clean, practical, and spiritually supportive halting points.',
        'ગિરનાર અને પાલિતાણા માર્ગ પર ઉપાશ્રયોને સ્વચ્છ, સુવિધાસભર અને સાધનાસહાયક વિરામસ્થળ તરીકે નવનિર્મિત કરવામાં આવે છે.',
        'गिरनार और पालीताना मार्ग पर उपाश्रयों को स्वच्छ, सुविधाजनक और साधना-सहायक विश्राम स्थलों के रूप में विकसित किया जा रहा है।',
      ),
      countLabel: tr('Total Upashrays Renovated till date', 'હાલ સુધી સુધારાયેલા ઉપાશ્રયો', 'अब तक नवीनीकृत उपाश्रय'),
      countValue: tr('80+', '80+', '80+'),
      currentFocus: tr('Current Focus: Pavagadh Upashrays', 'હાલનું કેન્દ્ર: પાવાગઢ ઉપાશ્રયો', 'वर्तमान केंद्र: पावागढ़ उपाश्रय'),
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
        'The devotional atmosphere of Girnar is shared in local Jinalayas through disciplined Maha Aarti and Abhishek seva.',
        'ગિરનારની દિવ્ય ભાવના સ્થાનિક જિનાલયોમાં શિસ્તબદ્ધ મહા આરતી અને અભિષેક સેવા દ્વારા પ્રસરાય છે.',
        'गिरनार की दिव्य भावना स्थानीय जिनालयों में अनुशासित महा आरती और अभिषेक सेवा के माध्यम से पहुंचाई जाती है।',
      ),
    },
    join: {
      title: tr('Join Our Sacred Journey', 'અમારી પવિત્ર યાત્રામાં જોડાઓ', 'हमारी पवित्र यात्रा से जुड़ें'),
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
        description: tr('Coming Soon...', 'ટૂંક સમયમાં...', 'जल्द आ रहा है...'),
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
        image: '/images/about-girnar/girnar-taleti.JPG'
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
          'When 3700 steps are completed while climbing, the premises of the main temples of Girnar begin. As soon as you come here, the mind becomes very calm and you feel close to the Lord.',
          'ચડતાં ચડતાં જ્યારે ૩૭૦૦ પગથિયાં પૂરાં થાય, ત્યારે ગિરનારના મુખ્ય દેરાસરોનો પરિસર શરૂ થાય છે. અહીં આવતા જ મન એકદમ શાંત થઈ જાય છે અને પ્રભુની નિકટ હોવાનો અહેસાસ થાય છે.',
          'चढ़ते समय जब 3700 सीढ़ियाँ पूरी हो जाती हैं, तब गिरनार के मुख्य मंदिरों का परिसर शुरू होता है। यहाँ आते ही मन एकदम शांत हो जाता है और प्रभु के निकट होने का एहसास होता है।'
        ),
        image: '/images/about-girnar/girnar-2750.jpeg'
      },
      {
        id: 'main-gate',
        title: tr('6. Girnar Tonk Main Gate', '૬. ગિરનાર ટૂંક મુખ્ય દરવાજો', '6. गिरनार टोंक मुख्य द्वार'),
        description: tr(
          'This is the main entrance to move towards the holy aura of Lord Neminath. Entering this gate, it feels as if we are leaving all the attachments and aversions of the world and entering the supreme abode of the Lord.',
          'ભગવાન નેમિનાથની પવિત્ર ઓરા તરફ આગળ વધવાનું આ મુખ્ય પ્રવેશદ્વાર છે. આ દ્વારમાં પ્રવેશતા જ એવું લાગે છે કે આપણે સંસારના તમામ રાગ-દ્વેષ છોડીને પ્રભુના પરમ ધામમાં પ્રવેશી રહ્યા છીએ.',
          'भगवान नेमिनाथ के पवित्र ओरा की ओर बढ़ने का यह मुख्य प्रवेश द्वार है। इस द्वार में प्रवेश करते ही ऐसा लगता है जैसे हम संसार के सभी राग-द्वेष को छोड़कर प्रभु के परम धाम में प्रवेश कर रहे हैं।'
        ),
        image: '/images/about-girnar/tonk-main-gate.jpg'
      },
      {
        id: 'tonk',
        title: tr('7. Girnar Tonk', '૭. ગિરનાર ટૂંક', '7. गिरनार टोंक'),
        description: tr('Coming Soon...', 'ટૂંક સમયમાં...', 'जल्द आ रहा है...'),
        image: '/images/about-girnar/girnar-tonk.jpeg'
      },
      {
        id: 'derashar',
        title: tr('8. Girnar Derashar', '૮. ગિરનાર દેરાસર', '8. गिरनार देरासर'),
        description: tr('Coming Soon...', 'ટૂંક સમયમાં...', 'जલ્દ આ રહા હૈ...'),
        image: '/images/about-girnar/girnar-derashar.jpg'
      },
      {
        id: 'neminath-bhagvan',
        title: tr('9. Neminath Bhagvan', '૯. નેમિનાથ ભગવાન', '9. नेमिनाथ भगवान'),
        description: tr('Coming Soon...', 'ટૂંક સમયમાં...', 'जल्द आ रहा है...'),
        image: '/images/about-girnar/neminath-bhagvan.jpg'
      },
      {
        id: 'sahesavan',
        title: tr('10. Sahesavan', '૧૦. સહેસાવન', '10. सहेसावन'),
        description: tr('Coming Soon...', 'ટૂંક સમયમાં...', 'जल्द आ रहा है...'),
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
