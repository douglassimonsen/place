const app = new Vue({
  el: '#page',
  data: function(){
    return {
      pixels: [[]],
      color: "#aa0000",
      lastClicked: null,
      secondsBetweenClicks: 10,
      username: '',
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
    checkLength: function(){
      this.username = this.username.slice(0, 40);
    }
  },
});