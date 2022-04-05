const app = new Vue({
  el: '#page',
  data: function(){
    return {
      pixels: [[]],
      color: "#aa0000",
      lastClicked: null,
      lastServerUpdate: null,
      secondsBetweenClicks: 2,
      username: '',
    };
  },
  created: function() {
    this.checkForUpdates();
    const timer = setInterval(() => {
      this.checkForUpdates();
    }, 333);
  
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
    this.username = JSON.parse(document.cookie).username;
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
      axios.post('/grid/needs_update', {'lastServerUpdate': this.lastServerUpdate}).then(function(response){
        if(!response.data){ // no update needed, helps with performance
          return;
        }
        axios.post('/grid/load').then(function(response){
          this.lastServerUpdate = response.data.lastServerUpdate
          this.pixels = response.data.pixels;
        }.bind(this))
      }.bind(this));

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
      document.cookie = JSON.stringify({username: this.username});
    }
  },
});