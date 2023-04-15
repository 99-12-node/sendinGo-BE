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
    this.createdAt = data.createdAt.toLocaleString('eu-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    this.rawCreatedAt = data.createdAt;
  }
}

module.exports = { CurrentStatisticsDto };
