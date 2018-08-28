let emitter = require("emitter")();
cc.Class({
    extends: cc.Component,

    properties: {
        levels:cc.Node,
        content :cc.Node,
        node_diff:cc.Node,
        editlevel:cc.Node,
    },

    // use this for initialization
    onLoad() {
        this.curLogic = require("logic").getInstance();
        emitter.on("getdifficultData",this.resetdifficultData,this);        //保证能在数据层的json读取后赋值
        this.difficult = null;
        this.difficultData = this.curLogic.get("difficultData");
        this.levelsData = [];
        this.initDiffState();
        this.initEditLevel();
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
    initEditLevel(){
        let Development = this.curLogic.get("Development");
        this.editlevel.active = Development;
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
    initDiffState(){
        let localData = this.curLogic.readLocalData();
        cc.log("localData",localData);
        for(let i=0 ;i<this.node_diff.childrenCount; i++){
            console.log(i)
            if(!localData){
                if(i==0){
                   this.node_diff.children[i].getComponent(cc.Button).interactable = true;
                }else{
                    this.node_diff.children[i].getComponent(cc.Button).interactable = false;
                }
            }else{
                if(i<localData.length){
                    this.node_diff.children[i].getComponent(cc.Button).interactable = true;
                }else{
                    this.node_diff.children[i].getComponent(cc.Button).interactable = false;
                }
            }
        }
    },
    DrawView(difficult){
        let localData = this.curLogic.readLocalData();
        for(let i=0; i<this.difficultData.length; i++){
            if(this.difficultData[i].difficult == difficult){
                this.levelsData = this.difficultData[i].levelsData;
            }
        }
        for(let i=0; i<this.levelsData.length; i++){
            let node = cc.instantiate(this.node.getChildByName("levelItem"));
            node.parent = this.content;
            node.active = true;
            node.getChildByName("number").getComponent(cc.Label).string = `${this.levelsData[i].level}`;
            node.name = `${this.levelsData[i].level}`;
            if(!localData){
                if(i==0){
                    node.opacity = 255;
                    node.on("touchstart", this.clickCallBack, this);
                }else{
                    node.opacity = 125;
                }
            }else{
                if(!localData[difficult-1].levelData[i]){
                    if(i<=localData[difficult-1].levelData.length){
                        node.opacity = 255;
                        node.on("touchstart", this.clickCallBack, this);
                    }else{
                        node.opacity = 125;
                    }
                }else{
                    node.opacity = 255;
                    node.on("touchstart", this.clickCallBack, this);
                }
            }
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
