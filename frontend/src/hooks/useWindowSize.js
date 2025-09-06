import { useState, useEffect } from 'react';

/**
 * A custom React hook that tracks the browser window's width.
 * @returns {number} The current width of the window in pixels.
 */
const useWindowSize = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures this effect runs only on mount and unmount

  return windowWidth;
};

export default useWindowSize;