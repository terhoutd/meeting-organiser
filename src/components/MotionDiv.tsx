import React from "react";
import { motion } from "framer-motion";

interface MotionDivProps {
  rightPagination?: boolean;
  children?: React.ReactNode;
}

export function MotionDiv({ rightPagination = false, children }: MotionDivProps) {
  return (
    <motion.div
      initial={{ x: rightPagination ? 32 : -32, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
