const http = require("http");
const { PORT } = require("./app.config");

const { router } = require("./routes")["ROUTES"];

const app = http.createServer(router).listen(PORT, () => {
  console.log(`Listening on http://localhost:${app.address().port}`);
});
