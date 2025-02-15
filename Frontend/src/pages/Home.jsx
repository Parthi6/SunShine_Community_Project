import Hero from '../components/Home/Hero';
import Biography from '../components/Home/Biography';
import Messages from '../components/Home/Messages';
import Facilities from '../components/Home/Facilities';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGraduationCap, FaHeart, FaStar, FaUsers } from 'react-icons/fa';
import './Home.css';  // Import CSS for wave background and other styles

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <Hero />

      {/* Quick Stats Section */}
      <div className="stats-section">
        <Container>
          <Row>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <h3>500+</h3>
                <p>Happy Students</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaGraduationCap />
                </div>
                <h3>50+</h3>
                <p>Certified Teachers</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaStar />
                </div>
                <h3>15+</h3>
                <p>Years Experience</p>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaHeart />
                </div>
                <h3>100%</h3>
                <p>Parents Satisfaction</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Biography Section with gradient divider */}
      <div className="gradient-divider"></div>
      <div className="biography-section">
        <Container>
          <div className="section-title-wrapper text-center">
            <h2 className="section-title">Welcome to Sunshine PreSchool</h2>
            <p className="section-subtitle">Where Every Child's Future Begins</p>
          </div>
          <Biography imageUrl={"Images/about.png"} />
        </Container>
      </div>

      {/* Facilities Section */}
      <div className="gradient-divider"></div>
      <div className="facilities-section">
        <Container>
          <div className="section-title-wrapper text-center">
            <h2 className="section-title">Our Facilities</h2>
            <p className="section-subtitle">Providing the Best for Your Child</p>
          </div>
          <Facilities />
        </Container>
      </div>

      {/* Teacher Section */}
      {/* <Messages /> */}

      {/* Wave Background */}
      <div className="wave"></div>
    </div>
  );
};

export default Home;