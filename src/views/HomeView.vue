<template>
  <div id="home">
    <div class="white--text black"></div>
    <v-tabs color="primary accent-4" background-color="black" dark right style="min-height:100vh">
      <v-tab>To Do</v-tab>
      <v-tab>Complete</v-tab>
      <v-tab-item v-for="n in [completedTasks,notCompletedTasks]" :key="n" class="black">
        <v-container fluid style="background-color:black">
          <v-row style="max-width:1100px;min-width:320px;width:100%;margin:0 auto" class="black">
            <v-col v-for="(item,index) in n" :key="item.id" cols="12" lg="4">
              <v-card
                class="mx-auto grey darken-4"
                max-width="344"
                flat
                dark
                style="border:1px solid green !important"
              >
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4">Task #{{index+1}}</div>
                    <v-list-item-title class="headline mb-1">{{item.name}}</v-list-item-title>
                    <v-list-item-subtitle>Min Estimate: {{item.minEstimate}} MIN</v-list-item-subtitle>
                    <v-list-item-subtitle>Max Estimate: {{item.maxEstimate}} MIN</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-avatar>
                    <v-btn
                      text
                      icon
                      color="green"
                      @click="complete(item.id)"
                      v-show="!item.completed"
                    >
                      <v-icon>check</v-icon>
                    </v-btn>
                    <v-menu bottom left offset-y open-on-hover>
                      <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark icon v-on="on">
                          <v-icon>more_vert</v-icon>
                        </v-btn>
                      </template>
                      <v-list dark class="grey darken-4">
                        <v-list-item @click="edit(item.id)">
                          <v-list-item-title>
                            Edit Task
                            <v-icon>edit</v-icon>
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="del(item.id)">
                          <v-list-item-title>
                            Delete Task
                            <v-icon>delete</v-icon>
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-avatar>
                </v-list-item>
                <v-card-actions>
                  <v-btn text>Elapsed Time: {{formatSeconds(item.currentTime)}}</v-btn>
                  <v-btn
                    elevation="0"
                    absolute
                    right
                    fab
                    small
                    dark
                    color="deep-purple"
                    @click="item.active=!item.active"
                    style="margin-top:-10px"
                    :disabled="item.completed ? true : false"
                  >
                    <v-icon>{{item.active? "pause":"play_arrow"}}</v-icon>
                  </v-btn>
                </v-card-actions>
                <v-progress-linear
                  color="green"
                  :value="formatProgress(item.currentTime,item.maxEstimate)"
                ></v-progress-linear>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </v-tabs>
    <v-container fluid>
      <v-row style="margin:0 auto">
        <v-btn fab fixed bottom right color="primary" @click="dialog=!dialog">
          <v-icon>add</v-icon>
        </v-btn>
        <v-overlay :opacity="0.9" v-model="dialog">
          <v-dialog
            v-model="dialog"
            width="800"
            dark
            hide-overlay
            transition="dialog-bottom-transition"
            @click="dialog=false"
          >
            <new-task style="max-width:800px;" @saved="saveNew"></new-task>
          </v-dialog>
        </v-overlay>
        <v-overlay :opacity="0.9" v-model="editDialog">
          <v-dialog
            v-model="editDialog"
            width="800"
            dark
            hide-overlay
            transition="dialog-bottom-transition"
            @click="dialog=false"
          >
            <edit-task style="max-width:800px;" @saved="update" :data-object="currentTask"></edit-task>
          </v-dialog>
        </v-overlay>
        <v-overlay :opacity="0.9" v-model="congratsDialog">
          <v-dialog v-model="congratsDialog" hide-overlay width="400">
            <v-card
              width="400"
              dark
              hide-overlay
              outline
              class="grey darken-4 text-center"
              style="border:1px solid green !important; padding:5px;"
            >
              <div class="green">
                <lottie
                  :options="defaultOptions"
                  :height="200"
                  :width="200"
                  v-on:animCreated="handleAnimation"
                />
              </div>
              <br />
              <v-card-text class="white--text">Congratulations on meeting your estimate!!!</v-card-text>
            </v-card>
          </v-dialog>
        </v-overlay>
        <v-overlay :opacity="0.9" v-model="failDialog">
        <v-dialog v-model="failDialog"  hide-overlay width="400">
          <v-card
            width="400px"
            dark
            outline
            class="grey darken-4 text-center"
            style="border:1px solid green !important; padding:5px"
          >
            <div class="green">
              <lottie
                :options="defaultOptions2"
                :height="200"
                :width="200"
                v-on:animCreated="handleAnimation"
              />
            </div>
            <br />
            <v-card-text class="white--text">
              You failed to meet your estimate.
              <br />Try breaking your task up into smaller tasks.
            </v-card-text>
          </v-card>
        </v-dialog>
        </v-overlay>
        <v-overlay :opacity="0.9" v-model="congrats2Dialog">
        <v-dialog v-model="congrats2Dialog"  hide-overlay width="400">
          <v-card
            width="400px"
            dark
            outline
            class="grey darken-4 text-center"
            style="border:1px solid green !important; padding:5px"
          >
            <div class="green">
              <lottie
                :options="defaultOptions3"
                :height="200"
                :width="200"
                v-on:animCreated="handleAnimation"
              />
            </div>
            <br />
            <v-card-text class="white--text">Another task completed! You're so productive!</v-card-text>
          </v-card>
        </v-dialog>
        </v-overlay>
      </v-row>
    </v-container>
  </div>
