function ComponentModel(marginTop,marginBottom,type,extra,extraType,items) {
  this.marginTop = marginTop;
  this.marginBottom = marginBottom;
  this.type = type;
  this.extra = extra;
  this.extraType = extraType; // extra的额外类型用于传递给java解析
  this.items = items;
}

function addItem(item){
  this.items.add(item);
}
