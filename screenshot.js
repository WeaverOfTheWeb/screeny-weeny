const puppeteer = require("puppeteer");

module.exports = function ({url, height, width, format}) {
	return new Promise((resolve, reject) => {
		(async () => {
			const browser = await puppeteer.launch({
				args: [
					"--incognito",
					"--no-sandbox",
					"--disable-setuid-sandbox"
				]
			});

			const page = await browser.newPage();

			await page.setViewport({
				height: parseInt(height) || 480,
				width: parseInt(width) || 640,
			});

			await page.goto(url, {
				waitUntil: [
					"load",
					"networkidle0",
					"domcontentloaded"
				]
			});

			const buffer = await page.screenshot({
				fullPage: false,
				type: format || "png"
			});

			await browser.close();

			resolve(buffer);
		})();
	});
};
