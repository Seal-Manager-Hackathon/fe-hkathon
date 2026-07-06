import { Link } from 'react-router-dom'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="home-page">
      <h1>Hello Vite!</h1>
      <p>
        React Router configured with senior best practices.
      </p>
      <Link to="/about" className="home-link">
        Learn more →
      </Link>
    </div>
  )
}
