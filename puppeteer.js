const puppeteer = require('puppeteer');




(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://tickets.denverartmuseum.org/DateSelection.aspx?item=2006');

    const tickets = await page.evaluate(() => {
        const desiredSchedules = ['288831', '288832', '288833'];
        const listings = Array.from(document.querySelectorAll('.js-timeslot > a'))
        const html=[]
        let foundTickets = false
        listings.forEach(item => {
            const scheduleId = item.getAttribute('data-schedule');
            if (desiredSchedules.includes(scheduleId)) {
                if (item.innerHTML.includes('Find Tickets')) {
                    foundTickets = true;
                    return;
                }
            }
        })
        return foundTickets;
    })
    console.log('listings', tickets)
    await browser.close();
  })();