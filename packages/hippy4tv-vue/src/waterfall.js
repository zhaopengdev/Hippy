

function registerWaterfall(Vue) {
  Vue.registerElement('my-waterfall', {
    component: {
      name: 'Waterfall',
    },
  });

  Vue.component('waterfall', {
    props: {
      color: Number,
    },

    render(h){
      return h(
        'my-waterfall',
        {
          ref: 'waterfall',

        }, this.$slots.default);
    }
  });

}

export default registerWaterfall;
