function SectionModel(title, marginTop, marginBottom,
  titleVerticalSpacing, customHeadItem, mComponentDataList) {
  this.title = title; // 标题
  this.marginTop = marginTop;
  this.marginBottom = marginBottom;
  this.titleVerticalSpacing = titleVerticalSpacing; // 标题与内容的间隔
  this.customHeadItem = customHeadItem;
  this.mComponentDataList = mComponentDataList; // 组件列表
}
