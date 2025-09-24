// next.config.mjs
const repo = 'wendy_closet_'; // ← 리포 이름과 정확히 동일!
const isProd = process.env.NODE_ENV === 'production';

export default {
  output: 'export',              // 핵심: 정적 내보내기 ON
  images: { unoptimized: true }, // next/image 경고 방지
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
};
