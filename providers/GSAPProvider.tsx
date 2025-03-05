'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { usePathname, useRouter } from 'next/navigation';

type GSAPProviderProps = {
  children: React.ReactNode;
};

gsap.registerPlugin(ScrollTrigger);

export default function GSAPProvider({ children }: GSAPProviderProps) {
  const main = useRef(null);
  const path = usePathname();
  const getBaseAnimation = (selector: HTMLElement) => {
    return {
      opacity: 1,
      clearProps: 'all',
      onStart: () => {
        selector.style.transition = 'none';
      },
      onComplete: () => {
        selector.style.opacity = '1';
        selector.style.transition = '';
      },
    };
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const gsapSelectors = document.querySelectorAll('[data-gsap]');

      gsapSelectors.forEach((selector, index) => {
        const type = selector.getAttribute('data-gsap');
        const timeline = gsap.timeline({ defaults: { ease: 'power1.inOut' } });
        switch (type) {
          case 'up':
            timeline.fromTo(
              selector,
              { opacity: 0, y: 200 }, // Starting state
              {
                y: 0,
                duration: 1.5,
                ...getBaseAnimation(selector as HTMLElement),
              },
            );
            break;
          case 'down':
            timeline.fromTo(
              selector,
              { opacity: 0, y: -200 }, // Starting state
              {
                y: 0,
                duration: 1.5,
                ...getBaseAnimation(selector as HTMLElement),
              },
            );
            break;
          case 'left':
            timeline.fromTo(
              selector,
              { opacity: 0, x: 200 }, // Starting state
              {
                x: 0,
                duration: 1.5,
                ...getBaseAnimation(selector as HTMLElement),
              },
            );
            break;
          case 'right':
            timeline.fromTo(
              selector,
              { opacity: 0, x: -200 }, // Starting state
              {
                x: 0,
                duration: 1.5,
                ...getBaseAnimation(selector as HTMLElement),
              },
            );
            break;
          case 'up-stagger':
            timeline.fromTo(
              selector,
              { opacity: 0, y: 200 }, // Starting state
              {
                y: 0,
                duration: 1.5,
                stagger: 0.3,
                ...getBaseAnimation(selector as HTMLElement),
              },
            );
            break;
          case 'down-stagger':
            timeline.fromTo(
              selector,
              { opacity: 0, y: -200 }, // Starting state
              {
                y: 0,
                duration: 1.5,
                stagger: 0.3,
                ...getBaseAnimation(selector as HTMLElement),
              },
            );
            break;
          case 'left-stagger':
            timeline.fromTo(
              selector,
              { opacity: 0, x: 200 }, // Starting state
              {
                x: 0,
                duration: 1.5,
                stagger: 0.3,
                ...getBaseAnimation(selector as HTMLElement),
              },
            );
            break;
          case 'right-stagger':
            timeline.fromTo(
              selector,
              { opacity: 0, x: -200 }, // Starting state
              {
                x: 0,
                duration: 1.5,
                stagger: 0.3,
                ...getBaseAnimation(selector as HTMLElement),
              },
            );
            break;
          case 'flip':
            timeline.fromTo(
              selector,
              { opacity: 0, rotateX: 90 }, // Starting state
              {
                rotateX: 0,
                duration: 1.5,
                delay: index * 0.3,
                ...getBaseAnimation(selector as HTMLElement),
              },
            );
            break;
          default:
            break;
        }

        if (index < 5) {
          ScrollTrigger.create({
            trigger: selector,
            start: 'top 90%',
            end: 'bottom 10%',
            animation: timeline,
          });
        } else if (index === 5) {
          ScrollTrigger.create({
            trigger: selector,
            start: `top 230%`,
            end: `top bottom`,
            animation: timeline,
          });
        } else {
          ScrollTrigger.create({
            trigger: selector,
            start: `top ${150 + (index + 1) * 10}%`,
            end: `top bottom ${10 + (index + 1) * 9.5}%`,
            animation: timeline,
          });
        }
      });
    }, main);
    return () => ctx.revert();
  }, [path]);

  return <>{children}</>;
}
