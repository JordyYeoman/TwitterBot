const puppeteer = require("puppeteer");
//const mongoose = require("mongoose");
//const schedule = require("node-schedule");
require("dotenv").config();
const fetch = require("node-fetch");
//const environemnt = require('./environmentals');


const username = process.env.LOGINUSERNAME;
const password = process.env.PASSWORD;

//const username = process.env.LOGINUSERNAME;
//const password = process.env.PASSWORD;
const twoFactorEmail = "";


// Connect this sucker to MongoDB
// (async () => {
//   await mongoose
//     .connect(`${process.env.DB_CONNECTION}`, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useFindAndModify: false,
//       useCreateIndex: true,
//     })
//     .then(() => {
//       console.log("Connected to database !!");
//     })
//     .catch((err) => {
//       console.log("Connection failed !!" + err.message);
//     });
// })();

//let data = undefined;

// Boot up this bad boi
(async () => {
  // Fetch Quotes
  const res = await fetch("https://type.fit/api/quotes");
  let data2 = await res.json();

  // Data manipulation
  let randomNumber = Math.floor(Math.random() * data2.length) + 1;
  let textOfDay = data2[randomNumber].text;
  let authorOfDay = data2[randomNumber].author;
  let quoteOfDay = `"${textOfDay}" - ${authorOfDay}`;



  // Let the beast loose!
  const browser = await puppeteer.launch({
    //args: ["--no-sandbox", "--disable-setuid-sandbox", "--headless", "--disable-dev-shm-usage"],
    headless: false,
    executablePath: process.env.CHROMIUM_PATH,
  });
  const page = await browser.newPage();
  await page.goto("https://twitter.com/login");

  console.log("Navigated to Twitter.com")

  await page.waitForSelector("input");

  // In puppeteer - querySelectorAll is $$
  const inputs = await page.$$("input");

  await inputs[5].type(username);
  console.log("Input 5 found");
  console.log(username);
  await inputs[6].type(password);
  console.log(password);

  // What URL are we currently on?
  console.log(page.url());

  console.log("Finding login button");
  const loginButton = await page.$$('[role="button2"]');
  //console.log(loginButton[0]);
  await loginButton[0].click();

  await page.waitForTimeout(6000).then(() => {
    console.log("Waited for 6s");
    // What URL are we currently on?
    console.log(page.url());
  });

  // const twoFactorInputs = await page.$$("input");
  // await twoFactorInputs[5].type(twoFactorEmail);
  // await twoFactorInputs[6].type(password);

  // const loginButton2 = await page.$$('[role="button"]');
  // await loginButton2[0].click();

  await page.waitForTimeout(4000).then(async () => {
    console.log("Waited 4 seconds!");
    // What URL are we currently on?
    console.log(page.url());
    await page.waitForSelector('[aria-label="Tweet text"]');
    const tweetInputField = await page.$$('[aria-label="Tweet text"]');
    //tweetInputField[0].click();
    //console.log(tweetInputField[0]);
    console.log("tweetInputField why don't you exist?");
    await tweetInputField[0].type(quoteOfDay);
    //await tweetInputField[0].type("Hello World, Online");

    const tweetButton = await page.$$('[data-testid="tweetButtonInline"]');
    tweetButton[0].click();
  }).catch((error) => {
    console.error(error);
  });;

  await page.waitForTimeout(4000);
  await browser.close();
})();

// Push to MongoDB
//    const options = {
//     method: "POST",
//     body: JSON.stringify(imageData),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };
//   fetch("http://localhost:9001/posts", options);
//   await browser.close();
