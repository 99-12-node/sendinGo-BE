class CurrentStatisticsDto {
  totalClientCount;
  totalGroupCount;
  accumulateSuccessRatio;
  accumulateClickRatio;
  createdAt;

  constructor(data) {
    this.totalClientCount = data.totalClientCount;
    this.totalGroupCount = data.totalGroupCount;
    this.accumulateSuccessRatio = data.accumulateSuccessRatio;
    this.accumulateClickRatio = data.accumulateClickRatio;
    this.createdAt = data.createdAt;
  }
}

module.exports = { CurrentStatisticsDto };
