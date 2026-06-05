import React from 'react';
import './About.css';

function About() {
  const photos = ['/photobrune.png', '/photososo.png', '/photoantoine.jpeg'];

  return (
    <div className="about-container">
      <h1>À propos de nous</h1>

      {/* --- SECTION JAVASCRIPT --- */}
      <section className="about-section js-section">
        <h2>Notre Histoire </h2>
        <div className="story-content">
          <p>
            L'EI du siècle ? On s'est bien amusés à créer ce site en tout cas !
          </p>
        </div>

        {/* Galerie de 3 photos */}
        <div className="photo-gallery">
          {photos.map((url, index) => (
            <div key={index} className="photo-card">
              <img src={url} alt={`us ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* --- SECTION CSS --- */}
    </div>
  );
}

export default About;
