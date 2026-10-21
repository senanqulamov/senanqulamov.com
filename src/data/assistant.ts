// What the Director knows. Each topic has a pattern that recognises the question in
// English, Azerbaijani or Russian, the answer in all three languages, and the follow-up
// topics it suggests next. Edit the answers here.

import { books } from "./books";
import { essays } from "./essays";
import { pricing } from "./pricing";
import { profile } from "./profile";
import { projects } from "./projects";
import { money } from "@/lib/format";
import { translate, type Lang } from "@/i18n";

export type Answer = {
  say: string;
  list?: string[];
  /** Buttons under the answer: [label, link]. Links starting with "copy:" copy text instead. */
  acts?: [string, string][];
  lang?: Lang;
  id?: string;
};

type Intent = {
  id: string;
  re: RegExp;
  q: (L: Lang) => string;
  a: (L: Lang, q?: string) => Answer;
  next: string[];
};

export const Brain = (() => {
  const LL = ["en", "az", "ru"];
  const li = (l: string) => Math.max(0, LL.indexOf(l));
  const trl = (s: string, L: Lang) => translate(L, s);
  const svcName = (k: string, L: Lang) => trl(pricing.services[k].name, L);
  const weeks = (w: [number, number], L: Lang) =>
    [`${w[0]} to ${w[1]} weeks`, `${w[0]}-${w[1]} həftə`, `${w[0]}–${w[1]} недель`][li(L)];
  const per = (u: string | undefined, L: Lang) =>
    u === "month"
      ? [" / month", " / ay", " / мес"][li(L)]
      : u === "session"
        ? [" / session", " / sessiya", " / сессия"][li(L)]
        : "";
  const A = (say: string, extra: Partial<Answer> = {}): Answer => Object.assign({ say }, extra);
  const X = (en: string, az: string, ru: string) => (L: Lang) => [en, az, ru][li(L)];
  const SVC: [string, RegExp][] = [
    ["site", /web ?site|landing|\bsayt|сайт|лендинг/],
    ["shop", /e-?commerce|\bshop|store|mağaza|e-?ticarət|магазин/],
    ["platform", /marketplace|platform|marketpleys|платформ|маркетплейс/],
    ["webapp", /web ?app|saas|application|tətbiq|приложени/],
    ["admin", /admin|dashboard|panel|internal tool|back-?office|панел|админ/],
    ["api", /\bapi\b|backend|integration|inteqrasiya|интеграц|бэкенд/],
    ["security", /security|audit|pentest|təhlükəsizlik|безопасн|аудит/],
    ["lead", /tech ?lead|team ?lead|leadership|texniki rəhbər|техлид|тимлид/],
    ["mentor", /mentor|coach|ментор|наставн/],
  ];
  const LINKS = {
    work: ["Browse the work", "İşlərə bax", "Смотреть работы"],
    start: ["Open the estimate builder", "Qiymət hesablayıcısını aç", "Открыть калькулятор"],
    contact: ["Contact page", "Əlaqə səhifəsi", "Страница контактов"],
    cv: ["Full CV", "Tam CV", "Полное резюме"],
    services: ["Services", "Xidmətlər", "Услуги"],
    press: ["Talk topics", "Çıxış mövzuları", "Темы выступлений"],
    journal: ["Read the essays", "Esseləri oxu", "Читать эссе"],
    library: ["Open the library", "Kitabxananı aç", "Открыть библиотеку"],
    lab: ["Open the lab", "Laboratoriyanı aç", "Открыть лабораторию"],
    bidbary: ["BidBary case study", "BidBary keysi", "Кейс BidBary"],
    email: ["Write an email", "E-poçt yaz", "Написать письмо"],
    copy: ["Copy email", "E-poçtu kopyala", "Скопировать email"],
  };
  const ln = (k: string, href: string, L: Lang): [string, string] => [LINKS[k][li(L)], href];
  const I: Intent[] = [
    {
      id: "greet",
      re: /^(hi|hello|hey|good (morning|evening|afternoon)|salam|salamlar|sabahınız xeyir|axşamınız xeyir|привет|здравствуй|добрый)\b/,
      q: X("Hello!", "Salam!", "Привет!"),
      a: (L: Lang) =>
        A(
          X(
            "Hello! I'm the Director, Senan's assistant. Ask me about his projects, prices, availability, or how he works.",
            "Salam! Mən Rejissoram, Senanın köməkçisi. Onun layihələri, qiymətlər, boş vaxtı və ya iş üsulu haqqında soruşun.",
            "Привет! Я Режиссёр, ассистент Сенана. Спросите о его проектах, ценах, занятости или о том, как он работает.",
          )(L),
        ),
      next: ["projects", "price", "available"],
    },
    {
      id: "thanks",
      re: /thank|thx|sağ ?ol|təşəkkür|спасибо|благодар/,
      q: X("Thanks!", "Təşəkkürlər!", "Спасибо!"),
      a: (L: Lang) =>
        A(
          X(
            "You're welcome. Anything else you'd like to know?",
            "Buyurun. Başqa nə bilmək istərdiniz?",
            "Пожалуйста. Что-нибудь ещё?",
          )(L),
        ),
      next: ["brief", "contact", "projects"],
    },
    {
      id: "bye",
      re: /\b(bye|goodbye|see you)\b|görüşərik|hələlik|пока|до свидания/,
      q: X("Bye", "Hələlik", "Пока"),
      a: (L: Lang) =>
        A(
          X(
            "Goodbye! When you're ready to build something, Senan is one email away.",
            "Hələlik! Nəsə qurmağa hazır olanda Senan bir e-poçt uzaqlığındadır.",
            "До встречи! Когда будете готовы что-то создать, Сенан на расстоянии одного письма.",
          )(L),
          { acts: [ln("email", "mailto:" + profile.email, L)] },
        ),
      next: [],
    },
    {
      id: "bot",
      re: /who are you|are you (a )?(bot|robot|ai|human|real)|sən kimsən|siz kimsiniz|robotsan|ты кто|вы кто|ты бот|ты робот/,
      q: X("Who are you?", "Sən kimsən?", "Кто ты?"),
      a: (L: Lang) =>
        A(
          X(
            "I'm the Director, a small assistant built into this site. I answer from what's on these pages: projects, services, prices, the CV and the essays. For anything important, write to Senan directly.",
            "Mən Rejissoram, bu sayta qurulmuş kiçik köməkçi. Bu səhifələrdəki məlumatlardan cavab verirəm: layihələr, xidmətlər, qiymətlər, CV və esselər. Vacib məsələlər üçün birbaşa Senana yazın.",
            "Я Режиссёр, небольшой ассистент этого сайта. Отвечаю по содержанию страниц: проекты, услуги, цены, резюме и эссе. По важным вопросам пишите Сенану напрямую.",
          )(L),
        ),
      next: ["who", "projects", "contact"],
    },
    {
      id: "who",
      re: /who is senan|about senan|tell me about (him|you|senan)|introduce|senan kimdir|senan haqqında|özün haqqında|кто такой сенан|о сенане|расскажи о (себе|нём|сенане)/,
      q: X("Who is Senan?", "Senan kimdir?", "Кто такой Сенан?"),
      a: (L: Lang) =>
        A(
          X(
            "Senan Qulamov is an engineer from Baku: Tech Lead at PMIS (BP), founder and CEO of BidBary, and for seven years a therapist in parallel. He builds software for the people who will use it.",
            "Senan Qulamov Bakıdan mühəndisdir: PMIS (BP)-də texniki rəhbər, BidBary-nin təsisçisi və CEO-su, paralel olaraq yeddi il terapevt. O, istifadə edəcək insanlar üçün proqram təminatı qurur.",
            "Сенан Гуламов — инженер из Баку: техлид в PMIS (BP), основатель и CEO BidBary и параллельно семь лет терапевт. Он создаёт софт для людей, которые будут им пользоваться.",
          )(L),
          { acts: [ln("cv", "/credits", L)] },
        ),
      next: ["experience", "therapy", "why"],
    },
    {
      id: "bidbary",
      re: /bidbary/,
      q: X("What is BidBary?", "BidBary nədir?", "Что такое BidBary?"),
      a: (L: Lang) =>
        A(
          X(
            "BidBary is Senan's company: one platform for every way people gather. Auctions, concerts, private dinners, tours and workshops, each with its own rules for pricing, access and who gets in.",
            "BidBary Senanın şirkətidir: insanların bir araya gəldiyi hər format üçün bir platforma. Hərraclar, konsertlər, özəl şam yeməkləri, turlar və emalatxanalar, hər birinin qiymət, giriş və iştirak qaydaları ilə.",
            "BidBary — компания Сенана: одна платформа для всех способов собираться вместе. Аукционы, концерты, частные ужины, туры и мастер-классы, у каждого свои правила цены, доступа и участия.",
          )(L),
          { acts: [ln("bidbary", "/work/bidbary", L), ["bidbary.me", "https://bidbary.me"]] },
        ),
      next: ["projects", "stack", "contact"],
    },
    {
      id: "price",
      re: /price|pric|cost|budget|quote|how much|rate|qiymət|neçəyə|neçə pul|büdcə|dəyəri|цен|стоим|сколько стоит|бюджет|расцен/,
      q: X("How much does a project cost?", "Layihə neçəyə başa gəlir?", "Сколько стоит проект?"),
      a: (L: Lang, q: string) => {
        const s = SVC.filter(([k, re]) => re.test(q)).map((x) => x[0])[0];
        if (s) {
          const v = pricing.services[s];
          return A(
            X(
              `${svcName(s, L)} starts from ${money(v.from)}${per(v.unit, L)}${v.weeks ? ` and usually takes ${weeks(v.weeks, L)}` : ""}. The final number depends on scope, extras and how fast you need it.`,
              `${svcName(s, L)} ${money(v.from)}${per(v.unit, L)}-dən başlayır${v.weeks ? ` və adətən ${weeks(v.weeks, L)} çəkir` : ""}. Yekun məbləğ həcmdən, əlavələrdən və sürətdən asılıdır.`,
              `${svcName(s, L)}: от ${money(v.from)}${per(v.unit, L)}${v.weeks ? `, обычно ${weeks(v.weeks, L)}` : ""}. Итог зависит от объёма, дополнений и сроков.`,
            )(L),
            { acts: [ln("start", "/start", L)] },
          );
        }
        return A(
          X(
            "Starting points, in AZN, excluding VAT:",
            "Başlanğıc qiymətlər, AZN, ƏDV-siz:",
            "Стартовые цены в AZN без НДС:",
          )(L),
          {
            list: Object.keys(pricing.services).map(
              (k) =>
                `${svcName(k, L)}: ${money(pricing.services[k].from)}${per(pricing.services[k].unit, L)}`,
            ),
            acts: [ln("start", "/start", L)],
          },
        );
      },
      next: ["timeline", "payment", "brief"],
    },
    {
      id: "timeline",
      re: /how long|timeline|deadline|how fast|weeks|nə qədər (vaxt|çəkir)|müddət|nə vaxta|сколько времени|срок|как быстро/,
      q: X("How long does it take?", "Nə qədər vaxt aparır?", "Сколько это занимает?"),
      a: (L: Lang) =>
        A(X("Typical timelines:", "Adi müddətlər:", "Обычные сроки:")(L), {
          list: Object.keys(pricing.services)
            .filter((k) => pricing.services[k].weeks)
            .map((k) => `${svcName(k, L)}: ${weeks(pricing.services[k].weeks, L)}`),
          acts: [ln("start", "/start", L)],
        }),
      next: ["process", "available", "price"],
    },
    {
      id: "process",
      re: /process|how do (you|we) work|steps|workflow|methodolog|necə işlə|proses|mərhələ|iş qaydası|процесс|как (вы|ты) работа|этап/,
      q: X("How does a project run?", "Layihə necə gedir?", "Как идёт проект?"),
      a: (L: Lang) =>
        A(
          X("Four steps, named like a film:", "Film kimi adlanan dörd addım:", "Четыре шага, как в кино:")(L),
          {
            list: [
              X(
                "Pre-production: a call about the problem, people and constraints",
                "Hazırlıq: problem, insanlar və məhdudiyyətlər haqqında zəng",
                "Препродакшн: созвон о задаче, людях и ограничениях",
              )(L),
              X(
                "Script: a written proposal with scope, milestones, timeline and cost",
                "Ssenari: həcm, mərhələlər, müddət və qiymətlə yazılı təklif",
                "Сценарий: письменное предложение с объёмом, этапами, сроками и ценой",
              )(L),
              X(
                "Production: weekly versions you can click, with honest updates",
                "İstehsal: klikləyə biləcəyiniz həftəlik versiyalar, dürüst hesabatlarla",
                "Продакшн: еженедельные версии с честными отчётами",
              )(L),
              X(
                "Premiere: launch, handover and support",
                "Premyera: buraxılış, təhvil və dəstək",
                "Премьера: запуск, передача и поддержка",
              )(L),
            ],
            acts: [ln("services", "/services", L)],
          },
        ),
      next: ["payment", "support", "brief"],
    },
    {
      id: "available",
      re: /availab|when can|free to|busy|start (soon|when)|boş|nə vaxt başla|başlaya bilər|məşğul|свобод|когда (можете|сможете|начать)|занят/,
      q: X("When are you available?", "Nə vaxt boşsunuz?", "Когда вы свободны?"),
      a: (L: Lang) =>
        A(
          X(
            "Senan is open to new projects from November. He usually starts within two weeks of an agreed proposal.",
            "Senan noyabrdan yeni layihələrə açıqdır. Adətən razılaşdırılmış təklifdən sonra iki həftə ərzində başlayır.",
            "Сенан открыт для новых проектов с ноября. Обычно начинает в течение двух недель после согласования предложения.",
          )(L),
          { acts: [ln("start", "/start", L)] },
        ),
      next: ["location", "price", "contact"],
    },
    {
      id: "location",
      re: /where (are|is|do)|based|location|remote|time ?zone|onsite|harada|uzaqdan|ofis|saat qurşağı|где (вы|он|ты)|удалён|часов(ой)? пояс|офис/,
      q: X("Do you work remotely?", "Uzaqdan işləyirsiniz?", "Вы работаете удалённо?"),
      a: (L: Lang) =>
        A(
          X(
            "Senan is based in Baku (GMT+4) and works with teams onsite and remotely, across time zones.",
            "Senan Bakıdadır (GMT+4) və komandalarla həm yerində, həm də fərqli saat qurşaqlarında uzaqdan işləyir.",
            "Сенан в Баку (GMT+4) и работает с командами на месте и удалённо в разных часовых поясах.",
          )(L),
        ),
      next: ["available", "langs", "contact"],
    },
    {
      id: "langs",
      re: /which languages|what languages|languages do|hansı dil|dilləri|dil bilir|какие языки|на каком языке|языки/,
      q: X("Which languages do you speak?", "Hansı dilləri bilirsiniz?", "Какие языки вы знаете?"),
      a: (L: Lang) =>
        A(
          X(
            "Azerbaijani, English and Russian. This chat speaks all three: switch with the buttons below.",
            "Azərbaycan, ingilis və rus. Bu söhbət də üç dildə danışır: aşağıdakı düymələrlə dəyişin.",
            "Азербайджанский, английский и русский. Этот чат тоже говорит на трёх языках: переключите кнопками ниже.",
          )(L),
        ),
      next: ["location", "contact"],
    },
    {
      id: "stack",
      re: /stack|tech|technolog|framework|java\b|laravel|php|react|next\.?js|docker|postgres|mysql|texnologiya|стек|технолог|фреймворк/,
      q: X("What is your tech stack?", "Texnologiya stekiniz nədir?", "Какой у вас стек?"),
      a: (L: Lang) =>
        A(
          X(
            "Backend is home: Java with Javalin, PHP with Laravel, PostgreSQL and MySQL, Docker and CI/CD. On the front end, Next.js, React, Livewire, GSAP and WebGL.",
            "Backend əsas sahədir: Java (Javalin), PHP (Laravel), PostgreSQL və MySQL, Docker və CI/CD. Frontend-də Next.js, React, Livewire, GSAP və WebGL.",
            "Основа — бэкенд: Java (Javalin), PHP (Laravel), PostgreSQL и MySQL, Docker и CI/CD. На фронтенде Next.js, React, Livewire, GSAP и WebGL.",
          )(L),
          { acts: [ln("lab", "/lab", L)] },
        ),
      next: ["projects", "site", "lab"],
    },
    {
      id: "projects",
      re: /what (have you|did you) (built|build|made)|projects?|portfolio|your work|examples|nə qurmusunuz|layihə|portfolio|işləriniz|проект|портфолио|что (вы|ты) (сделал|создал)|примеры работ/,
      q: X("What have you built?", "Nə qurmusunuz?", "Что вы сделали?"),
      a: (L: Lang) =>
        A(
          X(
            "Twenty-two projects so far, for example:",
            "İndiyədək iyirmi iki layihə, məsələn:",
            "Пока двадцать два проекта, например:",
          )(L),
          {
            list: [
              "BidBary — " +
                X(
                  "events and auctions platform",
                  "tədbir və hərrac platforması",
                  "платформа событий и аукционов",
                )(L),
              "SCMAI — " +
                X(
                  "SAP-aligned procurement platform",
                  "SAP uyğun satınalma platforması",
                  "платформа закупок, совместимая с SAP",
                )(L),
              "Edutoria — " +
                X("learning management system", "təlim idarəetmə sistemi", "система управления обучением")(L),
              "AllRent — " + X("rental marketplace", "icarə marketpleysi", "маркетплейс аренды")(L),
              "Ofisait10.az — " +
                X("office equipment store", "ofis avadanlığı mağazası", "магазин офисной техники")(L),
            ],
            acts: [ln("work", "/work", L)],
          },
        ),
      next: ["bidbary", "marketplace", "stack"],
    },
    {
      id: "marketplace",
      re: /marketplace|two-sided|marketpleys|маркетплейс/,
      q: X("Have you built marketplaces?", "Marketpleys qurmusunuz?", "Вы делали маркетплейсы?"),
      a: (L: Lang) =>
        A(
          X(
            "Yes: BidBary (events and auctions), AllRent (rentals) and NeoSphere (a gig and union hub). Marketplaces start from AZN 7,000 and usually take 12 to 20 weeks.",
            "Bəli: BidBary (tədbir və hərraclar), AllRent (icarə) və NeoSphere (gig və həmkarlar mərkəzi). Marketpleyslər AZN 7,000-dən başlayır və adətən 12-20 həftə çəkir.",
            "Да: BidBary (события и аукционы), AllRent (аренда) и NeoSphere (гиг-платформа). Маркетплейсы — от AZN 7,000, обычно 12–20 недель.",
          )(L),
          {
            acts: [
              ["AllRent", "/work/allrent"],
              ["BidBary", "/work/bidbary"],
            ],
          },
        ),
      next: ["price", "process", "brief"],
    },
    {
      id: "lead",
      re: /lead (our|a|the) team|join (our|your) team|hire you|team lead|cto|komandamıza|rəhbərlik edə|komandaya qoşul|возглавить|присоединиться к команд|нанять/,
      q: X(
        "Can you lead our team?",
        "Komandamıza rəhbərlik edə bilərsiniz?",
        "Можете возглавить нашу команду?",
      ),
      a: (L: Lang) =>
        A(
          X(
            "Yes. Senan leads engineering at PMIS (BP) today and led teams at Allrent and Deirvlon before. He can join as a tech lead, a senior engineer or an advisor. Fractional leadership starts from AZN 2,000 / month.",
            "Bəli. Senan hazırda PMIS (BP)-də mühəndisliyə rəhbərlik edir, əvvəllər Allrent və Deirvlon-da komandalara rəhbərlik edib. Texniki rəhbər, senior mühəndis və ya məsləhətçi kimi qoşula bilər. Hissəvi rəhbərlik AZN 2,000 / ay-dan başlayır.",
            "Да. Сейчас Сенан руководит инженерией в PMIS (BP), раньше вёл команды в Allrent и Deirvlon. Может присоединиться как техлид, senior-инженер или советник. Техлид на part-time — от AZN 2,000 / мес.",
          )(L),
          { acts: [ln("start", "/start", L)] },
        ),
      next: ["mentor", "available", "why"],
    },
    {
      id: "fulltime",
      re: /full[- ]?time|vacanc|job offer|employ|position|iş təklif|vakansiya|tam ştat|ваканси|штат|предложение о работе/,
      q: X(
        "Are you open to a full-time role?",
        "Tam ştatlı işə açıqsınız?",
        "Рассматриваете полную занятость?",
      ),
      a: (L: Lang) =>
        A(
          X(
            "Senan is currently Tech Lead at PMIS (BP) and building BidBary, so most new work is project-based or fractional. For a strong role, write to him and he'll answer honestly.",
            "Senan hazırda PMIS (BP)-də texniki rəhbərdir və BidBary-ni qurur, ona görə yeni işlərin çoxu layihə əsaslı və ya hissəvidir. Güclü bir vəzifə üçün ona yazın, dürüst cavab verəcək.",
            "Сейчас Сенан техлид в PMIS (BP) и строит BidBary, поэтому новая работа в основном проектная или частичная. Если роль сильная, напишите ему, он честно ответит.",
          )(L),
          { acts: [ln("email", "mailto:" + profile.email, L)] },
        ),
      next: ["lead", "contact"],
    },
    {
      id: "mentor",
      re: /mentor|coaching|career advice|наставн|ментор/,
      q: X("Do you do mentoring?", "Mentorluq edirsiniz?", "Вы занимаетесь менторством?"),
      a: (L: Lang) =>
        A(
          X(
            "Yes, for developers and founders: burnout, first-time leadership, team conflict and decisions under pressure. It draws on seven years as a therapist, but it's mentoring, not clinical therapy. Sessions from AZN 60.",
            "Bəli, developer və təsisçilər üçün: tükənmişlik, ilk rəhbərlik, komanda münaqişəsi və təzyiq altında qərarlar. Yeddi illik terapevt təcrübəsinə əsaslanır, amma bu mentorluqdur, klinik terapiya deyil. Sessiya AZN 60-dan.",
            "Да, для разработчиков и основателей: выгорание, первое руководство, конфликты в команде и решения под давлением. Опирается на семь лет терапии, но это менторство, а не лечение. Сессия от AZN 60.",
          )(L),
          { acts: [ln("start", "/start", L)] },
        ),
      next: ["therapy", "speak", "contact"],
    },
    {
      id: "therapy",
      re: /therap|psycholog|counsel|terapevt|psixoloq|psixologiya|терапевт|психолог/,
      q: X("Why a therapist?", "Niyə terapevt?", "Почему терапевт?"),
      a: (L: Lang) =>
        A(
          X(
            "For seven years, in parallel with engineering, Senan worked as a therapist. It shapes how he leads and builds: listening before solving, and naming what a room isn't saying.",
            "Yeddi il mühəndisliklə paralel Senan terapevt kimi işləyib. Bu, onun rəhbərliyini və işini formalaşdırır: həll etməzdən əvvəl dinləmək və otaqda deyilməyəni adlandırmaq.",
            "Семь лет параллельно с инженерией Сенан работал терапевтом. Это влияет на то, как он руководит: сначала слушать, потом решать, и называть то, о чём молчат.",
          )(L),
          { acts: [ln("journal", "/journal", L)] },
        ),
      next: ["mentor", "essays", "who"],
    },
    {
      id: "speak",
      re: /speak at|talk|keynote|podcast|conference|panel|çıxış|konfrans|podkast|выступ|доклад|конференц|подкаст/,
      q: X("Do you speak at events?", "Tədbirlərdə çıxış edirsiniz?", "Вы выступаете на мероприятиях?"),
      a: (L: Lang) =>
        A(
          X(
            "Yes: keynotes, workshops, panels and podcasts on technology, psychology and leadership.",
            "Bəli: texnologiya, psixologiya və rəhbərlik haqqında əsas çıxışlar, emalatxanalar, panellər və podkastlar.",
            "Да: кейноуты, воркшопы, панели и подкасты о технологиях, психологии и лидерстве.",
          )(L),
          { acts: [ln("press", "/press", L)] },
        ),
      next: ["therapy", "contact"],
    },
    {
      id: "experience",
      re: /experience|cv\b|resume|career|worked (at|for)|companies|təcrübə|karyera|harada işləyib|опыт|резюме|карьер|где работал/,
      q: X("What's your experience?", "Təcrübəniz nədir?", "Какой у вас опыт?"),
      a: (L: Lang) =>
        A(
          X(
            "Shipping production software since 2019: an internship at ATL Tech, then Ferrum Capital, Deirvlon, Allrent, GlobalSoft and Inci Group. Today he's Tech Lead at PMIS (BP) and founder of BidBary.",
            "2019-dan real məhsul kodu: ATL Tech-də təcrübə, sonra Ferrum Capital, Deirvlon, Allrent, GlobalSoft və Inci Group. Hazırda PMIS (BP)-də texniki rəhbər və BidBary-nin təsisçisidir.",
            "Пишет продакшн-софт с 2019 года: стажировка в ATL Tech, затем Ferrum Capital, Deirvlon, Allrent, GlobalSoft и Inci Group. Сейчас техлид в PMIS (BP) и основатель BidBary.",
          )(L),
          { acts: [ln("cv", "/credits", L)] },
        ),
      next: ["education", "lead", "projects"],
    },
    {
      id: "education",
      re: /education|study|studied|university|degree|master|bachelor|təhsil|universitet|magistr|bakalavr|образован|университет|магистр|бакалавр/,
      q: X("Where did you study?", "Harada təhsil almısınız?", "Где вы учились?"),
      a: (L: Lang) =>
        A(
          X(
            "A master's in Computer Science from Baku State University and a bachelor's from Khazar University. In 2018 his team took second place at the World Robot Olympiad in Azerbaijan.",
            "Bakı Dövlət Universitetində Kompüter Elmləri üzrə magistr və Xəzər Universitetində bakalavr. 2018-ci ildə Dünya Robot Olimpiadasının Azərbaycan mərhələsində ikinci yer.",
            "Магистратура по компьютерным наукам в Бакинском государственном университете и бакалавриат в Университете Хазар. В 2018 году — второе место на World Robot Olympiad в Азербайджане.",
          )(L),
        ),
      next: ["experience", "stack"],
    },
    {
      id: "contact",
      re: /contact|e-?mail|phone|reach|whatsapp|call (you|him)|əlaqə|e-?poçt|telefon|zəng|контакт|почт|телефон|связат|позвонить/,
      q: X("How do I contact Senan?", "Senanla necə əlaqə saxlayım?", "Как связаться с Сенаном?"),
      a: (L: Lang) =>
        A(
          X(
            `The fastest way is email: ${profile.email}. You can also call or WhatsApp ${profile.phone}.`,
            `Ən sürətli yol e-poçtdur: ${profile.email}. Həmçinin ${profile.phone} nömrəsinə zəng və ya WhatsApp yaza bilərsiniz.`,
            `Быстрее всего по почте: ${profile.email}. Также можно позвонить или написать в WhatsApp: ${profile.phone}.`,
          )(L),
          { acts: [ln("copy", "copy:" + profile.email, L), ln("contact", "/contact", L)] },
        ),
      next: ["brief", "available"],
    },
    {
      id: "brief",
      re: /brief|estimate|start a project|proposal|get started|brif|layihəyə başla|qiymətləndir|təklif al|бриф|оценк|смет|начать проект/,
      q: X("How do I start a project?", "Layihəyə necə başlayım?", "Как начать проект?"),
      a: (L: Lang) =>
        A(
          X(
            "Use the estimate builder: five short steps, an honest estimate as you go, and the brief goes straight to Senan. You'll get a written proposal within a few days.",
            "Qiymət hesablayıcısından istifadə edin: beş qısa addım, dürüst qiymət və brif birbaşa Senana gedir. Bir neçə günə yazılı təklif alacaqsınız.",
            "Используйте калькулятор: пять коротких шагов, честная оценка, и бриф уходит прямо Сенану. Письменное предложение придёт через несколько дней.",
          )(L),
          { acts: [ln("start", "/start", L)] },
        ),
      next: ["price", "timeline", "process"],
    },
    {
      id: "payment",
      re: /payment|pay |invoice|milestone|prepay|ödəniş|hesab-faktura|оплат|платеж|предоплат/,
      q: X("How does payment work?", "Ödəniş necə olur?", "Как происходит оплата?"),
      a: (L: Lang) =>
        A(
          X(
            "Payment terms are set in the written proposal, usually split across milestones so you pay as you see progress. Prices are in AZN, excluding VAT.",
            "Ödəniş şərtləri yazılı təklifdə müəyyən olunur, adətən mərhələlərə bölünür ki, irəliləyişi gördükcə ödəyəsiniz. Qiymətlər AZN ilə, ƏDV-siz.",
            "Условия оплаты фиксируются в письменном предложении, обычно по этапам, чтобы вы платили по мере прогресса. Цены в AZN без НДС.",
          )(L),
        ),
      next: ["nda", "support", "brief"],
    },
    {
      id: "nda",
      re: /\bnda\b|confidential|non-?disclosure|məxfi|конфиденц|неразглаш/,
      q: X("Will you sign an NDA?", "NDA imzalayırsınız?", "Подпишете NDA?"),
      a: (L: Lang) =>
        A(
          X(
            "Yes. Senan is happy to sign an NDA before you share details.",
            "Bəli. Senan detalları paylaşmazdan əvvəl NDA imzalamağa hazırdır.",
            "Да. Сенан готов подписать NDA до того, как вы поделитесь деталями.",
          )(L),
        ),
      next: ["brief", "contact"],
    },
    {
      id: "support",
      re: /support|maintenance|after launch|hosting|care plan|dəstək|texniki xidmət|buraxılışdan sonra|поддерж|сопровожд|после запуска/,
      q: X(
        "Do you offer support after launch?",
        "Buraxılışdan sonra dəstək var?",
        "Есть поддержка после запуска?",
      ),
      a: (L: Lang) =>
        A(
          X(
            "Yes. Every project includes a handover, and a monthly care plan covers updates and fixes after launch.",
            "Bəli. Hər layihədə təhvil var, aylıq qayğı planı isə buraxılışdan sonra yeniləmə və düzəlişləri əhatə edir.",
            "Да. В каждый проект входит передача, а ежемесячный план поддержки покрывает обновления и исправления после запуска.",
          )(L),
          { acts: [ln("start", "/start", L)] },
        ),
      next: ["payment", "price"],
    },
    {
      id: "mobile",
      re: /mobile app|ios|android|app store|mobil tətbiq|мобильн/,
      q: X("Do you build mobile apps?", "Mobil tətbiq hazırlayırsınız?", "Делаете мобильные приложения?"),
      a: (L: Lang) =>
        A(
          X(
            "Senan's focus is web: responsive web apps and the backends and APIs that mobile apps run on. For a native app, he can lead the backend and work with a mobile team.",
            "Senanın fokusu vebdir: responsiv veb tətbiqlər və mobil tətbiqlərin işlədiyi backend və API-lər. Native tətbiq üçün o, backend-ə rəhbərlik edib mobil komanda ilə işləyə bilər.",
            "Фокус Сенана — веб: адаптивные веб-приложения и бэкенды с API, на которых работают мобильные приложения. Для нативного приложения он может вести бэкенд вместе с мобильной командой.",
          )(L),
        ),
      next: ["stack", "api", "price"],
    },
    {
      id: "design",
      re: /design|ui\b|ux\b|figma|dizayn|дизайн/,
      q: X("Do you do design?", "Dizayn edirsiniz?", "Вы делаете дизайн?"),
      a: (L: Lang) =>
        A(
          X(
            "Senan sets the visual direction and builds interfaces himself, like this site. Custom interface design is available as an extra in any project.",
            "Senan vizual istiqaməti müəyyən edir və interfeysləri özü qurur, bu sayt kimi. Fərdi interfeys dizaynı istənilən layihəyə əlavə kimi mümkündür.",
            "Сенан задаёт визуальное направление и сам делает интерфейсы, как этот сайт. Индивидуальный дизайн доступен как дополнение к любому проекту.",
          )(L),
        ),
      next: ["site", "price"],
    },
    {
      id: "api",
      re: /\bapi\b|backend|integration|microservice|inteqrasiya|mikroservis|интеграц|микросервис|бэкенд/,
      q: X("Can you build our backend?", "Backend-imizi qura bilərsiniz?", "Сделаете нам бэкенд?"),
      a: (L: Lang) =>
        A(
          X(
            "Yes, backend is home: clean, fast and documented APIs, REST with OAuth and webhooks, Java microservices next to Laravel, query tuning and caching. From AZN 3,000, usually 4 to 8 weeks.",
            "Bəli, backend əsas sahədir: təmiz, sürətli və sənədləşdirilmiş API-lər, OAuth və webhook-larla REST, Laravel yanında Java mikroservisləri, sorğu optimallaşdırması və keşləmə. AZN 3,000-dən, adətən 4-8 həftə.",
            "Да, бэкенд — основа: чистые, быстрые и задокументированные API, REST с OAuth и вебхуками, микросервисы на Java рядом с Laravel, оптимизация запросов и кэш. От AZN 3,000, обычно 4–8 недель.",
          )(L),
          { acts: [ln("lab", "/lab", L)] },
        ),
      next: ["stack", "security", "price"],
    },
    {
      id: "security",
      re: /security|audit|pentest|vulnerab|təhlükəsizlik|zəiflik|безопасн|аудит|уязвим/,
      q: X(
        "Can you review our security?",
        "Təhlükəsizliyimizi yoxlaya bilərsiniz?",
        "Проверите нашу безопасность?",
      ),
      a: (L: Lang) =>
        A(
          X(
            "Yes. A security review covers authentication and authorization, common web and API vulnerabilities, and server hardening, ending with a prioritized fix list. From AZN 900, about 1 to 2 weeks.",
            "Bəli. Təhlükəsizlik auditi autentifikasiya və avtorizasiyanı, tipik veb və API zəifliklərini və server qorunmasını əhatə edir, sonda prioritetli düzəliş siyahısı. AZN 900-dən, təxminən 1-2 həftə.",
            "Да. Аудит охватывает аутентификацию и авторизацию, типовые уязвимости веба и API и защиту серверов, в конце — список исправлений по приоритету. От AZN 900, около 1–2 недель.",
          )(L),
        ),
      next: ["api", "brief"],
    },
    {
      id: "essays",
      re: /essay|blog|article|journal|esse|məqalə|jurnal|блог|стать|эссе/,
      q: X("What do you write about?", "Nə haqqında yazırsınız?", "О чём вы пишете?"),
      a: (L: Lang) =>
        A(
          X(
            "Five essays from both sides of his work, for example:",
            "İşinin hər iki tərəfindən beş esse, məsələn:",
            "Пять эссе с обеих сторон его работы, например:",
          )(L),
          { list: essays.slice(0, 3).map((b) => b.title), acts: [ln("journal", "/journal", L)] },
        ),
      next: ["therapy", "books"],
    },
    {
      id: "books",
      re: /book|reading|read\b|library|kitab|oxu|книг|чита|библиотек/,
      q: X("What books do you recommend?", "Hansı kitabları tövsiyə edirsiniz?", "Какие книги советуете?"),
      a: (L: Lang) =>
        A(
          X(
            "More than 200 read. A few he keeps coming back to:",
            "200-dən çox oxuyub. Təkrar-təkrar qayıtdıqları:",
            "Прочитано больше 200. Те, к которым он возвращается:",
          )(L),
          {
            list: books.slice(0, 4).map((b) => `${b.title}, ${b.author}`),
            acts: [ln("library", "/library", L)],
          },
        ),
      next: ["essays", "therapy"],
    },
    {
      id: "lab",
      re: /\blab\b|experiment|playground|sql|laboratoriya|eksperiment|лаборатор|эксперимент/,
      q: X("What's in the lab?", "Laboratoriyada nə var?", "Что в лаборатории?"),
      a: (L: Lang) =>
        A(
          X(
            "Working systems you can poke: a real SQL database, auction race conditions, rate limiters, consistent hashing, a cache simulator and live GitHub data.",
            "Toxuna biləcəyiniz işlək sistemlər: real SQL bazası, hərrac yarış vəziyyətləri, rate limiter-lər, ardıcıl heşləmə, keş simulyatoru və canlı GitHub məlumatları.",
            "Работающие системы: настоящая SQL-база, гонки ставок на аукционе, rate limiter, консистентное хеширование, симулятор кэша и живые данные GitHub.",
          )(L),
          { acts: [ln("lab", "/lab", L)] },
        ),
      next: ["stack", "api"],
    },
    {
      id: "site",
      re: /this (site|website)|how (was|is) (this|the site)|built this|webgl|three\.?js|bu sayt|saytı necə|этот сайт|как сделан/,
      q: X("How was this site built?", "Bu sayt necə qurulub?", "Как сделан этот сайт?"),
      a: (L: Lang) =>
        A(
          X(
            "Everything you see is computed live: the chrome is a raymarched shader in Three.js, motion runs on GSAP and Lenis, and every sound is synthesized in your browser. I'm part of it too.",
            "Gördüyünüz hər şey canlı hesablanır: xrom Three.js-də raymarching şeyderidir, hərəkət GSAP və Lenis ilə işləyir, bütün səslər brauzerinizdə sintez olunur. Mən də onun bir hissəsiyəm.",
            "Всё, что вы видите, считается вживую: хром — это шейдер с рэймарчингом на Three.js, анимация на GSAP и Lenis, все звуки синтезируются в браузере. Я тоже часть этого.",
          )(L),
        ),
      next: ["stack", "design", "lab"],
    },
    {
      id: "why",
      re: /why (should|would) (i|we)|why you|why hire|strength|different|niyə sizi|niyə məhz|üstünlüy|почему (вы|вас|именно)|преимуществ|сильные стороны/,
      q: X("Why work with Senan?", "Niyə Senanla işləmək?", "Почему стоит работать с Сенаном?"),
      a: (L: Lang) =>
        A(
          X(
            "Three things together: deep backend engineering, real leadership experience, and seven years of listening to people as a therapist. You get systems that work and a partner who understands what you actually need.",
            "Üç şey birlikdə: dərin backend mühəndisliyi, real rəhbərlik təcrübəsi və terapevt kimi yeddi il insanları dinləmək. İşləyən sistemlər və həqiqətən nəyə ehtiyacınız olduğunu anlayan tərəfdaş alırsınız.",
            "Три вещи вместе: глубокая бэкенд-инженерия, реальный опыт руководства и семь лет умения слушать людей как терапевт. Вы получаете работающие системы и партнёра, который понимает, что вам действительно нужно.",
          )(L),
          { acts: [ln("work", "/work", L)] },
        ),
      next: ["projects", "brief"],
    },
  ];
  const byId = Object.fromEntries(I.map((x) => [x.id, x]));
  const POP = ["projects", "price", "bidbary", "available"];
  function detect(q: string, fallback: Lang): Lang {
    if (/[а-яё]/i.test(q)) return "ru";
    if (
      /[əğışçöüƏĞIŞÇÖÜ]/.test(q) ||
      /\b(salam|necə|neçə|nədir|haqqında|var|mən|siz|layihə|qiymət|kimdir|harada)\b/i.test(q)
    )
      return "az";
    if (/\b(what|how|the|you|is|are|do|can|who|price|project)\b/i.test(q)) return "en";
    return fallback;
  }
  function project(q: string) {
    const s = q.toLowerCase();
    return projects.find((p) => {
      const t = p.title.toLowerCase().replace(/\s+/g, "");
      return t.length > 3 && s.replace(/\s+/g, "").includes(t) && !/bidbary/.test(t);
    });
  }
  function answer(raw: string, lang: Lang): Answer {
    const q = raw.toLowerCase().trim();
    const L = detect(q, lang || "en");
    if (/bidbary/.test(q)) return { ...byId.bidbary.a(L, q), lang: L, id: "bidbary" };
    const p = project(q);
    if (p)
      return {
        say: X(
          `${p.title}: ${p.subtitle}. ${p.client}, ${p.year}. Built with ${p.tech.slice(0, 5).join(", ")}.`,
          `${p.title}: ${p.subtitle}. ${p.client}, ${p.year}. Texnologiyalar: ${p.tech.slice(0, 5).join(", ")}.`,
          `${p.title}: ${p.subtitle}. ${p.client}, ${p.year}. Технологии: ${p.tech.slice(0, 5).join(", ")}.`,
        )(L),
        acts: [[X("Open the case study", "Keysi aç", "Открыть кейс")(L), "/work/" + p.slug]],
        lang: L,
        id: "projects",
      };
    const short = q.split(/\s+/).length <= 3;
    for (const it of I) {
      if ((it.id === "greet" || it.id === "thanks" || it.id === "bye") && !short) continue;
      if (it.re.test(q)) return { ...it.a(L, q), lang: L, id: it.id };
    }
    return {
      say: X(
        "I don't have a good answer to that from this site. Try asking about projects, prices, the stack or availability, or write to Senan directly.",
        "Bu sayt əsasında buna yaxşı cavabım yoxdur. Layihələr, qiymətlər, texnologiyalar və ya boş vaxt haqqında soruşun, ya da birbaşa Senana yazın.",
        "У меня нет хорошего ответа на это по материалам сайта. Спросите о проектах, ценах, стеке или занятости, либо напишите Сенану напрямую.",
      )(L),
      acts: [ln("email", "mailto:" + profile.email, L)],
      lang: L,
      id: "fallback",
    };
  }
  function follow(id: string, L: Lang, asked: Set<string>) {
    const nx = (byId[id] && byId[id].next.length ? byId[id].next : POP).concat(POP, [
      "why",
      "stack",
      "process",
      "contact",
    ]);
    const out = [];
    for (const k of nx) {
      if (out.length >= 3) break;
      if (!asked.has(k) && byId[k] && !out.includes(k) && k !== id) out.push(k);
    }
    return out.map((k) => ({ id: k, q: byId[k].q(L) }));
  }
  function answerId(id: string, L: Lang): Answer {
    const it = byId[id];
    if (!it) return null;
    return { ...it.a(L, it.q(L).toLowerCase()), lang: L, id };
  }
  return {
    answer,
    answerId,
    follow,
    popular: (L: Lang) => POP.map((k) => ({ id: k, q: byId[k].q(L) })),
    question: (id: string, L: Lang) => (byId[id] ? byId[id].q(L) : ""),
    detect,
  };
})();
