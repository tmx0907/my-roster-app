// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Tailwind 클래스를 사용하는 모든 파일 경로
  ],
  theme: {
    extend: {
      colors: {
        primary: '#718BBC',
        secondary: '#A3BCCF',
        accent: '#E0D7DA',
        light: '#F3F1EE',
        pink: '#EAC4D5',
      },
    },
  },
  plugins: [],
};
