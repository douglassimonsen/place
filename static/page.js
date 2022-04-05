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
  created: function() {
    const timer = setInterval(() => {
      this.checkForUpdates();
    }, 1000);
  
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
  mounted: function(){
    this.checkForUpdates();
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
    checkForUpdates: function(){
      axios.post('/grid/load').then(function(response){
        this.pixels = response.data;
      }.bind(this))
    },
    logChange: function(obj){
      obj.username = this.username;

      let row = this.pixels[obj.row].slice(0);
      row[obj.col] = {
        color: obj.color,
        username: obj.username,
      };
      Vue.set(this.pixels, obj.row, row);

      axios.post('/grid/save', obj).then(function(response){});
      this.lastClicked = obj.timestamp;
    },
    checkLength: function(){
      this.username = this.username.slice(0, 40);
    }
  },
});