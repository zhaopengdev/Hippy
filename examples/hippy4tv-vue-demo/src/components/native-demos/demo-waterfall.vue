<template>
  <div id="dialog-demo">
    <label>显示或者:</label>
    <button class="dialog-demo-button-1" @click="clickView">
      <span class="button-text">显示对话</span>
    </button>
    <!-- dialog 无法支持 v-show，只能使用 v-if 进行显示切换 -->
    <waterfall class="dialog-demo"></waterfall>
  </div>
</template>

<script>
export default {
  methods: {
    clickView() {
      this.dialogIsVisible = !this.dialogIsVisible;
    },
    clickOpenSecond(evt) {
      evt.stopPropagation(); // 二级弹窗关闭时会冒泡到这里，所以也要阻止一下冒泡防止一级 dialog 消失
      this.dialog2IsVisible = !this.dialog2IsVisible;
    },
    onShow() {
      console.log('Dialog is opening');
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


</style>
