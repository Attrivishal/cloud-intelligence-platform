import os

pages_data = {
    "infrastructure": {
        "title": "Cloud Infrastructure",
        "subtitle": "Real-time visibility into your AWS ecosystem",
        "icon": "Cpu",
        "color": "from-blue-500 to-cyan-400",
        "bgColor": "bg-blue-500/10",
        "borderColor": "border-blue-500/20",
        "sections": [
            {
                "title": "Comprehensive Asset Discovery",
                "content": "Our platform automatically discovers and catalogs your entire AWS infrastructure across all accounts and regions. We maintain a real-time inventory of your EC2 instances, S3 buckets, RDS databases, and Lambda functions, ensuring you always have a complete picture of your cloud footprint.",
                "icon": "Search"
            },
            {
                "title": "Continuous Synchronization",
                "content": "Powered by advanced Boto3 integrations, our synchronization engine continuously polls AWS APIs to detect changes in state, configuration, and utilization. This ensures your dashboard reflects the ground truth of your infrastructure without manual intervention.",
                "icon": "RefreshCw"
            },
            {
                "title": "Multi-Account Architecture",
                "content": "Designed for the enterprise, CloudIntel seamlessly aggregates data from dozens or hundreds of AWS accounts into a single pane of glass. Cross-account IAM roles provide secure, read-only access without compromising your security posture.",
                "icon": "Layers"
            }
        ]
    },
    "cost-analytics": {
        "title": "Cost Analytics",
        "subtitle": "Precision financial intelligence for your cloud spend",
        "icon": "BarChart3",
        "color": "from-emerald-500 to-teal-400",
        "bgColor": "bg-emerald-500/10",
        "borderColor": "border-emerald-500/20",
        "sections": [
            {
                "title": "Granular Spend Tracking",
                "content": "Break down your AWS bill to the resource level. We categorize costs by service, region, tags, and custom business units, allowing you to accurately allocate cloud spend to specific teams or projects.",
                "icon": "DollarSign"
            },
            {
                "title": "Predictive Forecasting",
                "content": "Leveraging historical usage data and advanced machine learning models, our platform predicts your end-of-month spend with up to 98% accuracy. Anticipate budget overruns before they happen and proactively adjust resource allocation.",
                "icon": "TrendingUp"
            },
            {
                "title": "Anomaly Detection",
                "content": "Our automated anomaly detection engine monitors your billing data 24/7. When sudden spikes in spend occur—whether due to a misconfiguration or an application error—you receive instant alerts to investigate and mitigate the issue.",
                "icon": "AlertTriangle"
            }
        ]
    },
    "risk-intelligence": {
        "title": "Risk Intelligence",
        "subtitle": "Proactive security and compliance monitoring",
        "icon": "ShieldCheck",
        "color": "from-red-500 to-orange-400",
        "bgColor": "bg-red-500/10",
        "borderColor": "border-red-500/20",
        "sections": [
            {
                "title": "Security Posture Management",
                "content": "Continuously assess your AWS infrastructure against industry best practices and security frameworks. We automatically identify publicly accessible S3 buckets, overly permissive security groups, and unencrypted critical data.",
                "icon": "Lock"
            },
            {
                "title": "Utilization Risk Analysis",
                "content": "Identify instances and databases operating near peak capacity or experiencing unusual utilization patterns. By detecting performance bottlenecks early, you can prevent costly downtime and ensure application reliability.",
                "icon": "Activity"
            },
            {
                "title": "Compliance Reporting",
                "content": "Generate automated compliance reports for frameworks like SOC 2, HIPAA, and CIS Benchmarks. Maintain an audit trail of your cloud configuration state over time to simplify compliance workflows.",
                "icon": "FileCheck"
            }
        ]
    },
    "optimization": {
        "title": "Cloud Optimization",
        "subtitle": "Actionable insights to eliminate waste",
        "icon": "Zap",
        "color": "from-amber-400 to-orange-500",
        "bgColor": "bg-amber-500/10",
        "borderColor": "border-amber-500/20",
        "sections": [
            {
                "title": "Intelligent Right-Sizing",
                "content": "Our core analyzing engine evaluates historical CPU, memory, and network metrics to recommend the optimal instance types for your workloads. Downgrade underutilized instances without impacting application performance.",
                "icon": "Minimize2"
            },
            {
                "title": "Idle Resource Identification",
                "content": "Automatically identify and flag unattached EBS volumes, obsolete snapshots, unassociated Elastic IPs, and idle RDS instances. Terminating these zombie resources provides immediate and recurring cost savings.",
                "icon": "Trash2"
            },
            {
                "title": "Modernization Opportunities",
                "content": "Discover opportunities to modernize your architecture. Our platform suggests transitions from previous generation instances to current models, and highlights workloads that could benefit from serverless alternatives.",
                "icon": "Lightbulb"
            }
        ]
    },
    "documentation": {
        "title": "Documentation",
        "subtitle": "Comprehensive guides to master the platform",
        "icon": "BookOpen",
        "color": "from-[#5B7AB5] to-blue-400",
        "bgColor": "bg-[#5B7AB5]/10",
        "borderColor": "border-[#5B7AB5]/20",
        "sections": [
            {
                "title": "Getting Started Guides",
                "content": "Step-by-step tutorials to help you connect your first AWS account, configure your dashboard, and interpret the initial synchronization results. From zero to your first optimization recommendation in under 15 minutes.",
                "icon": "PlayCircle"
            },
            {
                "title": "Best Practices",
                "content": "Learn how top engineering teams leverage CloudIntel to automate FinOps processes. Discover advanced tagging strategies, budget alert configurations, and workflows for integrating optimization recommendations into your CI/CD pipeline.",
                "icon": "Award"
            },
            {
                "title": "Architecture Overview",
                "content": "Deep dive into how our platform operates securely within your environment. Understand the details of our cross-account IAM role implementation, data retention policies, and encryption standards.",
                "icon": "Server"
            }
        ]
    },
    "api-reference": {
        "title": "API Reference",
        "subtitle": "Integrate CloudIntel into your existing workflows",
        "icon": "FileCode2",
        "color": "from-purple-500 to-indigo-400",
        "bgColor": "bg-purple-500/10",
        "borderColor": "border-purple-500/20",
        "sections": [
            {
                "title": "RESTful Architecture",
                "content": "Our API is built on modern REST principles, providing predictable, resource-oriented URLs. We use standard HTTP methods and status codes, and return all responses in structured JSON format for easy parsing.",
                "icon": "Code"
            },
            {
                "title": "Authentication & Rate Limiting",
                "content": "Secure your API integrations using long-lived JWT Bearer tokens. To ensure platform stability, API requests are rate-limited per organization, with informative headers included in every response indicating your current limits.",
                "icon": "Key"
            },
            {
                "title": "SDKs and Client Libraries",
                "content": "Accelerate development with our officially supported client libraries for Python, Node.js, and Go. These libraries abstract away the complexities of authentication, pagination, and error handling.",
                "icon": "Layers"
            }
        ]
    },
    "security": {
        "title": "Security Framework",
        "subtitle": "Enterprise-grade protection for your cloud data",
        "icon": "Lock",
        "color": "from-cyan-500 to-blue-500",
        "bgColor": "bg-cyan-500/10",
        "borderColor": "border-cyan-500/20",
        "sections": [
            {
                "title": "Principle of Least Privilege",
                "content": "CloudIntel requires only the absolute minimum permissions necessary to function. We utilize the AWS ReadOnlyAccess managed policy, ensuring our system can never accidentally or maliciously modify your live infrastructure.",
                "icon": "Shield"
            },
            {
                "title": "Data Encryption",
                "content": "Security is built into every layer. Data in transit is secured using TLS 1.3, and data at rest is encrypted using AES-256 via AWS KMS. Your infrastructure metadata is isolated and secure at all times.",
                "icon": "Key"
            },
            {
                "title": "Compliance & Certifications",
                "content": "We maintain rigorous security controls and undergo regular third-party audits. While we are currently pursuing formal SOC 2 Type II certification, our architecture is designed to meet or exceed strict regulatory requirements.",
                "icon": "CheckCircle"
            }
        ]
    },
    "about-us": {
        "title": "About CloudIntel",
        "subtitle": "Our mission to democratize cloud optimization",
        "icon": "Users",
        "color": "from-indigo-500 to-purple-400",
        "bgColor": "bg-indigo-500/10",
        "borderColor": "border-indigo-500/20",
        "sections": [
            {
                "title": "The Origin Story",
                "content": "Built as a capstone engineering project, CloudIntel was born from the frustrating reality that cloud bills lack transparency. We set out to create a tool that engineers and finance teams alike could use to understand exactly where their money was going.",
                "icon": "Lightbulb"
            },
            {
                "title": "Open and Transparent",
                "content": "We believe FinOps tools shouldn't be black boxes. Our architecture, synchronization methods, and recommendation algorithms are documented extensively. We aim to be the most transparent platform in the cloud management space.",
                "icon": "Eye"
            },
            {
                "title": "Our Engineering Philosophy",
                "content": "Performance and reliability are our guiding principles. From utilizing FastAPI for our backend to implementing efficient React hydration techniques on the frontend, every technical decision is made to ensure a snappy, low-latency user experience.",
                "icon": "Cpu"
            }
        ]
    },
    "contact-support": {
        "title": "Contact Support",
        "subtitle": "We're here to help you succeed",
        "icon": "Mail",
        "color": "from-amber-500 to-orange-400",
        "bgColor": "bg-amber-500/10",
        "borderColor": "border-amber-500/20",
        "sections": [
            {
                "title": "Technical Assistance",
                "content": "Encountering issues with IAM role configuration or experiencing synchronization delays? Our engineering support team is available to help troubleshoot complex integrations and get your data flowing correctly.",
                "icon": "Wrench"
            },
            {
                "title": "Billing & Account Inquiries",
                "content": "Have questions about your subscription plan, payment methods, or invoicing? Connect with our account management team for prompt resolution of any administrative concerns.",
                "icon": "CreditCard"
            },
            {
                "title": "Feature Requests",
                "content": "We actively shape our roadmap based on user feedback. If you need support for a specific AWS service or require a custom compliance report, we want to hear about it.",
                "icon": "MessageSquare"
            }
        ]
    },
    "help-center": {
        "title": "Help Center",
        "subtitle": "Find answers quickly and easily",
        "icon": "HelpCircle",
        "color": "from-teal-500 to-emerald-400",
        "bgColor": "bg-teal-500/10",
        "borderColor": "border-teal-500/20",
        "sections": [
            {
                "title": "Frequently Asked Questions",
                "content": "Browse our curated list of common questions covering topics from initial setup to interpreting complex cost allocation data. The fastest way to resolve common issues.",
                "icon": "HelpCircle"
            },
            {
                "title": "Troubleshooting Guides",
                "content": "Step-by-step resolution paths for common errors, such as 'Sts:AssumeRole Access Denied' exceptions, missing cost allocation tags, and dashboard synchronization failures.",
                "icon": "Tool"
            },
            {
                "title": "Video Tutorials",
                "content": "Visual learner? Watch our brief screencasts demonstrating how to navigate the platform, set up custom alerts, and implement optimization recommendations safely.",
                "icon": "Video"
            }
        ]
    },
    "privacy-policy": {
        "title": "Privacy Policy",
        "subtitle": "How we handle and protect your information",
        "icon": "FileText",
        "color": "from-gray-400 to-slate-300",
        "bgColor": "bg-gray-500/10",
        "borderColor": "border-gray-500/20",
        "sections": [
            {
                "title": "Data Collection Practices",
                "content": "We collect only the metadata necessary to provide our optimization and reporting services. This includes resource IDs, utilization metrics, and billing data. We NEVER access the underlying data stored within your S3 buckets or databases.",
                "icon": "Database"
            },
            {
                "title": "Information Usage",
                "content": "Your data is used exclusively to generate analytics, forecast costs, and provide recommendations within your dashboard. We do not sell, rent, or lease your operational metadata to any third parties for marketing purposes.",
                "icon": "Activity"
            },
            {
                "title": "Data Retention & Deletion",
                "content": "We retain historical usage metrics to provide accurate year-over-year reporting. However, if you choose to terminate your account, all associated infrastructure metadata is permanently purged from our systems within 30 days.",
                "icon": "Trash2"
            }
        ]
    },
    "terms": {
        "title": "Terms of Service",
        "subtitle": "The rules governing platform usage",
        "icon": "FileText",
        "color": "from-gray-400 to-slate-300",
        "bgColor": "bg-gray-500/10",
        "borderColor": "border-gray-500/20",
        "sections": [
            {
                "title": "Service Usage Limitations",
                "content": "CloudIntel is provided on an 'as-is' basis. Users agree not to attempt to reverse engineer the platform, bypass rate limits, or use the service to conduct security testing against AWS infrastructure they do not own or possess authorization to test.",
                "icon": "AlertOctagon"
            },
            {
                "title": "Liability Disclaimer",
                "content": "While our optimization engine strives for accuracy, actionable recommendations should always be reviewed by a qualified engineer before execution. CloudIntel assumes no liability for downtime or data loss resulting from following optimization advice.",
                "icon": "AlertTriangle"
            },
            {
                "title": "Subscription and Billing Rules",
                "content": "Paid subscriptions are billed automatically according to the selected tier. Users may cancel at any time, but partial month refunds are not provided. Continued use of the platform implies agreement with these updated billing terms.",
                "icon": "FileSignature"
            }
        ]
    }
}

