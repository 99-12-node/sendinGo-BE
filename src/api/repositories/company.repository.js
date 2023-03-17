const { Companies } = require('../../db/models');

class CompanyRepository {
  createCompany = async ({ companyName, companyNumber }) => {
    const newCompany = await Companies.create({
      companyName,
      companyNumber,
    });
    return newCompany;
  };

  findCompanyByName = async ({ companyName }) => {
    const company = await Companies.findOne({ where: { companyName } });

    return company;
  };
}

module.exports = CompanyRepository;
