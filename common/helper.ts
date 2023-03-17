import moment from "moment";

export function truncateFileName(str: string, max: number) {
  const splitStr = str.split('.');
  return str.length > max ? str.substring(0, max - 1) + '…' : str;
}

export function bytesToSize(bytes: number) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

export function downloadFile(data: any, name: string) {
  // uploadURL and filename
  // const result = response.data;
  // create file link in browser's memory
  var binaryData = [];
  binaryData.push(data);
  const href = URL.createObjectURL(new Blob(binaryData, { type: 'application/pdf' }));

  // create "a" HTML element with href to file & click
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', name); //or any other extension
  document.body.appendChild(link);
  link.click();

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);

}

export function convertMonthName(monthIndex?: string) {
  const indexNum = parseInt(monthIndex || '1') - 1;
  return moment().month(indexNum).format('MMM')
}

export function disableTemplate(path: string) {
  const routesWithoutTemplate = [
    {
      "route": "/Reports",
      "disableHeader": true,
      "disableSidebar": false,
    },
    {
      "route": "/reports",
      "disableHeader": true,
      "disableSidebar": true,
    }
  ];

  const selectedRoutes = routesWithoutTemplate.find(routObj => path.startsWith(routObj.route));

  if (selectedRoutes) {
    return selectedRoutes;
  } else {
    return {
      "route": "",
      "disableHeader": false,
      "disableSidebar": false,
    }
  }
}

export function numberWithCommas(x?: number, fixedNum = 2) {
  if (x) {
    return Number(x).toFixed(fixedNum).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  else {
    return 0;
  }

}

export function formatCurrency(currency?: number) {
  let formatDollar = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  // Remove the currency symbol.
  return formatDollar.format(currency || 0).split('$')[1];
}

export function convertDate(dateStr: string | null) {
  if (dateStr) {
    var parts = dateStr.split('/').map(par => Number(par));
    // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
    // January - 0, February - 1, etc.
    var dateObject = new Date(parts[2], parts[1] - 1, parts[0]);
    // var timestamp = Date.parse(dateStr || "");
    // var dateObject = new Date(timestamp);
    return dateObject.toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric" });
  }
  return null;
}

// calculate the median
export function median(arr: number[]) {
  arr.sort(function (a, b) { return a - b; });
  var i = arr.length / 2;
  return i % 1 == 0 ? (arr[i - 1] + arr[i]) / 2 : arr[Math.floor(i)];
}

export function calculatePagination(...total: string[]) {
  const totalPage = total.reduce((prev, current) => Number(current) + Number(prev), 0);
  return Number(total) != 0 ? Math.ceil(totalPage / 10) : 1;
}


export const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const monthNumToStr = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
}