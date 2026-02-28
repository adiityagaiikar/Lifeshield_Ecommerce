export const getProductImageSrc = (image?: string | null) => {
    if (!image || image === 'no-photo.jpg') {
        return '/assets/products/default.svg';
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
        return image;
    }

    if (image.startsWith('/')) {
        return image;
    }

    const fileNamePattern = /\.(svg|png|jpg|jpeg|webp|gif)$/i;
    if (fileNamePattern.test(image)) {
        return image.startsWith('/assets/products/') ? image : `/assets/products/${image}`;
    }

    if (image.startsWith('/products/')) {
        return image.replace('/products/', '/assets/products/');
    }

    return `/${image}`;
};
