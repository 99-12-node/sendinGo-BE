const customerRepository = require('../repositories/customer.repository');

class customerService {
  constructor() {
    this.customerRepository = new customerRepository();
  }
}

module.exports = customerService;
