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
  status: "Live Site" | "In Progress";
  description: string;
  demo?: string;
  image: string;
  imageLight?: string;
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

export interface FaqCallout {
  heading: string;
  body: string;
  link: FaqLink;
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
    title: "GAM[fest]",
    status: "In Progress",
    description:
      "A custom-coded recap site for GAM[fest], a Baltimore community festival celebrating games, art, and music on a giant LED billboard. Designed to feel like a playful arcade experience while still making the event story, photos, and community energy easy to explore on any device.",
    demo: "https://gamfest-demo.vercel.app/",
    image: "/images/gamfest.png",
    imageLight: "/images/gamfest-light.png",
    imageAlt:
      "Screenshot of the GAM[fest] website showing the retro arcade-themed hero scene with the festival's billboard design",
  },
  {
    title: "Siren Song Shop",
    status: "Live Site",
    description:
      "A custom-built recommendation site for practical, trust-first shopping guides and local resources. The site is structured for fast publishing, strong search visibility, and a calm browsing experience that helps readers find useful picks without the clutter of affiliate-heavy platforms.",
    demo: "https://sirensongshop.com/",
    image: "/images/siren-song.png",
    imageLight: "/images/siren-song-light.png",
    imageAlt:
      "Screenshot of the Siren Song website showing curated product recommendations and local resources for sustainable living",
  },
  {
    title: "RCAN",
    status: "Live Site",
    description:
      "A nonprofit website for the Returning Citizens Assistance Network, a Washington, DC group supporting people re-entering society after incarceration. Built to make the mission clear, guide visitors toward donations and volunteering, and give partner congregations a stronger public home.",
    demo: "https://www.rcandc.org/",
    image: "/images/rcan.png",
    imageAlt:
      "Screenshot of the RCAN website showing the homepage hero and community impact information",
  },
  {
    title: "Ghostbusters Virginia",
    status: "Live Site",
    description:
      "A community-focused website for Ghostbusters Virginia, rebuilt as a faster custom site with clearer paths to events, media, bookings, and contact. The redesign makes it easier for fans, event organizers, and press to find what they need while keeping the group personality front and center.",
    demo: "https://ghostbustersva.com/",
    image: "/images/gbva.png",
    imageAlt:
      "Screenshot of the Ghostbusters Virginia community website showing event listings and team information",
  },
  {
    title: "Astrid Beauty Hair Salon",
    status: "Live Site",
    description:
      "A custom website for a working hair salon, redesigned to help new and returning clients understand services, review pricing guidance, and book with less friction. Built with clean, accessible structure so the business feels polished without depending on a template platform.",
    demo: "https://www.byastridbeautysalon.com/",
    image: "/images/astrid.png",
    imageLight: "/images/astrid-light.png",
    imageAlt:
      "Screenshot of the Astrid Beauty Hair Salon website showing service listings and booking information",
  },
  {
    title: "JC Auto Body",
    status: "Live Site",
    description:
      "A custom site for a family-run auto body shop in Chantilly, Virginia, built to make services, location details, and contact information easy to find. The latest rebuild simplified the architecture, improved accessibility, and made the site faster and more reliable across devices.",
    demo: "https://jcautobodyva.com/",
    image: "/images/jc-auto-body.png",
    imageAlt:
      "Screenshot of the JC Auto Body website showing service information and contact details",
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
    a: "That's an option too. If you're code-savvy (or want to learn), I can walk you through making edits with GitHub so you can manage updates yourself. If you'd rather have a drag-and-drop style CMS (similar to WordPress), I can build that too - but that setup is outside the free offer.",
  },
  {
    q: "Is the site accessible and good for SEO?",
    a: "I design toward WCAG 2.2 AA and follow current SEO best practices throughout, then validate with automated checks and manual QA before handoff. I don't make legal-style compliance guarantees, because standards and site content can change over time - but accessibility and search performance are always core requirements in my process.",
  },
  {
    q: "Can you help with Google Business, Analytics, or donation/payment tools?",
    a: "Yes - I'm happy to help set up Google Business Profile, Google Analytics, Donorbox, or similar free and low-cost tools, and embed the widgets directly on your site. I'm not a tax or legal expert though - I learn a bit more with every project, but I don't know your legal/nonprofit status, and if the tool becomes something you use, you should confirm your setup is right with an accountant or lawyer. I don't assist with ad campaigns or paid advertising of any kind, and I won't put ads on your site.",
  },
  {
    q: "What's your stance on AI?",
    a: "I think it's a genuinely impressive tool for coding, and I use it thoughtfully as part of my development process - the same way I'd use any other tool in my stack. Where I draw the line is art, music, and other creative media: I don't use it to generate artwork, images, or audio, and I ask the same of you. Any assets on your site should come from a clear source: licensed work, original creations, or pieces you have explicit permission to use with proper attribution.",
  },
  {
    q: "Who are you?",
    a: "I'm a frontend-leaning full-stack engineer with 6 years of professional experience, including work as a lead engineer at Fortune 500 companies supporting mission-critical government programs. I hold an active TS/SCI clearance and Security+ certification, and I've spent that time leading migrations, refactors, and system designs on work where getting it right is imperative. My time with the DoD was invaluable, but I stepped away from the cleared industry to focus on this project, where my skills could be used for doing good and bringing joy into the world - for love, not war. This is where I get to bring that same level of craft to people and causes that build something good, without the corporate overhead.",
  },
];

export const faqCallout: FaqCallout = {
  heading: "Are you a designer or illustrator?",
  body: "I'd love to team up with an artist on illustrations, sprites, logos, and other visual assets for client projects.",
  link: { label: "Get in touch", href: "/#contact" },
};
