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

  editCompany = async ({ companyName, companyNumber, companyId }) => {
    await Companies.update(
      { companyName, companyNumber },
      { where: { companyId } }
    );

    return;
  };
}

module.exports = CompanyRepository;
