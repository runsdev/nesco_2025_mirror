'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import PropTypes from 'prop-types';

gsap.registerPlugin(ScrollTrigger);

export default function GSAPProvider({ children }) {
  const main = useRef();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let ctx;
    const initGSAP = () => {
      ctx = gsap.context(() => {
        const gsapSelectors = main.current.querySelectorAll('[data-gsap]');

        gsapSelectors.forEach((selector, index) => {
          const type = selector.getAttribute('data-gsap');

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: selector,
              start: 'top 90%',
              end: 'bottom 10%',
              toggleActions: 'play none none',
            },
          });

          switch (type) {
            case 'up':
              timeline.from(selector, { y: 200, duration: 1.2, opacity: 0 });
              break;
            case 'down':
              timeline.from(selector, { y: -200, duration: 1.2, opacity: 0 });
              break;
            case 'left':
              timeline.from(selector, { x: 200, duration: 1.2, opacity: 0 });
              break;
            case 'right':
              timeline.from(selector, { x: -200, duration: 1.2, opacity: 0 });
              break;
            case 'right-brutal':
              timeline.from(selector, { x: -200, duration: 3, opacity: 0 });
              break;
            case 'flip':
              timeline.from(selector, {
                rotateX: 90,
                duration: 1,
                opacity: 0,
                ease: 'power3.out',
                delay: index * 0.3,
              });
              break;
            case 'flip-fast':
              timeline.from(selector, {
                rotateX: 90,
                duration: 1,
                opacity: 0,
                ease: 'power3.out',
                delay: index * 0.2,
              });
              break;
            default:
              break;
          }

          if (index === 5) {
            timeline.scrollTrigger.start = 'top 230%';
            timeline.scrollTrigger.end = 'top bottom';
          } else if (index > 5) {
            timeline.scrollTrigger.start = `top ${150 + (index + 1) * 10}%`;
            timeline.scrollTrigger.end = `top bottom ${10 + (index + 1) * 9.5}%`;
          }
        });

        ScrollTrigger.refresh();
      }, main);
    };

    const timer = setTimeout(initGSAP, 100);

    return () => {
      clearTimeout(timer);
      if (ctx) {
        ctx.revert();
      }
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isClient]);

  return <div ref={main}>{children}</div>;
}

GSAPProvider.propTypes = {
  children: PropTypes.any.isRequired,
};
