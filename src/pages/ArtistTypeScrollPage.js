import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import logo from "../assets/images/Logo.png";

import paintingImg from "../assets/images/artist-types/paintings.jpg";
import sculptureImg from "../assets/images/artist-types/sculpture.jpg";
import photographyImg from "../assets/images/artist-types/photography.jpg";
import printsImg from "../assets/images/artist-types/prints.webp";
import digitalImg from "../assets/images/artist-types/digital.jpg";
import drawingsImg from "../assets/images/artist-types/drawings.jpg";


const artistTypes = [
  {
    label: "Digital Artwork",
    slug: "digital",
    image: digitalImg,
    // image: require("../assets/images/artist-types/digital.jpg"),
    description:
      "Digital artwork is a modern form of visual art created using advanced digital tools and software. Artists use platforms like Adobe Photoshop, Illustrator, and Procreate to design graphics, illustrations, and animations with precision and creativity. It plays an important role in today's digital era, especially in web design, advertising, gaming, and social media. Digital art allows easy editing and faster production compared to traditional methods, helping artists create visually engaging designs for a global audience.",
    type: "Digital Medium",
    tools: "Adobe Photoshop, Adobe Illustrator, Procreate, Clip Studio Paint, Blender",
    techniques: "Digital Painting, Vector Graphics, 3D Rendering, Photo Manipulation",
    applications: "Web Design, Advertising, Gaming, Social Media, Animation",
    keyFeatures: "Non-destructive editing, Layer-based composition, Unlimited color palette, Easy revisions"
  },
  {
    label: "Drawings",
    slug: "drawings",
    image: drawingsImg,
    // image: require("../assets/images/artist-types/drawings.jpg"),
    description:
      "Drawings capture pure artistic expression through line, form, and shadow. They range from quick sketches to detailed studies, representing the foundational art form that develops observation and technical skills. Drawings can be realistic or abstract, using various techniques to create depth and emotion.",
    type: "Drawing Medium",
    tools: "Graphite Pencils, Charcoal, Ink, Colored Pencils, Pastels, Fine-liner Pens",
    techniques: "Hatching, Cross-hatching, Blending, Stippling, Perspective Drawing",
    applications: "Fine Art, Illustration, Concept Art, Figure Studies, Architectural Sketches",
    keyFeatures: "Direct creative expression, Immediate feedback, Versatile materials, Portable"
  },
  {
    label: "Paintings",
    slug: "paintings",
    image: paintingImg,
    description:
      "Paintings bring stories to life through color, texture, and brush strokes on canvas. Each artwork reflects the emotions and imagination of the artist. Through different styles and techniques, painters express unique perspectives. A single painting can capture moments, memories, and powerful feelings forever.",
    type: "Painting Medium",
    tools: "Oil Paint, Acrylic Paint, Watercolor, Canvas, Brushes, Palette Knives",
    techniques: "Impasto, Glazing, Dry Brush, Wet-on-wet, Scumbling",
    applications: "Fine Art, Portraiture, Landscape, Still Life, Murals",
    keyFeatures: "Rich color depth, Tactile texture, Time investment, Lasting durability"
  },
  {
    label: "Sculpture",
    slug: "sculpture",
    image: sculptureImg,
    // image: require("../assets/images/artist-types/scul.jpg"),
    description:
      "Sculptures transform materials into powerful three-dimensional art forms that occupy real space. Artists shape stone, metal, clay, or wood into meaningful creations. Each sculpture adds depth, texture, and presence to its surroundings. They tell stories and express emotions through form and structure.",
    type: "3D Sculptural Form",
    tools: "Clay, Stone, Metal, Wood, Casting Equipment, Chisels, Welding Tools",
    techniques: "Carving, Modeling, Casting, Welding, Assembly, Stone Cutting",
    applications: "Public Art, Monuments, Gallery Installations, Decorative Pieces, Architectural Elements",
    keyFeatures: "Three-dimensional perspective, Spatial engagement, Tactile qualities, Permanent presence"
  },

  {
    label: "Photography",
    slug: "photography",
    image: photographyImg,
    // image: require("../assets/images/artist-types/photography.jpg"),
    description:
      "Photography captures reality, emotion, and perspective through the lens, transforming moments into timeless visual stories. It freezes special memories in a single powerful frame. Through light, angles, and composition, photographers create meaningful images. Every photograph preserves a moment that can be cherished forever.",
    type: "Light-based Medium",
    tools: "Digital Camera, DSLR, Mirrorless Cameras, Lenses, Tripods, Lighting Equipment, Adobe Lightroom",
    techniques: "Composition, Lighting, Exposure Control, Depth of Field, Post-processing",
    applications: "Portrait, Landscape, Commercial, Documentary, Fine Art, Fashion, Events",
    keyFeatures: "Authentic representation, Instant capture, Versatile perspectives, Emotional documentation"
  },

  {
    label: "Prints",
    slug: "prints",
    image: printsImg,
    // image: require("../assets/images/artist-types/prints.webp"),
    description:
      "Printmakers transform original artworks into refined collectible editions. They use techniques like engraving, etching, and screen printing to create detailed impressions. Each print maintains the essence of the original design while allowing multiple copies. Their work makes art more accessible while preserving its unique beauty.",
    type: "Print Medium",
    tools: "Printing Plates, Screen Printing Frame, Ink, Press Equipment, Chisels, Acid Bath",
    techniques: "Etching, Engraving, Screen Printing, Lithography, Relief Printing, Digital Printing",
    applications: "Fine Art Editions, Posters, Commercial Prints, Book Illustrations, Art Reproduction",
    keyFeatures: "Multiple editions, Precise detail, Traditional craftsmanship, Accessibility, Collectibility"
  },
];

