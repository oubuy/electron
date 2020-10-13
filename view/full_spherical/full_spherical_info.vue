<template>
    <div>
        <nav-menu></nav-menu>
        <div>
           <content-info></content-info>
        </div>
    </div>
</template>
<script>
import contentInfo from "../../components/common_info";
import NavMenu from "../../components/nav_menu";
export default {
    data(){
        return{

        }
    },
     components: {
    NavMenu,
    contentInfo
   
  },
}
</script>
