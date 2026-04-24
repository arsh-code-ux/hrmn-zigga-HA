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
  lg:grid lg:grid-cols-[0.9fr_1.3fr_1.3fr]
  gap-4 lg:gap-8
  px-4 lg:px-8
  overflow-hidden"
      style={{ height: 'calc(100vh - 0px)', overflow: 'hidden' }}>


        {/* LEFT - Info Panel - 33% width */}
        <div className="
flex-shrink-0
flex flex-col 
justify-center
items-start
gap-4
text-left
px-3 lg:px-6 py-3
h-full overflow-y-auto overflow-x-hidden
w-full
order-1 lg:order-1
"
        style={{ overflow: 'hidden' }}>
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-lg text-yellow-400 hover:text-yellow-300 transition cursor-pointer font-black self-start"
          >
            ← Back
          </button>

          {/* Artist Name & Type */}
          <div className="space-y-2 w-full">
            <h1 className="text-5xl font-black transition-all duration-500 leading-tight tracking-tight">
              {activeArtist.name}
            </h1>
            <p className="text-lg text-yellow-400 capitalize font-bold">
              {type.toUpperCase()}
            </p>
          </div>

          {/* Location */}
          {activeArtist.location && (
            <div className="space-y-2 border-t border-gray-700 pt-3 w-full">
              <h3 className="text-sm font-black text-yellow-400 uppercase">LOCATION</h3>
              {(() => {
                const [city, country] = activeArtist.location.split(", ");
                return (
                  <div className="text-sm text-gray-300 leading-relaxed">
                    <p>{city}</p>
                    <p>{country}</p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* About the Artist */}
          <div className="space-y-2 border-t border-gray-700 pt-3 w-full">
            <h3 className="text-sm font-black text-yellow-400 uppercase">About Artist</h3>
            <p className="text-xs text-gray-300 leading-relaxed font-medium">
              {activeArtist.bio}
            </p>
          </div>

          {/* Education */}
          {activeArtist.education && (
            <div className="space-y-2 border-t border-gray-700 pt-3 w-full">
              <h3 className="text-sm font-black text-yellow-400 uppercase">EDUCATION</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-medium">
                {activeArtist.education}
              </p>
            </div>
          )}


        </div>

        {/* CENTER - Main Image Area - 33% width */}
        <div className="
  flex-1 lg:w-1/3
  flex items-end justify-center 
  order-2 lg:order-2
  h-96 md:h-96 lg:h-[calc(100%-160px)]
  min-w-0
  relative
  pb-20
  overflow-hidden"
        >
          {artists.map((artist, index) => {
            const offset = index - activeIndex;
            const isActive = offset === 0;

            return (
              <div
                key={artist.id}
                onClick={() =>
                  isActive && navigate("/")
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
        {/* RIGHT - Artwork Details - 33% width */}
        <div className="
  flex-shrink-0
  flex flex-col 
  justify-center
  items-start
  gap-4
  text-sm
  text-gray-200
  transition-all duration-500
  text-left
  h-full overflow-y-auto overflow-x-hidden px-3 lg:px-6 py-3
  w-full
  order-3 lg:order-3
"
        style={{ overflow: 'hidden' }}>
          {/* About The Artwork */}
          {artworkMeta[activeArtist.slug] && (() => {
            const artworkSlug = Object.keys(artworkMeta[activeArtist.slug])[0];
            const artwork = artworkMeta[activeArtist.slug][artworkSlug];
            const artworkDetails = typeof artwork === 'string' 
              ? { description: artwork, title: "Untitled" }
              : artwork;

            return (
              <div className="space-y-3 w-full">
                {/* Title */}
                <div className="space-y-2 w-full">
                  <h3 className="text-sm font-black text-yellow-400 uppercase">TITLE</h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">
                    {artworkDetails.title || "Untitled"}
                  </p>
                </div>

                {/* Description */}
                {artworkDetails.description && (
                  <div className="space-y-2 border-t border-gray-700 pt-3 w-full">
                    <h3 className="text-sm font-black text-yellow-400 uppercase">DESC</h3>
                    <p className="text-xs text-gray-300 leading-relaxed font-medium">
                      {artworkDetails.description}
                    </p>
                  </div>
                )}

                {/* Artwork Details */}
                {(artworkDetails.category || artworkDetails.style || artworkDetails.techniques || artworkDetails.material) && (
                  <div className="space-y-2 border-t border-gray-700 pt-3 w-full">
                    <h3 className="text-sm font-black text-yellow-400 uppercase">DETAILS</h3>
                    
                    <div className="space-y-2 text-xs text-gray-300 font-medium">
                      {artworkDetails.category && (
                        <div className="flex justify-between gap-3">
                          <span className="font-semibold whitespace-nowrap">Category:</span>
                          <span className="text-right">{artworkDetails.category}</span>
                        </div>
                      )}
                      {artworkDetails.style && (
                        <div className="flex justify-between gap-3">
                          <span className="font-semibold whitespace-nowrap">Style:</span>
                          <span className="text-right">{artworkDetails.style}</span>
                        </div>
                      )}
                      {artworkDetails.techniques && (
                        <div className="flex justify-between gap-3">
                          <span className="font-semibold whitespace-nowrap">Techniques:</span>
                          <span className="text-right">{artworkDetails.techniques}</span>
                        </div>
                      )}
                      {artworkDetails.material && (
                        <div className="flex justify-between gap-3">
                          <span className="font-semibold whitespace-nowrap">Material:</span>
                          <span className="text-right">{artworkDetails.material}</span>
                        </div>
                      )}
                      {artworkDetails.medium && (
                        <div className="flex justify-between gap-3">
                          <span className="font-semibold whitespace-nowrap">Medium:</span>
                          <span className="text-right">{artworkDetails.medium}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {(artworkDetails.size || artworkDetails.year) && (
                  <div className="space-y-2 border-t border-gray-700 pt-3 w-full">
                    <h3 className="text-sm font-black text-yellow-400 uppercase">SPECS</h3>
                    
                    <div className="space-y-2 text-xs text-gray-300 font-medium">
                      {artworkDetails.size && (
                        <div className="flex justify-between gap-3">
                          <span className="font-semibold whitespace-nowrap">Size:</span>
                          <span className="text-right text-xs">{artworkDetails.size}</span>
                        </div>
                      )}
                      {artworkDetails.year && (
                        <div className="flex justify-between gap-3">
                          <span className="font-semibold whitespace-nowrap">Year:</span>
                          <span className="text-right text-xs">{artworkDetails.year}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Selling Info */}
                {(artworkDetails.sellingOptions || artworkDetails.deliveredAs) && (
                  <div className="space-y-2 border-t border-gray-700 pt-3 w-full">
                    <h3 className="text-sm font-black text-yellow-400 uppercase">SELL</h3>
                    
                    <div className="space-y-2 text-xs text-gray-300 font-medium">
                      {artworkDetails.sellingOptions && (
                        <div className="flex justify-between gap-3">
                          <span className="font-semibold whitespace-nowrap">Options:</span>
                          <span className="text-right">{artworkDetails.sellingOptions}</span>
                        </div>
                      )}
                      {artworkDetails.deliveredAs && (
                        <div className="flex justify-between gap-3">
                          <span className="font-semibold whitespace-nowrap">Delivered:</span>
                          <span className="text-right">{artworkDetails.deliveredAs}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })() || (
            <div className="text-xs text-gray-300 space-y-3 w-full font-medium">
              {/* Artist Overview */}
              <div className="space-y-2">
                <h3 className="text-sm font-black text-yellow-400 uppercase">OVERVIEW</h3>
                <p className="text-xs leading-relaxed">
                  {activeArtist.name} is a dedicated {type} artist.
                </p>
              </div>

              {/* Art Philosophy */}
              <div className="space-y-2 border-t border-gray-700 pt-3">
                <h3 className="text-sm font-black text-yellow-400 uppercase">VISION</h3>
                <p className="text-xs leading-relaxed">
                  {activeArtist.bio}
                </p>
              </div>

              {/* Experience */}
              {activeArtist.experience && (
                <div className="space-y-2 border-t border-gray-700 pt-3">
                  <h3 className="text-sm font-black text-yellow-400 uppercase">EXPERIENCE</h3>
                  <p className="text-xs leading-relaxed">
                    {activeArtist.experience}
                  </p>
                </div>
              )}

              {/* Style */}
              {activeArtist.style && (
                <div className="space-y-2 border-t border-gray-700 pt-3">
                  <h3 className="text-sm font-black text-yellow-400 uppercase">STYLE</h3>
                  <p className="text-xs leading-relaxed">
                    {activeArtist.style}
                  </p>
                </div>
              )}

              {/* Specialization */}
              {activeArtist.specialization && (
                <div className="space-y-2 border-t border-gray-700 pt-3">
                  <h3 className="text-sm font-black text-yellow-400 uppercase">SPECIAL</h3>
                  <p className="text-xs leading-relaxed">
                    {activeArtist.specialization}
                  </p>
                </div>
              )}

              {/* Career Highlights */}
              {activeArtist.careerHighlights && (
                <div className="space-y-2 border-t border-gray-700 pt-3">
                  <h3 className="text-sm font-bold text-yellow-400 uppercase">CAREER HIGHLIGHTS</h3>
                  <p className="text-xs leading-relaxed">
                    {activeArtist.careerHighlights}
                  </p>
                </div>
              )}

              {/* Category Details */}
              <div className="space-y-2 border-t border-gray-700 pt-3">
                <h3 className="text-sm font-black text-yellow-400 uppercase">CATEGORY</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold">Type:</span>
                    <span className="text-right capitalize">{type}</span>
                  </div>
                  {activeArtist.specialization && (
                    <div className="flex justify-between gap-3 text-xs">
                      <span className="font-semibold">Type:</span>
                      <span className="text-right">{activeArtist.specialization.split(",")[0]}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Default Info if no specific data */}
              {/* Default Info if no specific data */}
              {!activeArtist.awards && (
                <div className="space-y-2 border-t border-gray-700 pt-3 pb-3">
                  <h3 className="text-sm font-bold text-yellow-400 uppercase">ARTIST COLLECTION</h3>
                  <p className="text-xs leading-relaxed">
                    Explore the diverse collection of artworks by {activeArtist.name}. Each piece represents a unique perspective and artistic journey in the {type} category.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
