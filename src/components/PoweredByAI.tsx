import React from "react";

const PoweredByAI = () => {
  return (
    <section id="powered-by-ai" className="w-full">
      <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden relative">
        <div
          className="bg-no-repeat bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage: "url('/background-section3.png')",
            minHeight: '250px',
            padding: '2rem'
          }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair text-white italic font-thin text-center m-0">
            Powered By AI &amp; Education
          </h2>
        </div>
      </div>
    </section>
  );
};

export default PoweredByAI;