export default function ArtistTypeScrollPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const lastScrollTimeRef = useRef(0);
  
  // Check if we're on an inner artist page
  const isInnerPage = location.pathname.startsWith('/artists/');

  // Reset to first item when coming back to home page
  useEffect(() => {
    if (location.pathname === '/') {
      setActiveIndex(0);
    }
  }, [location.pathname]);

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
      // Don't navigate if scrolling inside overflow-x-auto containers
      if (e.target.closest('.overflow-x-auto')) {
        return;
      }

      // On mobile (small screens), don't navigate with vertical scroll
      // Only horizontal scroll (swipe on trackpad) should navigate
      const isMobile = window.innerWidth < 768;
      
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
      } else if (e.deltaY !== 0 && !isMobile) {
        // Vertical scroll only navigates on desktop, not mobile
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
      className="relative w-full min-h-screen md:h-screen overflow-x-hidden bg-black text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* MOBILE BACKGROUND - Top portion only */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-40 z-0 overflow-hidden">
        <img
          src={artistTypes[activeIndex].image}
          alt="background-blur"
          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/70" />
      </div>

      {/* DESKTOP BACKGROUND - Full screen */}
      <div className="hidden md:block absolute inset-0 z-0 overflow-hidden">
        <img
          src={artistTypes[activeIndex].image}
          alt="background-blur"
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
        />
        <img
          src={artistTypes[activeIndex].image}
          alt="background"
          className="absolute inset-0 w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/80" />
      </div>

      {/* MOBILE GRADIENT OVERLAY */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-black/20 via-black/60 to-black z-5 pointer-events-none" />

      {/* LOGO – TOP LEFT */}
      {/* <div className="absolute top-6 left-6 z-20">
        <img src={logo} alt="Ziggratus" className="w-28 opacity-90" />
      </div> */}

      {/* COUNTER - Top Right */}
      <div className="absolute top-4 md:top-6 right-4 md:right-10 z-50 flex flex-col items-end">
        <div className="text-xs md:text-sm text-white tracking-widest font-bold bg-black/40 px-3 py-1 rounded-full">
          {String(activeIndex + 1).padStart(2, "0")} / {String(artistTypes.length).padStart(2, "0")}
        </div>
      </div>

      {/* MOBILE LAYOUT - VERTICAL STACKING */}
      <div className="md:hidden relative z-10 w-full min-h-screen pt-4 pb-6 px-4 flex flex-col gap-4 overflow-y-auto show-scrollbar">
        {/* Title & Type */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-black">{artistTypes[activeIndex].label}</h2>
          <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider">{artistTypes[activeIndex].type}</p>
        </div>

        {/* Main Image Circle - Clickable to see artists in this category */}
        <div className="flex justify-center cursor-pointer" onClick={() => navigate(`/artists/${artistTypes[activeIndex].slug}`)}>
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-400 shadow-lg shadow-yellow-400/50 hover:shadow-yellow-400 hover:shadow-2xl transition-all">
            <img src={artistTypes[activeIndex].image} alt={artistTypes[activeIndex].label} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Description - What is it? */}
        <div className="space-y-2">
          <h3 className="text-xs font-black text-yellow-400 uppercase">What is it?</h3>
          <div className="overflow-x-auto show-scrollbar">
            <p className="text-xs text-gray-300 leading-relaxed text-justify whitespace-normal">
              {artistTypes[activeIndex].description}
            </p>
          </div>
        </div>

        {/* Primary Use - Medium Type */}
        <div className="space-y-2 border-t border-gray-600 pt-3">
          <h3 className="text-xs font-black text-yellow-400 uppercase">Medium Type</h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            {artistTypes[activeIndex].type} is part of our curated art collection featuring diverse artistic expressions.
          </p>
        </div>

        {/* Tools & Materials */}
        <div className="space-y-2 border-t border-gray-600 pt-3">
          <h3 className="text-xs font-black text-yellow-400 uppercase">Tools & Materials</h3>
          <div className="overflow-x-auto show-scrollbar">
            <p className="text-xs text-gray-300 leading-relaxed whitespace-normal">
              {artistTypes[activeIndex].tools}
            </p>
          </div>
        </div>

        {/* Techniques */}
        <div className="space-y-2 border-t border-gray-600 pt-3">
          <h3 className="text-xs font-black text-yellow-400 uppercase">Techniques</h3>
          <div className="overflow-x-auto show-scrollbar">
            <p className="text-xs text-gray-300 leading-relaxed whitespace-normal">
              {artistTypes[activeIndex].techniques}
            </p>
          </div>
        </div>

        {/* Applications */}
        <div className="space-y-2 border-t border-gray-600 pt-3">
          <h3 className="text-xs font-black text-yellow-400 uppercase">Applications</h3>
          <div className="overflow-x-auto show-scrollbar">
            <p className="text-xs text-gray-300 leading-relaxed whitespace-normal">
              {artistTypes[activeIndex].applications}
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="space-y-2 border-t border-gray-600 pt-3">
          <h3 className="text-xs font-black text-yellow-400 uppercase">Key Features</h3>
          <div className="overflow-x-auto show-scrollbar">
            <p className="text-xs text-gray-300 leading-relaxed whitespace-normal">
              {artistTypes[activeIndex].keyFeatures}
            </p>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT - 3 COLUMN GRID */}
      <div className="hidden md:grid relative z-10 h-full w-full grid-cols-[1fr_2fr_1fr] gap-8 px-10 py-0 overflow-hidden">

        {/* LEFT PANEL – DETAILED INFO */}
        <div className="flex flex-col justify-start items-start gap-4 mt-20 px-3 py-6 h-full overflow-y-auto">
          <div className="text-xs tracking-[0.2em] text-yellow-400 font-bold mb-4">
            CATEGORY GUIDE
          </div>

          {/* Category Header */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-yellow-400">WHAT IS IT?</h3>
            <p className="text-xs text-gray-200 leading-relaxed max-w-xs">
              {artistTypes[activeIndex].label} is part of our curated art collection featuring diverse artistic expressions.
            </p>
          </div>

          {/* Primary Application */}
          <div className="space-y-2 border-t border-gray-700 pt-3">
            <h3 className="text-xs font-bold text-yellow-400">PRIMARY USE</h3>
            <p className="text-xs text-gray-200 leading-relaxed max-w-xs">
              {artistTypes[activeIndex].applications?.split(",")[0] || "Artistic expression"}
            </p>
          </div>

          {/* Complexity Level */}
          <div className="space-y-2 border-t border-gray-700 pt-3">
            <h3 className="text-xs font-bold text-yellow-400">SKILL LEVEL</h3>
            <p className="text-xs text-gray-200 leading-relaxed max-w-xs">
              Beginner to Advanced - Artists develop expertise over time with practice and experience.
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-2 border-t border-gray-700 pt-3">
            <h3 className="text-xs font-bold text-yellow-400">TIME TO CREATE</h3>
            <p className="text-xs text-gray-200 leading-relaxed max-w-xs">
              Varies from hours to months depending on complexity, size, and artistic vision.
            </p>
          </div>

          {/* Cost Range */}
          <div className="space-y-2 border-t border-gray-700 pt-3">
            <h3 className="text-xs font-bold text-yellow-400">INVESTMENT</h3>
            <p className="text-xs text-gray-200 leading-relaxed max-w-xs">
              From affordable to high-end. Quality varies based on materials and artist expertise.
            </p>
          </div>

          {/* History */}
          <div className="space-y-2 border-t border-gray-700 pt-3 pb-6">
            <h3 className="text-xs font-bold text-yellow-400">HERITAGE</h3>
            <p className="text-xs text-gray-200 leading-relaxed max-w-xs">
              Combines traditional artistry with contemporary techniques, bridging classic and modern expression.
            </p>
          </div>
        </div>

        {/* CENTER – CIRCLES */}
        <div className="
          relative w-full
          flex items-end justify-center
          pb-20"
        >
          <div className="relative w-full h-32">
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
                    offset === 0 && !isInnerPage && navigate(`/artists/${type.slug}`)
                  }
                  className={`absolute left-1/2 -translate-x-1/2 transition-all duration-500 ease-out ${isInnerPage ? 'cursor-default' : 'cursor-pointer'}`}
                  style={{
                    bottom: '0px',
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
        <div className="flex flex-col justify-start items-center gap-6 mt-20 px-4 sm:px-6 md:px-8 w-full h-full overflow-y-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-relaxed text-center">
            {artistTypes[activeIndex].label}
          </h2>
          
          <p className="text-sm text-gray-100 leading-relaxed text-center max-w-3xl">
            {artistTypes[activeIndex].description}
          </p>

          {/* Type */}
          <div className="w-full border-t border-gray-600 pt-4">
            <h3 className="text-sm font-bold text-yellow-400 mb-2">MEDIUM TYPE</h3>
            <p className="text-sm text-gray-100">{artistTypes[activeIndex].type}</p>
          </div>

          {/* Tools */}
          <div className="w-full border-t border-gray-600 pt-4">
            <h3 className="text-sm font-bold text-yellow-400 mb-2">TOOLS & MATERIALS</h3>
            <p className="text-xs text-gray-100 leading-relaxed">{artistTypes[activeIndex].tools}</p>
          </div>

          {/* Techniques */}
          <div className="w-full border-t border-gray-600 pt-4">
            <h3 className="text-sm font-bold text-yellow-400 mb-2">TECHNIQUES</h3>
            <p className="text-xs text-gray-100 leading-relaxed">{artistTypes[activeIndex].techniques}</p>
          </div>

          {/* Applications */}
          <div className="w-full border-t border-gray-600 pt-4">
            <h3 className="text-sm font-bold text-yellow-400 mb-2">APPLICATIONS</h3>
            <p className="text-xs text-gray-100 leading-relaxed">{artistTypes[activeIndex].applications}</p>
          </div>

          {/* Key Features */}
          <div className="w-full border-t border-gray-600 pt-4 pb-10">
            <h3 className="text-sm font-bold text-yellow-400 mb-2">KEY FEATURES</h3>
            <p className="text-xs text-gray-100 leading-relaxed">{artistTypes[activeIndex].keyFeatures}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
