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
  demo?: string;
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
    footerLabel: "Contact",
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
      "Intentional Living",
      "Fan Communities",
      "Neurodivergent Folks",
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
    body: "Fast, accessible, and built to last. No monthly platform fees, no template lock-in, and no fragile plugin pileups. You get a site that feels like you and that you own outright.",
  },
  {
    icon: "Sparkles",
    title: "Animation & Motion",
    body: "Personality-forward design with thoughtful motion that adds delight and guides attention. Every effect is there for a reason, never just noise, and always includes a reduced-motion fallback.",
  },
  {
    icon: "Accessibility",
    title: "Accessibility-First",
    body: "WCAG 2.2 AA is the floor, with AAA patterns where practical. Keyboard navigation, semantic HTML, and clear structure are built in from day one, not patched in later.",
  },
  {
    icon: "Gamepad2",
    title: "Browser-Based Games",
    body: "I love building interactive, game-like websites where we break the mold and make something new and exciting. These are my favorite projects: playful, surprising, and still clear and accessible.",
  },
  {
    icon: "Search",
    title: "Finding Your Vision",
    body: "If your idea is messy, weird, or still forming, that is welcome here. We shape your direction together, then build a site with personality, clarity, and room for your dreams to breathe.",
  },
  {
    icon: "LayoutGrid",
    title: "Off Paid Platforms",
    body: "Move off WordPress, Squarespace, or any platform charging monthly for things you should own. You keep your content, domain, and history - just without recurring lock-in or platform dependency.",
  },
];

export const work: WorkItem[] = [
  {
    title: "Astrid Beauty Hair Salon",
    status: "In Production",
    description:
      "A production website for Astrid Beauty Salon, originally hand-built for a client with real customers. Rebuilt in 2026 as a full refactor and redesign. Focused on clear service presentation, pricing guidance, and a low-friction path to booking - with accessible markup and SEO-friendly structure throughout.",
    demo: "https://www.byastridbeautysalon.com/",
    image: "/images/astrid.png",
    imageAlt:
      "Screenshot of the Astrid Beauty Hair Salon website showing service listings and booking information",
  },
  {
    title: "No Whiteboard Dashboard",
    status: "In Production",
    description:
      "A frontend dashboard built on the open-source Hiring Without Whiteboards dataset, turning a large markdown company list into a fast, searchable web experience. Includes full-text search, multi-filtering, card and list view modes, pagination, dark and light themes, and mobile-first navigation.",
    demo: "https://no-wb.org",
    image: "/images/no-wb.png",
    imageAlt:
      "Screenshot of the No Whiteboard Jobs Dashboard showing a searchable list of tech companies that don't whiteboard in interviews",
  },
  {
    title: "JC Auto Body",
    status: "In Production",
    description:
      "A website for JC Auto Body, a locally owned family-run auto body shop in Chantilly, Virginia. Originally built in 2020, then fully refactored from a Next.js and Firebase setup into a simpler Astro and Vercel static architecture. The rebuild prioritized WCAG 2.2 accessibility and responsive behavior across devices.",
    demo: "https://jcautobodyva.com/",
    image: "/images/jc-auto-body.png",
    imageAlt:
      "Screenshot of the JC Auto Body website showing service information and contact details",
  },
  {
    title: "Siren Song Shop",
    status: "In Development",
    description:
      "A curated recommendation platform built as a trust-first alternative to affiliate-heavy shopping sites. Siren Song centers personally vetted picks, local resources, and practical guides, with Astro Content Collections and Keystatic powering fast editorial updates. Designed for WCAG-aware accessibility, clean SEO structure, and strong performance across mobile and desktop.",
    demo: "https://sirensongshop.com/",
    image: "/images/siren-song.png",
    imageAlt:
      "Screenshot of the Siren Song website showing curated product recommendations and local resources for sustainable living",
  },
  {
    title: "Ghostbusters Virginia",
    status: "In Development",
    description:
      "A community-focused website for Ghostbusters Virginia, refactored into a modern Astro site. Includes event listings, curated image galleries with a lightbox, news and media pages, and an integrated contact and booking flow. Prioritizes accessibility, SEO-friendly structure, and mobile-first performance.",
    demo: "https://ghostbustersva.vercel.app/",
    image: "/images/gbva.png",
    imageAlt:
      "Screenshot of the Ghostbusters Virginia community website showing event listings and team information",
  },
];

export const faqs: FaqItem[] = [
  {
    q: "How does pricing work?",
    a: "I use a hybrid model: free when funding is tight, sliding scale when a project can contribute. No one is turned away for lack of funds. If your organization has a budget, your contribution helps me keep offering fully free work to others. Third-party costs like domains are still paid directly by you.",
  },
  {
    q: "How do you decide free vs. sliding scale?",
    a: "Case by case, based on budget reality, project scope, and impact. If your resources are limited, we can keep it fully free. If you have a budget, we can agree on a sliding-scale contribution that feels fair and keeps the work sustainable.",
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
    a: "Yes, if you ever need something updated, just message me and I'll handle it. If you'd prefer to manage content on your own, I can set up an easy content management system similar to what you may know from WordPress — no coding required. Either way works.",
  },
  {
    q: "Is the site accessible and good for SEO?",
    a: "Both are built in from the start, not added as an afterthought. I target WCAG 2.2 AA accessibility as a minimum and follow current SEO best practices throughout. That said, web standards evolve over time - and since this is volunteer work, I can't guarantee the site will always be fully current as things change. I do my best, and I'll always be honest about limitations.",
  },
  {
    q: "How long does a project take?",
    a: "I typically turn a site around within five days once I've started on it. That said, I work when I'm available - I take on projects based on fit and bandwidth, and I can't commit to hard deadlines or delivery guarantees. If I take on your project, I'll be upfront about timing from the start.",
  },
];
