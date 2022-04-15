const AdmZip = require("adm-zip");
const DataGenerator = require("./mock/DataGenerator");
const XLSXService = require("./services/XLSXService");
exports.ROUTES = {
  router: (request, response) => {
    const { url, method } = request;
    const urlMethod = `${url}:${method}`;
    const route = this.ROUTES[urlMethod] ? this.ROUTES[urlMethod] : this.ROUTES.default;
    return route(request, response);
  },
  default: (request, response) => {
    response.write("Default Route");
    return response.end();
  },
  "/excel-single:GET": (request, response) => {
    console.log("Excel:GET SINGLE Route\n");
    const { data } = new DataGenerator(100, true);

    const { filePath } = new XLSXService(data)
      .createWorkSheet()
      .separateAlphabeticValues()
      .styleCells()
      .createXLSXFile();

    let readStream = require("fs").createReadStream(filePath);
    require("fs").unlink(filePath, err => {
      if (err) console.log(err);
    });
    readStream.on("open", () => {
      response.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      response.setHeader("Content-Disposition", "attachment; filename=SHEET.xls");
      response.setHeader("Access-Control-Allow-Origin", "*");
      readStream.pipe(response);
    });
    readStream.on("error", err => {
      console.log(err);
      response.writeHead(400);
      response.destroy();
    });
    request.setTimeout(12000, () => {
      request.abort();
    });
  },
  "/excel-multiple:GET": (request, response) => {
    console.log("Excel:GET MULTIPLE Route\n");
    const FIRST_NUMBER = 1 + +(Math.random() * 9).toFixed();
    let count = FIRST_NUMBER;
    const zip = new AdmZip();
    while (count) {
      const xlsxService = new XLSXService().createWorkBook();
      const randomNumbers100 = 1 + +(Math.random() * 99).toFixed();
      const { data } = new DataGenerator(randomNumbers100, true);
      const { buffer, filename } = xlsxService
        .mapData(data)
        .createWorkSheet()
        .separateAlphabeticValues()
        .styleCells()
        .createXLSXBuffer();

      zip.addFile(`${filename}${count}.xls`, buffer, "comment");
      count--;
    }

    const zipBuffer = zip.toBuffer();

    response.writeHead(200, {
      "Content-Type": "application/zip",
      "Content-disposition": "attachment; filename=myFile.zip",
      "Access-Control-Allow-Origin": "*",
    });
    // new Buffer is deprecated use Buffer.from() instead
    response.write(Buffer.from(zipBuffer));
    response.end(null, "binary");

    response.end();
  },
};
