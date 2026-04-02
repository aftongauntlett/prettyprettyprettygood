export interface WhoIWorkWithGroup {
  label: string;
  color: "primary" | "accent";
  items: string[];
}

export interface ServiceItem {
  icon:
    | "Palette"
    | "Sparkles"
    | "Accessibility"
    | "Gamepad2"
    | "Search"
    | "LayoutGrid";
  title: string;
  body: string;
}

export interface WorkItem {
  title: string;
  status: "In Production" | "In Development";
  description: string;
  tech: string[];
  link: string;
  demo: string;
  image: string;
  imageAlt: string;
}

export interface FaqLink {
  label: string;
  href: string;
}

export interface FaqItem {
  q: string;
  a: string;
  links?: FaqLink[];
}

export interface NavItem {
  label: string;
  href: string;
  section: string;
  footerLabel?: string;
}

export const primaryNavItems: NavItem[] = [
  { label: "About", href: "/#who", section: "who" },
  { label: "Services", href: "/#services", section: "services" },
  { label: "Work", href: "/#work", section: "work" },
  { label: "FAQ", href: "/#faq", section: "faq" },
  {
    label: "Contact",
    href: "/#contact",
    section: "contact",
    footerLabel: "Start a project",
  },
];

export const whoIWorkWith: WhoIWorkWithGroup[] = [
  {
    label: "Community & Cause",
    color: "primary",
    items: [
      "Nonprofits",
      "Civic Orgs",
      "Mutual Aid",
      "Animal Welfare",
      "Housing Orgs",
      "Intentional Communities",
      "Fan Communities",
    ],
  },
  {
    label: "Arts & Culture",
    color: "accent",
    items: [
      "Musicians",
      "Artists",
      "Photographers",
      "Galleries",
      "Museums",
      "Game Studios",
      "Theaters",
      "Writers",
    ],
  },
  {
    label: "Care & Healing",
    color: "accent",
    items: [
      "Therapists",
      "Counselors",
      "Herbalists",
      "Acupuncturists",
      "Community Health Workers",
      "Midwives",
      "Harm Reduction",
    ],
  },
  {
    label: "Practice & Profession",
    color: "primary",
    items: [
      "Law Firms",
      "Veterinarians",
      "Private Practices",
      "Solo Practitioners",
      "Co-ops",
      "Farmers Markets",
    ],
  },
];

export const services: ServiceItem[] = [
  {
    icon: "Palette",
    title: "Custom Static Sites",
    body: "Fast, accessible, built to last. No monthly fees, no CMS lock-in - just a site you own outright.",
  },
  {
    icon: "Sparkles",
    title: "Animation & Motion",
    body: "Personality-forward design with thoughtful motion. Delightful, not distracting - and always with a no-motion fallback.",
  },
  {
    icon: "Accessibility",
    title: "Accessibility-First",
    body: "WCAG 2.2 AA as the floor, AAA where practical. Clear UI, keyboard navigation, and semantic HTML for everyone.",
  },
  {
    icon: "Gamepad2",
    title: "Browser-Based Games",
    body: "Your website can be a game. Interactive experiences, playful interfaces, or a full-blown browser game - all of the above.",
  },
  {
    icon: "Search",
    title: "Finding Your Vision",
    body: "Don't know what you need yet? That's fine - the best part. We figure out what your web presence could be, then build it.",
  },
  {
    icon: "LayoutGrid",
    title: "Off Paid Platforms",
    body: "Migrating you off WordPress, Squarespace, or anything else charging you monthly for things you should just own.",
  },
];

export const work: WorkItem[] = [
  {
    title: "No Whiteboard Dashboard",
    status: "In Production",
    description:
      "A frontend dashboard built on the open-source Hiring Without Whiteboards dataset, turning a large markdown company list into a fast, searchable web experience. Includes full-text search, multi-filtering, card and list view modes, pagination, dark and light themes, and mobile-first navigation.",
    tech: ["Astro", "TypeScript", "Tailwind CSS", "Vercel"],
    link: "https://github.com/aftongauntlett/no-whiteboard-jobs-dashboard",
    demo: "https://no-wb.org",
    image: "/images/no-wb.png",
    imageAlt:
      "Screenshot of the No Whiteboard Jobs Dashboard showing a searchable list of tech companies that don't whiteboard in interviews",
  },
  {
    title: "Astrid Beauty Hair Salon",
    status: "In Production",
    description:
      "A production website for Astrid Beauty Salon, originally hand-built for a client with real customers. Rebuilt in 2026 as a full refactor and redesign. Focused on clear service presentation, pricing guidance, and a low-friction path to booking - with accessible markup and SEO-friendly structure throughout.",
    tech: ["Astro", "TypeScript", "Tailwind CSS", "Vercel"],
    link: "https://github.com/aftongauntlett/astrid-beauty",
    demo: "https://www.byastridbeautysalon.com/",
    image: "/images/astrid.png",
    imageAlt:
      "Screenshot of the Astrid Beauty Hair Salon website showing service listings and booking information",
  },
  {
    title: "Ghostbusters Virginia",
    status: "In Development",
    description:
      "A community-focused website for Ghostbusters Virginia, refactored into a modern Astro site. Includes event listings, curated image galleries with a lightbox, news and media pages, and an integrated contact and booking flow. Prioritizes accessibility, SEO-friendly structure, and mobile-first performance.",
    tech: ["Astro", "TypeScript", "Keystatic", "Vercel"],
    link: "https://github.com/aftongauntlett/ghostbustersva",
    demo: "",
    image: "/images/gbva.png",
    imageAlt:
      "Screenshot of the Ghostbusters Virginia community website showing event listings and team information",
  },
];

