const puppeteer = require("puppeteer");

module.exports = function ({ url, height, width, format, quality }) {
	return new Promise((resolve, reject) => {
		(async () => {
			const browser = await puppeteer.launch({
				args: [
					"--incognito",
					"--no-sandbox",
					"--disable-setuid-sandbox",
				],
				headless: true,
			});

			const page = await browser.newPage();

			await page.setViewport({
				height: parseInt(height) || 480,
				width: parseInt(width) || 640,
			});

			await page.goto(url, {
				waitUntil: ["load", "networkidle0", "domcontentloaded"],
			});

			const options = {};
			options.fullPage = false;
			options.type = "png";
			if (format === "jpeg") {
				option.quality = parseInt(quality) || 80;
				options.type = format;
			}

			const buffer = await page.screenshot(options);

			await browser.close();

			resolve(buffer);
		})();
	});
};
