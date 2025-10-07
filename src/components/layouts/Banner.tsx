import React, { useState, useEffect } from 'react';
import '@styles/components/banner.scss';
import type { BannerProps } from '@interfaces/components/banner';

const Banner: React.FC<BannerProps> = (props) => {
  const { images } = props
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className='banner'>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Slide ${index + 1}`}
          className={`fade-image ${index === currentIndex ? 'show' : ''}`}
        />
      ))}
    </div>
  );
};

export default Banner;
