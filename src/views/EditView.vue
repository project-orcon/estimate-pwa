<template>
  <div id="editTask">
    <v-card dark class="acard grey darken-4" outlined style="border:1px solid green !important">
      <v-card-title>Edit Task Estimate</v-card-title>
      <v-card-text>
        <v-form v-model="formValid" ref="form">
          <v-jsonschema-form
            v-if="schema"
            :schema="schema"
            :model="dataObject"
            :options="options"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn @click="save()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import VJsonschemaForm from "@koumoul/vuetify-jsonschema-form";

export default {
  name: "editTask",
  components: { VJsonschemaForm },
  props: {
    dataObject: Object
  },
  data() {
    return {
      cloneData: Object.assign({}, this.dataObject),
      schema: {
        type: "object",
        required: ["name", "minEstimate", "maxEstimate"],
        properties: {
          name: { type: "string", title: "Name" },

          minEstimate: {
            description:
              "Minimum estimate in minutes, must be greater than 0 and less than 300",
            type: "integer",
            title: "Minimum Estimate",
            minimum: 0,
            maximum: 300
          },
          maxEstimate: {
            description:
              "Maximum estimate in minutes, must be greater than 0 and less than 300",
            type: "integer",
            title: "Maximum Estimate",
            minimum: 0,
            maximum: 300
          },
          completed: {
            type: "boolean"
          },
          active: {
            type: "boolean",
            "x-display": "hidden"
          },
          currentTime: {
            type: "integer",
            "x-display": "hidden"
          }
        }
      },
      formValid: false,
      options: {
        debug: false,
        disableAll: false,
        autoFoldObjects: false
      }
    };
  },
  methods: {
    completed(index) {
      this.tasks[index].completed = true;
    },
    save() {
      this.$refs.form.validate();
      if (this.formValid == true) {
        console.log("DOBJET IS ",this.dataObject)
        this.$emit("saved", this.dataObject);
      }
    }
  }
};
</script>

<style>
.acard {
  width: 100%;
}
</style>