const XLSX = require("xlsx-js-style");
const path = require("path");

class XLSXService {
  columnsWch = [12.5, 12.5, 35, 10];
  constructor(data) {
    this.data = data;
  }

  mapData(data) {
    this.data = data;
    return this;
  }

  createWorkSheet() {
    this.worksheet = XLSX.utils.json_to_sheet(this.data, {
      cellStyles: true,
    });
    const [matricula, cpf, nome, comissao] = this.columnsWch;
    this.worksheet["!cols"] = [{ wch: matricula }, { wch: cpf }, { wch: nome }, { wch: comissao }];
    return this;
  }

  separateAlphabeticValues() {
    let alphabetic = [];
    for (const iterator of Object.keys(this.worksheet).values()) {
      const alphaName = iterator.replace(/\d/g, "");
      const foundName = alphabetic.findIndex(v => v === alphaName);
      if (foundName >= 0) break;
      alphabetic = [...alphabetic, iterator.replace(/\d/g, "")];
    }
    this.alphabetic = alphabetic;
    return this;
  }

  styleCells() {
    const columns = this.alphabetic.map(a => a + "1");
    for (const column of columns.values()) {
      this.worksheet[column]["s"] = {
        font: { bold: true, color: "F0F0F0" },
        alignment: { horizontal: "center", vertical: "center" },
        fill: { bgColor: "202020" },
      };
    }
    return this;
  }

  createXLSXFile(worksheet = this.worksheet, filename = "SHEET") {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, filename);
    const filePath = path.resolve(__dirname, "..", "uploads", "SHEET.xlsx");
    XLSX.writeFile(workbook, filePath);
    return { filePath, filename };
  }

  createWorkBook() {
    this.workbook = XLSX.utils.book_new();
    return this;
  }

  createXLSXBuffer(worksheet = this.worksheet, filename = "SHEET") {
    XLSX.utils.book_append_sheet(this.workbook, worksheet, filename);
    const buffer = XLSX.write(this.workbook, {
      type: "buffer",
      bookType: "xlsx",
    });
    return { buffer, filename };
  }
}

module.exports = XLSXService;
