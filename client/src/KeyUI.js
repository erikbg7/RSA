"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const RsaLib_1 = require("./RsaLib");
const KeyInfo_1 = require("./KeyInfo");
const bigInt = require("big-integer");
class KeyUI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modLength: 1024,
            keys: null,
            showInfo: false
        };
        this.newKey = this.newKey.bind(this);
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onClickShowInfo = this.onClickShowInfo.bind(this);
        this.loadKey = this.loadKey.bind(this);
        this.saveKey = this.saveKey.bind(this);
    }
    newKey(e) {
        e.preventDefault();
        let tempKey = RsaLib_1.generateKeys(this.state.modLength);
        this.setState({ keys: tempKey,
            usedLength: this.state.modLength });
        console.log(tempKey.publicKey.encrypt(bigInt('54321678555555555555555555555555555555555555555555555555555555555555555')));
    }
    saveKey(event) {
        window.localStorage.setItem('Key', JSON.stringify(this.state.keys));
        window.localStorage.setItem('usedLength', this.state.usedLength.toString());
        this.setState({});
    }
    loadKey(event) {
        this.setState({ keys: JSON.parse(window.localStorage.getItem('Key')) });
        this.setState({ usedLength: parseInt(window.localStorage.getItem('usedLength')) });
    }
    onChangeInput(event) {
        event.preventDefault();
        this.setState({ modLength: event.target.value });
    }
    onClickShowInfo(event) {
        //event.preventDefault();
        this.setState({ showInfo: !this.state.showInfo });
    }
    render() {
        return (React.createElement("div", null,
            this.state.showInfo &&
                React.createElement(KeyInfo_1.default, { keys: this.state.keys, bitLength: this.state.usedLength }),
            React.createElement("table", null,
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("td", null, window.localStorage.getItem('Key') != undefined &&
                            React.createElement("button", { type: "button", onClick: this.loadKey }, "Load RSA keys")),
                        React.createElement("td", null, this.state.keys != null &&
                            React.createElement("button", { type: "button", onClick: this.saveKey }, "Save Keys")),
                        React.createElement("td", null,
                            this.state.showInfo && (React.createElement("button", { type: "button", onClick: this.onClickShowInfo }, "Close")),
                            (!this.state.showInfo && this.state.keys != null) &&
                                (React.createElement("button", { type: "button", onClick: this.onClickShowInfo }, "Show")))))),
            React.createElement("form", { onSubmit: this.newKey },
                React.createElement("input", { type: "input", onChange: this.onChangeInput }),
                React.createElement("input", { type: "submit", value: "Create" }))));
    }
}
exports.KeyUI = KeyUI;
