var fs = require("fs"),
  http = require("http");

http
  .createServer(function (req, res) {
    fs.readFile(__dirname + req.url, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }

      if (req.url.endsWith(".js")) {
        res.setHeader("Content-Type", "text/javascript");
      }

      res.writeHead(200);
      res.end(data);
    });
  })
  .listen(8080);
