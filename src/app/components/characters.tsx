import React from 'react';

const Characters = () => {
  return (
    <div className="relative w-full h-full mt-[-100px] sm:mt-0 flex items-center justify-center">
     
      <div className="absolute z-30 top-0 left-10 md:left-40 lg:left-10 animate-float-center">
        <img 
          src="images/hero_1.png" 
          alt="Hero 1" 
          className="w-48 sm:w-64 h-auto "
        />
      </div>

      <div className="absolute bottom-10 left-[-5] md:left-20 z-25 animate-float-top-left">
        <img 
          src="images/monster_1.png" 
          alt="Monster 1" 
          className="w-18 sm:w-24 h-auto drop-shadow-xl"
        />
      </div>

      <div className="absolute left-[220px]  sm:left-[270] md:left-[450] lg:left-[280] top-1/3 z-25 animate-float-left">
      <img 
          src="images/hero_2.png" 
          alt="Hero 2" 
          className="w-[220px] sm:w-96 h-auto"
        />
      </div>

      <div className="absolute bottom- mt-10 md:mt-10 md:left-20 sm:mt-10 lg:mt-0 left-0 z-22 animate-float-top-center">
        <img 
          src="images/monster_2.png" 
          alt="Monster 2" 
          className="w-full md:w-180 h-auto drop-shadow-xl"
        />
      </div>


    </div>
  );
};

export default Characters;