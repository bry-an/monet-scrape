const puppeteer = require('puppeteer');
const nodemailer = require("nodemailer");
require('dotenv').config()

const user = process.env.AWS_USER
const pass = process.env.AWS_PASS

console.log("Ticket check service initialized.")
async function email(msg) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
//   let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user,
      pass
    },
    tls: {
        ciphers: 'SSLv3',
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Brace Gudnis" <bryan@bryanyunis.com>', // sender address
    to: "bryan@bryanyunis.com", // list of receivers
    subject: "Tickets Available", // Subject line
    text: `There is a ticket available! Here's information on it: ${msg}`, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

setInterval(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://tickets.denverartmuseum.org/DateSelection.aspx?item=2006');

    const ticketsAvailable = await page.evaluate(() => {
        const desiredSchedules = ['288831', '288832', '288833']
        const listings = Array.from(document.querySelectorAll('.js-timeslot > a'))
        let tickets = false
        let foundTicketInfo = ''
        listings.forEach(item => {
            const scheduleId = item.getAttribute('data-schedule');
            if (desiredSchedules.includes(scheduleId)) {
                if (!item.innerHTML.includes('Sold Out')) {
                    tickets = true;
                    foundTicketInfo = item.innerHTML
                }
            }
        })
        return tickets
    })
    if (ticketsAvailable === true) {
        email(positiveSchedule).catch(console.error)
        console.log('There\'s a ticket available! An email has been sent. 😃')
    } else {
        console.log('No tickets available ☹️. Last checked at ', new Date())
    }
    await browser.close();
  }, 30 * 1000)

