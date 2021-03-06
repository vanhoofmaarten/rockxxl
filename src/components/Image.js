import React, { Component, createRef, Fragment } from "react";
import styled from "styled-components";
import cloudinary from "cloudinary-core";
import withIntersectionObserver from "./withIntersectionObserver";

const Image = styled.img`
    width: 100%;
    display: block;
    transition: opacity .25s ease-in-out;
    opacity: ${({ styled: { loaded } }) => (loaded ? 1 : 0)};
    position: relative;
    z-index: 2;
    ${({ styled: { fit } }) => fit && `
        position: absolute
        top: 0;
        left: 0;
        height: 100%;
        object-fit: cover;
    `}
`;

const Wrapper = styled.div.attrs(
    ({ aspectRatio }) => aspectRatio && {
        style: {
            paddingBottom: `${aspectRatio.split(":")[1] / aspectRatio.split(":")[0] * 100}%`,
        },
    },
)`
    width: 100%;
    position: relative;
    overflow: hidden;
    background-color: ${props => props.theme.color.gray[3]};
`;

const Placeholder = styled.div.attrs(
    ({ styled: { backgroundImage } }) => ({
        style: {
            backgroundImage: `url(${backgroundImage})`,
        },
    }),
)`
    background-size: cover;
    content: "";
    display: block;
    filter: blur(25px);
    height: 100%;
    left: 0;
    object-fit: cover;
    overflow: hidden;
    position: absolute;
    top: 0;
    transform-origin: 50% 50%;
    transform: scale(2);
    width: 100%;
    z-index: 1;
`;

export const getPublicId = input => input.replace(/(?:https:\/\/res.cloudinary.com\/.*\/image\/upload\/)(?:.*\/)?(.*)/, "$1");

// https://res.cloudinary.com/rockxxl/image/upload/gmm18lineup1200x16972-5.jpg
// https://res.cloudinary.com/rockxxl/image/upload/1761d2fe-aeec-4795-b090-8c8036dd53ad.jpg
// https://res.cloudinary.com/rockxxl/image/upload/v1548589931/40576606_1843234992457191_6678925314967470080_n.jpg

class ImageLazyLoader extends Component {
    constructor(props) {
        super(props);
        this.image = createRef();
        this.state = {
            isLoaded: false,
            srcSet: null,
            src: null,
            sizes: "1px",
            srcSetSizes: [150, 300, 600, 900, 1200, 1500, 1800, 2100, 2400],
            cldnry: {
                core: new cloudinary.Cloudinary({ cloud_name: process.env.GATSBY_CLOUDINARY_CLOUD_NAME }),
                defaultOptions: {
                    dpr: 1,
                    crop: "scale",
                    fetch_format: "auto",
                    quality: "auto",
                },
            },
        };
    }

    componentDidMount() {
        const { props: { src } } = this;
        if (src !== null) this.generateSrcSet();
    }

    componentDidUpdate() {
        const {
            setSizes,
            props: { isVisible },
            state: { sizes },
        } = this;

        if (isVisible && sizes === "1px") setSizes();
    }

    setSizes = () => {
        const image = this.image.current;
        const { naturalWidth, naturalHeight } = image;
        const { height, width } = image.getBoundingClientRect();
        const imageWidthRatio = naturalWidth / naturalHeight;

        const roundedWidth = Math.max(
            width,
            height * imageWidthRatio,
        );

        this.setState({
            sizes: `${Number.isNaN(roundedWidth) ? width : roundedWidth}px`,
        });
    }

    imageLoaded = () => {
        this.setState({
            isLoaded: true,
        });
    }

    generateSrcSet() {
        const {
            srcSetSizes, cldnry,
        } = this.state;
        const {
            publicId: publicIdProp,
            src,
            srcSet,
        } = this.props;
        const srcHasCloudinaryUrl = src.includes("https://res.cloudinary.com/");

        if (publicIdProp || srcHasCloudinaryUrl) {
            const publicId = getPublicId(src);
            const cldnrySrc = cldnry.core.url(publicId, { transformation: "responsive_placeholder" });

            this.setState({
                src: cldnrySrc,
                srcSet: [
                    ...[`${cldnrySrc} 32w`],
                    ...srcSetSizes.map((size) => {
                        const url = cldnry.core.url(publicId, { ...cldnry.defaultOptions, width: size });
                        return `${url} ${size}w`;
                    }),
                ],
            });
        } else {
            this.setState({
                src,
                srcSet,
            });
        }
    }

    render() {
        const {
            isVisible, alt, aspectRatio, className,
        } = this.props;
        const {
            isLoaded, src, srcSet, sizes,
        } = this.state;

        return (
            <Wrapper
                aspectRatio={aspectRatio}
                className={className}
            >
                {isVisible && (
                    <Fragment>
                        <Image
                            ref={this.image}
                            src={src}
                            srcSet={srcSet}
                            onLoad={() => this.imageLoaded()}
                            onError={() => this.imageLoaded()}
                            styled={{
                                fit: aspectRatio,
                                loaded: isLoaded,
                            }}
                            sizes={sizes}
                            alt={alt}
                        />
                        <Placeholder
                            styled={{
                                backgroundImage: src,
                                loaded: isLoaded,
                            }}
                        />
                    </Fragment>
                )}
            </Wrapper>
        );
    }
}

export default withIntersectionObserver({
    threshold: 0,
    rootMargin: "500px 0px",
})(ImageLazyLoader);
