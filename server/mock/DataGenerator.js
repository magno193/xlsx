const { faker } = require("@faker-js/faker");

class DataGenerator {
  data = [];
  constructor(counter, generate = false) {
    this.counter = counter;
    if (generate) this.generateData();
  }

  generateData() {
    while (this.counter) {
      let cpf = faker.datatype
        .number({
          min: 0,
          max: 99999999999,
        })
        .toString();
      this.data.push({
        MATRÍCULA: `${faker.datatype.number({
          min: 100000,
          max: 999999,
        })}`,
        CPF: "0".repeat(11 - cpf.length) + cpf,
        NOME: faker.name.findName(),
        COMISSÃO: faker.finance.amount(10, 1000),
      });
      this.counter--;
    }
  }

  returnData() {
    return this.data;
  }
}

module.exports = DataGenerator;
