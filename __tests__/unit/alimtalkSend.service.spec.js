const AlimtalkSendService = require('../../src/services/alimtalkSend.service.js');
const redis = require('redis-mock');

const mockClientRepository = {
  createClientAndGroup: jest.fn(),
  createClient: jest.fn(),
  findAllClientsByKeyword: jest.fn(),
  getAllClients: jest.fn(),
  getClientsByGroup: jest.fn(),
  findClientsByKeywordAndGroup: jest.fn(),
  editClientInfo: jest.fn(),
  deleteClient: jest.fn(),
  getClientByClientId: jest.fn(),
  getDuplicatedClient: jest.fn(),
  confirmUser: jest.fn(),
  confirmUserId: jest.fn(),
  getAllClientsCount: jest.fn(),
  getClientsByGroupId: jest.fn(),
};

const mockTalkContentRepository = {
  createTalkContent: jest.fn(),
  getTalkContentById: jest.fn(),
  getContentByClientId: jest.fn(),
  updateTalkContentById: jest.fn(),
  getTalkContentInNoAuth: jest.fn(),
  findClientsByKeywordAndGroup: jest.fn(),
  updateContentByExistClient: jest.fn(),
};

const mockTalkTemplateRepository = {
  getTemplateByCode: jest.fn(),
  getVariablesByTemplateId: jest.fn(),
  getTemplateById: jest.fn(),
  getTemplatesList: jest.fn(),
  getTemplateVariablesById: jest.fn(),
};

const mockTalkSendRepository = {
  createTalkSend: jest.fn(),
  updateTalkSendResult: jest.fn(),
  getExistTalkSendByMid: jest.fn(),
  getTalkSendByMidAndGroup: jest.fn(),
  getTalkSendBySendId: jest.fn(),
  getExistTalkSendListByMid: jest.fn(),
};

const mockGroupRepository = {
  createGroup: jest.fn(),
  findDefaultGroup: jest.fn(),
  findSameGroup: jest.fn(),
  getAllGroup: jest.fn(),
  deleteGroup: jest.fn(),
  findGroupId: jest.fn(),
};

const mockTalkClickRepository = {
  createTalkClick: jest.fn(),
  saveTrackingUUID: jest.fn(),
  saveTrackingUUIDByContentId: jest.fn(),
  getValueByTrackingUUID: jest.fn(),
};

const alimtalkSendService = new AlimtalkSendService();
alimtalkSendService.clientRepository = mockClientRepository;
alimtalkSendService.talkContentRepository = mockTalkContentRepository;
alimtalkSendService.talkTemplateRepository = mockTalkTemplateRepository;
alimtalkSendService.talkSendRepository = mockTalkSendRepository;
alimtalkSendService.groupRepository = mockGroupRepository;
alimtalkSendService.talkClickRepository = mockTalkClickRepository;

describe('AlimtalkSendService Unit Test', () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test('AlimtalkSendService saveTalkContents Method', async () => {
    const getClientByClientIdReturnValue = {
      clientId: 1,
      clientName: '고객일',
      contact: '01012341234',
    };
    mockClientRepository.getClientByClientId = jest.fn(() => {
      return getClientByClientIdReturnValue;
    });

    const findGroupIdReturnValue = {
      groupId: 1,
      groupName: '회원가입 안내',
      groupDescripton: null,
      userId: 1,
      company: 1,
    };
    mockGroupRepository.findGroupId = jest.fn(() => {
      return findGroupIdReturnValue;
    });

    const getTemplateByIdReturnValue = {
      talkTemplateId: 6,
      talkTempateName: '회원가입완료 안내',
    };
    mockTalkTemplateRepository.getTemplateById = jest.fn(() => {
      return getTemplateByIdReturnValue;
    });

    const getTalkContentByIdReturnValue = {
      talkContentId: 1,
      clientId: 1,
      userId: 1,
      companyId: 1,
      organizationName: '센딩고',
      customerName: '김손님',
      orderNumber: '10123123',
      region: '서울시',
      regionDetail: '은평구',
      deliveryDate: '5월 1일',
      paymentPrice: 300000,
      deliveryCompany: 'OO택배',
      deliveryNumber: '1234-12341233',
    };
    mockTalkContentRepository.getTalkContentById = jest.fn(() => {
      return getTalkContentByIdReturnValue;
    });

    const getVariablesByTemplateIdReturnValue = [
      {
        talkVariableId: 1,
        talkVariableEng: 'organizationName',
        talkVariableKor: '회사명',
      },
      {
        talkVariableId: 10,
        talkVariableEng: 'customerName',
        talkVariableKor: '고객명',
      },
    ];
    mockTalkTemplateRepository.getVariablesByTemplateId = jest.fn(() => {
      return getVariablesByTemplateIdReturnValue;
    });

    const talkSendRequiredData = await alimtalkSendService.saveTalkContents({
      userId: 1,
      companyId: 1,
      groupId: 1,
      clientId: 1,
      talkTemplateId: 6,
      talkContentId: 1,
      organizationName: '센딩고',
      customerName: '나고객',
    });

    expect(talkSendRequiredData).toEqual({
      talkContentId: getTalkContentByIdReturnValue.talkContentId,
      clientId: getClientByClientIdReturnValue.clientId,
      groupId: findGroupIdReturnValue.groupId,
      talkTemplateId: getTemplateByIdReturnValue.talkTemplateId,
    });

    expect(mockClientRepository.getClientByClientId).toHaveBeenCalledTimes(1);
    expect(mockGroupRepository.findGroupId).toHaveBeenCalledTimes(1);
    expect(mockTalkTemplateRepository.getTemplateById).toHaveBeenCalledTimes(1);
    expect(mockTalkContentRepository.getTalkContentById).toHaveBeenCalledTimes(
      1
    );
    expect(mockTalkContentRepository.getTalkContentById).toHaveBeenCalledTimes(
      1
    );
    expect(
      mockTalkTemplateRepository.getVariablesByTemplateId
    ).toHaveBeenCalledTimes(1);
  });
});
