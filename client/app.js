"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const KeyUI_1 = require("./src/KeyUI");
ReactDOM.render(React.createElement("div", null,
    React.createElement("h1", null, "Hello, Welcome to the first page"),
    React.createElement(KeyUI_1.KeyUI, null)), document.getElementById("root"));
