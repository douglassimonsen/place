Vue.component('matrix', {
  props: ['color', 'nextClick', 'pixels'],
  data: function(){
    return {
      zoomIndex: 6,
      position: {x: 0, y: 0},
      zoomLevels: [.1, .17, .25, .4, .5, .8, 1, 1.5, 2, 3, 4, 6, 8, 10, 12],
      dragStart: null,
    };
  },
  computed: {
    viewBox: function(){
      return `${this.position.x} ${this.position.y} ${this.viewSideLength} ${this.viewSideLength}`;
    },
    zoom: function(){
      return this.zoomLevels[this.zoomIndex];
    },
    sideLength: function(){
      return 40 * this.pixels[0].length;
    },
    viewSideLength: function(){
      return this.sideLength / this.zoom;
    }
  },
  methods: {
    onwheel: function(evt){
      let oldViewSideLength = this.viewSideLength;
      if(evt.deltaY < 0){
        this.zoomIndex = Math.min(this.zoomIndex + 1, this.zoomLevels.length - 1);
      }
      if(evt.deltaY > 0){
        this.zoomIndex = Math.max(this.zoomIndex - 1, 0);
      }
      let posInCanvas = {
        x: evt.clientX - evt.path[3].getBoundingClientRect().x,
        y: evt.clientY - evt.path[3].getBoundingClientRect().y,
      };
      this.position = {
        x: this.position.x + oldViewSideLength * (posInCanvas.x / 400) - this.viewSideLength / 2,
        y: this.position.y + oldViewSideLength * (posInCanvas.y / 400) - this.viewSideLength / 2,
      }
    },
    mousedown: function(evt){
      this.dragStart = {
        x: evt.clientX,
        y: evt.clientY,
      }
    },
    mouseup: function(evt){
      this.position = {
        x: this.position.x + (this.dragStart.x - evt.clientX) / this.zoomLevels[this.zoomIndex] * (this.sideLength / 400),
        y: this.position.y + (this.dragStart.y - evt.clientY) / this.zoomLevels[this.zoomIndex] * (this.sideLength / 400),
      };
      this.dragStart = null;
    },
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
      <svg width=400 height=400 :viewBox="viewBox" 
        @wheel.prevent.stop="onwheel" 
        @mousedown.prevent.stop="mousedown" 
        @mouseup.prevent.stop="mouseup" 
      >
        <g v-for="row, i in pixels" :transform="translateRow(i)">
          <g v-for="element, j in row" :transform="translateCol(j)">
            <rect x=0 y=0 width=40 height=40 draggable="true"
              @mouseenter="mouseenter"
              @mouseleave="mouseleave($event, element)"
              @click.stop="addColor(i, j)" 
              :style="{fill: element?.color || '#ffffff', strokeWidth: '1px', stroke: '#000000'}" 
            />
          </g>
        </g>
      </svg>
    </div>
  `
})