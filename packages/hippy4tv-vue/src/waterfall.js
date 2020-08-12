

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
  });

}

export default registerWaterfall;