export const faqs: FaqItem[] = [
  {
    q: "Is this actually free? What's the catch?",
    a: "It's genuinely free. I do this because I believe in the work organizations like yours do, and a good website shouldn't require a small fortune or be a painful process. The only things that ever cost money are third-party services you choose to use - like a domain name - and you pay those directly. No invoices from me, ever.",
  },
  {
    q: "Why do you do this for free?",
    a: "Two reasons, honestly. First, I genuinely want to help - a lot of people don't have a website simply because the idea feels expensive and overwhelming, and I want to change that for whoever I can. Second, running a traditional design business wasn't good for me. The billing, the deadlines, the client meetings - it took the joy out of the work. Doing this on my own terms, in a way that feels meaningful, is how I stay sane. I do appreciate support. But I never expect it, and I never want anyone to feel obligated. Please don't pay me during a project. If later on you notice a real impact on your organization and you want to say thank you, a donation is always welcome. Only if you can afford it, and only if you feel I earned it.",
    links: [
      { label: "Ko-fi", href: "https://ko-fi.com/prettyprettyprettygood" },
      { label: "PayPal", href: "https://paypal.me/aftons" },
    ],
  },
  {
    q: "Do I need a domain? What does that cost?",
    a: "If you don't have one, I can help you find and register one. Domains typically run $10-20 per year depending on the extension - you'd pay that directly to the registrar, no markup from me. If you already have a domain somewhere, I can help move it over at no cost.",
  },
  {
    q: "Who owns the website after it's built?",
    a: "You do - fully. Everything is set up in your name: the domain, the hosting account, the code. I don't retain access or hold anything on your behalf. The moment your site goes live, it belongs to you outright. You're never dependent on me to keep it running.",
  },
  {
    q: "Can I update the site myself?",
    a: "Yes, if you want to. I use Keystatic - a lightweight content management system similar in simplicity to WordPress, but without the bloat or monthly fees. You can swap images, update text, change links, and more without touching any code. The only requirement is a free GitHub account. If you'd rather not deal with any of that, no problem - I'll build the site and you can email me whenever something needs updating.",
  },
  {
    q: "Can you help set up Google Business?",
    a: "Yes. If you need a Google Business Profile so you show up on Maps and in local search results, I can walk you through setting that up. It's free and makes a real difference for discoverability.",
  },
  {
    q: "Is the site accessible and good for SEO?",
    a: "Both are built in from the start, not added as an afterthought. I target WCAG 2.2 AA accessibility as a minimum and follow current SEO best practices throughout. That said, web standards evolve over time - and since this is volunteer work, I can't guarantee the site will always be fully current as things change. I do my best, and I'll always be honest about limitations.",
  },
  {
    q: "How long does a project take?",
    a: "I typically turn a site around within five days once I've started on it. That said, I work when I'm available - I take on projects based on fit and bandwidth, and I can't commit to hard deadlines or delivery guarantees. If I take on your project, I'll be upfront about timing from the start.",
  },
  {
    q: "Are you available after the site launches?",
    a: "Yes. I'm around for support, small updates, and questions after launch - I want the handoff to feel good, not abrupt. This is volunteer work, though, so please be mindful of that. I'll always communicate clearly about my availability and won't leave you without a heads-up if I need to step back.",
  },
  {
    q: "Do you use AI?",
    a: "Yes. I've been a developer for six years, including time with Fortune 500 teams, and I remember the Stack Overflow marathon days well. It's a tool I use deliberately, not a shortcut I lean on blindly. One practical thing worth knowing: if you'd like me to write or pre-fill content for your website, I'll use AI to help with that. I'm a developer, not a copywriter, and I'd rather be honest about that than overpromise. AI-drafted copy will be coherent - but it won't know your organization the way you do. I'd strongly encourage you to provide your own content or, at minimum, read through and revise whatever I draft. Your voice matters, and no tool can replicate it.",
  },
];
