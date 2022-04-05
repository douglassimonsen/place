const app = new Vue({
  el: '#page',
  data: function(){
    return {
      pixels: [[]],
      color: "#aa0000",
      lastClicked: null,
      secondsBetweenClicks: 10,
    };
  },
  computed: {
    nextClick: function(){
      if(this.lastClicked === null){
        return 0;
      }
      return this.lastClicked + this.secondsBetweenClicks;
    }
  },
  methods: {
    logChange: function(obj){
      this.lastClicked = obj.timestamp;
    },
  },
});