import express from "express";
import fs from "fs";
const app = express();

app.get("/", (req, res) => {

	const result = [];

	fs.readdir("video", (err, files) => {
	  files.forEach((file, index) => {
		result.push({
			description: file,
			id: index + 1,
			url: "/show?v=" + file
		});
	  });

	  res.json(result);
	});
	
});

app.get("/show", (req, res) => {
	const filePath = "./video/" + req.query.v;
	fs.exists(filePath, (exists) => {
	  if (exists) {
		res.writeHead(200, {"Content-Type": "video/mp4"} );
		const fileStream = fs.createReadStream("./video/" + req.query.v);
		fileStream.pipe(res);
	  } else {
		res.statusCode = 404;
		res.send("404 Not Found\n");
	  }
	});
});

app.listen(3000, () => {
  console.log("App listening on port 3000!");
});
