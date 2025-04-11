const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const fs = require("fs");

const URL = "https://www.saucedemo.com";
const SCREENSHOT_DIR = "./screenshots/";

function takeScreenshot(driver, name) {
  driver.takeScreenshot().then((data) => {
    fs.writeFileSync(`${SCREENSHOT_DIR}${name}.png`, data, "base64");
  });
}

describe("Pruebas con Selenium en JS", function () {
  this.timeout(30000);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("Login exitoso", async () => {
    await driver.get(URL);
    await driver.findElement(By.id("user-name")).sendKeys("standard_user");
    await driver.findElement(By.id("password")).sendKeys("secret_sauce");
    await driver.findElement(By.id("login-button")).click();
    await driver.wait(until.urlContains("inventory"), 5000);

    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include("inventory");

    takeScreenshot(driver, "login_exitoso");
  });

  it("Login fallido con credenciales erróneas", async () => {
    await driver.get(URL);
    await driver.findElement(By.id("user-name")).sendKeys("wrong");
    await driver.findElement(By.id("password")).sendKeys("wrong");
    await driver.findElement(By.id("login-button")).click();

    const error = await driver.findElement(By.css(".error-message-container"));
    expect(await error.isDisplayed()).to.be.true;

    takeScreenshot(driver, "login_fallido");
  });
});
