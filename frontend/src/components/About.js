import React, { useEffect } from 'react';
import '../App.css';
// Using hospital images
import aboutImage from '../images/Hospital/Himage_3.jpg';
import hospitalImage from '../images/Hospital/Himage_2.jpg';

function About() {
  useEffect(() => {
    document.title = "About Us | MedCare Hospital";
  }, []);

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About MedCare Hospital</h1>
        <p className="tagline">Providing quality healthcare with compassion and excellence</p>
      </div>

      {/* Image gallery section - horizontal layout */}
      <div className="about-gallery">
        <div className="gallery-image-container">
          <img src={aboutImage} alt="MedCare Hospital Facility" className="gallery-image" />
        </div>
        <div className="gallery-image-container">
          <img 
            src={hospitalImage}
            alt="MedCare Medical Staff" 
            className="gallery-image" 
          />
        </div>
      </div>

      {/* Text content below images */}
      <div className="about-text-section">
        <h2>Our Story</h2>
        <p>
          Established in 2005, MedCare Hospital has been a cornerstone of healthcare excellence in the community. 
          Our state-of-the-art medical facility combines advanced technology with compassionate care to provide 
          the best possible outcomes for our patients.
        </p>
        <p>
          From our humble beginnings as a small clinic, we have grown into a comprehensive healthcare center 
          with over 200 beds and more than 150 physicians across 40 specialties. Our growth reflects our 
          commitment to meeting the evolving healthcare needs of our community.
        </p>

        <h2>Our Mission</h2>
        <p>
          At MedCare Hospital, our mission is to enhance the health and wellbeing of the communities we serve 
          through compassionate, high-quality care. We are dedicated to healing, education, and the advancement 
          of medical knowledge through continuous research and improvement.
        </p>
        
        <h2>Our Specialties</h2>
        <p>
          Our hospital is recognized for excellence in several key specialties, including cardiology, neurology, 
          orthopedics, oncology, and pediatrics. Our Centers of Excellence are staffed by industry-leading 
          specialists who are committed to providing cutting-edge treatments and personalized care plans.
        </p>
        <p>
          We are particularly proud of our cardiac care unit, which has been recognized nationally for its 
          innovative approaches to heart disease treatment and prevention. Our stroke center provides rapid 
          response and treatment, significantly improving outcomes for patients experiencing neurological emergencies.
        </p>
      </div>

      <div className="contact-info">
        <h2>Contact Information</h2>
        <div className="contact-details">
          <div className="contact-item">
            <h3>Address:</h3>
            <p>MedCare Hospital<br />123 Health Avenue, Medical District</p>
          </div>
          
          <div className="contact-item">
            <h3>Contact us:</h3>
            <p>Emergency: (555) 911-1234<br />Appointments: (555) 123-4567</p>
          </div>
          
          <div className="contact-item">
            <h3>Social Media:</h3>
            <div className="social-links">
              <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="social-icon">📸</i> Instagram: @MedCareHospital
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="social-icon">🌐</i> X: @MedCareHealth
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="visit-info">
        <h2>Hospital Information</h2>
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">🕒</div>
            <h3>Hours</h3>
            <p>Emergency Care: 24/7<br />Outpatient Services: 8:00 AM - 8:00 PM</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">🏥</div>
            <h3>Services</h3>
            <p>Inpatient & Outpatient Care<br />Diagnostic Services<br />Specialty Clinics</p>
          </div>
          
          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Appointments</h3>
            <p>Online booking available<br />Call (555) 123-4567<br />Walk-ins accepted for urgent care</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
