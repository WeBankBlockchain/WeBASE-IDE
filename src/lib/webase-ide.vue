<template>
    <div class="content-wrapper">
        <div class="contract-list-wrapper">
            <ul>
                <li v-for="item in data" @click="select(item)" class="contract-item">
                    <span>{{item.contractName + '.sol'}}</span>
                </li>
            </ul>
        </div>

        <div class="contract-wrapper">
            <div>
                <button @click="compile">编译</button>
            </div>
            <div class="contract-content">
                <div ref="ace" :style="{'height': height + 'px'}">

                </div>
            </div>
            <div class="contract-console-wrapper" :style="{height:infoHeight + 'px'}">
                <span class="console-message" v-html="compileinfo"></span>
                <div class="console-message" style="color: #f00" v-show="errorInfo">
                    {{errorInfo}}
                </div>
                <span class="console-message" v-show="errorInfo" v-for="(item, index) in errorMessage">{{index+1}}、{{item}}</span>

                <span class="console-message" style="color: #68E600;" v-show="abiFileShow">{{successInfo}}</span>
                <div class="contract-info-list" v-show="contractAddress">
                    <span class="contract-info-list-title" style="color: #0B8AEE">contractAddress
                        <i class="wbs-icon-copy font-12 copy-public-key" @click="copyKey(contractAddress)" title="复制"></i>
                    </span>
                    <span>{{contractAddress}}</span>
                </div>
                <div class="contract-info-list" v-show="contractAbi">
                    <span class="contract-info-list-title" style="color: #0B8AEE">contractName
                        <i class="wbs-icon-copy font-12 copy-public-key" @click="copyKey(contractName)" title="复制"></i> </span>
                    <span class="showText">{{contractName}}</span>
                </div>
                <div class="contract-info-list" v-show="contractAbi">
                    <span class="contract-info-list-title" style="color: #0B8AEE">abi
                        <i class="wbs-icon-copy font-12 copy-public-key" @click="copyKey(contractAbi)" title="复制"></i>
                    </span>
                    <span class="showText" ref="showAbiText">
                        {{contractAbi}}
                    </span>
                    <i :class="[ showAbi ? 'el-icon-arrow-down': 'el-icon-arrow-up','font-13','cursor-pointer','visibility-wrapper'] " v-if="complieAbiTextHeight" @click="showAbiText"></i>
                </div>
                <div class="contract-info-list" style="border-bottom: 1px solid #e8e8e8" v-show="contractAbi">
                    <span class="contract-info-list-title" style="color: #0B8AEE">bytecodeBin
                        <i class="wbs-icon-copy font-12 copy-public-key" @click="copyKey(bytecodeBin)" title="复制"></i>
                    </span>
                    <span class="showText" ref="showBinText">
                        {{bytecodeBin}}
                    </span>
                    <i :class="[ showBin ? 'el-icon-arrow-down': 'el-icon-arrow-up','font-13','cursor-pointer','visibility-wrapper'] " v-if="complieBinTextHeight" @click="showBinText"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ace from "ace-builds";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/ext-language_tools";
