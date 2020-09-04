export function ComponentModel() {
  this.marginTop = 0;
  this.marginBottom = 0;
  this.type = 'waterfall';
  this.extra = null;
  this.extraType = ''; // extra的额外类型用于传递给java解析
  this.items = [];
  this.dataBundle = new Map();
  this.name = '';
  this.needLoad = true;
  this.width = -1;
  this.height = -2;
  this.verticalSpacing = 42;
  this.horizontalSpacing = 42;
  this.spanCount = 24;
}

export default {
  ComponentModel,
};
