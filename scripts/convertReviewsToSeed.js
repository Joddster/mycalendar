import fs from 'fs'

const knownTickers = new Set([
  'TSLA',
  'AAPL',
  'NVDA',
  'AMD',
  'META',
  'AMZN',
  'QQQ',
  'GOOGL',
  'GOOG',
  'SPY',
  'PLTR',
  'HOOD',
  'NQ',
])

const messages = [
  {
    timestamp: '2024-03-31T18:30:21.927Z',
    text: '2022 - 2023 Trade Review Files: @Premium Member',
  },
  {
    timestamp: '2024-04-04T19:54:54.149Z',
    text: 'April 4th Trade Review @Premium Member',
  },
  {
    timestamp: '2024-04-06T01:06:16.121Z',
    text: 'April 5th Trade Review @Premium Member',
  },
  {
    timestamp: '2024-04-08T22:55:51.605Z',
    text: 'April 8th Trade Review @Premium Member',
  },
  {
    timestamp: '2024-04-10T00:13:33.900Z',
    text: 'April 9th Trade Review ($7k TSLA) @Premium Member',
  },
  {
    timestamp: '2024-04-11T18:51:41.726Z',
    text: 'April 11th Trade Review (-$1100 NVDA) @Premium Member',
  },
  {
    timestamp: '2024-04-16T22:58:13.688Z',
    text: 'April 16th Trade Review ($500 meta) @Premium Member',
  },
  {
    timestamp: '2024-04-18T01:34:16.410Z',
    text: 'April 17th Trade Review ($5k Meta) @Premium Member',
  },
  {
    timestamp: '2024-04-18T22:24:23.227Z',
    text: 'April 18th Trade Review ($2.3k AMD) @Premium Member',
  },
  {
    timestamp: '2024-04-23T00:12:30.376Z',
    text: 'April 22nd Trade Review ($22k NVDA) @Premium Member',
  },
  {
    timestamp: '2024-04-25T01:06:54.172Z',
    text: 'April 24th Trade Review ($9.8k NVDA) @Premium Member',
  },
  {
    timestamp: '2024-04-26T02:05:01.999Z',
    text: 'April 25th Trade Review ($9.6k NVDA) @Premium Member',
  },
  {
    timestamp: '2024-04-30T02:10:00.219Z',
    text: 'April 29th Trade Review ($8k NVDA & AAPL) @Premium Member',
  },
  {
    timestamp: '2024-04-30T23:38:13.244Z',
    text: 'April 30th Trade Review ($18K NVDA Swing) @Premium Member',
  },
  {
    timestamp: '2024-05-03T00:53:13.225Z',
    text: 'May 2nd Trade Review ($90 AMZN) @Premium Member',
  },
  {
    timestamp: '2024-05-03T23:53:00.077Z',
    text: 'May 3rd Trade Review ($3k NVDA) @Premium Member',
  },
  {
    timestamp: '2024-05-07T04:34:09.995Z',
    text: 'super busy today couldnt do a trade review but wanted to still get a summary review out for you guys, will talk about full amzn trade tmmrw as well. (TSLA $1,500) @Premium Member',
  },
  {
    timestamp: '2024-05-09T01:57:50.471Z',
    text: 'May 8th Trade Review (NVDA $3k) @Premium Member',
  },
  {
    timestamp: '2024-05-11T00:11:36.534Z',
    text: 'May 10th Trade Review (NVDA $4k) @Premium Member',
  },
  {
    timestamp: '2024-05-14T02:08:01.993Z',
    text: 'May 13th Trade Review ($3k AAPL) @Premium Member',
  },
  {
    timestamp: '2024-05-16T01:00:23.988Z',
    text: 'May 15th Trade Review ($19k NVDA) @Premium Member',
  },
  {
    timestamp: '2024-05-17T20:41:50.465Z',
    text: 'May 17th Trade Review (-$4k AMD & AAPL) @Premium Member',
  },
  {
    timestamp: '2024-05-21T02:58:55.884Z',
    text: 'May 20th Trade Review ($4.5k NQ Futures) @Premium Member (edited)Tuesday, May 21, 2024 at 5:19 PM',
  },
  {
    timestamp: '2024-05-21T21:40:59.002Z',
    text: 'May 21st Trade Review ($5.2K TSLA) @Premium Member',
  },
  {
    timestamp: '2024-05-24T01:40:52.936Z',
    text: 'May 23rd Trade Review ($3.7k NVDA) @Premium Member',
  },
  {
    timestamp: '2024-05-30T01:42:54.300Z',
    text: 'May 29th Trade Review ($300 AAPL) @Premium Member',
  },
  {
    timestamp: '2024-05-30T23:07:12.733Z',
    text: 'May 30th Trade Review (TSLA $17k) @Premium Member',
  },
  {
    timestamp: '2024-06-04T01:52:42.553Z',
    text: 'June 3rd Trade Review ($2.8k TSLA) @Premium Member',
  },
  {
    timestamp: '2024-06-06T01:02:35.398Z',
    text: 'June 5th Trade Review (-$2.9k TSLA)',
  },
  {
    timestamp: '2024-06-09T18:35:39.158Z',
    text: 'June 7th Trade Review (AMD $900) @Premium Member',
  },
  {
    timestamp: '2024-06-11T01:03:28.114Z',
    text: 'June 10th Trade Review ($5.1K AMD) @Premium Member',
  },
  {
    timestamp: '2024-06-14T02:29:24.564Z',
    text: 'June 13th Trade Review ($60 AAPL) @Premium Member',
  },
  {
    timestamp: '2024-06-18T02:00:11.148Z',
    text: 'June 14th Trade Review ($1.2k TSLA) @Premium Member',
  },
  {
    timestamp: '2024-06-18T02:02:11.871Z',
    text: 'June 17th Trade Review ($11k TSLA A+ Trade) @Premium Member',
  },
  {
    timestamp: '2024-06-21T02:02:08.179Z',
    text: 'June 20th Trade Review ($6.7k AMD) @Premium Member',
  },
  {
    timestamp: '2024-06-25T02:15:40.324Z',
    text: 'June 24th Trade Review ($80 TSLA) @Premium Member',
  },
  {
    timestamp: '2024-06-28T02:06:29.476Z',
    text: 'June 26th + 27th Trade Review ( $7k 2 TSLA, AAPL) @Premium Member',
  },
  {
    timestamp: '2024-06-29T00:07:26.125Z',
    text: 'June 28th Trade Review ($4.7k TSLA) @Premium Member',
  },
  {
    timestamp: '2024-07-02T00:22:22.668Z',
    text: 'July 1st Trade Review ($10.3k TSLA) @Premium Member',
  },
  {
    timestamp: '2024-07-11T02:24:45.512Z',
    text: 'July 10th Trade Review ($2.4k TSLA) @Premium Member',
  },
  {
    timestamp: '2024-07-12T02:46:36.663Z',
    text: 'July 11th Trade Review ($2.2k TSLA) @Premium Member',
  },
  {
    timestamp: '2024-07-15T18:36:02.622Z',
    text: 'July 15th Trade Review ($10.9k TSLA) @Premium Member',
  },
  {
    timestamp: '2024-07-18T01:32:58.590Z',
    text: 'July 17th Trade Review ($1.7k AMD) @Premium Member',
  },
  {
    timestamp: '2024-07-19T20:13:56.008Z',
    text: 'July 19th Trade Review ($1.5k NVDA) @Premium Member',
  },
  {
    timestamp: '2024-07-23T00:41:53.312Z',
    text: 'July 22nd Trade Review (-$4.8k NVDA) @Premium Member',
  },
  {
    timestamp: '2024-07-23T23:33:39.353Z',
    text: 'July 23rd (-$1.6k NVDA) @Premium Member',
  },
  {
    timestamp: '2024-07-30T01:53:07.486Z',
    text: 'July 29th Trade Review ($2.4k TSLA) @Premium Member',
  },
  {
    timestamp: '2024-08-01T22:06:21.186Z',
    text: 'August 1st Trade Review (-$1.6k NVDA) @Premium Member',
  },
  {
    timestamp: '2024-08-07T20:56:31.112Z',
    text: 'August 7th Trade Review ($2k AAPL) @Premium Member',
  },
  {
    timestamp: '2024-08-09T04:05:46.056Z',
    text: 'August 8th Trade Review ($4k QQQ) @Premium Member',
  },
  {
    timestamp: '2024-08-14T01:44:18.731Z',
    text: 'August 13th Trade Review (-$180 AMD) @Premium Member',
  },
  {
    timestamp: '2024-08-15T02:35:29.280Z',
    text: 'August 14th Trade Review ($5.5k NVDA) @Premium Member',
  },
  {
    timestamp: '2024-08-19T02:26:15.675Z',
    text: 'August 16th Trade Review ($6.1k TSLA) Member',
  },
  {
    timestamp: '2024-08-21T02:21:13.039Z',
    text: 'August 20th Trade Review ($5k AMD & TSLA) @Premium Member',
  },
  {
    timestamp: '2024-08-23T03:11:59.218Z',
    text: 'August 22nd Trade Review ($2.8k AMD) @Premium Member',
  },
  {
    timestamp: '2024-08-28T03:15:18.894Z',
    text: 'August 27th Trade Review ($1.2k AMZN) @Premium Member',
  },
  {
    timestamp: '2024-08-30T02:26:00.084Z',
    text: 'August 29th Trade Review ($24k TSLA & AAPL Swing) @Premium Member',
  },
  {
    timestamp: '2024-09-04T01:38:28.331Z',
    text: 'September 3rd Trade Review ($6.2k NVDA) @Premium Member',
  },
  {
    timestamp: '2024-09-06T00:11:05.498Z',
    text: 'September 5th Trade Review ($2.9k AAPL) @Premium Member',
  },
  {
    timestamp: '2024-09-12T02:29:46.093Z',
    text: 'September 10 & 11th Trade Review (TSLA & NVDA) @Premium Member',
  },
  {
    timestamp: '2024-09-13T03:22:14.041Z',
    text: 'September 12th Trade Review (-3.8k TSLA) @Premium Member',
  },
  {
    timestamp: '2024-09-20T00:36:38.506Z',
    text: 'September 19th Trade Review ($24k TSLA & AAPL) @Premium Member',
  },
  {
    timestamp: '2024-09-23T23:24:53.869Z',
    text: 'September 23rd Trade Review ($6k TSLA) @everyone',
  },
  {
    timestamp: '2024-09-25T23:15:19.578Z',
    text: 'September 25th Trade Review ($4k NVDA + TSLA) @everyone',
  },
  {
    timestamp: '2024-10-01T04:13:28.267Z',
    text: 'September 30th Trade Review ($2k AAPL) @everyone',
  },
  {
    timestamp: '2024-10-03T02:48:51.548Z',
    text: 'October 2nd Trade Review ($1.7k NVDA) @everyone',
  },
  {
    timestamp: '2024-10-04T02:35:47.709Z',
    text: 'October 3rd Trade Review ($12k NVDA) @everyone',
  },
  {
    timestamp: '2024-10-05T00:59:13.703Z',
    text: 'October 4th Trade Review (-$1.6k NVDA) @everyone',
  },
  {
    timestamp: '2024-10-14T23:52:14.087Z',
    text: 'October 14th Trade Review ($1.2k NVDA) @everyone',
  },
  {
    timestamp: '2024-10-16T00:40:04.626Z',
    text: 'October 15th Trade Review ($6.7k AAPL) @everyone',
  },
  {
    timestamp: '2024-10-22T01:14:36.720Z',
    text: 'October 23rd Trade Review ($4k NVDA) @Premium Member',
  },
  {
    timestamp: '2024-10-24T02:29:06.959Z',
    text: 'October 23rd Trade Review (-$1k AAPL) @everyone',
  },
  {
    timestamp: '2024-10-26T00:55:59.062Z',
    text: 'October 25th Trade Review ($21k TSLA) @everyone',
  },
  {
    timestamp: '2024-11-02T00:51:52.511Z',
    text: 'November 1st Trade Review ($3k AAPL) @everyone',
  },
  {
    timestamp: '2024-11-05T03:41:57.668Z',
    text: 'November 4th Trade Review (-$1k AMD) @everyone',
  },
  {
    timestamp: '2024-11-06T01:50:27.298Z',
    text: 'November 5th Trade Review ($890 NVDA) @everyone',
  },
  {
    timestamp: '2024-11-07T00:33:03.525Z',
    text: 'BIGGEST TRADE EVER. November 6th Trade Review ($108k TSLA) @everyone',
  },
  {
    timestamp: '2024-11-08T23:16:08.979Z',
    text: 'November 8th Trade Review ($130k TSLA P2 + AAPL) @everyone',
  },
  {
    timestamp: '2024-11-12T02:49:00.021Z',
    text: 'November 11th Trade Review (-$300 SPY) @everyone',
  },
  {
    timestamp: '2024-11-13T01:37:58.765Z',
    text: 'November 12th Trade Review ($6.6k NVDA) @everyone',
  },
  {
    timestamp: '2024-11-15T03:09:30.694Z',
    text: 'November 14th Trade Review ($1.4k NVDA) @everyone (edited)Friday, November 15, 2024 at 7:33 PM',
  },
  {
    timestamp: '2024-11-16T00:33:10.908Z',
    text: 'November 15th Trade Review ($250 TSLA) @everyone',
  },
  {
    timestamp: '2024-11-19T02:02:50.677Z',
    text: 'November 18th Trade Review ($10.5k TSLA) @everyone',
  },
  {
    timestamp: '2024-11-20T01:03:58.013Z',
    text: 'November 19th Trade Review ($9.5k TSLA) @everyone',
  },
  {
    timestamp: '2024-11-22T02:29:17.298Z',
    text: 'November 21 Trade Review ($500 TSLA) @everyone',
  },
  {
    timestamp: '2024-11-23T00:00:40.824Z',
    text: 'November 22nd Trade Review ($30k TSLA) @everyone',
  },
  {
    timestamp: '2024-12-01T02:19:22.092Z',
    text: 'November 30th Trade Review ($220k Month + $10k AAPL Trade) @everyone',
  },
  {
    timestamp: '2024-12-03T02:25:58.437Z',
    text: 'December 2nd Trade Review ($2k AAPL + TSLA) @everyone',
  },
  {
    timestamp: '2024-12-03T22:51:58.927Z',
    text: 'December 3rd Trade Review ($4k AAPL) @everyone (edited)Tuesday, December 3, 2024 at 6:04 PM',
  },
  {
    timestamp: '2024-12-06T03:01:07.243Z',
    text: "Hey guys, since TSLA trade isn't fully over yet I didn't want to do the full trade review for it but I know some of you guys wanted an update. In terms of TSLA I bought 30 cons (was willing to add up to 50 if it dipped) and the risk was fairly low below the previous consolidation (see pics added) my pt was going to be 360 consolidation break. However, we had a really nice move same day we bought cons so I ended up selling 10 on first pop (just to lock profits in case of overnight) and from there i took profits near 370's today for another 10 cons. I am now sitting on 1/3 of the original position and it still looks good for that move up. However, the trade itself is risk free now which I always like with swings because now we can hold for that 3rd potential target. With this being said, I hold 10 cons for tmmrw. See yall then! @everyone",
  },
  {
    timestamp: '2024-12-07T02:29:05.875Z',
    text: 'December 6th Trade Review ($26k TSLA + NVDA) @everyone',
  },
  {
    timestamp: '2024-12-10T03:11:17.512Z',
    text: 'December 9th Trade Review ($3k AAPL) @everyone',
  },
  {
    timestamp: '2024-12-11T00:03:45.923Z',
    text: 'December 10th Trade Review ($9.9k GOOG + TSLA + AAPL) @everyone',
  },
  {
    timestamp: '2024-12-12T02:23:28.961Z',
    text: 'December 11th Trade Review ($16k TSLA) @everyone',
  },
  {
    timestamp: '2024-12-13T03:49:52.614Z',
    text: 'December 12th Trade Review ($350 AMD) @everyone',
  },
  {
    timestamp: '2024-12-17T04:12:52.703Z',
    text: 'December 16th Trade Review (-$690 SPY) @everyone',
  },
  {
    timestamp: '2024-12-19T03:30:03.072Z',
    text: 'December 18th Trade Review ($3k TSLA + SPY) @everyone',
  },
  {
    timestamp: '2024-12-21T14:59:04.330Z',
    text: 'December Trade Review ($4.5k TSLA) @everyone',
  },
  {
    timestamp: '2024-12-27T01:27:29.199Z',
    text: 'December 26 Trade Review ($500 AAPL) @everyone',
  },
  {
    timestamp: '2025-01-05T23:29:24.772Z',
    text: 'Dec 30th + Jan 2nd Trade Review (+3k, -1.7k NVDA) @everyone',
  },
  {
    timestamp: '2025-01-07T01:33:33.829Z',
    text: 'January 6th Trade Review ($6k NVDA) @everyone',
  },
  {
    timestamp: '2025-01-12T21:31:45.593Z',
    text: 'January 10th ($16k SPY + AAPL) @everyone',
  },
  {
    timestamp: '2025-01-14T01:12:19.618Z',
    text: 'January 13th Trade Review ($1.3k AAPL) @everyone',
  },
  {
    timestamp: '2025-01-15T02:45:31.550Z',
    text: 'January 14th Trade Review ($1.9k AAPL) @everyone',
  },
  {
    timestamp: '2025-01-16T02:18:03.285Z',
    text: 'January 15th Trade Review ($32k TSLA Trade) @everyone',
  },
  {
    timestamp: '2025-01-17T03:00:00.582Z',
    text: 'January 16th Trade Review ($3.7k TSLA) @everyone',
  },
  {
    timestamp: '2025-01-18T03:42:18.804Z',
    text: 'January 17th Trade Review ($21k TSLA) @everyone',
  },
  {
    timestamp: '2025-01-28T23:32:44.611Z',
    text: 'January 28th Trade Review ($7k AAPL) @everyone',
  },
  {
    timestamp: '2025-01-31T00:57:19.835Z',
    text: 'January 30th Trade Review (-$1800 GOOGL) @everyone',
  },
  {
    timestamp: '2025-02-05T01:27:16.847Z',
    text: 'February 4th Trade Review ($4k NVDA) @everyone',
  },
  {
    timestamp: '2025-02-06T02:05:11.665Z',
    text: 'February 5th Trade Review ($6k NVDA) @everyone',
  },
  {
    timestamp: '2025-02-07T22:58:08.245Z',
    text: 'February 1-7 Trade Review For Week @everyone',
  },
  {
    timestamp: '2025-02-11T01:33:02.678Z',
    text: 'February 10th Trade Review (-$8,000 TSLA + NVDA) @everyone',
  },
  {
    timestamp: '2025-02-12T00:38:43.883Z',
    text: 'February 11th Trade Review ($15k AAPL) @everyone',
  },
  {
    timestamp: '2025-02-13T00:53:20.291Z',
    text: 'February 12th Trade Review ($3.7k TSLA) @everyone',
  },
  {
    timestamp: '2025-02-15T01:09:07.596Z',
    text: 'February 14th Trade Review ($10.3k AAPL) @everyone',
  },
  {
    timestamp: '2025-02-20T02:54:07.269Z',
    text: 'February 19th Trade Review ($16k TSLA) @everyone',
  },
  {
    timestamp: '2025-02-21T02:07:15.386Z',
    text: 'February 20th Trade Review (-$2.8k AAPL) @everyone',
  },
  {
    timestamp: '2025-02-26T03:16:52.521Z',
    text: 'February 25th Trade Review (-1.8k AAPL) @everyone',
  },
  {
    timestamp: '2025-02-28T02:39:56.112Z',
    text: 'February 27 Trade Review ($15k TSLA + META) @everyone',
  },
  {
    timestamp: '2025-03-05T01:40:23.033Z',
    text: 'March 4th Trade Review ($20k TSLA) @everyone',
  },
  {
    timestamp: '2025-03-07T01:56:55.846Z',
    text: 'March 6th Trade Review (-$4.6k TSLA) @everyone',
  },
  {
    timestamp: '2025-03-07T23:13:14.380Z',
    text: 'March 7th Trade Review ($2.2k AAPL) @everyone',
  },
  {
    timestamp: '2025-03-11T00:33:44.515Z',
    text: 'March 10th Trade ($22k TSLA) @everyone',
  },
  {
    timestamp: '2025-03-13T01:30:29.468Z',
    text: 'March 12th Trade Review ($3.9k TSLA) @everyone',
  },
  {
    timestamp: '2025-03-14T00:04:37.451Z',
    text: 'March 13th Trade Review ($11.8k TSLA) @everyone',
  },
  {
    timestamp: '2025-03-14T23:10:03.248Z',
    text: 'March 14th Trade Review ($450 NVDA) @everyone',
  },
  {
    timestamp: '2025-03-18T02:01:20.741Z',
    text: 'March 17th Trade Review ($1.1k NVDA + AMD) @everyone',
  },
  {
    timestamp: '2025-03-19T01:15:22.039Z',
    text: 'March 18th Trade Review ($2.6k TSLA) @everyone',
  },
  {
    timestamp: '2025-03-22T03:22:15.293Z',
    text: 'March 21 Trade Review ($10k TSLA) @everyone',
  },
  {
    timestamp: '2025-03-26T02:22:18.172Z',
    text: 'March 24 & 25 Trade Review ($14k TSLA + AAPL) @everyone',
  },
  {
    timestamp: '2025-03-27T02:10:50.663Z',
    text: 'March 26th Trade Review ($7.5k NVDA) @everyone',
  },
  {
    timestamp: '2025-03-28T00:19:10.013Z',
    text: 'March 27 Trade Review ($3k TSLA) @everyone',
  },
  {
    timestamp: '2025-03-29T01:44:07.475Z',
    text: 'March 28th Trade Review ($5.7k TSLA) @everyone',
  },
  {
    timestamp: '2025-04-01T01:41:24.837Z',
    text: 'March 31st Trade Review (1.6k NVDA) @everyone',
  },
  {
    timestamp: '2025-04-01T22:58:27.611Z',
    text: 'April 1st, 2025 ($17k TSLA + AAPL) - 1 Year Anniversary @everyone',
  },
  {
    timestamp: '2025-04-03T01:51:40.028Z',
    text: 'April 2nd Trade Review ($600 NVDA) @everyone',
  },
  {
    timestamp: '2025-04-03T23:37:21.366Z',
    text: 'April 3rd Trade Review ($1k AAPL + QQQ) @everyone',
  },
  {
    timestamp: '2025-04-06T02:47:22.147Z',
    text: 'April 3rd & 4th Trade Review ($18k TSLA + AAPL + QQQ) @everyone',
  },
  {
    timestamp: '2025-04-09T00:26:59.017Z',
    text: 'April 8th Trade Review ($4.5k AMD) @everyone',
  },
  {
    timestamp: '2025-04-10T02:34:24.204Z',
    text: 'April 9th Trade Review ($4.7k TSLA) @everyone',
  },
  {
    timestamp: '2025-04-10T21:57:16.282Z',
    text: 'April 10th Trade Review ($100 TSLA) @everyone',
  },
  {
    timestamp: '2025-04-16T02:49:56.310Z',
    text: 'April 15th Trade Review ($6.7k TSLA) @everyone',
  },
  {
    timestamp: '2025-04-17T00:40:13.298Z',
    text: 'April 16th Trade Review ($-3k TSLA) @everyone (edited)Wednesday, April 16, 2025 at 8:43 PM',
  },
  {
    timestamp: '2025-04-23T02:08:36.550Z',
    text: 'April 22nd Trade Review ($7k AAPL) @everyone',
  },
  {
    timestamp: '2025-04-23T17:06:49.511Z',
    text: 'April 23rd Trade Review ($150 lol TSLA) @everyone',
  },
  {
    timestamp: '2025-04-29T23:11:42.891Z',
    text: 'April 29th Trade Review ($2.1k NVDA) @everyone',
  },
  {
    timestamp: '2025-05-02T00:14:13.715Z',
    text: 'May 1st Trade Review ($3.5k TSLA) @everyone',
  },
  {
    timestamp: '2025-05-06T03:40:32.901Z',
    text: 'May 5th Trade Review ($2.5k AMD + TSLA Thesis) @everyone',
  },
  {
    timestamp: '2025-05-07T02:52:20.730Z',
    text: 'May 6th Trade Review (-$5k TSLA) @everyone',
  },
  {
    timestamp: '2025-05-09T01:01:17.847Z',
    text: 'May 8th Trade Review (-$200 TSLA) @everyone',
  },
  {
    timestamp: '2025-05-10T03:11:25.303Z',
    text: '$75,000 TSLA Swing Trade Review @everyone',
  },
  {
    timestamp: '2025-05-14T02:35:01.570Z',
    text: 'May 13th Trade Review ($15.3k TSLA) @everyone',
  },
  {
    timestamp: '2025-05-15T02:39:51.654Z',
    text: 'May 14th Trade Review ($3k Loss on AAPL/TSLA, +$6k TSLA Swing Running + AAPL Thesis) @everyone',
  },
  {
    timestamp: '2025-05-17T01:30:15.002Z',
    text: 'May 16th Trade Review (-$2.5k TSLA) @everyone',
  },
  {
    timestamp: '2025-05-20T03:28:37.179Z',
    text: 'May 19th Trade Review ($1.4k NVDA) @everyone',
  },
  {
    timestamp: '2025-05-21T00:16:32.133Z',
    text: 'May 20th Trade Review (-$3.9k TSLA) @everyone',
  },
  {
    timestamp: '2025-05-22T04:26:14.723Z',
    text: 'May 21st Trade Review (-$22k Swings) @everyone (edited)Thursday, May 22, 2025 at 12:27 AM',
  },
  {
    timestamp: '2025-05-28T01:13:02.864Z',
    text: 'May 27th Trade Review ($25k TSLA) @everyone',
  },
  {
    timestamp: '2025-05-30T03:02:23.234Z',
    text: 'May 29th Trade Review (-$6.7k NVDA + SPY) @everyone',
  },
  {
    timestamp: '2025-05-31T03:07:06.685Z',
    text: 'May 30th Trade Review ($12k TSLA) @everyone',
  },
  {
    timestamp: '2025-06-07T02:20:00.161Z',
    text: 'June 2nd - 6th Trade Review ($1.4k week lol) @everyone',
  },
  {
    timestamp: '2025-06-10T01:40:48.696Z',
    text: 'June 9th Trade Review ($9k TSLA) @everyone',
  },
  {
    timestamp: '2025-06-10T20:21:17.062Z',
    text: 'June 10th Trade Review ($5k AMD) @everyone',
  },
  {
    timestamp: '2025-06-14T00:43:21.891Z',
    text: 'June 13th Trade Review ($7k TSLA) @everyone',
  },
  {
    timestamp: '2025-06-17T04:14:14.438Z',
    text: 'June 17th Trade Review (-$3.5k NVDA + PLTR) @everyone',
  },
  {
    timestamp: '2025-06-18T02:16:42.360Z',
    text: 'June 17th Trade Review ($7.5k AMD) @everyone',
  },
  {
    timestamp: '2025-06-18T20:32:07.225Z',
    text: 'June 18th Trade Review ($9.8k TSLA) @everyone',
  },
  {
    timestamp: '2025-06-24T01:21:30.222Z',
    text: 'June 23rd Trade Review ($50k TSLA) @everyone',
  },
  {
    timestamp: '2025-06-25T01:38:14.854Z',
    text: 'June 24th Trade Review ($7.2k NVDA) @everyone',
  },
  {
    timestamp: '2025-06-26T02:32:53.722Z',
    text: 'June 25th Trade Review ($13k NVDA) @everyone',
  },
  {
    timestamp: '2025-06-27T00:17:15.255Z',
    text: 'June 26th Trade Review ($21k NVDA) @everyone',
  },
  {
    timestamp: '2025-06-28T02:14:09.184Z',
    text: 'June 27th Trade Review ($2k NVDA) @everyone',
  },
  {
    timestamp: '2025-07-02T03:33:58.068Z',
    text: 'July 1st Trade Review ($6k AAPL) @everyone',
  },
  {
    timestamp: '2025-07-03T00:09:28.744Z',
    text: 'July 2nd Trade Review ($9.4k NVDA) @everyone',
  },
  {
    timestamp: '2025-07-03T23:33:09.164Z',
    text: 'July 3rd Trade Review ($2k AAPL) @everyone',
  },
  {
    timestamp: '2025-07-09T01:57:27.543Z',
    text: 'July 8th Trade Review (15k NVDA + TSLA) @everyone',
  },
  {
    timestamp: '2025-07-10T01:54:16.032Z',
    text: 'July 9th Trade Review (-$7k NVDA + META) @everyone',
  },
  {
    timestamp: '2025-07-11T00:12:48.001Z',
    text: 'July 10th Trade Review ($10k TSLA) @everyone',
  },
  {
    timestamp: '2025-07-12T00:42:41.339Z',
    text: 'July 11th Trade Review ($21k NVDA) @everyone',
  },
  {
    timestamp: '2025-07-15T03:21:45.636Z',
    text: 'July 14th Trade Review ($9k PLTR) @everyone @everyone',
  },
  {
    timestamp: '2025-07-17T01:50:52.893Z',
    text: 'July 15-16th Trade Review (19k TSLA + AMD) @everyone',
  },
  {
    timestamp: '2025-07-18T00:27:25.213Z',
    text: 'July 17 Trade Review ($11k HOOD) @everyone',
  },
  {
    timestamp: '2025-07-19T05:37:31.399Z',
    text: 'July 18 Trade Review (19k TSLA) @everyone',
  },
  {
    timestamp: '2025-07-30T00:56:29.792Z',
    text: 'July 21-29 Trade Review (full week breakdown) @everyone',
  },
  {
    timestamp: '2025-07-31T01:01:27.858Z',
    text: 'July 30th Trade Review ($2k AMD) @everyone',
  },
  {
    timestamp: '2025-08-01T00:05:50.260Z',
    text: 'July 31 Trade Review (-$7.5k META) @everyone',
  },
  {
    timestamp: '2025-08-02T02:18:26.811Z',
    text: 'August 1st Trade Review ($11.5k TSLA) @everyone',
  },
  {
    timestamp: '2025-08-04T23:47:46.671Z',
    text: 'August 4th Trade Review ($12.5k NVDA + TSLA) @everyone',
  },
  {
    timestamp: '2025-08-07T02:36:28.042Z',
    text: 'August 6 Trade Review ($20k AAPL) @everyone',
  },
  {
    timestamp: '2025-08-08T04:16:04.597Z',
    text: 'August 7th Trade Review ($30k AMD + TSLA) @everyone',
  },
  {
    timestamp: '2025-08-09T00:49:33.884Z',
    text: 'August 8 Trade Review ($35k TSLA) @everyone',
  },
  {
    timestamp: '2025-08-13T23:22:30.799Z',
    text: 'August 13 Trade Review ($2k TSLA + AMD) @everyone',
  },
  {
    timestamp: '2025-08-15T01:06:41.985Z',
    text: 'August 14th Trade Review ($8.4k NVDA) @everyone',
  },
  {
    timestamp: '2025-08-19T02:50:29.972Z',
    text: 'August 18 Trade Review ($2k NVDA) @everyone',
  },
  {
    timestamp: '2025-08-20T04:18:46.518Z',
    text: 'August 19 Trade Review ($20k TSLA) @everyone',
  },
  {
    timestamp: '2025-08-21T01:11:01.771Z',
    text: 'August 20th Trade Review ($13.9k AMD) @everyone',
  },
  {
    timestamp: '2025-08-24T00:48:34.216Z',
    text: 'August 22nd Trade Review ($25k TSLA) @everyone',
  },
  {
    timestamp: '2025-08-26T03:19:41.864Z',
    text: 'August 25th Trade Review ($1.4k TSLA + AAPL) @everyone',
  },
  {
    timestamp: '2025-08-27T19:27:52.936Z',
    text: 'August 27th Trade Review ($800 TSLA) @everyone',
  },
  {
    timestamp: '2025-08-29T00:24:26.520Z',
    text: 'August 28th Trade Review (-$2.6k AMD) @everyone',
  },
  {
    timestamp: '2025-08-30T03:02:08.194Z',
    text: 'August 29th Trade Review ($5.4k TSLA + NVDA) @everyone',
  },
  {
    timestamp: '2025-09-02T23:08:12.037Z',
    text: 'September 2nd Trade Review (-$10k TSLA + NVDA) @everyone',
  },
  {
    timestamp: '2025-09-03T22:31:37.049Z',
    text: 'September 3rd Trade Review ($400 NVDA +AMD) @everyone',
  },
  {
    timestamp: '2025-09-04T23:32:51.393Z',
    text: 'September 4th Trade Review ($3.3k AAPL) @everyone',
  },
  {
    timestamp: '2025-09-08T01:32:40.514Z',
    text: 'September 5th Trade Review ($41,000 TSLA) @everyone',
  },
  {
    timestamp: '2025-09-09T05:18:21.868Z',
    text: 'September 8th Trade Review ($6.5k NVDA) @everyone',
  },
  {
    timestamp: '2025-09-11T23:41:52.575Z',
    text: 'September 11th Trade Review ($22k TSLA) @everyone',
  },
  {
    timestamp: '2025-09-13T21:26:23.844Z',
    text: 'September 12th Trade Review ($96k TSLA) @everyone',
  },
  {
    timestamp: '2025-09-16T01:59:33.198Z',
    text: 'September 15th Trade Review (-$15k TSLA + PLTR) @everyone',
  },
  {
    timestamp: '2025-09-17T02:29:35.865Z',
    text: 'September 16th Trade Review ($15k AAPL) @everyone',
  },
  {
    timestamp: '2025-09-19T01:07:33.348Z',
    text: 'September 18th Trade Review ($4k PLTR) @everyone',
  },
  {
    timestamp: '2025-09-20T01:35:42.526Z',
    text: 'September 19th Trade Review ($7k TSLA) @everyone',
  },
  {
    timestamp: '2025-09-23T01:34:22.425Z',
    text: 'September 22nd Trade Review ($50k TSLA Swing + Day Trade) @everyone',
  },
  {
    timestamp: '2025-09-24T05:08:08.715Z',
    text: 'September 23rd Trade Review ($100 PLTR) @everyone',
  },
  {
    timestamp: '2025-09-25T04:10:52.765Z',
    text: 'September 24th Trade Review ($15.5k TSLA) @everyone',
  },
  {
    timestamp: '2025-09-26T03:43:27.029Z',
    text: 'September 25th Trade Review ($975 TSLA + NVDA) @everyone',
  },
  {
    timestamp: '2025-09-27T03:58:48.373Z',
    text: 'September 26th Trade Review ($2k AAPL) @everyone',
  },
  {
    timestamp: '2025-09-30T00:23:42.237Z',
    text: 'September 29th Trade Review ($3.9k NVDA) @everyone',
  },
  {
    timestamp: '2025-10-01T01:03:13.117Z',
    text: 'September 30th Trade Review ($23k NVDA) @everyone',
  },
  {
    timestamp: '2025-10-01T23:29:54.569Z',
    text: 'October 1st Trade Review ($26k TSLA + AMD) @everyone',
  },
  {
    timestamp: '2025-10-02T18:14:30.467Z',
    text: 'October 9th Trade Review (-$6k NVDA + AMD) @everyone',
  },
  {
    timestamp: '2025-10-17T23:47:44.149Z',
    text: 'WE ARE BACKKK October 17th Trade Review ($21k TSLA) @everyone',
  },
  {
    timestamp: '2025-10-20T23:41:11.906Z',
    text: 'October 20th Trade Review ($21k TSLA) @everyone',
  },
  {
    timestamp: '2025-10-22T01:46:07.171Z',
    text: 'October 21 Trade Review ($46 AAPL) @everyone',
  },
  {
    timestamp: '2025-10-22T23:00:04.366Z',
    text: 'October 22nd Trade Review ($145 GOOGL) @everyone',
  },
  {
    timestamp: '2025-10-23T22:22:53.662Z',
    text: 'October 23rd Trade Review ($28k TSLA) @everyone',
  },
  {
    timestamp: '2025-10-28T01:55:06.602Z',
    text: 'October 27th Trade Review ($30k TSLA + NVDA) @everyone',
  },
  {
    timestamp: '2025-10-29T01:55:22.641Z',
    text: 'October 28th Trade Review ($24k TSLA) @everyone',
  },
  {
    timestamp: '2025-10-30T02:30:34.409Z',
    text: 'October 29th Trade Review ($15,000 NVDA + AMD) @everyone',
  },
  {
    timestamp: '2025-10-31T21:11:58.006Z',
    text: 'October 31st Trade Review ($7k TSLA) @everyone',
  },
  {
    timestamp: '2025-11-04T03:07:00.464Z',
    text: 'November 3rd Trade Review ($26k TSLA + NVDA) @everyone',
  },
  {
    timestamp: '2025-11-05T00:31:05.775Z',
    text: 'November 4th Trade Review ($10.4k TSLA + AAPL) @everyone',
  },
  {
    timestamp: '2025-11-05T23:37:34.269Z',
    text: 'November 5th Trade Review ($19k AMD) @everyone',
  },
  {
    timestamp: '2025-11-06T23:15:34.284Z',
    text: 'November 6th Trade Review ($8k TSLA) @everyone',
  },
  {
    timestamp: '2025-11-08T04:05:18.915Z',
    text: 'November 7th Trade Review ($2k TSLA) @everyone',
  },
  {
    timestamp: '2025-11-11T03:49:19.904Z',
    text: 'November 10th Trade Review ($650 QQQ) @everyone',
  },
  {
    timestamp: '2025-11-13T02:59:44.618Z',
    text: 'November 12th Trade Review ($20k AAPL + AMD) @everyone',
  },
  {
    timestamp: '2025-11-14T01:36:22.722Z',
    text: 'November 13th Trade Review ($3.8k NVDA) @everyone',
  },
  {
    timestamp: '2025-11-15T00:53:01.255Z',
    text: 'November 14th Trade Review ($29k TSLA) @everyone',
  },
  {
    timestamp: '2025-11-17T22:20:40.459Z',
    text: 'November 17th Trade Review ($48k TSLA) @everyone',
  },
  {
    timestamp: '2025-11-19T08:00:01.276Z',
    text: 'November 18th Trade Review (18.4k TSLA) @everyone',
  },
  {
    timestamp: '2025-11-19T23:57:04.618Z',
    text: 'November 19th Trade Review ($11.6k TSLA + GOOGL) @everyone',
  },
  {
    timestamp: '2025-11-21T01:36:07.126Z',
    text: 'November 20th Trade Review ($15k AAPL) @everyone',
  },
  {
    timestamp: '2025-11-25T03:11:22.350Z',
    text: 'November 24th Trade Review ($30k TSLA + GOOGL) @everyone',
  },
  {
    timestamp: '2025-11-26T02:04:38.774Z',
    text: 'November 25th Trade Review ($550 NVDA) @everyone',
  },
  {
    timestamp: '2025-11-26T23:52:26.682Z',
    text: 'November 26th Trade Review (-$3k HOOD) @everyone',
  },
]

