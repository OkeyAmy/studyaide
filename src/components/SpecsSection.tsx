import React, { useEffect, useState, useRef } from "react";

const SpecsSection = () => {
  const message = "StudyAide works with your learning style, not against it. By automatically generating summaries, flashcards, and mind maps from any content, StudyAide helps you focus on what matters most: understanding and retaining knowledge.";
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Observe when section enters viewport to start typing
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Typing effect runs only after section is visible
  useEffect(() => {
    if (!started) return;
    let index = 0;
    const timer = setInterval(() => {
      setTyped(message.slice(0, index + 1));
      index++;
      if (index >= message.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [started]);

  return (
    <section ref={sectionRef} className="w-full py-6 sm:py-10 bg-white" id="specifications">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header with badge and line */}
        <div className="flex items-center gap-4 mb-8 sm:mb-16">
          <div className="flex items-center gap-4">
            <div className="pulse-chip">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">2</span>
              <span>Intelligence</span>
            </div>
          </div>
          <div className="flex-1 h-[1px] bg-gray-300"></div>
        </div>
        
        {/* Main content with text mask image - responsive text sizing */}
        <div className="max-w-5xl pl-4 sm:pl-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display leading-tight mb-8 sm:mb-12">
            <span className="block bg-clip-text text-transparent bg-[url('/text-mask-image.jpg')] bg-cover bg-center">
              {typed}
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
};

export default SpecsSection;
