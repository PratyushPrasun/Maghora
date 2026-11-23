"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Copy, Heart, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { MithilaLotus } from "./MithilaMotifs";

interface InstagramPostItem {
  id: string;
  image: string;
  alt: string;
  type: "reel" | "carousel" | "photo";
  likes: string | number;
  comments: string | number;
  caption: string;
  permalink?: string;
}

const DEFAULT_POSTS: InstagramPostItem[] = [
  {
    id: "post-1",
    image: "/maghora_peri_peri_01.jpg",
    alt: "Maghora Peri Peri Makhana roasted in pure olive oil",
    type: "reel",
    likes: "1,420",
    comments: "86",
    caption: "Slow-roasted to an airy, golden crunch with whole Indian spices 🔥 #Maghora",
  },
  {
    id: "post-2",
    image: "/maghora_mac_cheese_01.jpg",
    alt: "Maghora Truffle Mac & Cheese Flavoured Foxnuts",
    type: "carousel",
    likes: "2,180",
    comments: "142",
    caption: "Seven signature flavours, infinite mindful cravings. Which one is your pantry pick? ✨",
  },
  {
    id: "post-3",
    image: "/banner2.png",
    alt: "Sacred wetland makhana harvests from Mithila, Bihar",
    type: "reel",
    likes: "3,560",
    comments: "214",
    caption: "From the sacred freshwater pokhars of northern Bihar to your snack bowl 🌸",
  },
  {
    id: "post-4",
    image: "/maghora_cream_onion.jpg",
    alt: "Maghora Cream & Onion Roasted Foxnuts",
    type: "reel",
    likes: "1,890",
    comments: "95",
    caption: "Tangy spring onion & velvety cream. 100% vegetarian, zero palm oil 🌿",
  },
  {
    id: "post-5",
    image: "/Magnora.png",
    alt: "Maghora Artisanal Tasting Box Collection",
    type: "carousel",
    likes: "2,940",
    comments: "188",
    caption: "Unboxing Bihar's super-snack, reimagined with culinary love 🎁",
  },
  {
    id: "post-6",
    image: "/maghora_sweet_chilli_01.jpg",
    alt: "Maghora Sweet Chilli & Salt Pepper Makhana",
    type: "reel",
    likes: "1,670",
    comments: "73",
    caption: "Fresh batches rolling out of the roaster every morning. Crispy, light & satvik 📦",
  },
];

