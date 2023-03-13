const customerService = require('../services/customer.repository');

class customerCotroller {
  constructor() {
    this.customerService = new customerService();
  }
}

module.exports = customerCotroller;
