// next.config.mjs
const repo = 'wendy_closet_'; // 예: 'wardrobe'
const isProd = process.env.NODE_ENV === 'production';

export default {
  output: 'export',              // GitHub Pages용 정적 내보내기
  images: { unoptimized: true }, // next/image 최적화 끄기 (정적 호환)
  basePath: isProd ? `/${wendy_closet_}` : '',
  assetPrefix: isProd ? `/${wendy_closet_}/` : '',
  // 필요시: trailingSlash: true,
};
