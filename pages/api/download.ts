// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import absoluteUrl from 'next-absolute-url';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const type = req.query.type as string;
  const id = req.query.id as string;
  const month = req.query.month as string;
  const year = req.query.year as string;
  const { origin } = absoluteUrl(req)
  const viewPort = { width: 816, height: 1080 };
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: viewPort,
    args: ['--ash-host-window-bounds=816*1080', '--window-size=816,1048', '--window-position=0,0', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  await page.setViewport(viewPort);
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

  let url = `${origin}/reports/invoice/${id}`;

  if (type === 'group') {
    url = `${origin}/reports/group/${id}?year=${year}&month=${month}`;
  } else if (type === 'group_annex' || type === 'outlet' || type ==='invoice_annex') {
    url = `${origin}/reports/group_annax_outlets/${id}?year=${year}&month=${month}`;
  } else {
    url = `${origin}/reports/invoice/${id}?year=${year}&month=${month}`;
  }

  await page.goto(url, {
    waitUntil: ["load", 'networkidle2', 'domcontentloaded'],
  });

  await page.emulateMediaType('print');

  const pdfBuffer = await page.pdf({
    path: 'report.pdf',
    format: 'A4',
    printBackground: true,
    scale: 1,
  })

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment');
  res.setHeader('filename', 'group.pdf');
  res.send(pdfBuffer);

  await browser.close();
  // res.status(200).json({ name: pdfBuffer })
}