const amountRegex = /[+-]?\$[\d.,]+(?:k|K)?/g

const tokensFromText = (text) => {
  const matches = text.toUpperCase().match(/[A-Z]{2,5}/g) ?? []
  const seen = new Set()
  const tickers = []
  for (const token of matches) {
    if (knownTickers.has(token) && !seen.has(token)) {
      seen.add(token)
      tickers.push(token)
    }
  }
  return tickers
}

const parseAmount = (raw) => {
  let value = raw.replace(/\$/g, '').replace(/,/g, '')
  let multiplier = 1
  if (/k$/i.test(value)) {
    multiplier = 1000
    value = value.slice(0, -1)
  }
  const sign = value.includes('-') ? -1 : 1
  value = value.replace('-', '')
  const numeric = parseFloat(value || '0')
  return sign * numeric * multiplier
}

const normalizeStock = (tickers) => {
  if (!tickers.length) return 'MISC'
  if (tickers.length === 1) return tickers[0]
  return tickers.join('+')
}

const recordsMap = new Map()

for (const message of messages) {
  const date = message.timestamp.slice(0, 10)
  const text = message.text

  let match
  while ((match = amountRegex.exec(text)) !== null) {
    const amount = parseAmount(match[0])
    const remainder = text.slice(match.index + match[0].length)
    const segmentEnd = remainder.indexOf(')') >= 0 ? remainder.indexOf(')') : 60
    const segment = remainder.slice(0, Math.max(segmentEnd, 0))
    let tickers = tokensFromText(segment)
    if (!tickers.length) {
      tickers = tokensFromText(text)
    }
    const stock = normalizeStock(tickers)
    const key = `${date}|${stock}`
    if (!recordsMap.has(key)) {
      recordsMap.set(key, { date, stock, pnl: 0, trades: 0 })
    }
    const record = recordsMap.get(key)
    record.pnl += amount
    record.trades += 1
  }
}

const records = Array.from(recordsMap.values()).sort((a, b) => {
  if (a.date === b.date) return a.stock.localeCompare(b.stock)
  return a.date.localeCompare(b.date)
})

const output = `// Trading history generated from Discord trade review posts
export const seedTradingDays = ${JSON.stringify(records, null, 2)}
`

fs.writeFileSync(new URL('../src/data/seedData.js', import.meta.url), output)
console.log(`Wrote ${records.length} trading day records`)


