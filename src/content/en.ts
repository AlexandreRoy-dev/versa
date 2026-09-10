import type { Dictionary } from "./types";

export const en: Dictionary = {
  locale: "en",
  meta: {
    title: "Versa Capital | Commercial equipment financing",
    description:
      "Quebec-based brokerage for commercial equipment financing. Leasing, factoring, refinancing and term loans, with a callback in under 24 hours.",
  },
  nav: {
    home: "Home",
    solutions: "Solutions",
    equipment: "Equipment",
    about: "The firm",
    faq: "FAQ",
    contact: "Contact",
    callUs: "1-833-508-3772",
    apply: "Apply for financing",
    menu: "Menu",
    close: "Close",
    switchTo: "FR",
    switchLabel: "Voir le site en français",
  },
  hero: {
    eyebrow: "Equipment financing advisory firm",
    heading: "Commercial equipment financing, negotiated on your behalf",
    body: "Versa Capital is a Quebec brokerage firm. Our 19 brokers compare offers across several financial institutions and negotiate the terms for you, on new or used equipment.",
    primaryCta: "Get a quote",
    secondaryCta: "See our solutions",
    stats: [
      { value: "19", label: "brokers across Quebec" },
      { value: "24 h", label: "to your first callback" },
      { value: "14", label: "equipment sectors" },
    ],
    scrollHint: "Scroll",
  },
  marquee: [
    "Construction",
    "Transportation",
    "Forestry",
    "Agriculture",
    "Excavation",
    "Handling",
    "Industrial",
    "Medical and dental",
  ],
  why: {
    eyebrow: "Why use a brokerage",
    heading: "What changes when you stop shopping alone",
    body: "You deal with one team that talks to every institution on your behalf. That is the difference between filing five applications and filing one.",
    points: [
      {
        title: "A strategy built around your needs",
        body: "We start with your project, your cash position and your seasonality before we talk product. The structure follows your needs, not the other way around.",
      },
      {
        title: "Fast access to several institutions",
        body: "A single application goes out to our financial partners in parallel. You compare real offers instead of knocking on doors one at a time.",
      },
      {
        title: "Partner terms, not walk-in terms",
        body: "As owners and partners of equipment dealerships, we access terms normally reserved for high-volume buyers.",
      },
      {
        title: "One point of contact",
        body: "Leasing, factoring, refinancing, term loans and lines of credit: the same person follows your file from start to finish.",
      },
    ],
  },
  products: {
    eyebrow: "Our financing solutions",
    heading: "Four ways to finance equipment",
    body: "Each solution answers a different constraint: protecting your cash, freeing up capital already tied to an asset, or spreading an acquisition over time.",
    lineOfCredit: "A line of credit service is also available.",
    lineOfCreditCta: "Contact us",
    learnMore: "Learn more",
    bestForLabel: "Useful when",
    items: [
      {
        slug: "credit-bail",
        name: "Leasing",
        summary: "Finance new or used equipment without tying up your capital.",
        body: "Leasing is the simplest way to finance a wide variety of equipment, from construction fleets to computer hardware. You protect your cash and the credit lines you already have in place, which increases your purchasing power for everything else. Payments are deductible, and there is no sales tax to pay when you acquire the equipment.",
        benefits: [
          "Protects your cash and existing credit lines",
          "No sales tax due when you buy the equipment",
          "Deductible payments, up to 100% depending on structure",
          "Simple process and fast approval request",
          "Builds company credit without touching personal debt",
        ],
        bestFor: "you want the equipment now without locking up your cash.",
        estimatorNote:
          "Estimate based on a lease with a purchase option at term.",
      },
      {
        slug: "affacturage",
        name: "Factoring",
        summary: "Turn your receivables into cash available this week.",
        body: "Used by businesses of all sizes, factoring is especially useful during start-up, growth or restructuring. Because it is not subject to the spending restrictions of commercial loans, it suits businesses with seasonal or periodic sales. A dedicated team takes over accounts receivable management.",
        benefits: [
          "Immediate increase in cash flow",
          "Pay suppliers faster, often at a discount",
          "No spending restrictions, unlike a commercial loan",
          "Receivables management handled by a dedicated team",
          "Well suited to seasonal or periodic sales",
        ],
        bestFor: "the sales are made but customer payments are slow to arrive.",
        estimatorNote:
          "Factoring is priced against your receivables, so let's discuss it directly.",
      },
      {
        slug: "refinancement",
        name: "Equipment refinancing",
        summary: "Free up capital from equipment you have already paid off.",
        body: "Refinancing is a lever that pulls cash out of equipment you already own to rebuild your working capital. It is too often associated with companies in difficulty, when it mostly serves to fund a project that sets you apart from competitors, with all the advantages of leasing.",
        benefits: [
          "Preserves the capital already invested",
          "Access to cash without a new acquisition",
          "Flexible financing, structured around your fleet",
          "Keeps the advantages of leasing",
        ],
        bestFor: "your equipment is paid off and working capital is tight.",
        estimatorNote:
          "Estimate based on the residual value of the refinanced equipment.",
      },
      {
        slug: "pret-a-terme",
        name: "Term loan",
        summary: "Spread an acquisition over several years on fixed terms.",
        body: "A term loan lets you carry out your acquisition projects while keeping your cash for day-to-day operations. Terms and due dates are set in advance, which simplifies capital budget management and improves the structure of your balance sheet.",
        benefits: [
          "Payments spread over several years",
          "Terms and due dates set in advance",
          "Better capital budget management",
          "Improves your balance sheet structure",
        ],
        bestFor: "you want budget predictability on a long-lived asset.",
        estimatorNote:
          "Estimate based on level amortization over the selected term.",
      },
    ],
  },
  estimator: {
    eyebrow: "Payment estimator",
    heading: "Estimate your monthly payment",
    body: "Adjust the amount and term to see the order of magnitude of a payment. This is a starting point for the conversation, not an offer.",
    amountLabel: "Amount to finance",
    termLabel: "Financing term",
    productLabel: "Type of solution",
    months: "months",
    resultLabel: "Estimated monthly payment",
    perMonth: "per month",
    totalLabel: "Total of payments",
    rateLabel: "Annual rate used",
    rateNote: "Illustrative rate only",
    disclaimer:
      "This estimate is illustrative and uses a sample rate. Your actual rate depends on your credit file, the type and age of the equipment, and the institution selected. A broker confirms real terms after reviewing your file.",
    cta: "Have a broker confirm it",
  },
  proof: {
    eyebrow: "The firm in numbers",
    heading: "Where we stand today",
    body: "Versa Capital was founded in 2022 and has acted since as a growth catalyst for local businesses.",
    stats: [
      {
        value: 19,
        suffix: "",
        label: "Brokers",
        note: "Spread across Quebec",
      },
      {
        value: 21,
        suffix: "",
        label: "Team members",
        note: "Brokerage and administrative support",
      },
      {
        value: 14,
        suffix: "",
        label: "Equipment sectors",
        note: "From construction to medical",
      },
      {
        value: 2022,
        suffix: "",
        label: "Year founded",
        note: "Based in Saint-Augustin-de-Desmaures",
      },
    ],
  },
  process: {
    eyebrow: "How it works",
    heading: "What an application looks like",
    body: "Four steps, one point of contact. You only file the paperwork once.",
    steps: [
      {
        title: "You describe the project",
        body: "By phone, by email or through the form. The equipment, an approximate amount and your timeline are enough to get started.",
      },
      {
        title: "A broker calls you back within 24 hours",
        body: "They confirm your needs, your financial situation and which solution actually holds up before approaching any institution.",
      },
      {
        title: "We shop and negotiate",
        body: "Your file goes to our financial partners. We negotiate rates and terms, then come back to you with offers you can compare side by side.",
      },
      {
        title: "You sign, the equipment runs",
        body: "We coordinate the paperwork between the selected institution and your supplier, through to disbursement.",
      },
    ],
  },
  equipment: {
    eyebrow: "Equipment we finance",
    heading: "What we finance",
    body: "Fourteen equipment categories, new or used. If your asset is not on the list, it is still worth a call.",
    filterAll: "All sectors",
    filterLabel: "Filter by sector",
    searchPlaceholder: "Search equipment…",
    empty: "No category matches that search.",
    countOne: "1 category shown",
    countMany: "{n} categories shown",
    notListed: "Equipment not on the list?",
    notListedCta: "Ask us anyway",
    categories: [
      {
        slug: "construction",
        name: "Construction equipment",
        examples: "Excavators, loaders, lifts, formwork, compactors",
        sector: "Construction",
      },
      {
        slug: "excavation",
        name: "Excavation equipment",
        examples: "Excavators, dozers, graders, rock breakers",
        sector: "Construction",
      },
      {
        slug: "manutention",
        name: "Handling equipment",
        examples: "Forklifts, pallet jacks, conveyors, stackers",
        sector: "Industrial",
      },
      {
        slug: "transport",
        name: "Transport equipment",
        examples: "Heavy trucks, road tractors, dump trucks",
        sector: "Transportation",
      },
      {
        slug: "foresterie",
        name: "Forestry equipment",
        examples: "Harvesters, skidders, forwarders, chippers",
        sector: "Resources",
      },
      {
        slug: "agricole",
        name: "Agricultural equipment",
        examples: "Tractors, harvesters, seeders, milking systems",
        sector: "Resources",
      },
      {
        slug: "remorques",
        name: "Trailers",
        examples: "Dry vans, flatbeds, dump trailers, tankers",
        sector: "Transportation",
      },
      {
        slug: "atelier-automobile",
        name: "Automotive workshop equipment",
        examples: "Vehicle lifts, wheel balancers, diagnostic benches",
        sector: "Commercial",
      },
      {
        slug: "medical-dentaire",
        name: "Medical and dental equipment",
        examples: "Chairs, imaging, sterilizers, surgical equipment",
        sector: "Health",
      },
      {
        slug: "informatique",
        name: "Computer equipment",
        examples: "Servers, workstations, networking, bundled licences",
        sector: "Office",
      },
      {
        slug: "imprimerie",
        name: "Printing equipment",
        examples: "Digital presses, folders, cutters, finishing",
        sector: "Commercial",
      },
      {
        slug: "esthetique",
        name: "Aesthetic equipment",
        examples: "Lasers, treatment devices, clinic furniture",
        sector: "Health",
      },
      {
        slug: "industriel",
        name: "Industrial equipment",
        examples: "Machine tools, CNC, robotics, production lines",
        sector: "Industrial",
      },
      {
        slug: "gym",
        name: "Gym equipment",
        examples: "Cardio, weight racks, free weights",
        sector: "Commercial",
      },
    ],
  },
  about: {
    eyebrow: "The firm",
    heading: "Who is behind Versa Capital",
    body: "Since 2022, our advisory firm has acted as a growth catalyst for businesses looking for the right financing. Our objective is to identify and negotiate the best terms available on the market based on your needs.",
    valuesHeading: "Our values",
    values: [
      {
        title: "Integrity",
        body: "We present offers as they are, including the parts that do not work in your favour. It is the only way to build a relationship that outlasts a single transaction.",
      },
      {
        title: "Simplicity",
        body: "One file, one contact, plain language. You should not have to learn our vocabulary to understand your own financing.",
      },
      {
        title: "Commitment",
        body: "We stay on the file through to disbursement, and we still answer afterward. Far more than a financial intermediary.",
      },
    ],
    teamHeading: "A team of 21, including 19 brokers",
    teamBody:
      "Our brokers are spread across Quebec, backed by an administrative team. We support clients in construction, agriculture, transportation and forestry, and we align each financing solution with what they are actually trying to build.",
    sisterHeading: "A family of companies",
    sisterBody:
      "Versa Capital shares the visual world and the energy of Versa Équipements, its sister company. That relationship is also what gives us dealer-level terms with our financial partners.",
  },
  faq: {
    eyebrow: "Frequently asked questions",
    heading: "The questions we get most",
    body: "If your question is not here, a broker will answer it directly by phone.",
    items: [
      {
        question: "Why work with Versa Capital?",
        answer:
          "Our values set us apart: integrity, simplicity, commitment and an impeccable customer experience. In practice, you get one contact who stays on the file from the first call through to disbursement.",
      },
      {
        question: "Why use a broker instead of my own bank?",
        answer:
          "As owners and partners of equipment dealerships, we have access to favourable terms through our financial partners. You file one application instead of five, and we compare the offers for you. You save time and money.",
      },
      {
        question: "What are your financing solutions?",
        answer:
          "Leasing, conditional sales contracts, factoring and refinancing, plus term loans and a line of credit service. All your financing solutions under one roof.",
      },
      {
        question: "What equipment do you finance?",
        answer:
          "We finance a variety of equipment across construction, transportation, forestry, agriculture, industrial, medical and dental, office and more. The Equipment section lists all fourteen categories.",
      },
      {
        question: "How do I apply for financing?",
        answer:
          "By phone at 1-833-508-3772, by email at info@versacapital.ca, or through the online form. A consultant calls you back within 24 hours to assess your needs and answer your questions.",
      },
      {
        question: "Do you finance used equipment?",
        answer:
          "Yes. Our plans cover both new and used equipment. The age and type of asset affect the terms available, which a broker confirms with you on the first call.",
      },
    ],
    stillHave: "Still have a question?",
    stillHaveCta: "Talk to a broker",
  },
  form: {
    eyebrow: "Financing application",
    heading: "Request a quote",
    body: "Fill this out and a broker calls you back within 24 hours. No commitment.",
    name: "Full name",
    company: "Company",
    email: "Email",
    phone: "Phone",
    amount: "Amount of financing required",
    amountPlaceholder: "Select a range",
    service: "Solution you are interested in",
    servicePlaceholder: "Select a solution",
    comments: "Details about your project",
    commentsPlaceholder:
      "Equipment type, supplier, timeline… anything that helps us prepare for the call.",
    submit: "Send my request",
    submitting: "Sending…",
    successTitle: "Request received",
    successBody:
      "Thank you. A broker will call you back within 24 hours. If your file is urgent, call us directly at 1-833-508-3772.",
    successAgain: "Send another request",
    demoBody:
      "Form validated. This demo version does not send the request yet: the form will be wired to the inbox or CRM you choose. To reach a broker now, call 1-833-508-3772.",
    errorTitle: "Submission failed",
    errorBody:
      "Something went wrong. Please try again, or call us at 1-833-508-3772.",
    required: "This field is required",
    invalidEmail: "Enter a valid email address",
    privacy:
      "Your contact details are used only to process this financing request.",
    amountRanges: [
      "$1,000 to $25,000",
      "$25,001 to $50,000",
      "$50,001 to $100,000",
      "$100,001 to $250,000",
      "$250,001 and up",
    ],
  },
  contact: {
    eyebrow: "Contact",
    heading: "Let's talk about your project",
    body: "One place to find the best financing solution, whatever the asset being financed.",
    phoneLabel: "Phone",
    emailLabel: "Email",
    officeLabel: "Office",
    office:
      "110 rue de Singapour, Suite 101\nSaint-Augustin-de-Desmaures, Quebec G3A 0P5",
    hoursLabel: "Hours",
    hours: "Monday to Friday, 8 a.m. to 5 p.m.",
    responseLabel: "Response time",
    response: "A callback within 24 business hours",
  },
  footer: {
    tagline: "For today's projects. And tomorrow's connections.",
    blurb:
      "Commercial equipment financing advisory firm, based in Saint-Augustin-de-Desmaures and active across Quebec.",
    solutionsHeading: "Solutions",
    companyHeading: "The firm",
    contactHeading: "Get in touch",
    rights: "Versa Capital Inc. All rights reserved.",
    hosted: "Hosted in Quebec",
    prototypeNotice:
      "Redesign prototype prepared by Code sur Mesure. This is not the official site.",
  },
};
