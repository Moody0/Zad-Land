/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState } from "react";
import Image, { ImageProps } from "next/image";
import { getImageSourceCandidates, IMAGE_PLACEHOLDER_SRC } from "@/lib/image-utils";

interface ResilientImageProps extends Omit<ImageProps, "src" | "alt"> {
    src: string | null | undefined;
    fallbackSrc?: string;
    skeletonClassName?: string;
    alt?: string;
}

const ResilientImage = ({
    src,
    fallbackSrc = IMAGE_PLACEHOLDER_SRC,
    alt,
    onError,
    onLoad,
    className,
    skeletonClassName,
    ...imgProps
}: ResilientImageProps) => {
    const candidates = useMemo(
        () => getImageSourceCandidates(src, fallbackSrc),
        [fallbackSrc, src]
    );
    const sourceKey = candidates.join("|");
    return (
        <ResilientImageInner
            key={sourceKey}
            candidates={candidates}
            fallbackSrc={fallbackSrc}
            alt={alt}
            onError={onError}
            onLoad={onLoad}
            className={className}
            skeletonClassName={skeletonClassName}
            imgProps={imgProps}
        />
    );
};

interface ResilientImageInnerProps {
    candidates: string[];
    fallbackSrc: string;
    alt?: string;
    onError?: ImageProps["onError"];
    onLoad?: ImageProps["onLoad"];
    className?: string;
    skeletonClassName?: string;
    imgProps: Omit<ImageProps, "src" | "alt">;
}

const ResilientImageInner = ({
    candidates,
    fallbackSrc,
    alt,
    onError,
    onLoad,
    className,
    skeletonClassName,
    imgProps,
}: ResilientImageInnerProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const currentSrc = candidates[currentIndex] || fallbackSrc;

    return (
        <span className="relative block h-full w-full overflow-hidden">
            <span
                aria-hidden="true"
                className={`absolute inset-0 overflow-hidden bg-[#f8eef2] dark:bg-white/6 ${skeletonClassName || ""} ${isLoaded ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
            >
                <span className="image-shimmer absolute inset-0" />
            </span>
            <Image
                {...imgProps}
                alt={alt || ""}
                src={currentSrc}
                fill
                sizes={imgProps.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                className={`${className || ""} block transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={(event) => {
                    setIsLoaded(true);
                    onLoad?.(event);
                }}
                onError={(event) => {
                    setIsLoaded(false);
                    setCurrentIndex((previousIndex) => {
                        if (previousIndex < candidates.length - 1) {
                            return previousIndex + 1;
                        }

                        return previousIndex;
                    });

                    onError?.(event);
                }}
            />
        </span>
    );
};

export default ResilientImage;
