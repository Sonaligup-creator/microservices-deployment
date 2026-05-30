import React from 'react';
import Image from 'next/image';

const NextImage = ({ src, alt, priority, quality }) => {
  const myLoader = ({ src, quality }) => {
    if (src.startsWith('http://') || src.startsWith('https://')) {
      if (src.includes('dropbox.com')) {
        let url = src
          .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
          .replace('dropbox.com', 'dl.dropboxusercontent.com');

        url = url.replace(/([?&])dl=0(&|$)/, '$1').replace(/([?&])dl=1(&|$)/, '$1');
        if (!url.includes('raw=1')) {
          url += url.includes('?') ? '&raw=1' : '?raw=1';
        }
        return url;
      }

      return src;
    }

    if (src[0] === 'v') {
      return `https://res.cloudinary.com/ecommerce/image/upload/q_${quality || 60}/${src}`;
    }

    return `https://www.dropbox.com/s/${src}?raw=1&q=${quality || 70}`;
  };

  return (
		<Image
			loader={myLoader}
			src={src}
			layout="fill"
			objectFit="cover"
			priority={priority || false}
			alt={alt}
		/>
  );
};

export default NextImage;

