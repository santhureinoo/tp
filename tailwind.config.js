module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['MADE TOMMY', 'sans-serif'],
    },
    extend: {
      maxHeight: {
        'summaryTableHeight' : '132px',
      },
      width: {
        'rightSidebar': '627.16px',
      }
    },
  },
  plugins: [],
}
