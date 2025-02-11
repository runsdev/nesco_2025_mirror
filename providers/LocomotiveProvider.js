'use client';

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import LocomotiveScroll from 'locomotive-scroll';

const LocomotiveProvider = ({ children }) => {
  useEffect(() => {
    new LocomotiveScroll();
  }, []);
  return <>{children}</>;
};

export default LocomotiveProvider;

LocomotiveProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
