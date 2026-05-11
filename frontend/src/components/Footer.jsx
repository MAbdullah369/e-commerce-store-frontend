// Footer.jsx — Premium Redesign
import { Link } from 'react-router-dom'
import { FiMail, FiMapPin, FiPhone, FiArrowRight } from 'react-icons/fi'
import { IoLogoGithub, IoLogoTwitter, IoLogoInstagram } from 'react-icons/io5'

export default function Footer() {
  const cols = [
    { title: 'Shop', links: [{ to: '/products', label: 'All Products' }, { to: '/products?sort=newest', label: 'New Arrivals' }, { to: '/products?sort=rating', label: 'Top Rated' }] },
    { title: 'Support', links: [{ to: '/faq', label: 'FAQ' }, { to: '/shipping', label: 'Shipping' }, { to: '/returns', label: 'Returns' }, { to: '/contact', label: 'Contact' }] },
    { title: 'Company', links: [{ to: '/about', label: 'About Us' }, { to: '/careers', label: 'Careers' }, { to: '/blog', label: 'Blog' }] },
  ]

  return (
    <footer className="bg-[#050508] dark:bg-[#020204] border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-lg">λ</span>
              </div>
              <span className="font-black text-white text-lg">LuxeStore</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-[260px]">Your premium destination for curated products at exceptional prices.</p>
            <div className="flex gap-3">
              {[IoLogoTwitter, IoLogoInstagram, IoLogoGithub].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {cols.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map(({ to, label }) => (
                  <li key={label}><Link to={to} className="text-[13px] text-gray-400 hover:text-white transition-colors font-medium">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[12px] text-gray-600">&copy; {new Date().getFullYear()} LuxeStore. All rights reserved.</p>
          <div className="flex gap-6 text-[12px] text-gray-600">
            <Link to="#" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link to="#" className="hover:text-gray-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}