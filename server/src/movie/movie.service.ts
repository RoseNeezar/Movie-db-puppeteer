import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class MovieService {
  async search(url: string) {
    try {
      let browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();

      await page.goto(url, { waitUntil: 'load', timeout: 0 });
      const html = await page.evaluate(() => document.body.innerHTML);
      const $ = cheerio.load(html);

      let title = $('h2').text();
      let releaseDate = $('.release_date').text();
      let overview = $('.overview > p').text();
      let userScore = $('.user_score_chart').attr('data-percent');
      let imgUrl = $(
        '#original_header > div.poster_wrapper.true > div.poster > div.image_content.backdrop > img',
      ).attr('src');

      if (!imgUrl) {
        imgUrl = $(
          '#original_header > div.poster_wrapper.false > div.poster > div.image_content.backdrop > img',
        ).attr('src');
      }
      imgUrl = 'https://www.themoviedb.org/' + imgUrl;

      let crewLength = $('div.header_info > ol > li').length;

      let crew = [];

      for (let i = 1; i <= crewLength; i++) {
        let name = $(
          'div.header_info > ol > li:nth-child(' + i + ') > p:nth-child(1)',
        ).text();
        let role = $(
          'div.header_info > ol > li:nth-child(' + i + ') > p.character',
        ).text();

        crew.push({
          name: name,
          role: role,
        });
      }
      browser.close();
      return {
        title,
        releaseDate,
        overview,
        userScore,
        imgUrl,
        crew,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
