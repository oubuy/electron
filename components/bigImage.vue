<template>
  <div id="slider">
    <div class="window" @mouseover="stop" @mouseleave="play">
        <viewer v-if="list" :images="list" :options="options">
            <ul class="container" :style="containerStyle">
                <li ref="offsetWidth">
                  <!-- <img :style="{width:imgWidth+'px'}" :src="list[list.length - 1]" alt=""> -->
                    <img :style="{width:imgWidth+'vw'}" :src="list[list.length - 1]" alt="">
                
                </li>
                <li  v-for="(item, index) in list" :key="index">
                  <!-- <img :style="{width:imgWidth+'px'}" :src="item" alt=""> -->
                  <img :style="{width:imgWidth+'vw'}" :src="item" alt="">
                
                </li>
                <li>
                  <!-- <img :style="{width:imgWidth+'px'}" :src="list[0]" alt=""> -->
                  <img :style="{width:imgWidth+'vw'}" :src="list[0]" alt="">
              
                </li>
            </ul>
        </viewer>
        
    </div>
   
       <ul class="direction">
        <li class="left" @click="move(offsetWith, 1, speed)">
          
           <img src="~@/assets/local/images/left.png" alt="" class="">
        </li>
        <li class="right" @click="move(offsetWith, -1, speed)">
      
         <img src="~@/assets/local/images/right.png" alt="" class="">
        </li>
      </ul>
  
  </div>
   
</template>
<script>
import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer/src/component.vue";
export default {
  name: "slider",
  props: {
    initialSpeed: {
      type: Number,
      default: 30
    },
    initialInterval: {
      type: Number,
      default: 3
    },
    list: Array
  },
  data() {
    return {
      // list: [
      //   "https://pic.oceano.com.cn/osntv/banner/banner1(3840).jpg",
      //   "https://pic.oceano.com.cn/osntv/banner/banner2(3840).jpg",
      //   "https://pic.oceano.com.cn/osntv/banner/banner3(3840).jpg",
      //   "http://pic.oceano.com.cn/h5filesystem/products/p0350dd4747b74a77b92cde52ebedfbcd/thumb.jpg",
      //   "http://pic.oceano.com.cn/h5filesystem/products/p744c39b5cadd4115b1317a03b100759b/thumb.jpg",
      //   "http://pic.oceano.com.cn/h5filesystem/products/p4727b7503115443ab7e6cc1e71725ef5/thumb.jpg",
      //   "http://pic.oceano.com.cn/h5filesystem/products/p50180bb73181408b901852b56d2d5dc8/thumb.jpg"
      // ],
      sliderWidth:'',
       offsetWith:'',
      // imgWidth: 600,
      imgWidth: 36,
      currentIndex: 1,

      // distance: -600,
       distance:"",
      transitionEnd: true,
      speed: this.initialSpeed,
      options: {
        button: true,
        toolbar: true,
        rotatable: false,
        scalable: false,
        navbar: true,
        movable: false,
        title: false,
        // toolbar: false,
        fullscreen: false
      }
    };
  },
  components: {
    Viewer
  },
  computed: {
    containerStyle() {
      return {
        // transform: `translate3d(${this.distance}px, 0, 0)`
         transform: `translate3d(${this.distance}px, 0, 0)`
      };
    },
    interval() {
      return this.initialInterval * 1000;
    }
  },
  mounted() {
    setTimeout(()=>{
      console.log(this.$refs.offsetWidth,77777)
      this.offsetWith=this.$refs.offsetWidth.offsetWidth;
     this.distance=-this.offsetWith-70;
    },1000)
    this.init();
    // console.log(this.list,7777);
  },
  methods: {
    init() {
      this.play();
      window.onblur = function() {
        this.stop();
      }.bind(this);
      window.onfocus = function() {
        this.play();
      }.bind(this);
    },
    move(offset, direction, speed) {
      // console.log(offset, direction, speed)
      if (!this.transitionEnd) return;
      this.transitionEnd = false;
      // 源码
      // direction === -1
      //   ? (this.currentIndex += offset / 600)
      //   : (this.currentIndex -= offset / 600);

       direction === -1
        ? (this.currentIndex += offset / this.offsetWith)
        : (this.currentIndex -= offset / this.offsetWith);

      if (this.list) {
        if (this.currentIndex > this.list.length - 1) this.currentIndex = 1;
        if (this.currentIndex < 1) this.currentIndex = this.list.length - 1;
        const destination = this.distance + offset * direction;
        this.animate(destination, direction, speed);
      }
      // if (this.currentIndex > this.list.length - 1) this.currentIndex = 1;
      // if (this.currentIndex < 1) this.currentIndex = this.list.length - 1;
      // const destination = this.distance + offset * direction;
      // this.animate(destination, direction, speed);
    },
    animate(des, direc, speed) {
      if (this.list.length > 1) {
        if (this.temp) {
          window.clearInterval(this.temp);
          this.temp = null;
        }
        this.temp = window.setInterval(() => {
          if (
            (direc === -1 && des < this.distance) ||
            (direc === 1 && des > this.distance)
          ) {
            this.distance += speed * direc;
          } else {
            this.transitionEnd = true;
            window.clearInterval(this.temp);
            this.distance = des;
            // if (des < -(this.list.length * 600)) this.distance = -600;
            // if (des > -600) this.distance = -(this.list.length * 600);
             if (des < -(this.list.length * this.offsetWith)) this.distance = -this.offsetWith;
            if (des > -this.offsetWith) this.distance = -(this.list.length * this.offsetWith);
          }
        }, 20);
      }
    },
    jump(index) {
      const direction = index - this.currentIndex >= 0 ? -1 : 1;
      // const offset = Math.abs(index - this.currentIndex) * 600;
       const offset = Math.abs(index - this.currentIndex) * this.offsetWith;
      const jumpSpeed =
        Math.abs(index - this.currentIndex) === 0
          ? this.speed
          : Math.abs(index - this.currentIndex) * this.speed;
      this.move(offset, direction, jumpSpeed);
    },
    play() {
      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
      this.timer = window.setInterval(() => {
        // this.move(600, -1, this.speed);
        this.move(this.offsetWith, -1, this.speed);
      }, this.interval);
    },
    stop() {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
ol,
ul {
  list-style: none;
}
#slider {
  position: relative;
  // text-align: center;
//  width: 38.5vw;
  overflow: hidden;
 
}
.window {
  position: relative;
  width: 38vw;
  height: 58vh;
  max-width: 600px;
  max-height: 600px;
  // margin: 0 67px;
  margin-left: 20px;
  padding: 0 70px;
  overflow: hidden;
}
.container {
  display: flex;
  position: absolute;
  height: 100%;
  li {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
     
    
      max-width: 600px;
     max-height: 600px;
     margin: 0 auto;
      // height: auto;
    }
  }
}
.direction {
}
.left,
.right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  cursor: pointer;
}
.left {
  left: 0%;
  padding-left: 12px;
  padding-top: 10px;
}
.right {
  right: 0%;
  padding-right: 12px;
  padding-top: 10px;
}
img {
  user-select: none;
}
.dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}
.dots li {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin: 0 3px;
  border: 1px solid white;
  border-radius: 50%;
  background-color: #333;
  cursor: pointer;
}
.dots .dotted {
  background-color: orange;
}

.viewer-toolbar {
  li {
    width: 35px !important;
    height: 35px !important;
  }
}
.viewer-toolbar > ul > li::before {
  margin: 7px !important;
}
</style>
