import Link from "next/link";
import { ArrowLeft, Zap, HelpCircle, ShieldAlert, Award, FileText, HeartHandshake } from "lucide-react";
import { notFound } from "next/navigation";

// Generate static params for the router
export function generateStaticParams() {
  return [
    { slug: "about" },
    { slug: "story" },
    { slug: "careers" },
    { slug: "press" },
    { slug: "privacy" },
    { slug: "terms" },
    { slug: "help" },
    { slug: "returns" }
  ];
}

interface InfoContent {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  headline: string;
  paragraphs: string[];
  details?: { label: string; value: string | string[] }[];
}

const infoData: Record<string, InfoContent> = {
  about: {
    title: "About Us",
    icon: Zap,
    headline: "Redefining the modern e-commerce storefront.",
    paragraphs: [
      "Welcome to LOCO! We are a high-performance storefront designed to make product discovery and checkout as seamless as possible. Built on cutting-edge web technologies, our mission is to eliminate the clutter of traditional marketplaces and focus purely on what matters: premium products, honest pricing, and lightning-fast user experience.",
      "Our curated catalog of 110 items spans across Electronics, Fashion, Home, and Sports, bringing you the best budget and premium selections."
    ],
    details: [
      { label: "Corporate Entity", value: "LOCO India Corp" },
      { label: "Headquarters Address", value: ["123 Indigo Way, Sector 4", "Bangalore, KA 560001", "India"] },
      { label: "Contact Email", value: "corp@loco.com" },
      { label: "Phone Support", value: "+91 80 5555 9283 (Mon-Fri)" }
    ]
  },
  story: {
    title: "Our Story",
    icon: HeartHandshake,
    headline: "From a simple storefront to a high-speed shopping wave.",
    paragraphs: [
      "LOCO was founded in 2024 by a team of design enthusiasts and web performance engineers. We were frustrated by slow loading times, cluttered visual layouts, and dark, high-friction checkout flows on mainstream retail sites.",
      "We decided to build a platform that focuses on spacious, clean, and light layouts, allowing products to speak for themselves. Every micro-animation, index lookup, and database write is optimized to keep your shopping wave moving forward."
    ],
    details: [
      { label: "Founded Year", value: "2024" },
      { label: "Our Core Vision", value: "Spacious Visuals, Optimized Database Speeds, Zero Clutter" }
    ]
  },
  careers: {
    title: "Careers",
    icon: Award,
    headline: "Join a fast-moving, customer-first engineering culture.",
    paragraphs: [
      "At LOCO, we're always looking for talented developers, designers, and supply chain operators to help scale our high-speed e-commerce platform.",
      "We operate under a remote-first model with hubs in Bangalore, SF, and London. If you care about building pixel-perfect interfaces, ultra-fast SQLite write optimizations, or smooth UI transitions, we'd love to hear from you."
    ],
    details: [
      { label: "Open Roles", value: ["Senior Next.js Developer (Remote)", "UI/UX Designer - Light Theme Expert", "Database Performance Engineer (SQLite/Prisma)"] },
      { label: "How to Apply", value: "Send your CV to careers@loco.com" }
    ]
  },
  press: {
    title: "Press Relations",
    icon: HelpCircle,
    headline: "LOCO media resources, updates, and releases.",
    paragraphs: [
      "Get the latest announcements, brand kit resources, and official press releases for LOCO.",
      "For press inquiries, brand assets, or review samples of our premium product lines, please reach out to our media relations coordinator."
    ],
    details: [
      { label: "Media Contact", value: "press@loco.com" },
      { label: "Brand Kit", value: "Download logo vectors and theme colors (upon request)" }
    ]
  },
  privacy: {
    title: "Privacy Policy",
    icon: ShieldAlert,
    headline: "Your personal data is protected and private.",
    paragraphs: [
      "We respect your privacy. LOCO does not track your personal details, browsing history, or payment methods outside of what is required to process and dispatch your active order.",
      "All account credentials are encrypted using bcrypt (12 rounds) and secure NextAuth session headers to prevent data leakages."
    ],
    details: [
      { label: "Data Controller", value: "LOCO Security Team" },
      { label: "Compliance", value: "GDPR & Digital Personal Data Protection Act compliant" }
    ]
  },
  terms: {
    title: "Terms of Service",
    icon: FileText,
    headline: "Standard terms and conditions for using LOCO.",
    paragraphs: [
      "By using the LOCO storefront, you agree to buy products strictly for personal use. All stock levels, prices, and discounts displayed are active and correct.",
      "Our secure checkout process is encrypted. We reserve the right to cancel orders in case of suspected fraudulent activity."
    ],
    details: [
      { label: "Last Updated Date", value: "June 2026" },
      { label: "Jurisdiction", value: "High Court of Karnataka, Bangalore" }
    ]
  },
  help: {
    title: "Help Center",
    icon: HelpCircle,
    headline: "Frequently Asked Questions & Support Tickets.",
    paragraphs: [
      "Find quick answers to common checkout, shipment, and login issues.",
      "Our demo user credentials are: email: 'demo@shopwave.com' and password: 'demo1234'. You can use these credentials to sign in and test the cart checkout functionality."
    ],
    details: [
      { label: "Support Ticket Email", value: "support@loco.com" },
      { label: "Typical Response Time", value: "Within 2-4 business hours" }
    ]
  },
  returns: {
    title: "Returns & Exchanges",
    icon: HeartHandshake,
    headline: "Simple, hassle-free returns within 30 days.",
    paragraphs: [
      "Changed your mind? No problem. LOCO offers a complete 30-day return policy for all unused products in their original packaging.",
      "Once you initiate a return through the Help Center, a delivery partner will pick up the item within 48 hours. Refunds are processed immediately upon inspection."
    ],
    details: [
      { label: "Return Period", value: "30 Days from delivery date" },
      { label: "Refund Processing Time", value: "3-5 Business days to source payment" }
    ]
  }
};

interface InfoPageProps {
  params: Promise<{ slug: string }>;
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { slug } = await params;
  const content = infoData[slug];

  if (!content) {
    notFound();
  }

  const IconComponent = content.icon;

  return (
    <div className="mx-auto w-full px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/#products" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to shop
      </Link>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-orange-600">
            <IconComponent size={20} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">LOCO Info</span>
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900">{content.title}</h1>
        <p className="text-lg font-semibold text-gray-700">{content.headline}</p>
        
        <div className="space-y-4">
          {content.paragraphs.map((p, idx) => (
            <p key={idx} className="text-gray-600 leading-7 text-sm">
              {p}
            </p>
          ))}
        </div>

        {content.details && (
          <div className="border-t border-gray-100 pt-6 mt-6 space-y-4 text-sm">
            <h2 className="font-black uppercase tracking-wider text-gray-900 text-base">Key Details</h2>
            <div className="grid gap-4 sm:grid-cols-2 text-gray-600">
              {content.details.map((detail, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl border border-gray-200/50 p-4">
                  <p className="font-bold uppercase tracking-wide text-gray-800 mb-1">{detail.label}</p>
                  {Array.isArray(detail.value) ? (
                    <ul className="list-disc pl-4 space-y-0.5">
                      {detail.value.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{detail.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
