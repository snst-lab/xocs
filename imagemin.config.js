module.exports = {
  mozjpeg: {
    progressive: true,
    quality: 85,
  },
  pngquant: {
    quality: [0.65, 0.8],
    speed: 1,
    floyd: 0,
  },
  gifsicle: {
    interlaced: false,
    optimizationLevel: 5,
    colors: 256,
  },
  svgo: {
    multipass: true,
    js2svg: {
      indent: 2,
      pretty: true,
    },
  },
  webp: { quality: 25 },
};
