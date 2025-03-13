import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
   title: "react-better-html",
   tagline: "A component library for react that is as close to plane html as possible",
   favicon: "img/favicon.ico",
   url: "https://krissvv.github.io",
   baseUrl: "/react-better-html",
   organizationName: "krissvv",
   projectName: "react-better-html",
   trailingSlash: false,
   onBrokenLinks: "warn",
   onBrokenMarkdownLinks: "warn",
   i18n: {
      defaultLocale: "en",
      locales: ["en"],
   },
   presets: [
      [
         "classic",
         {
            docs: {
               sidebarPath: "./sidebars.ts",
               editUrl: "https://github.com/krissvv/react-better-html/tree/main/documentation/",
            },
            blog: {
               showReadingTime: true,
               feedOptions: {
                  type: ["rss", "atom"],
                  xslt: true,
               },
               editUrl: "https://github.com/krissvv/react-better-html/tree/main/documentation/",
               onInlineTags: "warn",
               onInlineAuthors: "warn",
               onUntruncatedBlogPosts: "warn",
            },
            theme: {
               customCss: "./src/css/custom.css",
            },
         } satisfies Preset.Options,
      ],
   ],
   themeConfig: {
      image: "img/docusaurus-social-card.jpg",
      navbar: {
         title: "react-better-html",
         logo: {
            alt: "Logo",
            src: "img/logo.svg",
         },
         items: [
            {
               type: "docSidebar",
               label: "Docs",
               sidebarId: "tutorialSidebar",
               position: "left",
            },
            {
               to: "/blog",
               label: "Blog",
               position: "left",
            },
            {
               href: "https://github.com/krissvv/react-better-html",
               label: "GitHub",
               position: "right",
            },
         ],
      },
      footer: {
         style: "dark",
         links: [
            {
               title: "Docs",
               items: [
                  {
                     label: "Introduction",
                     to: "/docs/introduction",
                  },
                  {
                     label: "Getting Started",
                     to: "/docs/category/getting-started",
                  },
               ],
            },
            {
               title: "Community",
               items: [
                  {
                     label: "issues",
                     href: "https://github.com/krissvv/react-better-html/issues",
                  },
               ],
            },
            {
               title: "More",
               items: [
                  {
                     label: "Blog",
                     to: "/blog",
                  },
                  {
                     label: "GitHub",
                     href: "https://github.com/krissvv/react-better-html",
                  },
               ],
            },
         ],
         copyright: `Copyright © ${new Date().getFullYear()} react-better-html.`,
      },
      prism: {
         theme: prismThemes.github,
         darkTheme: prismThemes.dracula,
      },
      colorMode: {
         defaultMode: "dark",
      },
   } satisfies Preset.ThemeConfig,
};

export default config;
