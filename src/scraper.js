import axios from 'axios';
import cheerio from 'cheerio';

import {
  BITCOIN_URL,
  COIN_URL,
  CURRENCY_URL,
  ETHEREUM_URL
} from './strings';

const fetchPage = async (url) => {
  const response = await axios.get(url);
  return response.data;
};

const getPageDOM = (data) => {
  return cheerio.load(data);
};

const normalize = (data) => {
  const replaceMap = {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
    ',': ''
  };
  let result = data;
  Object.entries(replaceMap).forEach(([from, to]) => {
    result = result.replace(new RegExp(from, 'g'), to);
  });
  return result;
};

export const getCurrencyData = async () => {
  // Final currency data
  let currencyData = [];

  // Fetch page and load it
  const pageData = await fetchPage(CURRENCY_URL);
  const dom = getPageDOM(pageData);
  const table = dom('.data-table.market-table > tbody');

  // Iterate over price table rows and get needed data
  table.find('tr').each((index, row) => {
    // Select useful data from table row
    const id = index + 1;
    const title = dom(row).find('th').eq(0).text();
    const price = normalize(dom(row).find('td').eq(0).text());
    const change = dom(row).find('td').eq(1).text();
    const changeTypeElement = dom(row)
      .find('td')
      .eq(1)
      .find('span');
    let changeType = '';
    if (changeTypeElement.hasClass('high')) {
      changeType = '+';
    }
    if (changeTypeElement.hasClass('low')) {
      changeType = '-';
    }
    const minimum = normalize(dom(row).find('td').eq(2).text());
    const maximum = normalize(dom(row).find('td').eq(3).text());
    const updatedAt = normalize(dom(row).find('td').eq(4).text());

    const currencyItemData = {
      id,
      title,
      price,
      change,
      changeType,
      minimum,
      maximum,
      updatedAt
    };

    currencyData.push(currencyItemData);
  });

  return currencyData;
};

export const getCoinData = async () => {
  // Final coin data
  let coinData = [];

  // Fetch page and load it
  const pageData = await fetchPage(COIN_URL);
  const dom = getPageDOM(pageData);
  const table = dom('.data-table.market-table > tbody');

  // Iterate over price table rows and get needed data
  table.find('tr').each((index, row) => {
    // Select useful data from table row
    const id = index + 1;
    const title = dom(row).find('th').eq(0).text();
    const price = normalize(dom(row).find('td').eq(0).text());
    const change = dom(row).find('td').eq(1).text();
    const changeTypeElement = dom(row)
      .find('td')
      .eq(1)
      .find('span');
    let changeType = '';
    if (changeTypeElement.hasClass('high')) {
      changeType = '+';
    }
    if (changeTypeElement.hasClass('low')) {
      changeType = '-';
    }
    const minimum = normalize(dom(row).find('td').eq(2).text());
    const maximum = normalize(dom(row).find('td').eq(3).text());
    const updatedAt = normalize(dom(row).find('td').eq(5).text() || dom(row).find('td').eq(4).text());

    const coinItemData = {
      id,
      title,
      price,
      change,
      changeType,
      minimum,
      maximum,
      updatedAt
    };

    coinData.push(coinItemData);
  });

  return coinData;
};

const getCryptoCurrencyData = async (url) => {
  // Fetch page and load it
  const pageData = await fetchPage(url);
  const dom = getPageDOM(pageData);
  const title = dom('.page-title').text();
  const list = dom('.data-line');

  const listItems = list.find('li');
  const price = normalize(listItems.eq(0).find('span').text());
  const maximum = normalize(listItems.eq(1).find('span').text());
  const minimum = normalize(listItems.eq(2).find('span').text());
  const updatedAt = normalize(listItems.eq(6).find('span').text());
  const change = `${listItems.eq(9).find('span').text()} (${listItems.eq(8).find('span').text()})`;
  const changeTypeElement = listItems.eq(8).find('span');
  let changeType = '';
  if (changeTypeElement.hasClass('high')) {
    changeType = '+';
  }
  if (changeTypeElement.hasClass('low')) {
    changeType = '-';
  }

  return {
    title,
    price,
    change,
    changeType,
    minimum,
    maximum,
    updatedAt
  };
};

export const getBitcoinData = async () => getCryptoCurrencyData(BITCOIN_URL);

export const getEthereumData = async () => getCryptoCurrencyData(ETHEREUM_URL);
