import React from 'react';
import { motion, Variants } from 'framer-motion';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fadeUp' | 'fadeIn' | 'scale' | 'slideLeft' | 'slideRight' | 'blur';
  delay?: number;
  duration?: number;
  once?: boolean;
  viewportMargin?: string;
  style?: React.CSSProperties;
  animateOnMount?: boolean; // If true, animate immediately without waiting for viewport
}

const variantsMap: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
  },
};

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  className = '',
  variant = 'fadeUp',
  delay = 0,
  duration = 0.5,
  once = true,
  viewportMargin = "-50px",
  style,
  animateOnMount = false,
}) => {
  // If animateOnMount is true, use animate prop directly instead of whileInView
  if (animateOnMount) {
    return (
      <motion.div
        variants={variantsMap[variant]}
        initial="hidden"
        animate="visible"
        transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={variantsMap[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;