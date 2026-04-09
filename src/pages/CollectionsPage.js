import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import logo from "../assets/images/Logo.png";

import paintingImg from "../assets/images/artist-types/paintings.jpg";
import sculptureImg from "../assets/images/artist-types/sculpture.jpg";
import photographyImg from "../assets/images/artist-types/photography.jpg";
import printsImg from "../assets/images/artist-types/prints.webp";
import digitalImg from "../assets/images/artist-types/digital.jpg";
import drawingsImg from "../assets/images/artist-types/drawings.jpg";


const artistTypes = [
  {
    label: "Digital Artist",
    slug: "digital",
    image: digitalImg,
    // image: require("../assets/images/artist-types/digital.jpg"),
    description:
      "Digital artists create modern visual experiences using innovative technology.They blend creativity with software tools to design stunning graphics and animations.From social media content to immersive web designs, their work shapes the digital world.With imagination and technology combined, they turn ideas into powerful visual stories."
    // "Digital artists create modern visual experiences using innovative technology.",
  },
  {
    label: "Drawings",
    slug: "drawings",
    image: drawingsImg,
    // image: require("../assets/images/artist-types/drawings.jpg"),
    description:
      "They use tools like Photoshop, Illustrator, and 3D software to bring ideas to life.Digital artists work on branding, websites, games, and social media visuals.Their designs communicate messages in a creative and engaging way.In today's digital era, their skills are highly valuable and in demand.",
  },
  {
    label: "Paintings",
    slug: "paintings",
    image: paintingImg,
    description:
      "Paintings bring stories to life through color, texture, and brush strokes on canvas.Each artwork reflects the emotions and imagination of the artist.Through different styles and techniques, painters express unique perspectives.A single painting can capture moments, memories, and powerful feelings forever.",
  },
  {
    label: "Sculpture",
    slug: "sculpture",
    image: sculptureImg,
    // image: require("../assets/images/artist-types/scul.jpg"),
    description:
      "Sculptures transform materials into powerful three-dimensional art forms that occupy real space.Artists shape stone, metal, clay, or wood into meaningful creations.Each sculpture adds depth, texture, and presence to its surroundings.They tell stories and express emotions through form and structure.",
  },

  {
    label: "Photography",
    slug: "photography",
    image: photographyImg,
    // image: require("../assets/images/artist-types/photography.jpg"),
    description:
      "Photography captures reality, emotion, and perspective through the lens, transforming moments into timeless visual stories.It freezes special memories in a single powerful frame.Through light, angles, and composition, photographers create meaningful images.Every photograph preserves a moment that can be cherished forever.",
  },

  {
    label: "Prints",
    slug: "prints",
    image: printsImg,
    // image: require("../assets/images/artist-types/prints.webp"),
    description:
      "Printmakers transform original artworks into refined collectible editions.They use techniques like engraving, etching, and screen printing to create detailed impressions.Each print maintains the essence of the original design while allowing multiple copies.Their work makes art more accessible while preserving its unique beauty.",
  },
];

