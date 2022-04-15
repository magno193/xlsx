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
    const worksheet = XLSX.utils.json_to_sheet(data, {
      cellStyles: true,
    });
    let alphabetic = [];
    for (const iterator of Object.keys(worksheet).values()) {
      const alphaName = iterator.replace(/\d/g, "");
      const foundName = alphabetic.findIndex((v) => v === alphaName);
      if (foundName >= 0) break;
      alphabetic = [...alphabetic, iterator.replace(/\d/g, "")];
    }
    const columns = alphabetic.map((a) => a + "1");
    for (const column of columns.values()) {
      worksheet[column]["s"] = { font: { name: "Courier", sz: 24 } };
    }

    const { filePath } = new XLSXService(data)
      .createWorkSheet()
      .separateAlphabeticValues()
      .styleCells()
      .createXLSXFile();

    let readStream = require("fs").createReadStream(filePath);
    require("fs").unlink(filePath, (err) => {
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
    // const headers = {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    //   "Access-Control-Max-Age": 2592000, // 30 days
    //   "Content-Type": "application/json",
    //   /** add other headers as per requirement */
    // };
    // response.writeHead(200, headers);

    // return response.end(JSON.stringify({ workbook: workbook }));
  },
  "/excel:POST": (request, response) => {
    response.write();
    response.end();
  },
};
