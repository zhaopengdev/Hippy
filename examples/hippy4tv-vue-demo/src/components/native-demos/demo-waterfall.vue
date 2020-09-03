<template>
  <div id="waterfall-demo">
    <!-- dialog 无法支持 v-show，只能使用 v-if 进行显示切换 -->
    <img class="background" :src="backgroundImg"/>
    <Waterfall
      id="waterfall"
      ref="waterfall"
      :style="{height:waterfallHeight,width:waterfallWidth}"
      :waterfallData = waterfallData
      class="waterfall"/>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapperWaterfallData } from '../../util';
import { testData } from '../waterfall-model/WaterfallData';

export default {
  methods: {
    clickView() {
      this.dialogIsVisible = !this.dialogIsVisible;
    },
    clickOpenSecond(evt) {
      evt.stopPropagation(); // 二级弹窗关闭时会冒泡到这里，所以也要阻止一下冒泡防止一级 dialog 消失
      this.dialog2IsVisible = !this.dialog2IsVisible;
    },
    onClose(evt) {
      evt.stopPropagation();
      // Dialog 会响应硬件返回按钮，所以需要在这里关闭弹窗。
      // 如果第二层弹窗是展开的，则只关闭二层弹窗，否则关闭一层弹窗
      if (this.dialog2IsVisible) {
        this.dialog2IsVisible = false;
      } else {
        this.dialogIsVisible = false;
      }
      console.log('Dialog is closing');
    },
    stopPropagation(evt) {
      evt.stopPropagation();
    },
  },
  data() {
    return {
      supportedOrientations: [
        'portrait',
        'portrait-upside-down',
        'landscape',
        'landscape-left',
        'landscape-right',
      ],
      Vue,
      waterfallData: '',
      backgroundImg: '',
      dialogIsVisible: false,
      dialog2IsVisible: false,
    };
  },
  // 绑定 Vue-Router 的返回 hook
  beforeRouteLeave(to, from, next) {
    // 如果弹窗没开，就返回上一页。
    if (!this.dialogIsVisible) {
      next();
    }
  },
  computed: {
    waterfallHeight() {
      // return Vue.Native.Dimensions.screen.height + 'px';
      return '1000px';
    },
    waterfallWidth() {
      // return Vue.Native.Dimensions.screen.width + 'px';
      return '600px';
    },
  },
  mounted() {
    // console.log(this.$refs.toString());
    // document.getElementById('waterfall').height = Vue.Native.Dimensions.screen.height + 'px'
    // this.refs.waterfall.width = '600px'
    // this.refs.waterfall.height = '1000px'
    // document.getElementById('waterfall').width = Vue.Native.Dimensions.screen.width + 'px'
    // fetch('http://qapi.moss.huan.tv/api/v1/home/layout/272', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    // eslint-disable-next-line max-len
    //   body: '{"action":"","developer":{"apikey":"2V29G3SD","packagename":"tv.huan.channelzero","secretkey":"5faa1c397ed64d09a17ab89b6b19d373","vercode":1500,"vername":"1.5.0-debug"},"device":{"brand":"OnePlus","clientType":"GM1910","dnum":"21DDF9841191EFABA08DA5402F917C1F","mac":"00db019c25b3","manufacturer":"OnePlus","model":"GM1910"},"param":{"advertCode":"CHANELZERO_CUSTOM_MSG","channelCode":"CHANGHONG","contentId":0,"custom":{"advertCode":"CHANELZERO_CUSTOM_MSG","assetId":"","categoryId":"","communityId":""},"rows":20,"start":0,"versionCode":1500},"user":{"appId":"123","baiduId":"123","city":"","latitude":"","longitude":"","province":"","umengId":"123","userId":0,"userToken":""}}',
    // })
    //   // eslint-disable-next-line no-undef
    //   .then((rsp) => {
    //     console.log(rsp);
    //     if (rsp.status === 200) {
    //       console.log(rsp.body.code);
    //       // if (rsp.body.code == 0) {
    //       this.waterfallData = rsp.body;
    //       mapperWaterfallData(rsp.body.toString());
    //       this.backgroundImg = JSON.parse(rsp.body).data.homeArrange.image;
    //       // }
    //     }
    //   });
    // console.log(testData);
    const rsp = JSON.parse(testData);
    const formate = mapperWaterfallData(JSON.stringify(rsp.data));
    console.log(formate);
  },
};
</script>

<style scope>
#dialog-demo {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
}

.dialog-demo-button-1 {
  height: 64px;
  width: 200px;
  border-style: solid;
  border-color: #40b883;
  border-width: 2px;
  border-radius: 10px;
  align-items: center;
}

.dialog-demo-button-1 .button-text {
  line-height: 56px;
  text-align: center;
}

.dialog-demo {
  position: absolute;
  background-color: transparent;
}
.background{
  flex: 1;
  height: 600px;
}
.waterfall{
  position: absolute;
  /*height: 500px;*/
  /*width: 1017px;*/
  left: 0px;
  /*padding-top: 100px;*/
  padding-left: 40px;
  padding-right: 40px;
  /*margin-top: 10px;*/
}

</style>
