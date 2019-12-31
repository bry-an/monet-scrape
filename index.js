const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const axios = require('axios')

const getListings = html => {
  const $ = cheerio.load(html);
  console.log($('js-timeslot'))
  const listings = []
  // return listings;
}


const getHtml = async () => {
axios.get('https://tickets.denverartmuseum.org/DateSelection.aspx?item=2006').then(response => {
  getListings(response)
})

}

// request('https://tickets.denverartmuseum.org/DateSelection.aspx?item=2006', (error, response, body) => {
//   if (error) console.log('error ', error);
//   // console.log('statusCode ', response && response.statusCode)
//   // console.log(getListings(body))
//   // console.log(body)
//   // fs.writeFileSync('example.txt', body)
//   getListings(body)
// })
// console.log(getHtml())
getHtml()
