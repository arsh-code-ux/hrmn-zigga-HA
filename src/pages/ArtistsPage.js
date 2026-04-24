import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";

import artistsData from "../data/artists";
import artworkMeta from "../data/artworkMeta";

export default function ArtistsPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const lastScrollTimeRef = useRef(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const artists = useMemo(() => {
    if (!type) return [];
    return artistsData.filter((artist) =>
      artist.types && artist.types.includes(type.toLowerCase())
    );
  }, [type]);

  const nextArtist = useCallback(() => {
    setActiveIndex((prev) => Math.min(prev + 1, artists.length - 1));
  }, [artists.length]);

  const prevArtist = useCallback(() => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  // Mouse Scroll Handling
  useEffect(() => {
    if (!artists.length) return;

    const onWheel = (e) => {
      const now = Date.now();
      const throttleDelay = 500;

      if (now - lastScrollTimeRef.current < throttleDelay) return;

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (e.deltaX > 0) {
          setActiveIndex((prev) => Math.min(prev + 1, artists.length - 1));
          lastScrollTimeRef.current = now;
        } else if (e.deltaX < 0) {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          lastScrollTimeRef.current = now;
        }
      } else if (e.deltaY !== 0) {
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

  // Touch Swipe Handling
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;

    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 70) {
      if (diff > 0) {
        nextArtist();
      } else {
        prevArtist();
      }
    }

    setTouchStartX(null);
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [type]);

  if (!artists.length) {
    return (
      <div className="w-full min-h-screen md:h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center px-4">
          <p className="text-xl md:text-2xl font-bold">No artists added for this category.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  const activeArtist = artists[activeIndex];

  return (
    <div
      className="relative w-full min-h-screen md:h-screen overflow-x-hidden text-white bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* MOBILE BACKGROUND - Top section only */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-48 z-0 overflow-hidden">
        <img
          src={activeArtist.image}
          alt="bg-blur"
          className="w-full h-full object-cover blur-md opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      {/* DESKTOP BACKGROUND - Full screen */}
      <div className="hidden md:block absolute inset-0 z-0">
        <img
          src={activeArtist.image}
          alt="bg-blur"
          className="absolute inset-0 w-full h-full object-cover blur-xl scale-110"
        />
        <img
          src={activeArtist.image}
          alt="background"
          className="absolute inset-0 w-full h-full object-contain opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/80" />
      </div>

      {/* MOBILE GRADIENT OVERLAY */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-black/30 via-black/60 to-black z-5 pointer-events-none" />

      {/* Artist Counter - Top Right */}
      <div className="absolute top-4 md:top-6 right-4 md:right-10 z-30 flex flex-col items-end">
        <div className="text-xs md:text-sm text-gray-300 tracking-widest font-bold bg-black/40 px-3 py-1 rounded-full">
          {String(activeIndex + 1).padStart(2, "0")} / {String(artists.length).padStart(2, "0")}
        </div>
      </div>

      {/* MAIN CONTENT - MOBILE VERTICAL LAYOUT */}
      <div className="md:hidden relative z-20 w-full min-h-screen pt-40 pb-4 px-4 flex flex-col gap-4">
        {/* Artist Info */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300 font-bold transition"
          >
            ← Back
          </button>

          <div className="space-y-1">
            <h1 className="text-2xl font-black line-clamp-2">
              {activeArtist.name}
            </h1>
            <p className="text-sm text-yellow-400 capitalize font-bold">
              {type.toUpperCase()}
            </p>
          </div>

          {activeArtist.location && (
            <div className="space-y-1 border-t border-gray-600 pt-2">
              <p className="text-xs text-yellow-400 font-bold uppercase">Location</p>
              {(() => {
                const [city, country] = activeArtist.location.split(", ");
                return (
                  <div className="text-xs text-gray-300">
                    <p>{city}</p>
                    <p>{country}</p>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="space-y-1 border-t border-gray-600 pt-2">
            <p className="text-xs text-yellow-400 font-bold uppercase">About</p>
            <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
              {activeArtist.bio}
            </p>
          </div>

          {activeArtist.education && (
            <div className="space-y-1 border-t border-gray-600 pt-2">
              <p className="text-xs text-yellow-400 font-bold uppercase">Education</p>
              <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                {activeArtist.education}
              </p>
            </div>
          )}
        </div>

        {/* Main Artist Image */}
        <div className="flex justify-center py-4">
          <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-yellow-400 shadow-lg shadow-yellow-400/50 flex-shrink-0">
            <img
              src={activeArtist.image}
              alt={activeArtist.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mobile Thumbnails - Horizontal Scroll */}
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-2 px-2">
            {artists.map((artist, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={artist.id}
                  onClick={() => setActiveIndex(index)}
                  className={`flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                    isActive
                      ? "border-yellow-400 ring-2 ring-yellow-400"
                      : "border-gray-500 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Artwork Details for Mobile */}
        {(artworkMeta[activeArtist.slug] && (() => {
          const artworkSlug = Object.keys(artworkMeta[activeArtist.slug])[0];
          const artwork = artworkMeta[activeArtist.slug][artworkSlug];
          const artworkDetails = typeof artwork === 'string'
            ? { description: artwork, title: "Untitled" }
            : artwork;

          return (
            <div className="space-y-3 border-t border-gray-600 pt-4">
              <div className="space-y-1">
                <h3 className="text-xs font-black text-yellow-400 uppercase">Title</h3>
                <p className="text-xs text-gray-300 line-clamp-2">{artworkDetails.title || "Untitled"}</p>
              </div>

              {artworkDetails.description && (
                <div className="space-y-1 border-t border-gray-600 pt-2">
                  <h3 className="text-xs font-black text-yellow-400 uppercase">Description</h3>
                  <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">{artworkDetails.description}</p>
                </div>
              )}

              {(artworkDetails.category || artworkDetails.style) && (
                <div className="space-y-1 border-t border-gray-600 pt-2">
                  <h3 className="text-xs font-black text-yellow-400 uppercase">Details</h3>
                  <div className="text-xs text-gray-300 space-y-1">
                    {artworkDetails.category && <p>📌 Category: {artworkDetails.category}</p>}
                    {artworkDetails.style && <p>🎨 Style: {artworkDetails.style}</p>}
                  </div>
                </div>
              )}
            </div>
          );
        })()) || (
          <div className="space-y-2 border-t border-gray-600 pt-4">
            <h3 className="text-xs font-black text-yellow-400 uppercase">Overview</h3>
            <p className="text-xs text-gray-300 line-clamp-4 leading-relaxed">{activeArtist.bio}</p>
          </div>
        )}
      </div>

      {/* DESKTOP LAYOUT - 3 COLUMN GRID */}
      <div className="hidden md:grid relative z-20 h-full w-full grid-cols-[0.9fr_1.3fr_1.3fr] gap-8 px-8 py-0 overflow-hidden">
        {/* LEFT PANEL - Artist Info */}
        <div className="flex flex-col justify-center items-start gap-4 text-left h-full overflow-y-auto pr-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-lg text-yellow-400 hover:text-yellow-300 transition font-black"
          >
            ← Back
          </button>

          <div className="space-y-2 w-full">
            <h1 className="text-5xl font-black leading-tight tracking-tight">
              {activeArtist.name}
            </h1>
            <p className="text-lg text-yellow-400 capitalize font-bold">
              {type.toUpperCase()}
            </p>
          </div>

          {activeArtist.location && (
            <div className="space-y-2 border-t border-gray-700 pt-3 w-full">
              <h3 className="text-sm font-black text-yellow-400 uppercase">Location</h3>
              {(() => {
                const [city, country] = activeArtist.location.split(", ");
                return (
                  <div className="text-sm text-gray-300">
                    <p>{city}</p>
                    <p>{country}</p>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="space-y-2 border-t border-gray-700 pt-3 w-full">
            <h3 className="text-sm font-black text-yellow-400 uppercase">About Artist</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              {activeArtist.bio}
            </p>
          </div>

          {activeArtist.education && (
            <div className="space-y-2 border-t border-gray-700 pt-3 w-full">
              <h3 className="text-sm font-black text-yellow-400 uppercase">Education</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeArtist.education}
              </p>
            </div>
          )}
        </div>

        {/* CENTER PANEL - Main Image & Carousel */}
        <div className="flex items-end justify-center h-full relative pb-20">
          {artists.map((artist, index) => {
            const offset = index - activeIndex;
            const isActive = offset === 0;

            return (
              <div
                key={artist.id}
                className="absolute transition-all duration-700 ease-out cursor-pointer"
                onClick={() => isActive && navigate("/")}
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
                  className={`w-24 h-24 rounded-full overflow-hidden border transition-all duration-500 ${
                    isActive
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
                <p className="text-center text-xs mt-2 px-2">{artist.name}</p>
              </div>
            );
          })}
        </div>

        {/* RIGHT PANEL - Artwork Details */}
        <div className="flex flex-col justify-center items-start gap-4 text-sm text-gray-200 text-left h-full overflow-y-auto pl-4">
          {(artworkMeta[activeArtist.slug] && (() => {
            const artworkSlug = Object.keys(artworkMeta[activeArtist.slug])[0];
            const artwork = artworkMeta[activeArtist.slug][artworkSlug];
            const artworkDetails = typeof artwork === 'string'
              ? { description: artwork, title: "Untitled" }
              : artwork;

            return (
              <div className="space-y-3 w-full">
                <div className="space-y-2 w-full">
                  <h3 className="text-sm font-black text-yellow-400 uppercase">Title</h3>
                  <p className="text-xs text-gray-300">
                    {artworkDetails.title || "Untitled"}
                  </p>
                </div>

                {artworkDetails.description && (
                  <div className="space-y-2 border-t border-gray-700 pt-3 w-full">
                    <h3 className="text-sm font-black text-yellow-400 uppercase">Description</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {artworkDetails.description}
                    </p>
                  </div>
                )}

                {(artworkDetails.category || artworkDetails.style || artworkDetails.techniques || artworkDetails.material) && (
                  <div className="space-y-2 border-t border-gray-700 pt-3 w-full">
                    <h3 className="text-sm font-black text-yellow-400 uppercase">Details</h3>
                    <div className="space-y-1 text-xs text-gray-300">
                      {artworkDetails.category && <p>Category: {artworkDetails.category}</p>}
                      {artworkDetails.style && <p>Style: {artworkDetails.style}</p>}
                      {artworkDetails.techniques && <p>Techniques: {artworkDetails.techniques}</p>}
                      {artworkDetails.material && <p>Material: {artworkDetails.material}</p>}
                    </div>
                  </div>
                )}

                {(artworkDetails.size || artworkDetails.year) && (
                  <div className="space-y-2 border-t border-gray-700 pt-3 w-full">
                    <h3 className="text-sm font-black text-yellow-400 uppercase">Specs</h3>
                    <div className="space-y-1 text-xs text-gray-300">
                      {artworkDetails.size && <p>Size: {artworkDetails.size}</p>}
                      {artworkDetails.year && <p>Year: {artworkDetails.year}</p>}
                    </div>
                  </div>
                )}
              </div>
            );
          })()) || (
            <div className="space-y-3 w-full">
              <div className="space-y-2">
                <h3 className="text-sm font-black text-yellow-400 uppercase">Overview</h3>
                <p className="text-xs leading-relaxed">
                  {activeArtist.name} is a dedicated {type} artist showcasing unique artistic vision.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
