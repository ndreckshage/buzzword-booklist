module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["books.google.com", "images.unsplash.com"],
  },
  experimental: {
    concurrentFeatures: true,
    serverComponents: true,
  },
  // typescript: {
  //   // !! WARN !!
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   // !! WARN !!
  //   ignoreBuildErrors: true,
  // },
};
