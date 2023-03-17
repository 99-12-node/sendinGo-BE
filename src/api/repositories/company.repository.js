const { Companies } = require('../../db/models');

class CompanyRepository {
  createCompany = async ({ companyName, companyNumber }) => {
    const newCompany = await Companies.create({
      companyName,
      companyNumber,
    });
    return newCompany;
  };

  findCompany = async ({ companyId }) => {
    const company = await Companies.findPK({ companyId });

    return company;
  };
}

module.exports = CompanyRepository;