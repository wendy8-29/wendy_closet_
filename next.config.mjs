const repo = 'wendy_closet_'; // ← repo 이름과 동일하게
const isProd = process.env.NODE_ENV === 'production';

export default {
  output: 'export',                // 정적 내보내기
  images: { unoptimized: true },   // next/image 비활성 (정적 호환)
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : ''
  // 필요하면 trailingSlash: true,
};
