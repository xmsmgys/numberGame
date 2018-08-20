let fileutil = require("fileutil")();        // 文件操作管理
let emitter = require("emitter")();
let
    GameLogic = function (){
       this.resetData();
    },
    gameLogic = GameLogic.prototype,
    g_instance = null;


//--------------
gameLogic.CONST = {
    difficult:{
        1:"初出茅庐",
        2:"小试牛刀",
        3:"渐入佳境",
        4:"锋芒毕露",
        5:"头脑强者",
    }
};
gameLogic.resetData = function () {
    this.difficultData = {};
    this.mapdata = {};
    this.levelListState = 0;            //有没有打开关卡列表
    this.difficultState = null;         //关卡难度
    // this.diff
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