Vue.component('matrix', {
  props: ['color', 'nextClick', 'pixels'],
  methods: {
    mouseenter: function(evt){
      if(+new Date() / 1000 < this.nextClick){
        return;
      }      
      evt.path[0].style.backgroundColor = this.color;
    },
    mouseleave: function(evt, element){
      evt.path[0].style.backgroundColor = element?.color || null;
    },
    addColor: function(i, j){
      if(+new Date() / 1000 < this.nextClick){
        return;
      }
      this.$emit('update', {
        row: i,
        col: j,
        color: this.color,
        timestamp: +new Date() / 1000,
      });
    },
  },
  template: `
    <table style="border-collapse: collapse;margin:auto;margin-bottom: 40px;">
      <tbody>
        <tr v-for="row, i in pixels">
          <td v-for="element, j in row" class="matrixSquare" @mouseenter="mouseenter" @mouseleave="mouseleave($event, element)" @click="addColor(i, j)" :style="{backgroundColor: element?.color}"></td>
        </tr>
      </tbody>
    </table>
  `
})