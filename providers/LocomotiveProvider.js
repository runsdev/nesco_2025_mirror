'use client';

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import LocomotiveScroll from 'locomotive-scroll';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LocomotiveProvider = ({ children }) => {
  useEffect(() => {
    new LocomotiveScroll({ smooth: true, smoothMobile: true });
    AOS.init(
      {
        duration: 1000,
        once: true,
      },
      [],
    );
  }, []);
  return <>{children}</>;
};

export default LocomotiveProvider;

LocomotiveProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
