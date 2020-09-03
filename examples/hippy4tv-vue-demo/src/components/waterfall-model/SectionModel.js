export function SectionModel() {
  this.id = 0;
  this.title = ''; // 标题
  this.marginTop = 0;
  this.marginBottom = 0;
  this.titleVerticalSpacing = 0; // 标题与内容的间隔
  this.customHeadItem = null;
  this.showTitle = true;
  this.name = '';
  this.mComponentDataList = []; // 组件列表
}
export default {
  SectionModel,
};
