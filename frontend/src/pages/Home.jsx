import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to E-Store</h1>
            <p className="text-xl mb-8">Discover amazing products at great prices</p>
            <Link to="/products" className="btn-primary">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">Fast Shipping</h3>
              <p className="text-gray-600">Quick and reliable delivery to your doorstep</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">💯</div>
              <h3 className="text-xl font-bold mb-2">Quality Products</h3>
              <p className="text-gray-600">Only the best products from trusted sellers</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-2">Secure Shopping</h3>
              <p className="text-gray-600">Safe and secure payment processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to explore?</h2>
          <p className="text-xl mb-8">Browse our latest collection of products</p>
          <Link to="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  )
}
