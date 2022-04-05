Vue.component('matrix', {
  props: ['color', 'nextClick'],
  data: function(){
    return {
      size: 10,
      grid: this.getGrid(10),
    };
  },
  methods: {
    getGrid: function(size){
      let ret = []
      for(let i=0;i<size;i++){
        let row = []
        for(let j=0;j<size;j++){
          row.push(null);
        }
        ret.push(row);
      }
      return ret;      
    },
    mouseenter: function(evt){
      evt.path[0].style.backgroundColor = this.color;
    },
    mouseleave: function(evt, element){
      evt.path[0].style.backgroundColor = element;
    },
    addColor: function(i, j){
      if(+new Date() / 1000 < this.nextClick){
        return;
      }
      let tmpGrid = this.grid;

      tmpGrid[i][j] = this.color;
      Vue.set(this.grid, tmpGrid)
      this.grid = tmpGrid;
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
        <tr v-for="row, i in grid">
          <td v-for="element, j in row" class="matrixSquare" @mouseenter="mouseenter" @mouseleave="mouseleave($event, element)" @click="addColor(i, j)" :style="{backgroundColor: element}"></td>
        </tr>
      </tbody>
    </table>
  `
})