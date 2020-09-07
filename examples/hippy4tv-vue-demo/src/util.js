import { PageModel } from './components/waterfall-model/PageModel';
import { SectionModel } from './components/waterfall-model/SectionModel';
import { ComponentModel } from './components/waterfall-model/ComponentModel';
import { ItemModel } from './components/waterfall-model/ItemModel';
import {
  EXTRA_ITEM_HEIGHT_WITH_TITLE,
  HEIGHT_TWO_LINE_TITLE, TYPE_COMPONENT_AUTO_DATA,
  TYPE_COMPONENT_FLOW,
  TYPE_COMPONENT_FLOW_HORIZONTAL,
  TYPE_COMPONENT_SHORT_VIDEO,
  TYPE_COMPONENT_SINGLE_LINE,
  TYPE_ITEM_ACTION,
  TYPE_ITEM_FLIP_AD,
  TYPE_ITEM_PAGE,
  TYPE_ITEM_PLAYER,
  TYPE_ITEM_SIMPLE,
  TYPE_ITEM_SIMPLE_TYPE_1,
  TYPE_ITEM_SIMPLE_TYPE_2,
  TYPE_ITEM_SIMPLE_TYPE_UNKNOWN,
  TYPE_ITEM_STAND_NO_TITLE,
  TYPE_ITEM_STAND_SINGLE_LINE_TITLE,
  TYPE_ITEM_TWO_LINE_TITLE,
  WATERFALL_COMPONENT_VERTICAL_MARGIN, WATERFALL_DEV_HORIZONTAL_SPAN_COUNT,
  WATERFALL_ITEM_GAP,
  WATERFALL_ITEM_UNITY,
  WATERFALL_SECTION_GAP,
  WATERFALL_SECTION_PADDING_TOP,
  WIDTH_TWO_LINE_TITLE,
} from './components/waterfall-model/WaterfallConstant';

let cachedApp;

function setApp(app) {
  cachedApp = app;
}

function getApp() {
  return cachedApp;
}

// 过滤所有特殊字符
const stripscript = function (s) {
  // eslint-disable-next-line no-control-regex
  const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？↵\r\n]");
  let rs = '';
  for (let i = 0; i < s.length; i += 1) {
    rs += s.substr(i, 1).replace(pattern, '');
  }
  return rs;
};

// 字符转16进制数字
// eslint-disable-next-line camelcase
const hex_change = function (v) {
  let res;
  switch (v) {
    case 'a': res = 10; break;
    case 'b': res = 11; break;
    case 'c': res = 12; break;
    case 'd': res = 13; break;
    case 'e': res = 14; break;
    case 'f': res = 15; break;
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9': res = Number(v); break;
    default: res = 0; break;
  }
  return res;
};

// 返回 v 乘以 n 个 16 的积
const muti16 = function (v, n) {
  let temp = v;
  for (let i = 0; i < n; i += 1) {
    temp *= 16;
  }
  return temp;
};

// 16进制数转10进制
// eslint-disable-next-line no-unused-vars
const ex16hex = function (value) {
  // eslint-disable-next-line no-param-reassign
  value = stripscript(value);
  // eslint-disable-next-line no-param-reassign
  value = value.replace('0x', '');
  let arr = value.split('');
  arr = arr.reverse();
  let res = 0;
  arr.forEach((i, v) => {
    const num = hex_change(v);
    res += muti16(num, i);
  });
  return res;
};


