import os

pages_data = {
    "infrastructure": {
        "title": "Infrastructure",
        "icon": "Cpu",
        "color": "text-blue-400",
        "desc": "Our platform provides comprehensive, real-time visibility into your AWS infrastructure. Syncing via Boto3, we pull detailed metadata about your EC2 instances, S3 buckets, RDS databases, and Lambda functions to give you an unfiltered view of your multi-account environment."
    },
    "cost-analytics": {
        "title": "Cost Analytics",
        "icon": "BarChart3",
        "color": "text-emerald-400",
        "desc": "Advanced ML models analyze your usage patterns to precisely forecast future cloud expenditures. Track daily spend across services and regions to eliminate waste before it happens."
    },
    "risk-intelligence": {
        "title": "Risk Intelligence",
        "icon": "ShieldCheck",
        "color": "text-red-400",
        "desc": "Automated analysis of your resources to find security vulnerabilities, misconfigurations, and idle assets. We evaluate instances for low CPU utilization, high memory consumption, and exposure risks."
    },
    "optimization": {
        "title": "Optimization",
        "icon": "Zap",
        "color": "text-amber-400",
        "desc": "Transform findings into action. Our engine provides contextual recommendations to right-size instances, terminate unused resources, and utilize more cost-effective instance families."
    },
    "documentation": {
        "title": "Documentation",
        "icon": "BookOpen",
        "color": "text-[#5B7AB5]",
        "desc": "Explore our comprehensive guides to learn how to connect your AWS accounts securely, configure synchronization schedules, and interpret dashboard analytics."
    },
    "api-reference": {
        "title": "API Reference",
        "icon": "FileCode2",
        "color": "text-purple-400",
        "desc": "Detailed documentation for developers looking to integrate with our FastAPI backend. Explore endpoints for retrieving instance metadata, updating cost reports, and manually triggering sync tasks."
    },
    "security": {
        "title": "Security Framework",
        "icon": "Lock",
        "color": "text-cyan-400",
        "desc": "Security is non-negotiable. Our platform operates strictly on ReadOnlyAccess IAM policies. All transit is encrypted via TLS 1.3, and database operations use advanced row-level security."
    },
    "about-us": {
        "title": "About the Project",
        "icon": "Users",
        "color": "text-indigo-400",
        "desc": "CloudIntel began as a capstone initiative to build a transparent, developer-focused FinOps tool. Our vision is to demystify complex billing and provide real infrastructure observability."
    },
    "contact-support": {
        "title": "Contact Support",
        "icon": "Mail",
        "color": "text-amber-500",
        "desc": "Need technical assistance? Our engineering team is standing by to help with IAM configurations, deployment issues, or customized compliance reports."
    },
    "help-center": {
        "title": "Help Center",
        "icon": "HelpCircle",
        "color": "text-teal-400",
        "desc": "Search our knowledge base for FAQs regarding AWS connectivity, Boto3 integration errors, or dashboard troubleshooting steps."
    },
    "privacy-policy": {
        "title": "Privacy Policy",
        "icon": "FileText",
        "color": "text-gray-400",
        "desc": "We commit to strict data handling practices. AWS metadata is securely processed locally and never sold to third parties. We collect only what is explicitly necessary for generating analytics."
    },
    "terms": {
        "title": "Terms of Service",
        "icon": "FileText",
        "color": "text-gray-400",
        "desc": "By utilizing this platform, you agree to our terms. The tool is provided as open-source software without guarantees. Always verify recommendations before executing changes in your AWS console."
    }
}

base_dir = "app"

for slug, data in pages_data.items():
    page_dir = os.path.join(base_dir, slug)
    os.makedirs(page_dir, exist_ok=True)
    
    # Write layout.tsx (Server component for Metadata)
    layout_content = f"""import type {{ Metadata }} from "next";

export const metadata: Metadata = {{
  title: "{data['title']} - Cloud Intelligence Platform",
  description: "{data['desc'][:150]}...",
}};

export default function Layout({{ children }}: {{ children: React.ReactNode }}) {{
  return <>{{children}}</>;
}}
"""
    with open(os.path.join(page_dir, "layout.tsx"), "w") as f:
        f.write(layout_content)
        
    # Write page.tsx (Client component for animations)
    page_content = f""""use client";

import {{ motion }} from "framer-motion";
import {{ Cloud, ArrowLeft, {data['icon']} }} from "lucide-react";
import {{ useRouter }} from "next/navigation";
import Link from "next/link";

export default function {slug.replace('-', '').capitalize()}Page() {{
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0A1929] text-white">
      <nav className="border-b border-white/5 bg-[#0A1929]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] rounded-xl flex items-center justify-center">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">cloudintel<span className="text-[#5B7AB5]">.</span></span>
          </Link>
          
          <button 
            onClick={{() => router.push('/')}}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{{{ opacity: 0, y: 30 }}}}
          animate={{{{ opacity: 1, y: 0 }}}}
          className="text-center mb-16"
        >
          <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8">
            <{data['icon']} className="w-12 h-12 {data['color']}" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            {data['title']}
          </h1>
        </motion.div>

        <motion.section
          initial={{{{ opacity: 0, y: 20 }}}}
          animate={{{{ opacity: 1, y: 0 }}}}
          transition={{{{ delay: 0.2 }}}}
          className="bg-white/5 border border-white/5 rounded-3xl p-8 md:p-12"
        >
          <p className="text-gray-400 text-xl leading-relaxed">
            {data['desc']}
          </p>
        </motion.section>

        {slug == 'contact-support' and '''<motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a 
            href="mailto:support@cloudintel.io" 
            className="inline-block bg-[#5B7AB5] text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#5B7AB5]/20 hover:bg-[#4A6FA5] transition-all"
          >
            Email Us Directly
          </a>
        </motion.div>''' or ''}
      </main>

      <footer className="py-10 border-t border-white/5 text-center text-gray-500 text-sm font-medium mt-auto relative bottom-0 w-full">
        <p>© 2026 Cloud Intelligence Platform.</p>
      </footer>
    </div>
  );
}}
"""
    with open(os.path.join(page_dir, "page.tsx"), "w") as f:
        f.write(page_content)

print("Created 12 specific pages and their layouts!")
