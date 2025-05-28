import { useEffect, useState } from "react";

const imageCache = new Map<string, string>();

export function useCachedImage(url?: string | null) {
    const [cachedUrl, setCachedUrl] = useState<string | null>(null);

    useEffect(() => {
        if(!url) return;

        if(imageCache.has(url)){
            setCachedUrl(imageCache.get(url)!);
            return;
        }

        fetch(url)
            .then((res) => {
                if(!res.ok) throw new Error("Image fetch failed");
                return res.blob();
            })
            .then((blob) => {
                const objectUrl = URL.createObjectURL(blob);
                imageCache.set(url, objectUrl);
                setCachedUrl(objectUrl);
            }).catch((err) => {
                console.error("Image load error: ", err, "for URL: ", url);
                setCachedUrl(null); //fallback logic handled by component
                
            })
    }, [url]);

    return cachedUrl;
}