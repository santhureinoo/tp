module.exports = {
  important:true,
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./common/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    fontFamily: {
      'sans': ['MADE TOMMY', 'sans-serif'],
    },
    extend: {
      fontSize: {
        'custom-sm': ['10px', '10px'],
        'custom-lg': ['16px', '20px'],
        'custom-lg1': ['25px', '25px'],
        'custom-lg2': ['24px', '24px'],
        'custom-lg3': ['28px', '28px'],
        'custom-lg4': ['65px', '37.5px'],
        'custom-xs': ['8px', '12px']
      },
      maxHeight: {
        'summaryTableHeight': '132px',
        'summaryOutletSavingsHeight': '500px',
        'summaryBillingHeight': '294px',
      },
      width: {
        // 'rightSidebar': '627.16px',
        'rightSidebar': '800px',
      },
      colors: {
        'custom-darkblue': '#1F78B4',
        'report-table-header-background': '#fbe4d5',
        'report-main-header': '#222b82',
        'report-non-table-text': '#fea662',
        'stack-bar-outer': '#ff7000',
        'stack-bar-inner': '#1a237e',
        'custom-active-link': '#1890FF',
        'warning-batch-gen': '#FFC53D',
        'exception-batch-gen': '#F5222D',
        'tp-orange': '#FF6F00',
        'tp-blue': '#1367C6',
        'tp-grey': '#FAFAFA'
      }
    },
  },
  plugins: [
    require("flowbite/plugin")
  ],
}
