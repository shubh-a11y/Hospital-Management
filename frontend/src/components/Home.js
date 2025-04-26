import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
// Import hospital images
import image1 from '../images/Hospital/Himage1.webp';
import image2 from '../images/Hospital/Himage_2.jpg';
import image3 from '../images/Hospital/Himage_3.jpg';
import image4 from '../images/Hospital/Himage_4.jpg';
import image5 from '../images/Hospital/Himage_5.jpg';
import image6 from '../images/Hospital/HImage_6.jpg';

/**
 * MedicalService class - Demonstrates encapsulation in OOP
 * Encapsulates data and behavior related to medical services
 */
class MedicalService {
  constructor(name, description, icon) {
    this.name = name;
    this.description = description;
    this.icon = icon;
  }
  
  getDisplayName() {
    return this.name;
  }
  
  getDescription() {
    return this.description;
  }
  
  getIcon() {
    return this.icon;
  }
}

/**
 * Home Component using OOP principles
 * Shows how to use classes for data modeling
 */
function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const hospitalFacts = [
    "Our hospital has a 98% patient satisfaction rate across all departments",
    "Our emergency response team arrives within 8 minutes on average",
    "MedCare Hospital has performed over 10,000 successful surgeries last year",
    "Our cardiac unit has a 95% recovery rate for heart patients",
    "We employ over 200 doctors specialized in 40 different medical fields",
    "Our pediatric ward treats over 5,000 children annually"
  ];

  const slides = [
    { image: image1, fact: hospitalFacts[0] },
    { image: image2, fact: hospitalFacts[1] },
    { image: image3, fact: hospitalFacts[2] },
    { image: image4, fact: hospitalFacts[3] },
    { image: image5, fact: hospitalFacts[4] },
    { image: image6, fact: hospitalFacts[5] }
  ];

  // Create medical services using the MedicalService class
  const medicalServices = [
    new MedicalService("Emergency Care", "24/7 emergency medical services with rapid response teams", "🚑"),
    new MedicalService("Cardiology", "Complete heart care from diagnosis to advanced treatments", "❤️"),
    new MedicalService("Pediatrics", "Specialized care for infants, children and adolescents", "👶"),
    new MedicalService("Orthopedics", "Treatment for bone, joint, and muscle conditions", "🦴"),
    new MedicalService("Neurology", "Comprehensive brain and nervous system care", "🧠"),
    new MedicalService("Oncology", "Cancer treatment and support services", "🩺"),
    new MedicalService("Maternity", "Pre and post-natal care for mothers and newborns", "👪"),
    new MedicalService("Radiology", "Advanced imaging services including MRI, CT, and X-ray", "📷"),
    new MedicalService("Laboratory", "Comprehensive diagnostic testing services", "🧪")
  ];

  useEffect(() => {
    document.title = "MedCare Hospital - Healthcare Services";
    
    // Auto-advance slides
    const slideInterval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(slideInterval);
  }, [slides.length]);
  
  // Function to navigate to previous slide
  const prevSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide - 1 + slides.length) % slides.length);
  };
  
  // Function to navigate to next slide
  const nextSlide = () => {
    setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="forest-banner hospital-banner">
        {/* Background image slider */}
        <div className="slider-container">
          {slides.map((slide, index) => (
            <div 
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="fact-tooltip">
                <div className="fact-content">
                  <h3>Healthcare Facts</h3>
                  <p>{slide.fact}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Navigation arrows */}
          <button className="arrow prev" onClick={prevSlide}>❮</button>
          <button className="arrow next" onClick={nextSlide}>❯</button>
          
          {/* Slide indicators */}
          <div className="slide-indicators">
            {slides.map((_, index) => (
              <span 
                key={index} 
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
        
        {/* Overlay content */}
        <div className="forest-content hospital-content">
          <div className="title-container">
            <h1>
              <span className="title-first">MedCare</span>
              <span className="title-second">Hospital</span>
            </h1>
            <p className="tagline">Caring for you, every step of the way</p>
          </div>
          
          <div className="info-container">
            <div className="info-box">
              <h2>Healthcare Services</h2>
              <p>Welcome to our state-of-the-art medical facility</p>
              <p className="description">
                Quality healthcare services with compassionate care
              </p>
              <button className="login-button" onClick={handleLoginClick}>
                Login to Patient Portal
              </button>
            </div>
          </div>
          
          <div className="feature-boxes">
            <div className="feature">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Expert Physicians</h3>
              <p>Specialists in diverse fields</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🏥</div>
              <h3>Modern Facilities</h3>
              <p>Advanced medical technology</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⏱️</div>
              <h3>24/7 Care</h3>
              <p>Always available for you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical services section */}
      <div className="product-showcase services-showcase">
        <h2 className="showcase-title">Our Medical Services</h2>
        <p className="showcase-description">Comprehensive healthcare for all your needs</p>
        
        <div className="medical-services-grid">
          {medicalServices.map((service, index) => (
            <div className="medical-service-card" key={index}>
              <div className="service-icon">{service.getIcon()}</div>
              <div className="service-content">
                <h3>{service.getDisplayName()}</h3>
                <p>{service.getDescription()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home; 