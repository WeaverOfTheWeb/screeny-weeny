const screenshot = require("./screenshot");
const http = require("http");
const url = require("url");

http.createServer(async function (req, res) {
	const queryObject = url.parse(req.url, true).query;

	if (queryObject.url && queryObject.height && queryObject.width) {
		try {
			const buffer = await screenshot({
				height: queryObject.height,
				width: queryObject.width,
				url: queryObject.url,
				format: queryObject.format,
			});

			res.writeHead(
				200,
				{ "Content-Type": "text/html" }
			);
			
			if (queryObject.format === 'jpeg') {
				res.write(`<img src="data:image/jpeg;base64,${buffer.toString("base64")}" />`);
			} else {
				res.write(`<img src="data:image/png;base64,${buffer.toString("base64")}" />`);
			}
		} catch (e) {
			res.writeHead(
				500,
				{ "Content-Type": "text/html" }
			);
			res.write(`${e}`);
		}
	} else {
		res.write(JSON.stringify(queryObject));
	}

	res.end();
}).listen(process.env.PORT || 1337);
