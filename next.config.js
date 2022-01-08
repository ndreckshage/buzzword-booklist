module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      "books.google.com",
      "images.unsplash.com",
      "avatars.githubusercontent.com",
    ],
  },
  experimental: {
    concurrentFeatures: true,
    serverComponents: true,
  },
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      include: [options.dir],
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve("graphql-tag/loader"),
        },
      ],
    });

    return config;
  },
  // typescript: {
  //   // !! WARN !!
  //   // Dangerously allow production builds to successfully complete even if
  //   // your project has type errors.
  //   // !! WARN !!
  //   ignoreBuildErrors: true,
  // },
};
