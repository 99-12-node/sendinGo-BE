const { Companies } = require('../../db/models');

class CompanyRepository {
  findCompanyByCompanyId = async ({ companyId }) => {
    const company = await Companies.findOne({
      attributes: ['companyName', 'companyNumber'],
      where: { companyId },
    });

    return company;
  };

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

  deleteCompany = async ({ companyId }) => {
    await Companies.destory({ where: { companyId } });

    return;
  };
}

module.exports = CompanyRepository;
