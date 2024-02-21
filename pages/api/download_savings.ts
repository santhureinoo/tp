// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import puppeteer, { BrowserContext } from 'puppeteer';
import { temporaryFile, temporaryDirectory } from 'tempy';

const PDFMerger = require('pdf-merger-js');
const fs = require('fs');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // Run the cors middleware
  // nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
  await NextCors(req, res, {
    // Options
    methods: ['POST'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  // const type = req.query.type as string;
  // const id = req.query.id as string;
  // const month = req.query.month as string;
  // const year = req.query.year as string;
  // const outletIds = req.query['outletIds[]'] as string[];
  const viewPort = { width: 2000, height: 1200, deviceScaleFactor: 2 };
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: viewPort,
    args: ['--ash-host-window-bounds=2000*1200', '--window-size=2000,1200', '--window-position=0,0', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  const merger = new PDFMerger();
  const tempFileDir = temporaryFile({ extension: 'pdf' });

  await page.setViewport(viewPort);
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

  const addPage = async (url: string, scale: number) => {
    await page.goto(url, {
      timeout: 0,
      waitUntil: ["load", 'networkidle2', 'networkidle0', 'domcontentloaded'],
    });
    await page.emulateMediaType('screen');

    let pdfBuffer;
    pdfBuffer = await page.pdf({
      // path: 'report.pdf',
      height: '34cm',
      width: '25.4cm',
      landscape: false,
      printBackground: true,
      preferCSSPageSize: true,
      // margin: {
      //   left: 30,
      //   right: 30,
      // },
      scale: scale
    })

    fs.writeFileSync(tempFileDir, pdfBuffer);
    await merger.add(tempFileDir);
  }
  const data = JSON.stringify(req.body);
  const origin = process.env.NEXT_PUBLIC_SITE_URL + ':3000';
  await addPage(`${origin}/reports/saving_projections`, 1);
  await addPage(`${origin}/reports/saving_projections/result?data=${encodeURIComponent(data)}`, 0.8);
  await addPage(`${origin}/reports/saving_projections/submit?data=${encodeURIComponent(data)}`, 1);

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