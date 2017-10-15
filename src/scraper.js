import cheerio from 'cheerio';
import axios from 'axios';

import {
  TABLE_SELECTOR,
  CURRENCY_URL,
  COIN_URL
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
  const table = dom(TABLE_SELECTOR);

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
  let currencyData = [];

  // Fetch page and load it
  const pageData = await fetchPage(COIN_URL);
  const dom = getPageDOM(pageData);
  const table = dom(TABLE_SELECTOR);

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