export function InstagramFeed() {
  const instagramUrl ="https://www.instagram.com/_maghora/";
  const instagramHandle =
    process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "_maghora";
  const liveFeedEndpoint = process.env.NEXT_PUBLIC_INSTAGRAM_FEED_ENDPOINT;
  const elfsightWidgetId =
    process.env.NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_ID ||
    "d070777d-a5f6-4a3a-97f4-f08468b980f6";

  const [posts, setPosts] = useState<InstagramPostItem[]>(DEFAULT_POSTS);
  const [followerCount, setFollowerCount] = useState<string>("638");
  const [postCount, setPostCount] = useState<string>("69");
  const [followingCount, setFollowingCount] = useState<string>("4");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLive, setIsLive] = useState<boolean>(false);

  // Load Elfsight platform script if widget ID is configured
  useEffect(() => {
    if (!elfsightWidgetId) return;

    const existingScript = document.querySelector('script[src*="platform.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    } else if (typeof window !== "undefined" && (window as any).elfsight) {
      try {
        (window as any).elfsight.init();
      } catch {
        // fallback
      }
    }
  }, [elfsightWidgetId]);

  // Fetch live Instagram posts and metrics if a feed endpoint (e.g., Behold.so, Graph API proxy, or Elfsight JSON) is configured
  useEffect(() => {
    if (!liveFeedEndpoint) return;

    let isMounted = true;
    setIsLoading(true);

    fetch(liveFeedEndpoint)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch live Instagram feed");
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;

        // Support Behold.so format
        if (Array.isArray(data)) {
          const mappedPosts: InstagramPostItem[] = data.slice(0, 6).map((item: any, idx: number) => ({
            id: item.id || `live-post-${idx}`,
            image: item.mediaUrl || item.thumbnailUrl || "/logo-mark.png",
            alt: item.prunedCaption || "Maghora Instagram post",
            type: item.mediaType === "VIDEO" ? "reel" : item.mediaType === "CAROUSEL_ALBUM" ? "carousel" : "photo",
            likes: item.likeCount ? item.likeCount.toLocaleString() : "1.2K",
            comments: item.commentsCount ? item.commentsCount.toLocaleString() : "45",
            caption: item.caption || item.prunedCaption || "",
            permalink: item.permalink || instagramUrl,
          }));

          setPosts(mappedPosts);
          setIsLive(true);
        }
        // Support custom object with followers & media counts
        else if (data && typeof data === "object") {
          if (data.followersCount) {
            setFollowerCount(
              typeof data.followersCount === "number"
                ? `${(data.followersCount / 1000).toFixed(1)}K`
                : String(data.followersCount)
            );
          }
          if (data.mediaCount) {
            setPostCount(String(data.mediaCount));
          }
          if (Array.isArray(data.posts) && data.posts.length > 0) {
            const mappedPosts: InstagramPostItem[] = data.posts.slice(0, 6).map((item: any, idx: number) => ({
              id: item.id || `live-post-${idx}`,
              image: item.image || item.mediaUrl || "/logo-mark.png",
              alt: item.caption || "Maghora post",
              type: item.type || (item.mediaType === "VIDEO" ? "reel" : "photo"),
              likes: item.likes || "1.5K",
              comments: item.comments || "62",
              caption: item.caption || "",
              permalink: item.permalink || instagramUrl,
            }));
            setPosts(mappedPosts);
          }
          setIsLive(true);
        }
      })
      .catch((err) => {
        console.warn("Instagram live feed endpoint unavailable, using cached assets:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [liveFeedEndpoint, instagramUrl]);

  return (
    <section
      id="instagram"
      className="bg-[#F8EEDC] py-10 sm:py-16 border-b border-[#E8D7BE]/70 select-none relative overflow-hidden"
      aria-label="Latest on Instagram"
    >
      <div className="mx-auto max-w-5xl px-3.5 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEDEC4]/60 border border-[#E8D7BE] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#702C32] mb-2 font-serif">
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
            <span>{isLive ? "Live Instagram Feed" : "Community & Kitchen Stories"}</span>
            <MithilaLotus className="h-3 w-3 text-[#E8B84E]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-wide text-[#702C32] uppercase">
            Latest on Instagram
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#33251F]/75 leading-relaxed font-serif">
            Fresh glimpses from our roastery, wetland harvests &amp; kitchen to your feed.
          </p>
        </div>

        {/* Instagram Profile & Feed Container Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-[#E8D7BE] bg-white p-3.5 sm:p-6 shadow-[0_12px_40px_rgba(51,37,31,0.06)] overflow-hidden min-h-[320px]">
          {elfsightWidgetId ? (
            <div className={`elfsight-app-${elfsightWidgetId}`} data-elfsight-app-lazy />
          ) : (
            <>
              {/* Profile Bar Header */}
              <div className="flex items-center justify-between pb-3.5 sm:pb-5 mb-3.5 sm:mb-5 border-b border-[#E8D7BE]/70">
            {/* Left: Avatar with Instagram Gradient Ring + Actual Profile Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 sm:gap-5 w-full">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full p-[2.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shrink-0 shadow-sm transition-transform hover:scale-105 cursor-pointer"
                aria-label="View Maghora on Instagram"
              >
                <div className="relative h-full w-full rounded-full bg-white p-1 overflow-hidden shadow-inner">
                  <Image
                    src="/logo.png"
                    alt="MAGHORA on Instagram"
                    fill
                    className="object-contain p-0.5"
                    priority
                  />
                </div>
              </a>

              <div className="flex-1 min-w-0">
                {/* Handle + Verified Tick + Follow Button */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-base sm:text-xl text-[#33251F] hover:text-[#702C32] transition-colors font-sans"
                    >
                      {instagramHandle}
                    </a>
                    {/* Blue Verified Badge */}
                    <span
                      title="Verified Account"
                      className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-[#1877F2] text-white shrink-0 shadow-xs"
                    >
                      <svg className="h-2.5 w-2.5 fill-current" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </span>
                  </div>

                  {/* Actions: Follow CTA + Instagram Icon */}
                  <div className="flex items-center gap-2">
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 sm:py-2 rounded-xl bg-[#702C32] hover:bg-[#551F24] text-white text-xs font-serif font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>Follow</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>

                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open Maghora on Instagram"
                      className="h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 rounded-full bg-[#F8EEDC] hover:bg-[#EEDEC4] flex items-center justify-center text-[#702C32] transition-all cursor-pointer"
                    >
                      <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Display Name & Category */}
                <p className="font-serif font-extrabold text-sm sm:text-base text-[#33251F] mt-1 leading-tight">
                  MAGHORA
                </p>
                <p className="text-[11px] text-[#7B685F] font-medium">
                  Product/service
                </p>

                {/* Exact Stats: Posts · Followers · Following */}
                <div className="flex items-center gap-4 sm:gap-6 text-xs text-[#33251F] my-2 pt-0.5">
                  <div>
                    <span className="font-bold text-[#702C32]">{postCount}</span>{" "}
                    <span className="text-[#7B685F]">posts</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#702C32]">{followerCount}</span>{" "}
                    <span className="text-[#7B685F]">followers</span>
                  </div>
                  <div>
                    <span className="font-bold text-[#702C32]">{followingCount}</span>{" "}
                    <span className="text-[#7B685F]">following</span>
                  </div>
                </div>

                {/* Exact Bio Text from Profile */}
                <div className="text-xs text-[#33251F]/90 leading-relaxed font-sans space-y-0.5 pt-1">
                  <p className="font-semibold text-[#702C32]">MAGHORA™</p>
                  <p className="font-medium">ANCIENT ROOTS. MODERN TASTE. 🌿</p>
                  <p>🌱 Rooted in Bihar’s Makhana Heritage</p>
                  <p>✨ Crafted for the Modern Generation</p>
                </div>

                {/* Link in bio */}
                <div className="mt-2 pt-1 flex items-center gap-1.5 text-xs text-[#702C32] font-medium">
                  <svg className="h-3.5 w-3.5 shrink-0 stroke-[2.2]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <a
                    href="https://dl.flipkart.com/s/3Z8Ee8NNNN"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-semibold text-[11px] sm:text-xs text-[#702C32]"
                  >
                    dl.flipkart.com/s/3Z8Ee8NNNN
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 6-Tile Instagram Grid (3 columns x 2 rows) */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-[#702C32]">
              <Loader2 className="h-8 w-8 animate-spin text-[#702C32] mb-2" />
              <p className="text-xs font-serif font-semibold">Fetching latest Instagram posts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3.5">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={post.permalink || instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#244C38] border border-[#E8D7BE]/70 cursor-pointer shadow-2xs block"
                >
                  {/* Media Image */}
                  <Image
                    src={post.image}
                    alt={post.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-108"
                  />

                  {/* Top-Right Badge: Reel or Carousel Icon */}
                  <div className="absolute top-2 right-2 z-10 drop-shadow-md">
                    {post.type === "reel" ? (
                      <div className="h-6 w-6 rounded-full bg-black/45 backdrop-blur-xs flex items-center justify-center text-white">
                        <Play className="h-3 w-3 fill-white translate-x-0.2" />
                      </div>
                    ) : post.type === "carousel" ? (
                      <div className="h-6 w-6 rounded-full bg-black/45 backdrop-blur-xs flex items-center justify-center text-white">
                        <Copy className="h-3 w-3" />
                      </div>
                    ) : null}
                  </div>

                  {/* Hover Overlay: Instagram Engagement Counts & Caption Preview */}
                  <div className="absolute inset-0 bg-black/55 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 sm:p-4 text-white z-20">
                    <div className="text-[10px] sm:text-xs text-white/90 line-clamp-2 sm:line-clamp-3 leading-snug">
                      {post.caption}
                    </div>

                    <div className="flex items-center justify-center gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-4 w-4 fill-white" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="h-4 w-4 fill-white" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

            {/* Bottom Mobile Follow CTA Button */}
            <div className="mt-4 pt-3.5 border-t border-[#E8D7BE]/60 text-center sm:hidden">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#702C32] text-[#F8EEDC] text-xs font-serif font-bold uppercase tracking-wider"
              >
                <span>Follow @{instagramHandle} on Instagram</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </>
        )}
        </div>
      </div>
    </section>
  );
}

