/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    })
    return config
  },
  ...nextConfig,
}

// module.exports = {
//   reactStrictMode: true,
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   module: {
//     rules: [
//       // or "loaders" for webpack 1.x
//       {
//         test: /\.graphql?$/,
//         use: [
//           {
//             loader: 'webpack-graphql-loader',
//             options: {
//               // validate: true,
//               // schema: "./path/to/schema.json",
//               // removeUnusedFragments: true
//               // etc. See "Loader Options" below
//             },
//           },
//         ],
//       },
//     ],
//   },
// }
