Vue.component('matrix', {
  props: ['color', 'nextClick', 'pixels'],
  methods: {
    mouseenter: function(evt){
      if(+new Date() / 1000 < this.nextClick){
        return;
      }      
      evt.path[0].style.fill = this.color;
    },
    mouseleave: function(evt, element){
      evt.path[0].style.fill = element?.color || '#ffffff';
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
    translateRow(rowIndex){
      return `translate(0, ${rowIndex * 40})`;
    },
    translateCol(colIndex){
      return `translate(${colIndex * 40}, 0)`;
    },    
  },
  template: `
    <div style="display: flex;justify-content: center;align-items: center; padding-top:60px">
      <svg width=400 height=400>
        <g v-for="row, i in pixels" :transform="translateRow(i)">
          <g v-for="element, j in row" :transform="translateCol(j)">
            <rect x=0 y=0 width=40 height=40
              @mouseenter="mouseenter"
              @mouseleave="mouseleave($event, element)"
              @click="addColor(i, j)" 
              :style="{fill: element?.color || '#ffffff', strokeWidth: '1px', stroke: '#000000'}" 
            />
          </g>
        </g>
      </svg>
    </div>
  `
})