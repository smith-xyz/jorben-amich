const path = require('path');
const fs = require('fs');

(async () =>
  await Promise.all(
    [
      ['https://isidore.co/aquinas/ContraGentiles1.htm', 'scg-1.txt'],
      ['https://isidore.co/aquinas/ContraGentiles2.htm', 'scg-2.txt'],
      ['https://isidore.co/aquinas/ContraGentiles3a.htm', 'scg-3a.txt'],
      ['https://isidore.co/aquinas/ContraGentiles3b.htm', 'scg-3b.txt'],
      ['https://isidore.co/aquinas/ContraGentiles4.htm', 'scg-4.txt'],
    ].map(async ([url, filename]) => {
      const result = await fetch(url);
      const html = await result.text();
      fs.writeFileSync(path.join(__dirname, filename), html);
    })
  ))();
