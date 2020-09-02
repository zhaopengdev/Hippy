function ItemModel(type, rawDataType) {
  this.type = type
  this.logoUrl = '';
  this.titleStyle = 0;
  this.disableShadow = false;
  this.layoutSpanx = 0;
  this.layoutSpanY = 0;
  this.spanHorizontal = 0;
  this.width = 0;
  this.height = 0;
  this.spanVertical = 0;
  this.isShowPlayIcon = false;
  this.flagBgColor = 0;
  this.contentId = -1;
  this.adverId = '';
  this.contentType = -100;
  this.rawDataType = rawDataType;
  this.rawData = null;
  this.flagTypeText = '';
  this.flagText = '';
  this.displaySubTitle = '';
  this.posterUrl = '';
  this.displayTitle = '';
  this.action = '';
}
