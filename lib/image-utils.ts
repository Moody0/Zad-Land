export const IMAGE_PLACEHOLDER_SRC = "/placeholder.svg";

const isRemoteImageUrl = (url: string) => /^https?:\/\//i.test(url);

const getProxyImageUrl = (url: string) => `/_next/image?url=${encodeURIComponent(url)}&w=1080&q=75`;

const appendRetryParam = (url: string, attempt: number) =>
    `${url}${url.includes("?") ? "&" : "?"}retry=${attempt}`;

const cleanUrl = (url: string): string => {
    let cleaned = url.trim();
    if (cleaned.includes('/api/image-proxy?url=')) {
        try {
            const urlParam = cleaned.split('url=')[1].split('&')[0];
            cleaned = decodeURIComponent(urlParam);
        } catch (e) {
            // ignore
        }
    }
    return cleaned;
};

/**
 * Checks if an image URL needs to be proxied to bypass regional blocks (e.g., Shopify CDN in Syria).
 */
export const getSafeImageUrl = (url: string | null | undefined): string => {
    if (!url) return IMAGE_PLACEHOLDER_SRC;

    const trimmedUrl = cleanUrl(url);

    // Shopify CDN is blocked in some regions (e.g., Syria)
    if (trimmedUrl.includes("cdn.shopify.com")) {
        return getProxyImageUrl(trimmedUrl);
    }

    return trimmedUrl || IMAGE_PLACEHOLDER_SRC;
};

export const parseImageList = (images: string | null | undefined): string[] => {
    if (!images) {
        return [];
    }

    return images
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean);
};

export const getPrimaryImage = (images: string | null | undefined): string =>
    parseImageList(images)[0] || IMAGE_PLACEHOLDER_SRC;

export const getImageSourceCandidates = (
    url: string | null | undefined,
    fallbackSrc: string = IMAGE_PLACEHOLDER_SRC
): string[] => {
    if (!url) {
        return [fallbackSrc];
    }

    const trimmedUrl = cleanUrl(url);

    if (!trimmedUrl) {
        return [fallbackSrc];
    }

    const candidates = [trimmedUrl];
    const isRemote = isRemoteImageUrl(trimmedUrl);

    if (isRemote) {
        candidates.push(appendRetryParam(trimmedUrl, 1));
    }

    candidates.push(fallbackSrc);

    return [...new Set(candidates.filter(Boolean))];
};
