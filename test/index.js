import path from "path";
import pluginTester from 'babel-plugin-tester';
import chevrotainSerializePlugin from "../lib/index";
import chevrotain from "chevrotain";

pluginTester({
  plugin: chevrotainSerializePlugin,
  pluginName: "chevrotainSerializePlugin",
  fixtures: path.join(__dirname, "fixtures"),
});