require("ace-mode-solidity/build/remix-ide/mode-solidity");
import { Base64 } from 'js-base64';
import constant from "./util/constant.js";
export default {
    name: 'webase-ide',
    props: {
        mode: {
            type: Number,
            default: 0
        },
        type: {
            type: Number,
            default: 1
        },
        height: {
            type: Number,
            default: 500
        },
        data: {
            type: Array,
            default: function () {
                return [
                    {
                        contractName: 'demo',
                        contractSource: 'SGVsbG9Xb3JsZA==',
                    }
                ]
            }
        }
    },
    data() {
        return {
            themePath: "ace/theme/chrome",
            modePath: "ace/mode/solidity",
            aceEditor: {},
            contractList: [],
            contractContent: '',
            contractName: '',
            compileinfo: '',
            errorMessage: '',
            errorInfo: '',
            successInfo: '',
            contractAbi: '',
            contractAddress: '',
            contractBin: '',
            bytecodeBin: '',
            abiFileShow: false,
            complieAbiTextHeight: false,
            complieBinTextHeight: false,
            successHide: true,
            infoHeight: '',
        }
    },
    beforeMount() {
        var head = document.head;
        var script = document.createElement("script");
        switch (this.type) {
            case 1:
                script.src = "./static/js/soljson-v0.4.25-gm.js";
                break;
        
            case 2:
                script.src = "./static/js/soljson-v0.4.25+commit.59dbf8f1.js";
                break;
        }
        script.setAttribute('id', 'soljson');
        if (!document.getElementById('soljson')) {
            head.append(script)
        }
    },
    mounted() {
        this.initEditor();
    },
    methods: {
        initEditor() {
            let _this = this;
            this.aceEditor = ace.edit(this.$refs.ace, {
                fontSize: 14,
                fontFamily: "Consolas,Monaco,monospace",
                theme: this.themePath,
                mode: this.modePath,
                tabSize: 4,
                useSoftTabs: true
            });
            this.aceEditor.setOptions({
                enableSnippets: true,
                enableLiveAutocompletion: true,
                enableBasicAutocompletion: true,
                autoScrollEditorIntoView: true,
                copyWithEmptySelection: true
            });
            this.aceEditor.commands.addCommand({
                name: 'myCommand',
                bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
                exec: function (editor) {
                    _this.save()
                },
            });
            this.aceEditor.getSession().on("change", this.changeAce);
            let editor = this.aceEditor.alignCursors();
            this.aceEditor.getSession().setUseWrapMode(true);
            this.aceEditor.resize();
            if (this.data.length > 0) {
                this.aceEditor.setValue(Base64.decode(this.data[0]['contractSource']))
                this.contractName = this.data[0]['contractName']
                this.contractAddress = this.data[0]['contractAddress']
            }

        },
        changeAce() {
            this.contractContent = this.aceEditor.getSession().getValue();
        },
        select(item) {
            this.aceEditor.setValue(Base64.decode(item.contractSource))
            this.contractName = item.contractName;
            this.complieAbiTextHeight = false;
            this.complieBinTextHeight = false;
            this.refreshMessage();
        },

        createContract() {

        },
        save() {
            this.contractContent = this.aceEditor.getSession().getValue();
        },
        refreshMessage() {
            this.abiFileShow = false;
            this.errorInfo = "";
            this.compileinfo = "";
            this.contractAbi = "";
            this.contractAddress = "";
            this.errorMessage = "";
        },
        compile() {
            let wrapper = require("solc/wrapper");
            let solc = wrapper(window.Module);
            this.refreshMessage();
            for (let i = 0; i < constant.COMPILE_INFO.length; i++) {
                this.compileinfo = this.compileinfo + constant.COMPILE_INFO[i];
            }
            let content = "";
            let output;
            let input = {
                language: "Solidity",
                settings: {
                    outputSelection: {
                        "*": {
                            "*": ["*"]
                        }
                    }
                }
            };
            input.sources = {};
            input.sources[this.contractName + ".sol"] = {};
            let libs = [];
            input.sources[this.contractName + ".sol"] = {
                content: this.contractContent
            };
            try {
                output = JSON.parse(solc.compileStandard(JSON.stringify(input), this.findImports));
            } catch (error) {
                this.errorInfo = '合约编译失败';
                this.errorMessage = error;
                this.compileShow = true;
            }
            if (output && JSON.stringify(output.contracts) != "{}") {
                if (output.contracts[this.contractName + ".sol"]) {
                    this.changeOutput(
                        output.contracts[this.contractName + ".sol"]
                    );
                }
            } else {
                this.errorMessage = output.errors;
                this.errorInfo = '合约编译失败!';
            }
        },
        changeOutput: function (obj) {
            if (JSON.stringify(obj) !== "{}") {
                if (obj.hasOwnProperty(this.contractName)) {
                    let compiledMap = obj[this.contractName]
                    this.abiFileShow = true;
                    this.successInfo = '编译成功！';
                    this.contractAbi = compiledMap.abi;
                    this.contractAbi = JSON.stringify(this.contractAbi);
                    this.contractBin = compiledMap.evm.deployedBytecode.object;
                    this.bytecodeBin = compiledMap.evm.bytecode.object;
                    this.$emit('complieSuccess', {
                        contractName: this.contractName,
                        contractSource: this.contractContent,
                        contractAbi: this.contractAbi,
                        contractBin: this.contractBin,
                        contractAddress: this.contractAddress,

                    })
                } else {
                    this.errorInfo = '编译失败！';
                }
            } else {
                this.errorInfo = '编译失败！';
            }
        },
        findImports(path) {
            let arry = path.split("/");
            let newpath = arry[arry.length - 1];
            let num = 0;
            if (arry.length > 1) {
                let newPath = arry[0]
                let oldPath = arry[arry.length - 1]
                let importArry = []
                this.data.forEach(value => {
                    if (value.contractPath == newPath) {
                        importArry.push(value)
                    }
                })
                if (importArry.length) {
                    for (let i = 0; i < importArry.length; i++) {
                        if (oldPath == importArry[i].contractName + ".sol") {
                            return {
                                contents: Base64.decode(importArry[i].contractSource)
                            }
                        }
                    }
                } else {
                    return { error: "File not found" };
                }
            } else {
                let newpath = arry[arry.length - 1];
                let newArry = []
                this.data.forEach(value => {
                    if (value.contractPath == this.data.contractPath) {
                        newArry.push(value)
                    }
                })
                if (newArry.length > 1) {
                    for (let i = 0; i < newArry.length; i++) {
                        if (newpath == newArry[i].contractName + ".sol") {
                            return {
                                contents: Base64.decode(
                                    newArry[i].contractSource
                                )
                            };
                        }
                    }
                    for (let i = 0; i < this.data.length; i++) {
                        if (newpath == this.data[i].contractName + ".sol") {
                            return {
                                contents: Base64.decode(this.data[i].contractSource)
                            };
                        } else {
                            num++;
                        }
                    }
                    if (num) {
                        return { error: "File not found" };
                    }
                } else {
                    for (let i = 0; i < this.data.length; i++) {
                        if (newpath == this.data[i].contractName + ".sol") {
                            return {
                                contents: Base64.decode(this.data[i].contractSource)
                            };
                        }
                    }
                }
            }
        },
        copyKey(param) {

        }
    }
}
</script>
<style scoped>
ul,li{ padding:0;margin:0;list-style:none}
.content-wrapper {
    display: flex;
    display: -moz-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
}
.contract-wrapper {
    width: 100%;
}
.contract-content {
    position: relative;
    padding-top: 20px;
    text-align: left;
    box-sizing: border-box;
    overflow: auto;
}
.contract-item {
    cursor: pointer;
    display: list-item;
    padding: 0 10px 0 10px;
}
.contract-item > span {
    display: block;
    height: 40px;
    color: #444;
    line-height: 40px;
    font-size: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 400;
}
.contract-item > span:hover {
    color: #409eff;
}
.console-message {
    text-align: left;
    display: block;
    padding-left: 20px;
    padding-right: 20px;
}
.contract-console-wrapper {
    border: 1px solid #e7ebf0;
    box-sizing: border-box;
    height: 100%;
    max-height: 250px;
    overflow: auto;
}
.contract-info-list {
    padding: 5px 20px;
    margin: 0 auto;
    border: 1px solid #e8e8e8;
    border-bottom: none;
    word-break: break-all;
    text-align: left;
}
.contract-info-list-title {
    width: 120px;
    display: inline-block;
}
</style>