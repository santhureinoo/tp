// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
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
  const viewPort = { width: 1707, height: 960 };
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: viewPort,
    args: ['--ash-host-window-bounds=1707*960', '--window-size=1707,960', '--window-position=0,0', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
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

  await merger.add('./public/pdf/Group_Report_Default.pdf');
  await page.goto(url, {
    timeout: 0,
    waitUntil: ["load", 'networkidle2', 'networkidle0', 'domcontentloaded'],
  });

  // if (type === 'invoice') {
  //   await page.waitForSelector('tr[id="tFoot"]');
  //   console.log('waiting done');
  // }


  await page.emulateMediaType('print');
  // await page.waitForFunction(() => {
  //   return document.querySelectorAll('.tfoot-data').length > 0;
  // });

  const pdfBuffer = await page.pdf({
    // path: 'report.pdf',
    // format: 'A3',
    height: '45.1612cm',
    width: '25.4cm',
    landscape: true,
    printBackground: true,
    scale: type === 'invoice' ? 0.8 : 1.2,
  })

  fs.writeFileSync(tempFileDir, pdfBuffer);
  await merger.add(tempFileDir);

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