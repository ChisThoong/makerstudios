import React from 'react';

const Background = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main Background Image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="/images/bg_pc.png" 
          alt="Background" 
          className="w-full h-full object-cover "
        />
      </div>

      {/* Floating X O Decorations */}
      {/* Top Left - Circle */}
      <div className="absolute top-[5%] left-[0%] animate-float-slow">
        <img 
          src="/images/bg_1.png" 
          alt="Decoration" 
          className="w-36 h-36 "
        />
      </div>

      {/* Top Right - X */}
      <div className="absolute top-[15%] right-[50%] animate-float-medium">
        <img 
          src="/images/bg_4.png" 
          alt="Decoration" 
          className="w-32 h-32 "
        />
      </div>
      <div className="absolute top-[5%] right-[2%] animate-float-medium">
        <img 
          src="/images/bg_5.png" 
          alt="Decoration" 
          className="w-32 h-32 "
        />
      </div>

      {/* Middle Left - Circle */}
      <div className="absolute top-[45%] left-[5%] animate-float-fast">
        <img 
          src="/images/bg_1.png" 
          alt="Decoration" 
          className="w-28 h-28 opacity-35"
        />
      </div>

      {/* Bottom Left - X */}
      <div className="absolute bottom-[3%] left-[5%] animate-float-slow">
        <img 
          src="/images/bg_3.png" 
          alt="Decoration" 
          className="w-32 h-32 "
        />
      </div>

      {/* Bottom Right - Circle */}
      <div className="absolute bottom-[-5%] right-[-2%] animate-float-medium">
        <img 
          src="/images/bg_2.png" 
          alt="Decoration" 
          className="w-72 h-72"
        />
      </div>

      {/* Top Center - Small Circle */}
      {/* <div className="absolute top-[8%] right-[35%] animate-float-fast">
        <img 
          src="/images/bg_3.png" 
          alt="Decoration" 
          className="w-16 h-16 "
        />
      </div> */}

      {/* Middle Right - X */}
      {/* <div className="absolute top-[50%] right-[8%] animate-float-slow">
        <img 
          src="images/bg_1.png" 
          alt="Decoration" 
          className="w-24 h-24"
        />
      </div> */}

      {/* Bottom Center - Circle */}
      {/* <div className="absolute bottom-[10%] left-[40%] animate-float-medium">
        <img 
          src="/images/bg_2.png" 
          alt="Decoration" 
          className="w-20 h-20"
        />
      </div> */}
    </div>
  );
};

export default Background;