base_dir = "app"

for slug, data in pages_data.items():
    page_dir = os.path.join(base_dir, slug)
    
    # Generate sections elements individually so we don't mess up python f string formatting with arrow functions
    sections_str = ""
    for sec in data["sections"]:
        sections_str += f"""
               <motion.div 
                 variants={{fadeIn}}
                 className="group relative p-8 md:p-10 bg-white/5 border border-white/5 rounded-[2rem] hover:border-white/10 transition-all duration-300"
               >
                 <div className="absolute inset-0 bg-gradient-to-br {data['bgColor']} opacity-0 group-hover:opacity-10 rounded-[2rem] transition-opacity duration-500" />
                 
                 <div className="relative z-10 flex flex-col md:flex-row gap-8">
                   <div className="shrink-0">
                     <div className="w-14 h-14 rounded-xl bg-[#0A1929] border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                       <{sec['icon']} className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                     </div>
                   </div>
                   
                   <div>
                     <h2 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:{data['color']} transition-all">
                       {sec['title']}
                     </h2>
                     <p className="text-gray-400 leading-relaxed text-lg font-light">
                       {sec['content']}
                     </p>
                   </div>
                 </div>
               </motion.div>
        """

    # Write page.tsx (Client component for animations)
    page_content = f""""use client";

import {{ motion }} from "framer-motion";
import {{ Cloud, ArrowLeft, {data['icon']}, Search, RefreshCw, Layers, DollarSign, TrendingUp, AlertTriangle, Lock, Activity, FileCheck, Minimize2, Trash2, Lightbulb, PlayCircle, Award, Server, Code, Key, Shield, CheckCircle, Eye, Cpu, Wrench, CreditCard, MessageSquare, HelpCircle, Tool, Video, Database, AlertOctagon, FileSignature, ChevronRight }} from "lucide-react";
import {{ useRouter }} from "next/navigation";
import Link from "next/link";

export default function {slug.replace('-', '').capitalize()}Page() {{
  const router = useRouter();

  const fadeIn = {{
    hidden: {{ opacity: 0, y: 20 }},
    visible: {{ opacity: 1, y: 0 }}
  }};

  const staggerContainer = {{
    hidden: {{ opacity: 0 }},
    visible: {{
      opacity: 1,
      transition: {{
        staggerChildren: 0.1
      }}
    }}
  }};

  return (
    <div className="min-h-screen bg-[#0A1929] text-white selection:bg-[#5B7AB5]/30">
      <nav className="border-b border-white/5 bg-[#0A1929]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2D3A5E] to-[#4A6FA5] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[#4A6FA5]/20 transition-all">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter">cloudintel<span className="text-[#5B7AB5]">.</span></span>
          </Link>
          
          <button 
            onClick={{() => router.push('/')}}
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-24 pl-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{staggerContainer}}
          className="mb-24"
        >
          <motion.div variants={{fadeIn}} className="flex items-center gap-6 mb-8 pt-4">
            <div className="w-20 h-20 rounded-2xl {data['bgColor']} border {data['borderColor']} flex items-center justify-center shadow-2xl">
              <{data['icon']} className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r {data['color']}">
                {data['title']}
              </h1>
            </div>
          </motion.div>
          
          <motion.p variants={{fadeIn}} className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed font-light pl-2">
            {data['subtitle']}
          </motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{staggerContainer}}
          className="grid gap-8"
        >
          {sections_str}
        </motion.div>

        {slug == 'contact-support' and '''<motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-12 text-center bg-gradient-to-br from-[#1A2A4A] to-[#0A1929] border border-[#5B7AB5]/20 rounded-[3rem] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#5B7AB5]/5 animate-pulse" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-6">Need Immediate Assistance?</h3>
            <p className="text-gray-400 text-lg mb-10">Our engineering team is ready to help you resolve technical issues or answer specific compliance questions.</p>
            <a 
              href="mailto:support@cloudintel.io" 
              className="inline-flex items-center gap-3 bg-[#5B7AB5] hover:bg-[#4A6FA5] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-[#5B7AB5]/20 transition-all hover:scale-105 active:scale-95"
            >
              Email Support Team
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>''' or ''}
      </main>

      <footer className="py-12 border-t border-white/5 mt-auto relative bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-gray-500 font-medium">
            <Cloud className="w-5 h-5" />
            <span>© {new Date().getFullYear()} Cloud Intelligence Platform</span>
          </div>
          <div className="text-gray-600 text-sm">
            Designed for performance and security.
          </div>
        </div>
      </footer>
    </div>
  );
}}
"""
    with open(os.path.join(page_dir, "page.tsx"), "w") as f:
        f.write(page_content)

print("Updated 12 specific pages with professional UI!")
