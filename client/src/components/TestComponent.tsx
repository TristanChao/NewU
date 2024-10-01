import { useRef, useEffect, useState } from 'react';

export function TestComponent() {
  const componentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (componentRef.current) {
      setWidth(componentRef.current.getBoundingClientRect().width);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div ref={componentRef}>
        My component content
        <p>Width: {width}</p>
      </div>
      <div>Window width: {windowWidth}</div>
    </>
  );
}