export default function ArtistTypeScrollPage() {
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const lastScrollTimeRef = useRef(0);

  const nextArtist = () => {
    setActiveIndex((i) => Math.min(i + 1, artistTypes.length - 1));
  };

  const prevArtist = () => {
    setActiveIndex((i) => Math.max(i - 1, 0));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Swipe threshold
    if (Math.abs(diff) > 70) {
      if (diff > 0) {
        nextArtist();   // swipe left → next
      } else {
        prevArtist();   // swipe right → previous
      }
    }

    setTouchStartX(null);
  };

  useEffect(() => {
    const onWheel = (e) => {
      const now = Date.now();
      const throttleDelay = 500; // Increased throttle to 500ms per action

      // Only process if enough time has passed since last action
      if (now - lastScrollTimeRef.current < throttleDelay) {
        return;
      }

      // Listen for horizontal scroll (deltaX) for left/right navigation
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Horizontal scroll detected
        if (e.deltaX > 0) {
          // Scrolling right → next
          setActiveIndex((i) => Math.min(i + 1, artistTypes.length - 1));
          lastScrollTimeRef.current = now;
        } else if (e.deltaX < 0) {
          // Scrolling left → previous
          setActiveIndex((i) => Math.max(i - 1, 0));
          lastScrollTimeRef.current = now;
        }
      } else if (e.deltaY !== 0) {
        // Fallback: vertical scroll for up/down navigation
        if (e.deltaY > 0) {
          setActiveIndex((i) => Math.min(i + 1, artistTypes.length - 1));
          lastScrollTimeRef.current = now;
        } else {
          setActiveIndex((i) => Math.max(i - 1, 0));
          lastScrollTimeRef.current = now;
        }
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setActiveIndex((i) =>
          Math.min(i + 1, artistTypes.length - 1)
        );
      }

      if (e.key === "ArrowLeft") {
        setActiveIndex((i) =>
          Math.max(i - 1, 0)
        );
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      className="relative w-screen h-[100svh] overflow-hidden bg-black text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={artistTypes[activeIndex].image}
          alt="background-blur"
          className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110"
        />
        <img
          src={artistTypes[activeIndex].image}
          alt="background"
          className="absolute inset-0 w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      </div>

      {/* LOGO – TOP LEFT */}
      {/* <div className="absolute top-6 left-6 z-20">
        <img src={logo} alt="Ziggratus" className="w-28 opacity-90" />
      </div> */}

      {/* LAYOUT */}
      <div className="relative z-10 h-full grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] px-4 md:px-10">

        {/* LEFT PANEL – MINIMAL */}
        <div className="flex flex-col justify-center items-center">
          <div className="text-xs tracking-[0.35em] text-gray-400 rotate-90 origin-left font-bold">
            CURATED ART COLLECTION
          </div>
        </div>

        {/* CENTER – CIRCLES */}
        <div className="
          relative w-full h-[650px] md:h-[500px]
          flex items-end justify-center
          mt-20 md:mt-0
          lg:items-center lg:justify-center"
        >
          <div className="relative w-full h-[500px]">
            {artistTypes.map((type, index) => {
              const offset = index - activeIndex;
              const x = offset * 190;
              const y = Math.abs(offset) * 80;
              const scale = offset === 0 ? 1 : 0.7;
              const opacity = Math.abs(offset) > 2 ? 0 : 1;
              const isActive = offset === 0;

              return (
                <div
                  key={type.label}
                  onClick={() =>
                    offset === 0 && navigate(`/artists/${type.slug}`)
                  }
                  className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out cursor-pointer"
                  style={{
                    transform: `translate(${x}px, ${y}px) scale(${scale})`,
                    opacity,
                    zIndex: 10 - Math.abs(offset),
                  }}
                >
                  <div
                    className={`artist-circle w-28 h-28 rounded-full overflow-hidden shadow-xl transition-all duration-500 ${isActive ? "ring-4 ring-yellow-400 shadow-yellow-400/40" : ""}`}
                  >
                    <img src={type.image} alt={type.label} className="w-full h-full object-cover" />
                  </div>

                  <div className="mt-2 text-center text-sm drop-shadow-lg">
                    {type.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col justify-start items-center gap-4 mt-8 px-4 sm:px-6 md:px-8 w-full">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-relaxed text-center">
            {artistTypes[activeIndex].label}
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed text-center max-w-3xl">
            {artistTypes[activeIndex].description}
          </p>
        </div>

        {/* COUNTER */}
        <div className="absolute bottom-6 right-10 z-50 flex flex-col items-end gap-3">

          {/* Number */}
          <div className="text-sm tracking-widest text-white">
            {String(activeIndex + 1).padStart(2, "0")} / {String(artistTypes.length).padStart(2, "0")}
          </div>

        </div>

      </div>
    </div>
  );
}
