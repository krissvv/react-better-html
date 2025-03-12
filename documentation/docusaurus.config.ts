import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
   title: "react-better-html",
   tagline: "A component library for react that is as close to plane html as possible",
   favicon: "img/favicon.ico",

   // Set the production url of your site here
   url: "https://krissvv.github.io",
   // Set the /<baseUrl>/ pathname under which your site is served
   // For GitHub pages deployment, it is often '/<projectName>/'
   baseUrl: "/react-better-html",

   // GitHub pages deployment config.
   // If you aren't using GitHub pages, you don't need these.
   organizationName: "kriss.vv", // Usually your GitHub org/user name.
   projectName: "react-better-html", // Usually your repo name.
   trailingSlash: false,

   onBrokenLinks: "throw",
   onBrokenMarkdownLinks: "warn",

   // Even if you don't use internationalization, you can use this field to set
   // useful metadata like html lang. For example, if your site is Chinese, you
   // may want to replace "en" with "zh-Hans".
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
               // Please change this to your repo.
               // Remove this to remove the "edit this page" links.
               editUrl:
                  "https://github.com/krissvv/react-better-html/tree/main/packages/create-docusaurus/templates/shared/",
            },
            blog: {
               showReadingTime: true,
               feedOptions: {
                  type: ["rss", "atom"],
                  xslt: true,
               },
               // Please change this to your repo.
               // Remove this to remove the "edit this page" links.
               editUrl:
                  "https://github.com/krissvv/react-better-html/tree/main/packages/create-docusaurus/templates/shared/",
               // Useful options to enforce blogging best practices
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
      // Replace with your project's social card
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
