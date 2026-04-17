/** @type {import('tailwindcss').Config} */
export default {
  // content：告訴 Tailwind 去哪些檔案掃描使用到的 class，沒用到的會被移除（減少打包大小）
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
