"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { FreeMode, Thumbs, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import ResilientImage from '../ResilientImage';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';

interface ProductGalleryProps {
    images: any;
    isTrending?: boolean;
}

const ProductGallery = ({ images, isTrending }: ProductGalleryProps) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedImage]);

    const allImages = typeof images === 'string'
        ? images.split(',').map(img => img.trim()).filter(Boolean)
        : Array.isArray(images) ? images : [];

    const lightbox = (
        <AnimatePresence>
            {selectedImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-[100000] p-2 bg-black/20 rounded-full"
                        onClick={() => setSelectedImage(null)}
                    >
                        <MdClose size={32} />
                    </button>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative max-w-6xl w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage}
                            alt="Expanded product view"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl pointer-events-none select-none"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="flex flex-col gap-4 self-start h-fit w-full">
            {/* Main Image Slider */}
            <div className="relative w-full aspect-square max-w-[882px] mx-auto overflow-hidden rounded-[10px] !bg-white group border border-[#e6dbdf] dark:border-gray-800/50 shadow-sm cursor-zoom-in">
                <Swiper
                    spaceBetween={10}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    modules={[FreeMode, Thumbs, Autoplay]}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    loop={allImages.length > 1}
                    className="h-full w-full !bg-white"
                >
                    {allImages.map((img, index) => (
                        <SwiperSlide
                            key={`main-${index}`}
                            className="!bg-white"
                            onClick={() => setSelectedImage(img)}
                        >
                            <div className="relative w-full h-full flex items-center justify-center !bg-white">
                                <ResilientImage
                                    src={img}
                                    alt={`Product image ${index + 1}`}
                                    className="w-full h-full object-cover transition-opacity duration-500"
                                    loading={index === 0 ? "eager" : "lazy"}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Trending Badge */}
                <div className="absolute top-4 right-6 z-20 pointer-events-none">
                    {isTrending && (
                        <span className="inline-block bg-[#C20059] text-white px-3 py-1 rounded text-[10px] font-medium tracking-wider uppercase shadow-md leading-tight">
                            Trending
                        </span>
                    )}
                </div>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
                <div className="w-full max-w-[882px] mx-auto">
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={12}
                        slidesPerView={4}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, Thumbs]}
                        className="thumbs-swiper"
                        breakpoints={{
                            640: { slidesPerView: 5 },
                            768: { slidesPerView: 6 },
                        }}
                    >
                        {allImages.map((img, index) => (
                            <SwiperSlide key={`thumb-${index}`}>
                                <div className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-300 ${activeIndex === index ? 'border-[#1C1C1C]' : 'border-transparent hover:border-gray-200'
                                    }`}>
                                    <ResilientImage
                                        src={img}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            {/* Render Lightbox via Portal to bypass stacking contexts */}
            {mounted && createPortal(lightbox, document.body)}

            <style jsx global>{`
                .thumbs-swiper {
                    padding: 4px 0;
                }
                .thumbs-swiper .swiper-slide {
                    width: 20%;
                    height: auto;
                }
                .thumbs-swiper .swiper-slide-thumb-active .relative {
                    border-color: #1C1C1C !important;
                }
            `}</style>
        </div>
    );
};

export default ProductGallery;
