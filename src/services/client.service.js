const { logger } = require('../middlewares/logger');
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  Conflict,
} = require('../exceptions/errors');
const ClientRepository = require('../repositories/client.repository');
const GroupRepository = require('../repositories/group.repository');
const TalkContentRepository = require('../repositories/talkcontent.repository');
const TalkTemplateRepository = require('../repositories/talktemplate.repository');

module.exports = class ClientService {
  constructor() {
    this.clientRepository = new ClientRepository();
    this.groupRepository = new GroupRepository();
    this.talkContentRepository = new TalkContentRepository();
    this.talkTemplateRepository = new TalkTemplateRepository();
  }
  // 클라이언트 등록
  createClient = async ({
    userId,
    companyId,
    clientName,
    contact,
    clientEmail,
  }) => {
    logger.info(`ClientService.createClient Request`);
    const duplicatedClient = await this.clientRepository.getDuplicatedClient({
      userId,
      companyId,
      clientName,
      contact,
      clientEmail,
    });
    if (duplicatedClient) {
      throw new Conflict('중복된 클라이언트가 존재합니다.');
    }

    // 미지정 그룹 존재 확인
    const existDefaultGroup = await this.groupRepository.findDefaultGroup({
      userId,
      companyId,
    });
    // 미지정 그룹 있으면 클라이언트만 생성
    if (existDefaultGroup) {
      const createClient = await this.clientRepository.createClient({
        userId,
        companyId,
        clientName,
        contact,
        clientEmail,
      });
      if (!createClient) {
        throw new BadRequestError('클라이언트 등록에 실패하였습니다.');
      }
      return createClient;
    }
    // 미지정 그룹 없으면 클라이언트, 기본 그룹 동시 생성
    const createClient = await this.clientRepository.createClientAndGroup({
      userId,
      companyId,
      clientName,
      contact,
      clientEmail,
    });
    if (!createClient) {
      throw new BadRequestError('클라이언트 등록에 실패하였습니다.');
    }
    return createClient;
  };

  //클라이언트 전체 조회 (쿼리로 조건 조회)
  getClients = async ({ userId, companyId, index, keyword }) => {
    logger.info(`ClientService.getClients Request`);

    const offset = index ? parseInt(index - 1) : 0;

    // 그룹별 클라이언트 개수
    const clientCount = await this.clientRepository.getAllClientsCount({
      userId,
      companyId,
    });

    // 키워드 검색
    const clientsByKeyword =
      await this.clientRepository.findAllClientsByKeyword({
        userId,
        companyId,
        keyword: keyword ?? '%',
        offset,
      });

    return { clients: clientsByKeyword, clientCount };
  };

  //클라이언트 그룹별 조회
  getClientsByGroup = async ({
    userId,
    companyId,
    groupId,
    index,
    keyword,
  }) => {
    logger.info(`ClientService.getClientsByGroup Request`);

    const offset = index ? parseInt(index - 1) : 0;

    const existGroup = await this.groupRepository.findGroupId({
      userId,
      companyId,
      groupId,
    });
    if (!existGroup) {
      throw new NotFoundError('그룹 조회에 실패하였습니다.');
    }

    const clients = await this.clientRepository.findClientsByKeywordAndGroup({
      userId,
      companyId,
      groupId,
      index,
      keyword: keyword ?? '%',
      offset,
    });
    return clients;
  };

  //클라이언트 수정
  editClientInfo = async ({
    userId,
    companyId,
    clientId,
    clientName,
    contact,
    clientEmail,
  }) => {
    logger.info(`ClientService.editClientInfo Request`);
    const data = await this.clientRepository.confirmUser({
      userId,
      companyId,
      clientId,
    });

    if (!data) {
      throw new NotFoundError('클라이언트 조회에 실패하였습니다.');
    }

    if (userId !== data.userId) {
      throw new ForbiddenError('수정 권한이 없습니다.');
    }

    const editedClient = await this.clientRepository.editClientInfo({
      clientId,
      userId,
      companyId,
      clientName,
      contact,
      clientEmail,
    });

    if (!editedClient) {
      throw new NotFoundError('수정에 실패하였습니다');
    }

    return editedClient;
  };

  //클라이언트 삭제
  deleteClient = async ({ userId, companyId, clientId }) => {
    logger.info(`ClientService.deleteClient Request`);
    const deleteData = await this.clientRepository.confirmUser({
      clientId,
      userId,
      companyId,
    });

    if (!deleteData) {
      throw new NotFoundError('클라이언트 조회에 실패하였습니다.');
    }

    if (userId !== deleteData.userId) {
      throw new ForbiddenError('삭제 권한이 없습니다.');
    }

    const deleteId = await this.clientRepository.deleteClient({
      clientId,
      userId,
      companyId,
    });
    if (!deleteId) {
      throw new BadRequestError('삭제에 실패하였습니다.');
    }

    return deleteData;
  };

  // 클라이언트 대량등록
  createClientBulk = async ({
    userId,
    companyId,
    clientName,
    contact,
    clientEmail,
    ...talkContentData
  }) => {
    logger.info(`ClientService.createClientBulk Request`);
    // 중복된 클라이언트 확인
    const dulicatedClient = await this.clientRepository.getDuplicatedClient({
      userId,
      companyId,
      clientName,
      contact,
      clientEmail,
    });
    // 중복된 클라이언트인 경우, 기존 데이터에 덮어쓰기
    if (dulicatedClient) {
      const updatedTalkContent =
        await this.talkContentRepository.updateContentByExistClient({
          userId,
          companyId,
          clientId: dulicatedClient.clientId,
          ...talkContentData,
        });
      return dulicatedClient;
    }
    // 동일한 정보가 없는 경우만, 클라이언트 생성
    const newClient = await this.clientRepository.createClient({
      userId,
      companyId,
      clientName,
      contact,
      clientEmail,
    });
    if (!newClient) {
      throw new BadRequestError('클라이언트 대량 등록에 실패하였습니다.');
    }
    if (talkContentData) {
      const newTalkContent = await this.talkContentRepository.createTalkContent(
        {
          userId,
          companyId,
          clientId: newClient.clientId,
          ...talkContentData,
        }
      );
      if (!newTalkContent) {
        throw new BadRequestError('전송 데이터 등록에 실패하였습니다.');
      }
    }
    return newClient;
  };
};
