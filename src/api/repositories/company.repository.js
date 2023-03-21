const { Companies } = require('../../db/models');
const { logger } = require('../../middlewares/logger');

class CompanyRepository {
  findCompanyByCompanyId = async ({ companyId }) => {
    logger.info(`CompanyRepository.findCompanyByCompanyId Request`);
    const company = await Companies.findOne({
      attributes: ['companyName', 'companyNumber'],
      where: { companyId },
    });

    return company;
  };

  createCompany = async ({ companyName, companyNumber }) => {
    logger.info(`CompanyRepository.createCompany Request`);
    const newCompany = await Companies.create({
      companyName,
      companyNumber,
    });
    return newCompany;
  };

  findCompanyByName = async ({ companyName }) => {
    logger.info(`CompanyRepository.findCompanyByName Request`);
    const company = await Companies.findOne({ where: { companyName } });

    return company;
  };

  editCompany = async ({ companyName, companyNumber, companyId }) => {
    logger.info(`CompanyRepository.editCompany Request`);
    await Companies.update(
      { companyName, companyNumber },
      { where: { companyId } }
    );

    return;
  };
}

module.exports = CompanyRepository;
