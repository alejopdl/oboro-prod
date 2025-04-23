// Purpose: Visual connector between product cards to show relationships between levels

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

/**
 * ProductConnector component that draws SVG lines between products in different levels
 * to show the relationship and unlock path.
 * 
 * @param props - Component props
 * @param props.startRef - Reference to the starting product element
 * @param props.endRef - Reference to the ending product element
 * @param props.isUnlocked - Whether the end product is unlocked
 * @param props.direction - Direction of the connection (vertical or horizontal)
 * @returns JSX Element
 */
export default function ProductConnector({
  startRef,
  endRef,
  isUnlocked = false,
  direction = 'vertical'
}: {
  startRef: React.RefObject<HTMLElement>;
  endRef: React.RefObject<HTMLElement>;
  isUnlocked?: boolean;
  direction?: 'vertical' | 'horizontal';
}) {
  const [path, setPath] = useState('');
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0, left: 0, top: 0 });
  const prefersReducedMotion = useReducedMotion();

  // Calculate the path between the two elements
  useEffect(() => {
    const calculatePath = () => {
      if (!startRef.current || !endRef.current) return;

      const startRect = startRef.current.getBoundingClientRect();
      const endRect = endRef.current.getBoundingClientRect();
      
      // Use viewport-relative positioning to avoid scroll issues
      // Calculate the center bottom of the start element
      const startX = startRect.left + (startRect.width / 2);
      // Move starting point up by 10px for better positioning
      const startY = startRect.bottom - 10; 
      
      // Calculate the center top of the end element
      const endX = endRect.left + (endRect.width / 2);
      // Move ending point up by 5px
      const endY = endRect.top - 5;
      
      // Calculate the SVG dimensions
      const minX = Math.min(startX, endX);
      const minY = Math.min(startY, endY);
      const width = Math.abs(startX - endX) + 20; // Add padding
      const height = Math.abs(startY - endY) + 20;
      
      // Set absolute positioning values relative to the viewport
      // Add a small vertical offset to position connectors slightly higher
      setSvgDimensions({
        width,
        height,
        left: minX - 10, // Subtract half of padding
        top: minY - 15, // Move up a bit more
      });
      
      // Calculate relative positions within the SVG
      const relStartX = startX - minX + 10;
      const relStartY = startY - minY + 10;
      const relEndX = endX - minX + 10;
      const relEndY = endY - minY + 10;
      
      // Create a curved path
      // For vertical connections (between levels)
      if (direction === 'vertical') {
        const midY = (relStartY + relEndY) / 2;
        setPath(`M ${relStartX} ${relStartY} C ${relStartX} ${midY}, ${relEndX} ${midY}, ${relEndX} ${relEndY}`);
      } 
      // For horizontal connections (within the same level)
      else {
        const midX = (relStartX + relEndX) / 2;
        setPath(`M ${relStartX} ${relStartY} C ${midX} ${relStartY}, ${midX} ${relEndY}, ${relEndX} ${relEndY}`);
      }
    };

    calculatePath();
    
    // Recalculate on window resize
    window.addEventListener('resize', calculatePath);
    return () => window.removeEventListener('resize', calculatePath);
  }, [startRef, endRef, direction]);

  if (!path) return null;

  return (
    <div 
      className="fixed pointer-events-none z-0" 
      style={{
        left: svgDimensions.left,
        top: svgDimensions.top,
        width: svgDimensions.width,
        height: svgDimensions.height,
      }}
    >
      <svg width="100%" height="100%" overflow="visible">
        <motion.path
          d={path}
          fill="none"
          strokeWidth={2.5}
          strokeDasharray={isUnlocked ? "0" : "5,5"}
          initial={{ 
            pathLength: 0, 
            opacity: 0,
            stroke: isUnlocked ? "#16a34a" : "#ef4444" 
          }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            stroke: isUnlocked ? "#16a34a" : "#ef4444" 
          }}
          transition={{ 
            duration: prefersReducedMotion ? 0.5 : 1.5, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Arrow at the end of the path */}
        <motion.polygon
          points="0,-4 8,0 0,4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: prefersReducedMotion ? 0.3 : 0.8 }}
          fill={isUnlocked ? "#16a34a" : "#ef4444"}
          style={{
            transform: `translate(${svgDimensions.width/2}px, ${svgDimensions.height - 10}px) rotate(90deg)`,
          }}
        />
      </svg>
    </div>
  );
}
