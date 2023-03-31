const { clickElement } = require("./commands.js");

module.exports = {
  getRandomChairSelector: function (rows, chairsInRow) {
    let row = Math.round(Math.random() * (rows - 1)) + 1;
    let chair = Math.round(Math.random() * (chairsInRow - 1)) + 1;
    return "div:nth-child(" + row + ") > span:nth-child(" + chair + ")";
  },
  
  confirmBooking: async function (page) { 
    await clickElement(page, "button");
    await page.waitForSelector("h2");
    await clickElement(page, "button");
    await page.waitForSelector("img");
    const imgClassName = await page.$eval("img", (el) => el.className);
    return imgClassName;
  },

  getFreeRandomChair: async function (page) { 
    let rowsCount = await page.$$("div.buying-scheme__row");
    let rows = rowsCount.length; 
    let chairsInRowCount = await page.$$("div>span.buying-scheme__chair");
    let chairsInRow = chairsInRowCount.length/rows; 
    let i, attempts = rows * chairsInRow * 3; 
    for (i = 0; i < attempts; i++) {
      let row = Math.round(Math.random() * (rows - 1)) + 1;
      let chair = Math.round(Math.random() * (chairsInRow - 1)) + 1;
      let chairSelector = "div:nth-child(" + row + ") > span:nth-child(" + chair + ")";
      let className = await page.$eval(chairSelector, (el) => el.classList[2]);
      if (
        className !== "buying-scheme__chair_selected" &&
        className !== "buying-scheme__chair_taken"
      ) {
        return chairSelector;
      }
    }
    throw new Error(
      `Сделано ${attempts} попыток - не удалось найти свободное кресло!`
    );
  },

  selectDate: async function (page, day) {  
    await page.waitForSelector("h1");
    let daysOfWeek = await page.$$("a.page-nav__day"); 
    await daysOfWeek[day].click();
  },

  selectHall: async function (page, index1) { 
    let halls = await page.$$("div>ul>li"); 
    await halls[index1-1].click();
    await page.waitForSelector("p.buying__info-hall");
  }
};