</template>
<script>
// @ is an alias to /src
import fakeData from "../data.js";
import NewTask from "./NewView.vue";
import EditTask from "./EditView.vue";
import Lottie from "vue-lottie";
import animationData from "../assets/claps.json";
import animationData2 from "../assets/crying.json";
import animationData3 from "../assets/typing.json";

export default {
  name: "home",
  components: { NewTask, EditTask, Lottie },
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
    complete(id) {
      var index = this.tasks.findIndex(x => x.id == id);
      this.$set(this.tasks.find(x => x.id === index), "completed", true);
      //check that the time taken for the task is less than the maximum Estimate

      if (this.rewardFactor < Math.random()) {
        if (
          this.tasks[index].currentTime <=
          this.tasks[index].maxEstimate * 60
        ) {
          if (0.5 < Math.random()) {
            this.congratsDialog = true;
          } else {
            this.congrats2Dialog = true;
          }
        } else {
          this.failDialog = true;
        }
      }
    },
    handleAnimation: function(anim) {
      this.anim = anim;
    },
    saveNew: function(data) {
      this.tasks.push(data);
      this.dialog = false;
    },
    update: function(id, data) {
      var index = this.tasks.findIndex(x => x.id == id);
      this.$set(this.tasks, index, data);
      this.editDialog = false;
    },
    edit: function(id) {
      this.currentTaskIndex = this.tasks.findIndex(x => x.id == id);
      this.currentTask = this.tasks[this.currentTaskIndex];
      this.editDialog = true;
    },
    del: function(id) {
      console.log("id is", id);
      var index = this.tasks.findIndex(x => x.id == id);
      console.log("index is", index);
      this.tasks.splice(index, 1);
    },
    formatSeconds: function(sec) {
      //format into M:SS
      return Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);
    },
    formatProgress: function(sec, maxEstimateMinutes) {
      //format progress bar (100 = 100%)
      return (sec / (maxEstimateMinutes * 60)) * 100;
    }
  },
  computed: {
    completedTasks: function() {
      return this.tasks.filter(x => x.completed == false);
    },
    notCompletedTasks: function() {
      return this.tasks.filter(x => x.completed == true);
    }
  },
  data() {
    return {
      rewardFactor: 0.45,
      dialog: false,
      editDialog: false,
      congratsDialog: false,
      congrats2Dialog: false,
      failDialog: false,
      tasks: fakeData.data,
      currentTask: {},
      currentTaskIndex: 0,

      defaultOptions: { animationData: animationData },
      animationSpeed: 1,

      defaultOptions2: { animationData: animationData2 },
      animationSpeed: 1,
      defaultOptions3: { animationData: animationData3 },
      animationSpeed: 1
    };
  }
};
</script>
<style>
.v-list-item__title {
  min-width: 80px;
  font-size: 12px;
  line-height: 1;
  padding: 0;
}

.v-list-item__title .v-icon {
  font-size: 14px;

  float: right;
}

.eliza {
  font-family: "Courier New";
  color: green;
  font-size: 20px;
}

.v-window__container {
  background-color: black !important;
}
</style>