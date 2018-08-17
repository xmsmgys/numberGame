let emitter = require("emitter")();
cc.Class({
    extends: cc.Component,

    properties: {
        levels:cc.Node,
        content :cc.Node,
    },

    // use this for initialization
    onLoad() {
        this.curLogic = require("logic").getInstance();
        emitter.on("getdifficultData",this.resetdifficultData,this);        //保证能在数据层的json读取后赋值
        this.difficult = null;
        this.difficultData = this.curLogic.get("difficultData");
        this.levelsData = [];
        this.isshowLevels();
    },
    isshowLevels(){
        let state = this.curLogic.get("levelListState");
        let difficult = this.curLogic.get("difficultState");
        if(state ==1){
            this.levels.active = true;
            this.DrawView(difficult);
        }
    },
    resetdifficultData(){
        this.difficultData = this.curLogic.get("difficultData");
    },
    initLevels(event){
        this.curLogic.set("levelListState",1);
        this.curLogic.set("difficultState",parseInt(event.target.name));
        this.levelsData = [];
        this.levels.active = true;
        this.content.removeAllChildren();
        this.difficult =parseInt(event.target.name);
        this.DrawView(this.difficult);
    },
    DrawView(difficult){
        for(let i=0; i<this.difficultData.length; i++){
            if(this.difficultData[i].difficult == difficult){
                this.levelsData = this.difficultData[i].levelsData;
            }
        }
        for(let i=0; i<this.levelsData.length; i++){
            let node = cc.instantiate(this.node.getChildByName("levelItem"));
            node.on("touchstart", this.clickCallBack, this);
            node.parent = this.content;
            node.active = true;
            node.getChildByName("number").getComponent(cc.Label).string = i+1;
            node.name = `${i+1}`;
        }
    },
    editMap_cb(){
        cc.director.loadScene("editLevel");
    },
    back_cb(){
        this.levels.active = false;
        this.curLogic.set("levelListState",0);
    },
    clickCallBack(event){
        let mapdata;
        let level =parseInt(event.target.name);
        for(let i=0; i<this.levelsData.length; i++){
            if(this.levelsData[i].level == level){
                mapdata = this.levelsData[i]
            }
        }
        this.curLogic.set("mapdata",mapdata);
        cc.director.loadScene("game");
    },
});
