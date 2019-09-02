import Vue from "vue";
import Vuetify, { VSlideYTransition, VTextField, VTooltip,VIcon,VCheckbox } from "vuetify/lib";

Vue.use(Vuetify, {
  components: {
    VSlideYTransition,
    VTextField,
    VTooltip,
    VIcon,
    VCheckbox
  }
});

export default new Vuetify({
  icons: {
    iconfont: "mdi"
  }
});
