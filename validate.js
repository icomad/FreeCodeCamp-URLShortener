const dns = require('dns');

exports.validateURL = (url) => {
  url = url.replace(/(^\w+:|^)\/\//, '');
  return new Promise((resolve, reject) => {
    dns.lookup(url, (err, address, family) => {
      if (err) reject(err);
      resolve();
    })
  });
}