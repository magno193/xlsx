export default {
  async downloadXLSX () {
    const response = await fetch('http://localhost:4000/excel-single')
    return response
  },
  async downloadZIP () {
    const response = await fetch('http://localhost:4000/excel-multiple')
    return response
  }
}
