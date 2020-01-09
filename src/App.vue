<template>
  <v-app>
    <v-app-bar app style="background-color:#ffffff" >
      <v-toolbar-title class="headline green--text  " style="width:100%;" >
        <div><v-icon left style="margin-top:-6px;font-size:25px" color="black" >  timer</v-icon><span class=" black--text">ESTIMATE XYZ</span></div>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-content class="black">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  components: {
    HelloWorld
  },
  data: () => ({
    //
  })
};
</script>

<style>


</style>
