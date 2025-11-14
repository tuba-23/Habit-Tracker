const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new WorkboxPlugin.GenerateSW({
          clientsClaim: true,
          skipWaiting: true,
        }),
      ],
    },
  },
};