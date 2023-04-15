class CurrentStatisticsDto {
  totalClientCount;
  totalGroupCount;
  accumulateSuccessRatio;
  accumulateClickRatio;
  createdAt;

  constructor(data) {
    this.hourlyStatisticsId = data.hourlyStatisticsId;
    this.totalClientCount = data.totalClientCount;
    this.totalGroupCount = data.totalGroupCount;
    this.accumulateSuccessRatio = data.accumulateSuccessRatio;
    this.accumulateClickRatio = data.accumulateClickRatio;

    const rawCreatedAt = data.createdAt;
    rawCreatedAt.setHours(rawCreatedAt.getHours() + 9); // 한국 시간으로 변견
    this.createdAt = rawCreatedAt.toLocaleString('eu-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }); // mm-dd hh:mm 으로 양식 변경
    this.rawCreatedAt = rawCreatedAt;
  }
}

module.exports = { CurrentStatisticsDto };
