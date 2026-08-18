import { Shield, MapPin, Phone, Mail, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0a1128] text-slate-200 border-t border-slate-700">
      {/* Tricolor accent strip — signature govt-portal touch */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-green-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand / About */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="font-extrabold text-lg tracking-wide text-white">
                SENTINEL
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unified Government CCTV Intelligence &amp; Vehicle Tracking
              Platform. Built for Gujarat Police under the Gujarat Police
              Innovation Hackathon 2026.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#overview" className="hover:text-blue-400 transition-colors">Overview</a></li>
              <li><a href="#vehicle-search" className="hover:text-blue-400 transition-colors">Vehicle Search</a></li>
              <li><a href="#gis-intelligence" className="hover:text-blue-400 transition-colors">GIS Intelligence</a></li>
              <li><a href="#alerts" className="hover:text-blue-400 transition-colors">Alert Center</a></li>
            </ul>
          </div>

          {/* Policies (standard on govt sites) */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Policies
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Data Security Policy</a></li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-1">
                  Accessibility Statement <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-blue-400" />
                Gujarat Police Command Center, Gandhinagar, Gujarat
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-blue-400" />
                Control Room: 100
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                support@sentinel.gujarat.gov.in
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {currentYear} SENTINEL — Gujarat Police. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span>Last Updated: {new Date().toLocaleDateString("en-IN")}</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
