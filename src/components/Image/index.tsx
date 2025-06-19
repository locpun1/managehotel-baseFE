import { Box, SxProps } from "@mui/material";
import React, { ImgHTMLAttributes, useState } from "react";
import avatar from "@/assets/images/users/default-avatar.jpg";


interface CommonImageProps extends ImgHTMLAttributes<HTMLImageElement>{
    fallbackSrc?: string;
    sx?: SxProps;
}

const CommonImage: React.FC<CommonImageProps> = ({
    src,
    alt = 'image',
    fallbackSrc = avatar,
    sx= {},
    onError,
    ...rest
}) => {
    const [imgSrc, setImgSrc] = useState(src);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setImgSrc(fallbackSrc);
        if(onError) onError(e)
    }

    return(
        <Box
            component='img'
            src={imgSrc}
            alt={alt}
            loading="lazy"
            onError={handleError}
            sx={{
                maxWidth: '100%',
                height:'auto',
                display:'block',
                borderRadius: 1,
                objectFit: 'fill',
                bgcolor:'grey',
                ...sx,
            }}
            {...rest}
        />
    )
}

export default CommonImage;