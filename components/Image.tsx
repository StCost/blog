// import NextImage, { ImageProps } from "next/image";
//
// const Image = ({ ...rest }: ImageProps) => <NextImage {...rest} />;
//
// export default Image;

import NextImage, { ImageProps } from "next/image";

// @ts-ignore
const Image = ({ ...rest }: ImageProps) => <img {...rest} />;

export default Image;
