import UserAddress from "./components/UserAddress.vue";
import {
  Button,
  Card,
  Dropdown as DropDown,
  FormGroupInput as FgInput,
  LoadingPanel,
  Tabs,
  TabPane,
  TokenInput,
  VeeInput,
} from "./components";
import {
  ElInput,
  ElInputNumber,
  ElTooltip,
  ElPopover,
  ElLoading,
  ElTable,
  ElTableColumn,
} from "element-plus";

/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(app) {
    app.component("drop-down", DropDown);
    app.component("card", Card);
    app.component("n-button", Button);
    app.component(ElInput.name, ElInput);
    app.component(ElInputNumber.name, ElInputNumber);
    app.component(ElTable.name, ElTable);
    app.component(ElTableColumn.name, ElTableColumn);
    app.component("fg-input", FgInput);
    app.component("loading-panel", LoadingPanel);
    app.component("tabs", Tabs);
    app.component("tab-pane", TabPane);
    app.component("token-input", TokenInput);
    app.component("user-address", UserAddress);
    app.component("vee-input", VeeInput);
    app.use(ElTooltip);
    app.use(ElPopover);
    app.use(ElLoading);
  },
};

export default GlobalComponents;
