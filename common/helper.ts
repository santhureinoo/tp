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

// export function numberWithCommas(x?: number, fixedNum = 2) {
//   if (x) {
//     return x.toFixed(fixedNum).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//   }
//   else {
//     return 0;
//   }

// }

export function getInDecimal(x: number, fixed = 0) {
  return x % 1 === 0 ? x : Number((Math.round(x * Math.pow(10, fixed + 1)) / Math.pow(10, fixed + 1)).toFixed(fixed));
}

export function numberWithCommas(x?: number, fixed = 0) {
  if (x && x > 999) {
    let numX = Number(x);
    if (fixed > 0) {
      return getInDecimal(x, fixed).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      // numX = Math.round(numX * Math.pow(10, fixed)) / Math.pow(10, fixed);
    }

    return getInDecimal(numX, fixed).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  else {
    return x && !isNaN(x) ? getInDecimal(x, fixed) : x;
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



export function dateValueForQuery(month: string, year: string) {
  let finalStr = "";

  if (month !== 'All') {
    finalStr = '01/' + month;
  }

  if (year !== 'All') {
    finalStr = finalStr + '/' + year;
  } else {
    if (finalStr !== "") {
      finalStr = finalStr + '/';
    }
  }
  return finalStr;
}

export function render_html_to_canvas(html: string, ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  var data = "data:image/svg+xml;charset=utf-8," + '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' +
    '<foreignObject width="100%" height="100%">' +
    html_to_xml(html) +
    '</foreignObject>' +
    '</svg>';

  var img = new Image();
  img.onload = function () {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 6, y - 20);
    ctx.stroke();
    ctx.drawImage(img, x, y - 30);
  }
  img.src = data;
}

export function html_to_xml(html: any) {
  var doc = document.implementation.createHTMLDocument('');
  doc.write(html);

  // You must manually set the xmlns if you intend to immediately serialize     
  // the HTML document to a string as opposed to appending it to a
  // <foreignObject> in the DOM

  doc.documentElement.namespaceURI && doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI);

  // Get well-formed markup
  html = (new XMLSerializer).serializeToString(doc.body);
  return html;
}