<template>
  <div id="home">
    <div class="white--text black"></div>
    <v-tabs color="primary accent-4" background-color="black" dark right style="min-height:100vh">
      <v-tab>To Do</v-tab>
      <v-tab>Complete</v-tab>
      <v-tab-item
        v-for="(n,index) in [completedTasks,notCompletedTasks]"
        :key="index"
        class="black"
      >
        <v-container fluid style="background-color:black">
          <v-row style="max-width:1100px;min-width:320px;width:100%;margin:0 auto" class="black">
            <v-col v-if="n.length == 0 " class="green--text text-center">
              <lottie
                :options="defaultOptions4"
                :height="200"
                :width="200"
                v-on:animCreated="handleAnimation"
              />

              <p v-if="index==0">
                No current estimates.
                <br />Click the add button on the bottom right to create a new estimate.
              </p>
              <p v-else>
                No completed estimates.
                <br />Click the tick button on an estimate card to mark as complete.
              </p>
            </v-col>

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
                    @click="playOrPause(item.id)"
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
            <edit-task style="max-width:800px;" @saved="update" :data-object="currentEstimate"></edit-task>
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
          <v-dialog v-model="failDialog" hide-overlay width="400">
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
          <v-dialog v-model="congrats2Dialog" hide-overlay width="400">
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
import animationChecklist from "../assets/checklist.json";
import { db, estimatesCollection } from "../firebase";
import { openDB } from "idb";

