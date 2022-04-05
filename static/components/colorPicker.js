Vue.component('colorPicker', {
  props: ['value'],
  data: function(){
    return {
      colorOptions: [["white", "#ffffff"], ["black", "#000000"]],
    };
  },
  methods: {
    selectColor(colorOpt){
      this.$emit('value', colorOpt[1]);
    },
  },
  template: `
    <div class="colorPicker">
      <div v-for="opt in colorOptions" class="colorSquareContainer">
        <div class="colorSquare" :style="{backgroundColor: opt[1]}" @click="selectColor(opt)"></div>
        <div>
          {{opt[0]}}
        </div>
      </div>
    </div>
  `
});