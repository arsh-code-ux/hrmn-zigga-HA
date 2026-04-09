import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";

import artistsData from "../data/artists";
import artworkMeta from "../data/artworkMeta";

// import Logo from "../assets/images/Logo.png";

export default function ArtistsPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const lastScrollTimeRef = useRef(0);

  const artists = useMemo(() => {
    if (!type) return [];

    return artistsData.filter((artist) =>
      artist.types &&
      artist.types.includes(type.toLowerCase())
    );
  }, [type]);

  const nextArtist = useCallback(() => {
    setActiveIndex((prev) =>
      Math.min(prev + 1, artists.length - 1)
    );
  }, [artists.length]);

  const prevArtist = useCallback(() => {
    setActiveIndex((prev) =>
      Math.max(prev - 1, 0)
    );
  }, []);



  // ----------------------------
  // 🖱️ Mouse Scroll Handling
  // ----------------------------
  useEffect(() => {
    if (!artists.length) return;

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
          setActiveIndex((prev) => Math.min(prev + 1, artists.length - 1));
          lastScrollTimeRef.current = now;
        } else if (e.deltaX < 0) {
          // Scrolling left → previous
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          lastScrollTimeRef.current = now;
        }
      } else if (e.deltaY !== 0) {
        // Fallback: vertical scroll for up/down navigation
        if (e.deltaY > 0) {
          setActiveIndex((prev) => Math.min(prev + 1, artists.length - 1));
          lastScrollTimeRef.current = now;
        } else {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          lastScrollTimeRef.current = now;
        }
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") nextArtist();
      if (e.key === "ArrowLeft") prevArtist();
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [artists.length, nextArtist, prevArtist]);

  // ----------------------------
  // 📱 Touch Swipe Handling
  // ----------------------------
  const [touchStartX, setTouchStartX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

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
    setActiveIndex(0);
  }, [type]);

  if (!artists.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        No artists added for this category.
      </div>
    );
  }

  const activeArtist = artists[activeIndex];

  return (
    <div
      className="relative w-full h-screen overflow-hidden text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* Background */}
      <div className="absolute inset-0 z-0">

        {/* Blurred Background */}
        <img
          src={activeArtist.image}
          alt="bg-blur"
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
        />

        {/* Main Image */}
        <img
          src={activeArtist.image}
          alt="background"
          className="absolute inset-0 w-full h-full object-contain"
        />

      </div>
      {/* <img
  src={activeArtist.image}
  alt="background"
  className="absolute inset-0 w-full h-full object-cover z-0"
/> */}

      {/* Stronger Right Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/80 z-10" />

      {/* Logo */}
      {/* <div className="absolute top-6 left-6 z-20">
        <img src={Logo} alt="Ziggratts" className="w-20 opacity-90" />
      </div> */}

      {/* Artist Counter */}
      <div className="absolute top-6 right-10 z-30 flex flex-col items-end gap-3">

        {/* Counter */}
        <div className="text-sm text-gray-300 tracking-widest">
          {String(activeIndex + 1).padStart(2, "0")} / {String(artists.length).padStart(2, "0")}
        </div>

      </div>

      {/* Layout */}
      <div className="relative z-20 h-full w-full
  flex flex-col md:flex-col lg:flex-row
  lg:grid lg:grid-cols-3
  gap-4 lg:gap-6
  px-4 lg:px-6
  overflow-hidden">

        {/* LEFT - Info Panel - 25% width */}
        <div className="
flex-shrink-0 lg:w-1/4
flex flex-col 
justify-center
gap-6
text-left
px-0
h-full overflow-y-auto hide-scrollbar
min-w-0
order-1 lg:order-1
">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300 transition cursor-pointer w-fit"
          >
            ← Back
          </button>

          <div>
            <h1 className="text-4xl font-bold transition-all duration-500 mb-2">
              {activeArtist.name}
            </h1>
            <p className="text-sm text-yellow-400 capitalize font-semibold">
              {type}
            </p>
            <div className="text-sm text-gray-300 mt-2">
              {activeArtist.location && (() => {
                const [city, country] = activeArtist.location.split(", ");
                return (
                  <>
                    <p className="text-sm">{country}</p>
                    <p className="text-sm">{city}</p>
                  </>
                );
              })()}
            </div>
          </div>

          {/* About the Artist */}
          <div className="pt-6 border-t-2 border-gray-500 hide-scrollbar">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">
              About the Artist
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {activeArtist.bio}
            </p>
          </div>
        </div>

        {/* CENTER - Main Image Area - 50% width */}
        <div className="
  flex-1 lg:w-1/2
  flex items-center justify-center 
  order-2 lg:order-2
  h-96 md:h-96 lg:h-full
  min-w-0
  relative
">
          {artists.map((artist, index) => {
            const offset = index - activeIndex;
            const isActive = offset === 0;

            return (
              <div
                key={artist.id}
                onClick={() =>
                  isActive && navigate(`/collections/${artist.slug}`)
                }
                className="absolute transition-all duration-700 ease-out cursor-pointer"
                style={{
                  transform: `
                    translateX(${offset * 100}px)
                    translateY(${Math.abs(offset) * 25}px)
                    scale(${isActive ? 1 : 0.75})
                  `,
                  opacity: Math.abs(offset) > 2 ? 0 : 1,
                  zIndex: isActive ? 20 : 10,
                }}
              >
                <div
                  className={`w-20 h-20 rounded-full overflow-hidden border transition-all duration-500 ${isActive
                      ? "ring-4 ring-yellow-400 shadow-yellow-400/40"
                      : "border-white/40"
                    }`}
                >
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-center text-xs mt-2">
                  {artist.name}
                </p>
              </div>
            );
          })}
        </div>
        {/* RIGHT - Artwork Details - 25% width */}
        <div className="
  flex-shrink-0 lg:w-1/4
  flex flex-col 
  justify-center
  gap-3
  text-xs
  text-gray-200
  transition-all duration-500
  text-left
  h-full overflow-y-auto px-0 hide-scrollbar
  min-w-0
  order-3 lg:order-3
">
          {/* About The Artwork */}
          {artworkMeta[activeArtist.slug] && (() => {
            const artworkSlug = Object.keys(artworkMeta[activeArtist.slug])[0];
            const artwork = artworkMeta[activeArtist.slug][artworkSlug];
            const artworkDetails = typeof artwork === 'string' 
              ? { description: artwork, title: "Untitled" }
              : artwork;

            return (
              <div>
                <h4 className="text-sm font-bold text-yellow-400 mb-2">
                  About The Artwork
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed font-normal mb-1">
                  {artworkDetails.title || "Untitled"}
                </p>
                {artworkDetails.description && (
                  <p className="text-xs text-gray-300 leading-relaxed mt-2">
                    {artworkDetails.description}
                  </p>
                )}

                {/* Artwork Details */}
                <div className="pt-3 border-t-2 border-gray-500 mt-3">
                  <h3 className="text-sm font-bold text-yellow-400 mb-2">
                    Artwork Details
                  </h3>
                  
                  <div className="space-y-0.5 text-xs text-gray-300">
                    {artworkDetails.category && (
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-semibold whitespace-nowrap text-xs">Category</span>
                        <span className="text-gray-400 text-right break-words text-xs">{artworkDetails.category}</span>
                      </div>
                    )}
                    {artworkDetails.style && (
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-semibold whitespace-nowrap text-xs">Style</span>
                        <span className="text-gray-400 text-right break-words text-xs">{artworkDetails.style}</span>
                      </div>
                    )}
                    {artworkDetails.techniques && (
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-semibold whitespace-nowrap text-xs">Techniques</span>
                        <span className="text-gray-400 text-right break-words text-xs">{artworkDetails.techniques}</span>
                      </div>
                    )}
                    {artworkDetails.size && (
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-semibold whitespace-nowrap text-xs">Size (WxH)</span>
                        <span className="text-gray-400 text-right break-words text-xs">{artworkDetails.size}</span>
                      </div>
                    )}
                    {artworkDetails.material && (
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-semibold whitespace-nowrap text-xs">Material used</span>
                        <span className="text-gray-400 text-right break-words text-xs">{artworkDetails.material}</span>
                      </div>
                    )}
                    {artworkDetails.medium && (
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-semibold whitespace-nowrap text-xs">Medium</span>
                        <span className="text-gray-400 text-right break-words text-xs">{artworkDetails.medium}</span>
                      </div>
                    )}
                    {artworkDetails.sellingOptions && (
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-semibold whitespace-nowrap text-xs">Selling Options</span>
                        <span className="text-gray-400 text-right break-words text-xs">{artworkDetails.sellingOptions}</span>
                      </div>
                    )}
                    {artworkDetails.year && (
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-semibold whitespace-nowrap text-xs">Year of art work</span>
                        <span className="text-gray-400 text-right break-words text-xs">{artworkDetails.year}</span>
                      </div>
                    )}
                    {artworkDetails.deliveredAs && (
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-semibold whitespace-nowrap text-xs">Artwork will be delivered as</span>
                        <span className="text-gray-400 text-right break-words text-xs">{artworkDetails.deliveredAs}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

      </div>
    </div>
  );
}
