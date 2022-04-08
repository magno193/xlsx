export default {
  async downloadExcel(request) {
    const response = await fetch("http://localhost:4000/excel", {
      method: "POST",
      body: JSON.stringify(request),
    });
    return response;
  },
  async getExcel() {
    const response = await fetch("http://localhost:4000/excel");
    return response;
  },
};
