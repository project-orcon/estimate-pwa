<template>
  <v-card>
    <v-tabs background-color="white" color="deep-purple accent-4" right>
      <v-tab>To Do</v-tab>
      <v-tab>Complete</v-tab>
      <v-tab-item v-for="n in 2" :key="n">
        <v-container fluid>
          <v-row>
            <v-col v-for="(item,index) in tasks" :key="index" cols="12" md="4">
              <v-card class="mx-auto" max-width="344" outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4">Task #{{index+1}}</div>
                    <v-list-item-title class="headline mb-1">{{item.name}}</v-list-item-title>
                    <v-list-item-subtitle>Min Estimate: {{item.minEstimate}} MIN</v-list-item-subtitle>
                    <v-list-item-subtitle>Max Estimate: {{item.maxEstimate}} MIN</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-avatar>
                    <v-btn text icon color="green">
                      <v-icon>check</v-icon>
                    </v-btn>
                    <v-btn text icon color="primary">
                      <v-icon>more_vert</v-icon>
                    </v-btn>
                  </v-list-item-avatar>
                </v-list-item>
                <v-card-actions>
                  <v-btn text>Elapsed Time: {{formatSeconds(item.currentTime)}}</v-btn>
                  <v-btn
                    fab
                    class="white--text"
                    color="deep-purple"
                    @click="item.active=!item.active"
                    style="margin-top:-40px; margin-left:75px"
                  >
                    <v-icon>{{item.active? "pause":"play_arrow"}}</v-icon>
                  </v-btn>
                </v-card-actions>
                <v-progress-linear :value="formatProgress(item.currentTime,item.maxEstimate)"></v-progress-linear>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>
<script>
// @ is an alias to /src
import fakeData from "../data.js";
export default {
  name: "home",
  mounted() {
    window.setInterval(() => {
      //every one second update all cards which are currently active.
      this.tasks.forEach(function(x) {
        if (x.active) {
          x.currentTime++;
        }
      });
    }, 1000);
  },
  methods: {
    formatSeconds: function(sec) {
      //format into M:SS 
      return Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);
    },
    formatProgress: function (sec,maxEstimateMinutes) {
      //format progress bar (100 = 100%)
      return sec/(maxEstimateMinutes*60)*100;
    }
  },
  data() {
    return {
      tasks: fakeData.data
    };
  }
};
</script>
