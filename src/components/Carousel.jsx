import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HealthIcon from './HealthIcon';
import './Carousel.css';

export default function Carousel({ items = [], autoPlay = true, interval = 4000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsRef = useRef(items);

  // 同步items引用
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (!autoPlay || isHovered || items.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % itemsRef.current.length;
        setIsTransitioning(true);
        setTimeout(() => setIsTransitioning(false), 600);
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, isHovered, items.length]);

  const goToSlide = (index) => {
    if (index === currentIndex || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const newIndex = (prev - 1 + items.length) % items.length;
      return newIndex;
    });
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const newIndex = (prev + 1) % items.length;
      return newIndex;
    });
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // 计算项的显示位置（支持无限循环）
  const getItemPosition = (index) => {
    if (items.length === 0) return { x: 0, scale: 0.6, opacity: 0.3, zIndex: 0 };
    
    let relativeIndex = index - currentIndex;
    
    // 处理循环：如果距离太远，从另一边绕过来
    if (relativeIndex > items.length / 2) {
      relativeIndex = relativeIndex - items.length;
    } else if (relativeIndex < -items.length / 2) {
      relativeIndex = relativeIndex + items.length;
    }

    const distance = Math.abs(relativeIndex);
    const isActive = relativeIndex === 0;
    const isNear = distance <= 2;

    return {
      x: relativeIndex * 150,
      scale: isActive ? 1.3 : isNear ? 0.85 : 0.6,
      opacity: isNear ? 1 : 0.3,
      zIndex: isActive ? 10 : Math.max(1, 5 - distance),
      isActive,
      isNear,
    };
  };

  if (!items || items.length === 0) return null;

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-wrapper">
        <button className="carousel-nav carousel-nav-prev" onClick={goToPrev}>
          ‹
        </button>
        <button className="carousel-nav carousel-nav-next" onClick={goToNext}>
          ›
        </button>

        <div className={`carousel-track ${isTransitioning ? 'transitioning' : ''}`}>
          {items.map((item, index) => {
            const position = getItemPosition(index);
            
            return (
              <div
                key={index}
                className={`carousel-slide ${position.isActive ? 'active' : ''} ${position.isNear ? 'near' : 'far'}`}
                style={{
                  transform: `translateX(${position.x}px) scale(${position.scale})`,
                  opacity: position.opacity,
                  zIndex: position.zIndex,
                }}
                onClick={() => !position.isActive && !isTransitioning && goToSlide(index)}
              >
                {item.link ? (
                  <Link to={item.link} className="carousel-item">
                    {item.iconType ? (
                      <div className="carousel-icon">
                        <HealthIcon type={item.iconType} size={48} />
                      </div>
                    ) : item.icon ? (
                      <div className="carousel-icon">{item.icon}</div>
                    ) : null}
                    {item.image && <img src={item.image} alt={item.title} className="carousel-image" />}
                    <div className="carousel-content">
                      <h3 className="carousel-title">{item.title}</h3>
                      {item.description && <p className="carousel-description">{item.description}</p>}
                    </div>
                    {position.isActive && <div className="carousel-circle"></div>}
                  </Link>
                ) : (
                  <div className="carousel-item">
                    {item.iconType ? (
                      <div className="carousel-icon">
                        <HealthIcon type={item.iconType} size={48} />
                      </div>
                    ) : item.icon ? (
                      <div className="carousel-icon">{item.icon}</div>
                    ) : null}
                    {item.image && <img src={item.image} alt={item.title} className="carousel-image" />}
                    <div className="carousel-content">
                      <h3 className="carousel-title">{item.title}</h3>
                      {item.description && <p className="carousel-description">{item.description}</p>}
                    </div>
                    {position.isActive && <div className="carousel-circle"></div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="carousel-dots">
        {items.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`跳转到第 ${index + 1} 项`}
          />
        ))}
      </div>
    </div>
  );
}

