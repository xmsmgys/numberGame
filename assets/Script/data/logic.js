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
    this.Development = false;            //开发模式
    this.difficultData = {};
    this.mapdata = {};
    this.levelListState = 0;            //有没有打开关卡列表
    this.difficultState = null;         //关卡难度
    this.readJson();
};
gameLogic.readLocalData = function(){
    let getLocalData = localStorage.getItem('localData'); // 读取字符串数据
    console.log("getLocalData",getLocalData);
    if(!getLocalData) return null;
    let jsonObj = JSON.parse(getLocalData);
    return jsonObj;
},
gameLogic.writeLocalData = function(data){
    let str_jsonData = JSON.stringify(data);
    localStorage.setItem('localData', str_jsonData); // 存储字符串数据到本地
},
gameLogic.readJson = function () {
    if (this.Development) {
        console.log("post")
        this.PSOT("http://192.168.1.117:8081/downfd", { ph: "mapdata.json" }, (data) => {
            cc.log("!!!!!!!",data.fd)
            this.difficultData = JSON.parse(data.fd);
            cc.log("!!!!!!!",this.difficultData)
            emitter.emit("getdifficultData");
        })
    } else {
        fileutil.readJSON("mapdata").then(data => {
            this.difficultData = data;
            cc.log("!!!!!!!",this.difficultData)
            emitter.emit("getdifficultData");
        })
    }
};
gameLogic.get = function (key) {
    return this[key];
};
gameLogic.set = function (key, value) {
    this[key] = value;
};
//******************* */
gameLogic.PSOT = function (route, msg, next) {
    let xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
            let respone = xhr.responseText;
            let pone = JSON.parse(respone);
            console.log("post ", pone)
            next(pone);
        }
    };
    // note: In Internet Explorer, the timeout property may be set only after calling the open()
    // method and before calling the send() method.
    xhr.timeout = 5000;
    xhr.onerror = (error) => {
        console.log("出错啦 http.POST ...")
    }
    console.log("http.POST 发送数据: ", route, msg)
    xhr.open("POST", route, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
    xhr.send(JSON.stringify(msg));
},
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