export default {
  name: "home",
  components: { NewTask, EditTask, Lottie },
  mounted() {
    //bind firestore

    var firebaseConnectedPromise = this.$bind(
      "estimates",
      db.collection("estimates")
    );
    //.then(() => this.loaded = true);

    this.fingerprinting();
    this.lastTimeRecorded = Date.now();
    window.setInterval(() => {
      //every 200ms check how much time has passed since last time and add to seconds timers
      var TimeDiff = (Date.now() - this.lastTimeRecorded) / 1000;
      if (TimeDiff > 1) {
        this.lastTimeRecorded = Date.now();
        this.estimates.forEach(function(x) {
          if (x.active) {
            var time = x.currentTime + Math.floor(TimeDiff);
            estimatesCollection.doc(x.id).update({ currentTime: time });
          }
        });
      }
    }, 200);

    //set up indexDBDatabase - try adding an estimate object to the database.
    var indexDbPromise = this.indexDbPromise();
    var vueInstance = this;

    if (navigator.onLine) {
      console.log("app online");
      Promise.all([firebaseConnectedPromise, indexDbPromise]).then(function(
        responses
      ) {
        console.log("Firebase has connected and indexedDB has opened database");
        console.log(estimatesCollection.doc().id);
        var indexdb = responses[1];

        //get all the new estimates that have been created.

        var transaction = indexdb.transaction("estimates", "readwrite");
        var estimateStore = transaction.objectStore("estimates");

        //retrieve changes that have been made offline and stored in local storage.
        //arrays of ids
        var addedOffline = JSON.parse(localStorage.getItem("addedOffline"));
        var editedOffline = JSON.parse(localStorage.getItem("editedOffline"));
        var deletedOffline = JSON.parse(localStorage.getItem("deletedOffline"));

        estimateStore.getAll().then(estimates => {
          estimates.forEach(estimate => {
            if (addedOffline.includes(estimate.id)) {
              console.log("ESTIMATE TO ADD IS", estimate);
              var newId = vueInstance.saveNewOnline(estimate);
              //adding a new estimate will change the id of the estimate (generated by firebase)
              //so the editedOffline and deletedOffline arrays may need to be updated
              editedOffline=editedOffline.map(x => x == estimate.id ? newId : x);
              deletedOffline=deletedOffline.map(x => x == estimate.id ? newId : x);
            }
          });
        });

        console.log("edited offline", editedOffline);
        //update firebase with all the edited offline estimates.
        estimateStore.getAll().then(estimates => {
          estimates.forEach(estimate => {
            if (editedOffline.includes(estimate.id)) {
              console.log("ESTIMATE TO EDIT IS", estimate);
              vueInstance.updateOnline(estimate);
            }
          });
        });

        //clear local storage after updating
        localStorage.removeItem("addedOffline");
        localStorage.removeItem("editedOffline");

        //update firebase with all the deleted offline estimates.
        estimateStore.getAll().then(estimates => {
          estimates.forEach(estimate => {
            if (deletedOffline.includes(estimate.id)) {
              console.log("ESTIMATE TO DELETE IS", estimate);
            }
          });
        });

        //clear the IDB estimate store, before storing current firebase data.
        estimateStore.clear();
        vueInstance.estimates.forEach(estimate => {
          console.log("estimate added is", estimate);
          var db_op_req = estimateStore.add(estimate); // IDBRequest
        });
      });
    } else {
      console.log("app offline");
      indexDbPromise.then(function(response) {
        var indexdb = response;
        var transaction = indexdb.transaction("estimates", "readwrite");
        var estimateStore = transaction.objectStore("estimates");
        indexdb.getAll("estimates").then(x => {
          vueInstance.estimates = x;
        });
      });
    }
  },
  //had to remove this as needed a way to fetch promise that was returned when firebase connected
  //firestore() {
  // return {
  //   estimates: estimatesCollection.orderBy("createdAt", "desc")
  // };
  //},
  methods: {
    indexDbPromise: function() {
      return openDB("estimatesDb", 1, {
        upgrade(db, oldVersion, newVersion, transaction) {
          db.createObjectStore("estimates", { keyPath: "id" });
        }
      });
    },
    saveIndexedDB(estimate) {
      var indexDbPromise = this.indexDbPromise();

      indexDbPromise.then(function(response) {
        var indexdb = response;
        var transaction = indexdb.transaction("estimates", "readwrite");
        var estimateStore = transaction.objectStore("estimates");
        estimateStore.put(estimate);
      });
    },

    playOrPause(id) {
      estimatesCollection
        .doc(id)
        .get()
        .then(snapshot => {
          const data = snapshot.data();
          if (data.active) {
            estimatesCollection.doc(id).update({ active: false });
          } else {
            estimatesCollection.doc(id).update({ active: true });
          }
        });
    },
    setFingerprint(components) {
      console.log("hash is", components); // an array of components: {key: ..., value: ...}
      var values = components.map(function(component) {
        return component.value;
      });
      this.fingerprint = Fingerprint2.x64hash128(values.join(""), 31);
      //this.estimates = this.estimates.where("user", "==", this.fingerprint);
    },
    fingerprinting() {
      const Fingerprint2 = window.Fingerprint2;
      var vueInstance = this;
      if (window.requestIdleCallback) {
        requestIdleCallback(() => {
          Fingerprint2.get(function(components) {
            vueInstance.setFingerprint(components);
          });
        });
      } else {
        setTimeout(function() {
          Fingerprint2.get(function(components) {
            vueInstance.setFingerprint(components);
          });
        }, 500);
      }
    },
    complete(id) {
      estimatesCollection.doc(id).update({ completed: true, active: false });
      //check that the time taken for the task is less than the maximum Estimate
      estimatesCollection
        .doc(id)
        .get()
        .then(snapshot => {
          const data = snapshot.data();
          if (this.rewardFactor < Math.random()) {
            if (data.currentTime <= data.maxEstimate * 60) {
              if (0.5 < Math.random()) {
                this.congratsDialog = true;
              } else {
                this.congrats2Dialog = true;
              }
            } else {
              this.failDialog = true;
            }
          }
        });
    },
    handleAnimation: function(anim) {
      this.anim = anim;
    },
    saveNew: function(data) {
      if (navigator.onLine) {
        this.saveNewOnline(data);
      } else {
        this.saveNewOffline(data);
      }
    },
    saveNewOnline: function(data) {
      var generatedId = estimatesCollection.doc().id;
      var estimate = {
        id: generatedId,
        name: data.name,
        minEstimate: data.minEstimate,
        maxEstimate: data.maxEstimate,
        completed: false,
        active: false,
        currentTime: 0,
        createdAt: new Date(),
        user: this.fingerprint
      };

      //update indexDB
      estimatesCollection.doc(generatedId).set(estimate);
      console.log("created new firebase record id: ", generatedId);
      this.saveIndexedDB(estimate);
      this.dialog = false;

      return generatedId;
    },
    saveNewOffline: function(data) {
      var timestamp = new Date().getUTCMilliseconds();
      var newEstimate = {
        id: timestamp,
        name: data.name,
        minEstimate: data.minEstimate,
        maxEstimate: data.maxEstimate,
        completed: false,
        active: false,
        currentTime: 0,
        createdAt: new Date(),
        user: this.fingerprint
      };
      this.saveIndexedDB(newEstimate);
      this.estimates.push(newEstimate);
      this.addedOffline.push(newEstimate.id);
      localStorage.setItem("addedOffline", JSON.stringify(this.addedOffline));
      this.dialog = false;
    },
    update: function(data) {
      if (navigator.onLine) {
        this.updateOnline(data);
      } else {
        this.updateOffline(data);
      }
    },
    updateOnline: function(data) {
      console.log("attempting to update id of ", data.id);
      estimatesCollection.doc(data.id).update(data);
      this.saveIndexedDB(data);
      this.editDialog = false;
    },
    updateOffline: function(data) {
      this.editedOffline.push(data.id);
      localStorage.setItem("editedOffline", JSON.stringify(this.editedOffline));
      console.log("new data added to editedOffline", this.editedOffline);
      this.saveIndexedDB(data);
      var index = this.estimates.findIndex(x => x.id == data.id);
      this.estimates[index] = data;
      this.editDialog = false;
    },
    edit: function(id) {
      if (navigator.onLine) {
        this.editOnline(id);
      } else {
        this.editOffline(id);
      }
    },
    editOnline: function(id) {
      this.currentEstimateId = id;
      estimatesCollection
        .doc(id)
        .get()
        .then(snapshot => {
          this.currentEstimate = snapshot.data();
          this.editDialog = true;
        });
      console.log("EDIT ID IS", id);
    },
    editOffline: function(id) {
      this.currentEstimateId = id;
      this.currentEstimate = this.estimates.find(x => x.id == id);
      this.editDialog = true;
    },
    del: function(id) {
      estimatesCollection.doc(id).delete();
    },
    formatSeconds: function(sec) {
      //format into M:SS
      if (sec < 3600) {
        return Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);
      } else {
        var hours = Math.floor(sec / 3600);
        var minutes = ("0" + Math.floor((sec - hours * 3600) / 60)).slice(-2);
        var seconds = ("0" + (sec % 60)).slice(-2);
        return hours + ":" + minutes + ":" + seconds;
      }
    },
    formatProgress: function(sec, maxEstimateMinutes) {
      //format progress bar (100 = 100%)
      return (sec / (maxEstimateMinutes * 60)) * 100;
    }
  },
  computed: {
    completedTasks: function() {
      return this.estimates.filter(x => x.completed == false);
    },
    notCompletedTasks: function() {
      return this.estimates.filter(x => x.completed == true);
    }
  },
  data() {
    return {
      addedOffline: [],
      editedOffline: [],
      deletedOffline: [],
      transaction: {},
      estimateStore: {},
      loaded: false,
      estimates: [],
      fingerprint: "",
      lastTimeRecorded: 0,
      rewardFactor: 0.45,
      dialog: false,
      editDialog: false,
      congratsDialog: false,
      congrats2Dialog: false,
      failDialog: false,
      tasks: fakeData.data,
      currentEstimate: {},
      currentEstimateId: 0,

      defaultOptions: { animationData: animationData },
      animationSpeed: 1,

      defaultOptions2: { animationData: animationData2 },
      animationSpeed: 1,
      defaultOptions3: { animationData: animationData3 },
      animationSpeed: 1,

      defaultOptions4: { animationData: animationChecklist },
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