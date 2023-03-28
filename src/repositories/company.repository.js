const { Companies } = require('../db/models');
const { logger } = require('../middlewares/logger');

class CompanyRepository {
  findCompanyByCompanyId = async ({ companyId }) => {
    logger.info(`CompanyRepository.findCompanyByCompanyId Request`);
    const company = await Companies.findOne({
      attributes: ['companyName', 'companyNumber', 'companyEmail'],
      where: { companyId },
    });

    return company;
  };

  findCompanyByName = async ({ companyName }) => {
    logger.info(`CompanyRepository.findCompanyByName Request`);
    const company = await Companies.findOne({ where: { companyName } });

    return company;
  };

  editCompany = async ({
    companyName,
    companyNumber,
    companyEmail,
    companyId,
  }) => {
    logger.info(`CompanyRepository.editCompany Request`);
    await Companies.update(
      { companyName, companyNumber, companyEmail },
      { where: { companyId } }
    );

    return;
  };

  deleteCompany = async ({ companyId }) => {
    await Companies.destroy({ where: { companyId } });

    return;
  };
}

module.exports = CompanyRepository;