function isEmpty(obj) {
  // eslint-disable-next-line eqeqeq
  if (typeof obj == 'undefined' || obj == null || obj == '') {
    return true;
  }
  return false;
}
//
// function isNeedMarginBottom(hp) {
//   const plateDetails = hp.plateDetails;
//   let isNeed = false;
//   plateDetails.forEach((pd) => {
//     if (!isEmpty(pd.config.title)) {
//       isNeed = true;
//     }
//   });
//   return isNeed;
// }
// 将一个页面转成一个section
function buildEmptySectionWithHomeArrangePlate(hp) {
  const sectionModel = new SectionModel();
  sectionModel.showTitle = hp.showPlateName !== 0;
  if (sectionModel.showTitle) {
    sectionModel.marginTop = WATERFALL_SECTION_GAP;
  } else {
    sectionModel.marginTop = WATERFALL_COMPONENT_VERTICAL_MARGIN - WATERFALL_SECTION_PADDING_TOP;
  }
  if (isEmpty(hp.iconTitle)) {
    sectionModel.customHeadItem = { text: hp.plateName, titleLogo: hp.iconTitle };
  }
  return sectionModel;
}

// 区分一个版块是竖版还是横版
function isComponentHorizontal(p) {
  let immobileSizeY = 0;
  let isHorizontal = true;
  let row = 1;
  if (isEmpty(p.plateDetails)) {
    return isHorizontal;
  }
  p.plateDetails.forEach((hp) => {
    if (hp.row > row) {
      // 换行
      immobileSizeY = 0;
      // eslint-disable-next-line prefer-destructuring
      row = hp.row;
    }
    if (immobileSizeY === 0) {
      immobileSizeY = hp.sizeY;
    } else if (immobileSizeY !== hp.sizeY) {
      // 如果存在高度不一，证明是竖版
      isHorizontal = false;
    }
  });
  return isHorizontal;
}

function computeSizeWithSpan(span) {
  return (span * WATERFALL_ITEM_UNITY + (span - 1) * WATERFALL_ITEM_GAP);
}

// 确定item的类型
function fixItemSizeIfNeedForTwoLine(p, si, item) {
  // 短视频类型
  // 俩行数据Title类型大小服务端没有返回，本地写死
  const copy = item;
  copy.width = computeSizeWithSpan(3);
  copy.height = HEIGHT_TWO_LINE_TITLE + EXTRA_ITEM_HEIGHT_WITH_TITLE;
  return copy;
}
function shortVideoToItemModel(p, si) {
  let item = new ItemModel();
  item.type = TYPE_ITEM_STAND_SINGLE_LINE_TITLE;
  item.rawDataType = TYPE_ITEM_STAND_SINGLE_LINE_TITLE;
  item.rawData = si;
  item.titleStyle = 1;
  item = fixItemSizeIfNeedForTwoLine(p, si, item);
  item.posterUrl = si.cover;
  item.action = p.action;
  item.displayTitle = isEmpty(si.communityName) ? si.assetName : si.communityNam;
  return item;
}

function buildGridFlowComponent(sourceList, itemSpan, spanCount, preferLine, trim) {
  const component = new ComponentModel();
  component.horizontalSpacing = 42;
  component.verticalSpacing = 42;
  let index = 0;
  for (let i = 0; i < preferLine; i += 1) {
    let spanValue = 0;
    const modelLine = [];
    let complete = false;
    while (sourceList.length > index) {
      const item = sourceList[index];
      index += 1;
      const intentSpan = spanValue + itemSpan;
      if (intentSpan < spanCount) {
        spanValue += itemSpan;
        modelLine.push(item);
        sourceList.pop();
      } else if (intentSpan === spanCount) {
        modelLine.push(item);
        sourceList.pop();
        complete = true;
        break;
      } else {
        break;
      }
    }

    if (trim) {
      if (complete || component.items.size() <= 0) {
        component.items.addAll(modelLine);
      }
    } else {
      component.addAll(modelLine);
    }
  }


  return component;
}

function buildShortVideoSeekMoreComponent(sourceList) {
  const rawList = [];
  rawList.push(sourceList);
  const c = buildGridFlowComponent(sourceList, 1, 4, 2, true);
  c.extra = rawList;
  c.marginTop = WATERFALL_ITEM_GAP;
  c.horizontalSpacing = WATERFALL_ITEM_GAP;
  c.verticalSpacing = WATERFALL_ITEM_GAP;
  return c;
}

