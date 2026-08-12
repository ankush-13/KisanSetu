import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sprout,
  ShoppingBasket,
  Handshake,
  MapPin,
  Wheat,
} from "lucide-react";

const Home = () => {
  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-container">

          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Empowering Indian Agriculture
            </div>

            <h1>
              From the
              <span> Farm </span>
              to Your
              <span> Table.</span>
            </h1>

            <p>
              KisanSetu connects farmers directly with buyers,
              making agricultural trade simpler, fairer and
              more transparent.
            </p>

            <div className="hero-actions">
              <Link
                to="/marketplace"
                className="primary-btn"
              >
                Explore Marketplace
                <ArrowRight size={19} />
              </Link>

              <Link
                to="/register"
                className="secondary-btn"
              >
                Start Selling
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <strong>100%</strong>
                <span>Direct Trade</span>
              </div>

              <div>
                <strong>Local</strong>
                <span>Farmers</span>
              </div>

              <div>
                <strong>Simple</strong>
                <span>Ordering</span>
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="hero-visual">
            <div className="hero-card main-farm-card">

              <div className="sun"></div>

              <div className="farm-scene">
                <div className="farm-house">🏠</div>

                <div className="farm-crops">
                  🌾 🌾 🌾 🌾
                </div>

                <div className="farm-ground"></div>
              </div>

              <div className="floating-card farmer-card">
                <div className="floating-icon">
                  👨‍🌾
                </div>

                <div>
                  <strong>Farmer Direct</strong>
                  <span>Better opportunities</span>
                </div>
              </div>

              <div className="floating-card market-card">
                <div className="floating-icon">
                  🛒
                </div>

                <div>
                  <strong>Fresh Produce</strong>
                  <span>Direct from farms</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="section-container">

          <div className="section-heading">
            <span>HOW KISANSETU WORKS</span>

            <h2>
              One simple bridge between
              <br />
              farmers and buyers.
            </h2>

            <p>
              We make agricultural commerce easier for
              everyone involved.
            </p>
          </div>

          <div className="steps-grid">

            <div className="step-card">
              <div className="step-number">01</div>

              <div className="step-icon">
                <Sprout />
              </div>

              <h3>Farmers List</h3>

              <p>
                Farmers list their fresh crops with
                quantity, price and location.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>

              <div className="step-icon">
                <ShoppingBasket />
              </div>

              <h3>Buyers Discover</h3>

              <p>
                Buyers browse products and find
                agricultural produce near them.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>

              <div className="step-icon">
                <Handshake />
              </div>

              <h3>Trade Directly</h3>

              <p>
                Buyers place orders and farmers
                manage them through one platform.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* WHY KISANSETU */}
      <section className="why-section">
        <div className="section-container">

          <div className="why-content">

            <div className="why-text">
              <span className="section-label">
                BUILT FOR THE GROUND
              </span>

              <h2>
                Agriculture deserves
                <span> better connections.</span>
              </h2>

              <p>
                KisanSetu brings farmers and buyers
                closer together through a simple digital
                marketplace designed around real
                agricultural needs.
              </p>

              <div className="why-points">

                <div>
                  <MapPin size={20} />
                  <div>
                    <strong>Local Marketplace</strong>
                    <span>
                      Find products from farmers in your region.
                    </span>
                  </div>
                </div>

                <div>
                  <Wheat size={20} />
                  <div>
                    <strong>Fresh Agricultural Produce</strong>
                    <span>
                      Discover crops directly from their source.
                    </span>
                  </div>
                </div>

                <div>
                  <Handshake size={20} />
                  <div>
                    <strong>Direct Connections</strong>
                    <span>
                      Simple buying and selling without unnecessary complexity.
                    </span>
                  </div>
                </div>

              </div>
            </div>

            <div className="why-visual">
              <div className="big-leaf">🌱</div>

              <div className="why-circle circle-one"></div>
              <div className="why-circle circle-two"></div>

              <div className="quote-card">
                <span>“</span>

                <p>
                  Connecting the people who grow
                  with the people who need.
                </p>

                <small>
                  — KisanSetu
                </small>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="cta-section">
        <div className="cta-container">

          <div>
            <span>READY TO GET STARTED?</span>

            <h2>
              Let's grow together.
            </h2>

            <p>
              Whether you're a farmer or a buyer,
              KisanSetu is your bridge to better
              agricultural trade.
            </p>
          </div>

          <Link
            to="/register"
            className="cta-button"
          >
            Join KisanSetu
            <ArrowRight size={19} />
          </Link>

        </div>
      </section>

    </div>
  );
};

export default Home;