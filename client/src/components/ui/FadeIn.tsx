import { motion, type HTMLMotionProps } from 'framer-motion';

// Variants — exported so consumers can compose custom motion.divs if needed
export const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

export const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

// ─── FadeIn ──────────────────────────────────────────────────────────────────
// Wraps any block element and fades it up when it enters the viewport.
// Triggers once — no re-animation on scroll back.

interface FadeInProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  /** Extra vertical offset before the trigger fires. Default "-60px" */
  margin?: string;
}

export function FadeIn({ children, className, margin = '-60px', ...rest }: FadeInProps) {
  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerGrid ─────────────────────────────────────────────────────────────
// Wraps a grid container. Children (StaggerItem) stagger in as the grid enters view.

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  /** Extra vertical offset before the trigger fires. Default "-40px" */
  margin?: string;
}

export function StaggerGrid({ children, className, margin = '-40px' }: StaggerGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerItem ─────────────────────────────────────────────────────────────
// Wraps each card inside a StaggerGrid. Inherits the stagger delay from the parent.

type StaggerItemProps = HTMLMotionProps<'div'> & {
  children: React.ReactNode;
};

export function StaggerItem({ children, className, ...rest }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants} className={className} {...rest}>
      {children}
    </motion.div>
  );
}
