let fileutil = require("fileutil")();        // 文件操作管理
let emitter = require("emitter")();
let
    GameLogic = function (){
       this.resetData();
    },
    gameLogic = GameLogic.prototype,
    g_instance = null;


//--------------
gameLogic.resetData = function () {
    this.difficultData = {};
    this.mapdata = {};
    this.levelListState = 0;
    this.difficultState = null;
    this.readJson();
}
gameLogic.readJson = function(){
    fileutil.readJSON("mapdata").then(data=>{
        this.difficultData = data;
        emitter.emit("getdifficultData");
    })
},
gameLogic.get = function (key) {
    return this[key];
};
gameLogic.set = function (key, value) {
    this[key] = value;
};
module.exports.getInstance = function(){
    if(!g_instance){
        g_instance = new GameLogic();
        console.log("************************clear")
        // g_instance.regisrterEvent();
    }
    return g_instance;
};
module.exports.destroy = function(){
    if(g_instance){
       
       g_instance.destroy();
    }
};