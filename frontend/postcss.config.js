// PostCSS 是 CSS 處理工具，Tailwind v3 需要透過它運作
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},  // 自動補上各瀏覽器的 CSS 前綴（如 -webkit-）
  },
}
