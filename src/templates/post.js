/* eslint-disable react/no-danger */

import React from "react";
import { graphql } from "gatsby";
import Grid, { grid } from "styled-components-grid";
import styled from "styled-components";
import cloudinary from "cloudinary-core";
import { p, mb, mr } from "styled-components-spacing";
import { Helmet } from "react-helmet";
import striptags from "striptags";
import { format } from "date-fns";
import nlDateFnsLocale from "date-fns/locale/nl";
import Layout from "../components/Layout";
import Image from "../components/Image";

const Wrapper = styled(Grid)`
    display: flex;
    flex-grow: 1;
    max-width: 1440px;
    width: 100%;
`;

const Sidebar = styled(Grid.Unit)`
    border-left: 1px solid ${props => props.theme.color.extremelyLight};
    ${p(6)};
`;

const Content = styled.article`
    ${grid.unit({ size: { md: 3 / 4 } })}
    display: flex;
    flex-direction: column;
    align-items: center;
    ${p(6)};
`;

const Header = styled.header`
    width: 100%;
    max-width: 960px;
    ${mb(6)};
`;

const Section = styled.section`
    width: 100%;
    max-width: 640px;
    line-height: ${props => props.theme.leading.loose};
`;

const Media = styled.div`
    width: 50%;
    float: left;
    margin-left: -25%;
    ${mb(3)};
    ${mr(6)};
`;

const aspectRatio = (category) => {
    switch (category.toLowerCase()) {
    case "interviews":
        return "4:3";
    case "live reviews":
        return "210:297";
    default:
        return null;
    }
};

const H1 = styled.h1`
    ${mb(5)};
`;

const Title = ({ title }) => (
    <H1>
        <div>{title.split(" - ")[0]}</div>
        { title.split(" - ")[1] && (
            <div>{title.split(" - ")[1]}</div>
        )}
    </H1>
);

const Subtitle = styled.div`
    text-transform: uppercase;
    font-weight: 400;
    font-family: ${props => props.theme.font.family.headings};
    letter-spacing: 2px;
    font-size: .62rem;
    color: ${props => props.theme.color.extraLight};
`;

const OgImage = (image) => {
    const cldnry = new cloudinary.Cloudinary({ cloud_name: process.env.GATSBY_CLOUDINARY_CLOUD_NAME });
    return cldnry.url(image, { transformation: "og_image" });
};

export default function Template({ data }) {
    const { markdownRemark } = data;
    const {
        fields: {
            slug,
        },
        frontmatter: {
            title,
            image,
            category,
            date,
            author,
        }, html,
    } = markdownRemark;

    const strippedDescription = striptags(html);

    return (
        <Layout>
            <Helmet
                title={title}
                link={[
                    { rel: "canonical", href: `${process.env.GATSBY_APP_URL}${slug}` },
                ]}
                meta={[
                    { name: "description", content: strippedDescription },
                    { property: "og:title", content: title },
                    { property: "og:description", content: strippedDescription },
                    { property: "og:url", content: `${process.env.GATSBY_APP_URL}${slug}` },
                    { property: "og:image", content: OgImage(image) },
                    { property: "og:article:published_time", content: date },
                ]}
            />
            <Wrapper>
                <Content>
                    <Header>
                        <Title title={title} />
                        <Subtitle>
                            {`${format(date, "D MMM YYYY", { locale: nlDateFnsLocale })} – ${author}`}
                        </Subtitle>
                    </Header>
                    <Section>
                        { image && (
                            <Media>
                                <Image
                                    publicId={image}
                                    aspectRatio={aspectRatio(category)}
                                    alt={title}
                                />
                            </Media>
                        )}
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                    </Section>
                </Content>

                <Sidebar size={{ md: 1 / 4 }}>
                    <aside>
                        sidebar
                    </aside>
                </Sidebar>
            </Wrapper>
        </Layout>
    );
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(fields: { slug: { eq: $path } }) {
      html
      fields {
        slug
      }
      frontmatter {
        title
        category
        image
        author
        date
      }
    }
  }
`;
