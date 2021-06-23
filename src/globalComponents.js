import { Pagination as NPagination } from "./components";
import UserAddress from "./components/UserAddress.vue";
import {
  Button,
  Card,
  Checkbox,
  Dropdown as DropDown,
  FormGroupInput as FgInput,
  LoadingPanel,
  Slider,
  Tabs,
  TabPane,
  Table as NTable,
  TokenInput,
  TokenInputStandalone,
  VeeInput,
} from "./components";
import {
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSelect,
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
    app.component("checkbox", Checkbox);
    app.component("n-button", Button);
    app.component(ElDatePicker.name, ElDatePicker);
    app.component(ElInput.name, ElInput);
    app.component(ElInputNumber.name, ElInputNumber);
    app.component(ElOption.name, ElOption);
    app.component(ElSelect.name, ElSelect);
    app.component(ElTable.name, ElTable);
    app.component(ElTableColumn.name, ElTableColumn);
    app.component("n-pagination", NPagination);
    app.component("fg-input", FgInput);
    app.component("loading-panel", LoadingPanel);
    app.component("n-table", NTable);
    app.component("slider", Slider);
    app.component("tabs", Tabs);
    app.component("tab-pane", TabPane);
    app.component("token-input", TokenInput);
    app.component("token-input-standalone", TokenInputStandalone);
    app.component("user-address", UserAddress);
    app.component("vee-input", VeeInput);
    app.use(ElTooltip);
    app.use(ElPopover);
    app.use(ElLoading);
  },
};

export default GlobalComponents;