// 确定item的类型
function fixItemType(p, pd, item) {
  const copy = item;
  // 短视频类型
  if (p.type === TYPE_COMPONENT_SINGLE_LINE) {
    copy.type = TYPE_ITEM_TWO_LINE_TITLE;
  } else {
    let type = '';
    // eslint-disable-next-line default-case
    switch (pd.detailType) {
      case 1:
        type = TYPE_ITEM_PLAYER;
        copy.type = type;
        break;
      // 新增的翻转广告类型
      case 2:
        type = TYPE_ITEM_FLIP_AD;
        copy.adverId = pd.adverId;
        copy.type = TYPE_ITEM_FLIP_AD;
        break;
      default:
        break;
    }
    if (isEmpty(type)) {
      switch (`${pd.type}`) {
        // 根据type确定item的类型
        case TYPE_ITEM_SIMPLE:
          copy.type = `${pd.type}`;
          break;
        case TYPE_ITEM_SIMPLE_TYPE_1:
          copy.type = `${pd.type}`;
          break;
        case TYPE_ITEM_SIMPLE_TYPE_2:
          copy.type = `${pd.type}`;
          break;
        default:
          copy.type = TYPE_ITEM_SIMPLE_TYPE_UNKNOWN;
      }
    }
    if (isEmpty(copy.type)) {
      switch (pd.config.contentType) {
        case TYPE_ITEM_PAGE: // 布局类型的格子
          copy.type = TYPE_ITEM_TWO_LINE_TITLE;
          break;
        case TYPE_ITEM_ACTION:// action 跳转类型
          copy.type = TYPE_ITEM_TWO_LINE_TITLE;
          break;
        default:
          copy.type = TYPE_ITEM_TWO_LINE_TITLE;
      }
    }
  }
  return copy;
}

// 确定item的大小
function fixItemSizeIfNeed(p, pd, item, isLayoutHorizontal) {
  const copy = item;
  // 短视频类型
  if (p.type === TYPE_COMPONENT_SINGLE_LINE) {
    // 俩行数据Title类型大小服务端没有返回，本地写死
    copy.width = WIDTH_TWO_LINE_TITLE;
    copy.height = HEIGHT_TWO_LINE_TITLE;
  } else {
    // let vhRatio = pd.sizeY / pd.sizeX.toFloat();
    copy.width = computeSizeWithSpan(pd.sizeX);
    if (isLayoutHorizontal) {
      const hwRate = pd.sizeY / pd.sizeX;
      // 高度由宽度的比值而来
      copy.height = Math.floor(hwRate * item.width);
    } else {
      copy.height = computeSizeWithSpan(pd.sizeY);
    }
  }
  return copy;
}

// 特殊处理item
function adjustItemForTitle(title, item) {
  const typeStr = item.type;
  const copy = item;
  // eslint-disable-next-line default-case
  switch (typeStr) {
    case TYPE_ITEM_SIMPLE:
      if (isEmpty(title)) {
        copy.type = TYPE_ITEM_STAND_NO_TITLE;
      } else {
        copy.height += EXTRA_ITEM_HEIGHT_WITH_TITLE;
        copy.type = TYPE_ITEM_SIMPLE;
      }
      break;
    case TYPE_ITEM_SIMPLE_TYPE_1:
      if (isEmpty(title)) {
        copy.type = TYPE_ITEM_STAND_NO_TITLE;
      } else {
        copy.height += EXTRA_ITEM_HEIGHT_WITH_TITLE;
        copy.type = TYPE_ITEM_SIMPLE;
      }
      break;
    case TYPE_ITEM_SIMPLE_TYPE_2:
      if (isEmpty(title)) {
        copy.type = TYPE_ITEM_STAND_NO_TITLE;
      } else {
        copy.height += EXTRA_ITEM_HEIGHT_WITH_TITLE;
        copy.type = TYPE_ITEM_SIMPLE;
      }
      break;
    case TYPE_ITEM_TWO_LINE_TITLE:
      copy.type = TYPE_ITEM_STAND_NO_TITLE;
      break;
  }

  return copy;
}
// 需要完善字段
function configItemWithHomeArrangePlateConfig(it, item) {
  const copy = item;
  if (!isEmpty(it)) {
    copy.posterUrl = it.poster;
    if (it.contentType === TYPE_ITEM_PAGE) {
      // 布局类型的显示下面的标题
      copy.displayTitle = it.posterTitle;
    } else {
      copy.displayTitle = it.posterTitle;
    }
    copy.contentType = it.contentType;
    copy.flagTypeText = it.cornerContent;
    copy.flagText = it.posterTitle;
    copy.action = it.action;
    copy.contentId = it.contentId;
    copy.logoUrl = it.chlogo;
    if (!isEmpty(it.cornerColor)) {
      copy.flagBgColor = ex16hex(it.cornerColor.replace('#', '0x'));
    }
  }
  return adjustItemForTitle(it.posterTitle, item);
}

