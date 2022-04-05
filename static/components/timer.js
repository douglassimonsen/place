Vue.component('timer', {
  props: ['lastClicked', 'secondsBetweenClicks'],
  data: function(){
    return {
      secondsDiff: null,
    };
  },
  created: function() {
    const timer = setInterval(() => {
      this.getSecondsDiff();
    }, 1000);
  
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
  computed: {
    hours: function(){
      let tmp = Math.floor(this.secondsDiff / 3600);
      return tmp.toString().padStart(2, '0');
    },
    minutes: function(){
      let tmp = Math.floor((this.secondsDiff % 3600) / 60);
      return tmp.toString().padStart(2, '0');
    },
    seconds: function(){
      let tmp = Math.floor(this.secondsDiff % 60);
      return tmp.toString().padStart(2, '0');
    },
    time: function(){
      return `${this.hours}:${this.minutes}:${this.seconds}`;
    }
  },
  methods: {
    getSecondsDiff: function(){
      if(this.lastClicked === null){
        this.secondsDiff = null;
      }
      else{
        this.secondsDiff = Math.max(0, this.secondsBetweenClicks - Math.floor(+(new Date() / 1000) - this.lastClicked));
      }
    },
  },
  template: `
    <div v-text="time" style="text-align:center">
    </div>
  `
})