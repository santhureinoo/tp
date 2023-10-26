// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer, { BrowserContext } from 'puppeteer';
import { temporaryFile, temporaryDirectory } from 'tempy';

const PDFMerger = require('pdf-merger-js');
const fs = require('fs');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const type = req.query.type as string;
  const id = req.query.id as string;
  const month = req.query.month as string;
  const year = req.query.year as string;
  const outletIds = req.query['outletIds[]'] as string[];
  const viewPort = { width: 1100, height: 960, deviceScaleFactor: 2 };
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: viewPort,
    args: ['--ash-host-window-bounds=1100*960', '--window-size=1100,960', '--window-position=0,0', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  const merger = new PDFMerger();
  const tempFileDir = temporaryFile({ extension: 'pdf' });

  await page.setViewport(viewPort);
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

  const origin = process.env.NEXT_PUBLIC_SITE_URL + ':3000';
  let url = `${origin}/reports/invoice/${id}`;

  if (type === 'group') {
    url = `${origin}/reports/group/${id}?year=${year}&month=${month}`;
  } else if (type === 'group_annex' || type === 'outlet' || type === 'invoice_annex') {
    url = `${origin}/reports/group_annax_outlets/${id}?year=${year}&month=${month}`;
  } else {
    url = `${origin}/reports/invoice/${id}?year=${year}&month=${month}`;
  }

  if (type !== 'invoice') {
    await merger.add('./public/pdf/Group_Report_Default.pdf');
  }

  await page.goto(url, {
    timeout: 0,
    waitUntil: ["load", 'networkidle2', 'networkidle0', 'domcontentloaded'],
  });
  await page.emulateMediaType('screen');

  let pdfBuffer;

  if (type === 'invoice') {
    pdfBuffer = await page.pdf({
      // path: 'report.pdf',
      format: 'A4',
      // height: '34cm',
      // width: '25.4cm',
      landscape: true,
      printBackground: true,
      preferCSSPageSize: false,
      scale: 0.7,
    })
  } else {
    pdfBuffer = await page.pdf({
      // path: 'report.pdf',
      // format: 'A4',
      height: '34cm',
      width: '25.4cm',
      landscape: true,
      printBackground: true,
      preferCSSPageSize: false,
      scale: 0.8,
    })
  }


  fs.writeFileSync(tempFileDir, pdfBuffer);
  await merger.add(tempFileDir);

  /**
   *  Looping across outlets for group+annex selection.
   */

  if (outletIds) {
    for (let i = 0; i < outletIds.length; i++) {
      const subUrl = `${origin}/reports/group_annax_outlets/${outletIds[i]}?year=${year}&month=${month}`;
      await page.goto(subUrl, {
        timeout: 0,
        waitUntil: ["load", 'networkidle2', 'networkidle0', 'domcontentloaded'],
      });


      const pdfBuffer = await page.pdf({
        height: '34cm',
        width: '25.4cm',
        landscape: true,
        printBackground: true,
        preferCSSPageSize: true,
        scale: 0.8,
      })

      fs.writeFileSync(tempFileDir, pdfBuffer);
      await merger.add(tempFileDir);
    }
  }


  const mergedPdfBuffer = await merger.saveAsBuffer();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment');
  res.send(mergedPdfBuffer);

  await browser.close();
  fs.unlink(tempFileDir, (err: any) => {
    if (err) throw err //handle your error the way you want to;
  });
  // await fs.rm(tempFileDir);
  // res.status(200).json({ name: pdfBuffer })
}