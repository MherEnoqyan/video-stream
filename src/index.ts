interface Result {
	description: string;
	id: number;
	url: string;
}

import express from "express";
import fs from "fs";
import cors from "cors";
import url from "url";
import path from "path";
import {fork} from "child_process";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
	const host = req.protocol + '://' + req.get('host');
	const result:Result[] = [];

	fs.readdir("video", (err, files) => {
		files.forEach((file, index) => {
			const url = `${host}/streamcontent/${ index + 1}/${file.split(".")[0]}.m3u8`;
			result.push({
				description: file,
				id: index + 1,
				url: url
			});
		});

		res.json(result);
	});

});

app.post('/create-stream', (req, res) => {
	const host = req.protocol + '://' + req.get('host');
	fs.readdir('video', (err, files) => {
		files.forEach((file, index) => {
			const source = `video/${file}`;
			const streamFolder = `streamcontent/${ index + 1}`;
			const streamFile = `${file.split(".")[0]}.m3u8`;

			if (!fs.existsSync(`./${streamFolder}`)) {
				fs.mkdirSync(`./${streamFolder}`);
			}

			fork("dist/stream.js", [source,host,streamFolder,streamFile]);
		});
	});
});

app.get('/streamcontent/*', (req, res) => {
	const uri = url.parse(req.url).pathname;
	const filename = path.join(process.cwd(), unescape(uri));
	let stats;

	try {
		stats = fs.lstatSync(filename);
	} catch (e) {
		res.status(404).end('404 Not Found\n');
		return;
	}

	if (stats.isFile()) {
		switch (path.extname(filename).split(".")[1]) {
			case 'ts':
				res.writeHead(200, {'Content-Type': 'video/MP2T'} );
				break;
			case 'm3u8':
				res.writeHead(200, {'Content-Type': 'application/x-mpegURL'} );
				break;
		}

		const fileStream = fs.createReadStream(filename);
		fileStream.pipe(res);
	} else {
		res.status(500).end('500 Internal server error\n');
	}
});

app.use((req, res) => {
	res.status(404).end('404 Not Found\n');
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