function fixDataItem(p, item) {
  const copy = item;
  if (p.config.url === '/api/v1/klk/userhistory/history/-1|history') {
    copy.type = 'historyItem';
    copy.name = 'historyGridItem';
  }
  return copy;
}

function homeArrangePlateDetailToItemModel(p, pd, spanCount, isLayoutHorizontal) {
  let it = new ItemModel();

  it = fixItemType(p, pd, it);
  it = fixItemSizeIfNeed(p, pd, it, isLayoutHorizontal);
  it.rawDataType = 'plateDetail';
  it.rawData = pd;
  it = configItemWithHomeArrangePlateConfig(pd.config, it);
  it = fixDataItem(pd, it);
  return it;
}

function buildAutoDataComponent(p) {
  if (!isEmpty(p.data) && p.data.size > 0) {
    const list = [];
    p.data.map((si) => {
      const copy = si;
      copy.communityName = si.assetName;
      // eslint-disable-next-line max-len
      const item = shortVideoToItemModel(p, copy, WATERFALL_DEV_HORIZONTAL_SPAN_COUNT);
      item.isShowPlayIcon = true;
      item.contentType = 0;
      list.push(item);
      return item;
    });
    const c = buildGridFlowComponent(list, 1, 4, 2, true);
    c.type = TYPE_COMPONENT_AUTO_DATA;
    c.name = 'autoData';
    c.dataBundle.set('plate', p);
    // 这里如果时间，服务器的版块接口会不变化，导致每次进入应用内容都相同。所以这里要把时间置成0
    c.dataBundle.set('createTime', 0);
    c.marginTop = WATERFALL_SECTION_PADDING_TOP;
    c.horizontalSpacing = WATERFALL_ITEM_GAP;
    c.verticalSpacing = WATERFALL_ITEM_GAP;
    return c;
  }
  return null;
}

