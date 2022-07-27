module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./common/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ['MADE TOMMY', 'sans-serif'],
    },
    extend: {
      maxHeight: {
        'summaryTableHeight' : '132px',
        'summaryOutletSavingsHeight' : '500px',
        'summaryBillingHeight': '294px',
      },
      width: {
        // 'rightSidebar': '627.16px',
        'rightSidebar': '800px',
      },
    },
  },
  plugins: [],
}
