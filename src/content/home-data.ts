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
  a: string | string[];
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
  {
    label: "Contact",
    href: "/#contact",
    section: "contact",
    footerLabel: "Contact",
  },
  { label: "FAQ", href: "/#faq", section: "faq" },
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
    status: "In Production",
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
    demo: "https://gbva-site.vercel.app/",
    image: "/images/gbva.png",
    imageAlt:
      "Screenshot of the Ghostbusters Virginia community website showing event listings and team information",
  },
];

export const faqs: FaqItem[] = [
  {
    q: "How do you decide free vs. sliding scale?",
    a: "I use a hybrid model and decide case by case based on budget reality, scope, and impact. If funds are tight, we can keep it fully free. If your organization has budget, we can agree on a fair sliding-scale contribution that helps sustain free work for others. Third-party costs like domains are always paid directly by you.",
  },
  {
    q: "Do I need a domain? What does that cost?",
    a: "If you don't have one, I can help you find and register one. Domains typically run $10-20 per year depending on the extension - you'd pay that directly to the registrar, no markup from me. If you already have a domain somewhere, I can help move it over at no cost.",
  },
  {
    q: "Do you build more complex websites?",
    a: "Yes - I can build more complex projects with things like login/auth flows, storefronts, booking calendars, backend services, and databases. Those builds involve significantly more planning and maintenance, so they are available as paid projects, not under the free option.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on scope. Smaller sites can come together in a day; others take up to a week when there's back-and-forth on design choices or content. My current task load can affect timing too. I'll always be upfront about where things stand.",
  },
  {
    q: "Who owns the website after it's built?",
    a: "You do - fully. Everything is set up in your name: the domain, the hosting account, and the code. Once it's handed off, it's yours. If you want updates later, you can still reach out and I can help with edits by request.",
  },
  {
    q: "Do I need to manage website edits myself?",
    a: "No - the main benefit for most clients is that I handle edits for you. Just send me what you want changed by email, text, or call, and I will take care of it. You never need to learn code, log into a CMS, or manage technical tools unless you want to. If helpful, I can also set up a simple password-protected request page for your site so submitting and tracking update requests is easy.",
  },
  {
    q: "What if I want to edit the website myself later?",
    a: "Yes. If you're code-savvy (or want to learn), I can walk you through making edits with GitHub so you can manage updates yourself. If you'd rather have a drag-and-drop style CMS (similar to WordPress), I can build that too - but that setup is outside the free offer.",
  },
  {
    q: "Is the site accessible and good for SEO?",
    a: "I design toward WCAG 2.2 AA and follow current SEO best practices throughout, then validate with automated checks and manual QA before handoff. I don't make legal-style compliance guarantees, because standards and site content can change over time - but accessibility and search performance are always core requirements in my process.",
  },
  {
    q: "Can you help with Google Business, Analytics, or other free tools?",
    a: "Yes - if you want help setting up Google Business Profile, Google Analytics, or similar free tools, I'm happy to walk you through it. These are straightforward to configure and genuinely useful for visibility and insight. I don't assist with ad campaigns or paid advertising of any kind, and I won't put ads on your site.",
  },
  {
    q: "Do you use AI?",
    a: [
      "<strong>For development:</strong> Yes, I have 6 years of professional development experience at Fortune 500 companies and remember the Stack Overflow days well. I consider myself a frontend developer, but I'm comfortable across the stack. I wouldn't offer these services if I didn't feel confident handing something off. I'm not a vibe-coder - but AI has become a meaningful part of my workflow. If that makes you uneasy, I completely understand, which is exactly why I'm being transparent about it.",
      "<strong>For art, images, and assets:</strong> I don't use AI to generate artwork, images, or audio - and I ask the same of you. Any assets you'd like on your site should come with a clear source: licensed work, original creations, or pieces you have explicit permission to display with proper attribution. This isn't about being difficult - it's about respecting artists and the people whose work makes the web worth looking at. This whole project is built on doing right by people, and that includes creators.",
      "<strong>For your written content:</strong> I can use AI to help generate page copy, and it does a decent job with a good prompt. That said, I always recommend writing your own - no one can tell your story better than you. If you do want AI-generated content, that's completely fine, but you're responsible for reviewing it and making sure it's accurate and properly reflects your voice and intentions.",
    ],
  },
];
