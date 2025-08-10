import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Spline from "@splinetool/react-spline";


export default function LandingPage() {
  const navigate = useNavigate();
  const [sceneLoaded, setSceneLoaded] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-pink-300 via-fuchsia-200 to-purple-300 flex flex-col justify-center items-center overflow-hidden">
      {/* Loader while 3D scene loads */}
      {!sceneLoaded && (
        <div className="absolute z-0 flex justify-center items-center w-full h-full bg-black/30 text-white text-xl">
          <span className="loading loading-spinner loading-xs"></span>
        </div>
      )}

      {/* Spline 3D */}
      <Spline
        scene="https://prod.spline.design/mDj1ZCkQ-AG52zcC/scene.splinecode"
        onLoad={() => setSceneLoaded(true)}
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      />

      {/* Overlay content */}
      <div className="z-10 text-center space-y-6 px-6" data-aos="fade-up">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.4)]">
          Your DSA Buddy, <span className="text-yellow-300">Rohit Negi</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white font-light drop-shadow-[0_3px_3px_rgba(0,0,0,0.3)]">
          Decode, Learn, Conquer!
        </p>
        <button
          onClick={() => navigate("/chatbot")}
          className="btn btn-primary btn-wide animate-bounce shadow-xl bg-amber-500">
          Get Started
        </button>
      </div>
    </div>
  );
}
