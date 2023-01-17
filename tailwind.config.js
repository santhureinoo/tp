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
      fontSize: {
        'custom-xs' : ['8px', '12px']
      },
      maxHeight: {
        'summaryTableHeight' : '132px',
        'summaryOutletSavingsHeight' : '500px',
        'summaryBillingHeight': '294px',
      },
      width: {
        // 'rightSidebar': '627.16px',
        'rightSidebar': '800px',
      },
      colors: {
        'custom-darkblue' : '#1F78B4',
        'report-table-header-background' : '#fbe4d5',
        'report-main-header' : '#222b82',
        'report-non-table-text' : '#fea662',
        'stack-bar-outer': '#ff7000',
        'stack-bar-inner': '#1a237e',
        'custom-active-link' : '#147CFC',
      }
    },
  },
  plugins: [],
}
