import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const I18N_PATH = "./i18n/request.ts";

const withNextIntl = createNextIntlPlugin(I18N_PATH);

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    qualities: [85, 60, 30, 10],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
