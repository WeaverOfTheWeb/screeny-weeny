const screenshot = require("./screenshot");
const http = require("http");
const url = require("url");

http.createServer(async function (req, res) {
	const queryObject = url.parse(req.url, true).query;

	if (queryObject.url && queryObject.height && queryObject.width) {
		try {
			const screenshotData = await screenshot({
				height: queryObject.height,
				width: queryObject.width,
				url: queryObject.url,
				format: queryObject.format,
			});

			if (queryObject.output === "binary") {
				res.writeHead(200, {
					"Content-Type": `image/${queryObject.format || "png"}`,
					"Content-disposition": `attachment;filename=${url
						.parse(queryObject.url, true)
						.hostname.replaceAll(".", "_")}.${
						queryObject.format || "png"
					}`,
					"Content-Length": screenshotData.length,
				});
				res.end(Buffer.from(screenshotData, "binary"));
			} else {
				res.writeHead(200, { "Content-Type": "text/html" });

				res.write(
					`<img src="data:image/${
						queryObject.format || "png"
					};base64,${screenshotData.toString("base64")}" />`
				);
			}
		} catch (e) {
			res.writeHead(500, { "Content-Type": "text/html" });
			res.write(`${e}`);
		}
	} else {
		res.write(JSON.stringify(queryObject));
	}

	res.end();
}).listen(process.env.PORT || 1337);
