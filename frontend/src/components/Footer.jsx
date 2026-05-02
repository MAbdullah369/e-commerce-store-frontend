// Footer.jsx
import { Link } from 'react-router-dom'
import { FiMail, FiMapPin, FiPhone, FiArrowRight, FiHeart } from 'react-icons/fi'
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter, IoLogoGithub } from 'react-icons/io5'

export default function Footer() {
  const socialLinks = [
    { icon: IoLogoFacebook, href: '#', color: 'hover:bg-blue-600' },
    { icon: IoLogoInstagram, href: '#', color: 'hover:bg-pink-600' },
    { icon: IoLogoTwitter, href: '#', color: 'hover:bg-sky-500' },
    { icon: IoLogoGithub, href: '#', color: 'hover:bg-gray-600' },
  ]

  const quickLinks = [
    { to: '/products', label: 'All Products' },
    { to: '/products?sort=newest', label: 'New Arrivals' },
  ]

  const supportLinks = [
    { to: '/faq', label: 'FAQ' },
    { to: '/shipping', label: 'Shipping Info' },
    { to: '/returns', label: 'Returns Policy' },
    { to: '/contact', label: 'Contact Us' },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-300 mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-600/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-white font-bold text-2xl bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">E-Store</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">Your one-stop destination for quality products at great prices.</p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, color }, i) => (
                <a key={i} href={href} className={`w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white ${color} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map(({ to, label }) => (
                <li key={label}><Link to={to} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"><FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /><span>{label}</span></Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm">
              {supportLinks.map(({ to, label }) => (
                <li key={label}><Link to={to} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"><FiArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" /><span>{label}</span></Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0"><FiMapPin className="w-4 h-4 text-primary-400" /></div><span className="text-gray-400">123 Commerce St, DC 10001</span></li>
              <li className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0"><FiMail className="w-4 h-4 text-primary-400" /></div><span className="text-gray-400">support@estore.com</span></li>
              <li className="flex items-center gap-3"><div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0"><FiPhone className="w-4 h-4 text-primary-400" /></div><span className="text-gray-400">+1 (234) 567-8900</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500 flex items-center gap-1">© {new Date().getFullYear()} E-Store. Made with <FiHeart className="w-3 h-3 text-red-400" /> All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="#" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-gray-300 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}