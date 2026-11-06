import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function IntroStatement() {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;
    
    const lines = textRef.current.querySelectorAll('.reveal-line');
    
    gsap.fromTo(lines, 
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <section className="product-section min-h-[60vh] flex items-center justify-center bg-(--bg-primary)" ref={containerRef}>
      <div className="w-full max-w-[1200px]" ref={textRef}>
        <div className="overflow-hidden py-1"><h2 className="reveal-line text-statement font-bold text-(--text-primary) uppercase">I BUILD</h2></div>
        <div className="overflow-hidden py-1"><h2 className="reveal-line text-statement font-bold text-(--text-primary) uppercase">SOFTWARE</h2></div>
        <div className="overflow-hidden py-1"><h2 className="reveal-line text-statement font-bold text-(--text-primary) uppercase">SYSTEMS</h2></div>
        <div className="overflow-hidden py-1"><h2 className="reveal-line text-statement font-bold text-(--text-primary) uppercase">AND</h2></div>
        <div className="overflow-hidden py-1"><h2 className="reveal-line text-statement font-bold text-(--accent) uppercase">AI-POWERED</h2></div>
        <div className="overflow-hidden py-1"><h2 className="reveal-line text-statement font-bold text-(--text-primary) uppercase">PRODUCTS.</h2></div>
      </div>
    </section>
  );
}
