[![license](https://img.shields.io/github/license/mamal72/gheroon.svg)](https://github.com/mamal72/gheroon/blob/master/LICENSE)

# gheroon

Gheroon is a simple JS library to get currency and gold price in Iran.


## Installation

```bash
npm i gheroon
# or
yarn add gheroon
```


## Usage

```js
import { getCoinData, getCurrencyData } from 'gheroon';

(async () => {
  // Get currency price data
  const currencyData = await getCurrencyData();

  // Get coin price data
  const coinData = await getCoinData();
})();
```


## Ideas or Issues

Create an issue and describe it. I'll check it ASAP!


## Contribution

You can fork the repository, improve or fix some part of it and then send the pull requests back if you want to see them here. I really appreciate that. :heart:


## License

Licensed under the [MIT License](https://github.com/mamal72/gheroon/blob/master/LICENSE).