function homeArrangePlateToSection(value) {
  const spanCount = 12;
  const s = buildEmptySectionWithHomeArrangePlate(value);
  const isHorizontalComponent = isComponentHorizontal(value);
  let c = null;
  // eslint-disable-next-line default-case
  switch (value.type) {
    case TYPE_COMPONENT_SINGLE_LINE:
      // 单行类型版块
      // eslint-disable-next-line no-case-declarations
      const list = [];
      value.data.forEach((it) => {
        const item = shortVideoToItemModel(value, it);
        item.contentType = 1;
        item.isShowPlayIcon = true;
        if (item.width > 0) {
          list.push(item);
        }
      });
      c = buildShortVideoSeekMoreComponent(list);
      c.extraType = 'itemList';
      c.horizontalSpacing = WATERFALL_ITEM_GAP;
      c.verticalSpacing = WATERFALL_ITEM_GAP * 2 + 10;
      s.marginTop = WATERFALL_SECTION_GAP;
      break;
    case TYPE_COMPONENT_SHORT_VIDEO:
      c = buildAutoDataComponent(value);
      // eslint-disable-next-line no-case-declarations
      // const list2 = [];
      // value.data.map((it) => {
      //   const copy = it;
      //   copy.communityName = it.assetName;
      //   const item = shortVideoToItemModel(value, copy);
      //   item.isShowPlayIcon = true;
      //   item.contentType = 0;
      //   if (item.width > 0) {
      //     list2.push(item);
      //   }
      //   return item;
      // });
      // c = buildShortVideoSeekMoreComponent(list2);
      // c.extraType = 'shortVideo';
      // c.horizontalSpacing = WATERFALL_ITEM_GAP;
      // c.verticalSpacing = WATERFALL_ITEM_GAP + EXTRA_ITEM_HEIGHT_WITH_TITLE;
      break;
    case TYPE_COMPONENT_FLOW || TYPE_COMPONENT_FLOW_HORIZONTAL:
      if (isHorizontalComponent) {
        c = new ComponentModel();
        c.horizontalSpacing = WATERFALL_ITEM_GAP;
        c.verticalSpacing = WATERFALL_ITEM_GAP;
      } else {
        c = new ComponentModel();
        c.type = 'SpanGridComponent';
        c.spanCount = spanCount;
        c.horizontalSpacing = WATERFALL_ITEM_GAP;
        c.verticalSpacing = WATERFALL_ITEM_GAP;
      }
      c.marginTop = WATERFALL_SECTION_PADDING_TOP;
      value.plateDetails.forEach((it) => {
        if (it.config.url === '/api/v1/live/zero/program/hotlist|zeroprogramall') {
          // 实时热播圈子，特殊处理
          const componentModel = new ComponentModel();
          componentModel.type = 'PendingCpt';
          componentModel.name = 'pendingHotComponent';
          s.name = 'pendingHotPrograms';
          componentModel.extra = value;
          componentModel.height = 270;
          componentModel.marginBottom = EXTRA_ITEM_HEIGHT_WITH_TITLE;
          // componentModel.dataProvider = HotProgramComponentProvider()
          // 因为特殊Item，改变组件
          c = componentModel;
          s.mComponentDataList.push(c);
        } else {
          // sizeY 由sizeX计算后得出
          // eslint-disable-next-line max-len
          const item = homeArrangePlateDetailToItemModel(value, it, spanCount, isHorizontalComponent);
          item.layoutSpanX = it.col - 1;
          item.layoutSpanY = it.row - 1;
          item.spanHorizontal = it.sizeX;
          item.spanVertical = it.sizeY;

          if (item.width > 0) {
            c.items.push(item);
          }
        }
      });
      break;
    default:
      break;
  }
  if (c == null) {
    return null;
  }
  if (c.items.length > 0) {
    s.mComponentDataList.push(c);
  }
  if (s.mComponentDataList.length > 0) {
    return s;
  }
  return null;
}

function trimSections(sections) {
  sections.map((sectionModel, index) => {
    const copyS = sectionModel;
    if (index === 0) {
      copyS.marginTop = 0;
      sectionModel.mComponentDataList.map((componentModel, indexC) => {
        const copyC = componentModel;
        if (indexC === 0) {
          copyC.marginTop = 0;
        }
        return copyC;
      });
    }
    return copyS;
  });
  return sections;
}

function mapperWaterfallData(dataStr) {
  const hm = JSON.parse(dataStr).homeArrange;
  const pagemodel = new PageModel(null);
  pagemodel.id = hm.id;
  pagemodel.imageBG = hm.image;
  pagemodel.secondBG = hm.backgroundImage;
  const plate = hm.plates;
  let sections = [];
  plate.map((value) => {
    const section = homeArrangePlateToSection(value);
    if (section != null) {
      sections.push(section);
    }
    return value;
  });
  sections = trimSections(sections);
  pagemodel.mSections = sections;
  return JSON.stringify(pagemodel);
}

export {
  setApp,
  getApp,
  mapperWaterfallData,
};
