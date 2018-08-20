const PROPSIZE = 100;   //渲染道具的尺寸
cc.Class({
    extends: cc.Component,

    properties: {
        editbox_mapSize: cc.EditBox,
        editbox_level:cc.EditBox,
        editbox_value:cc.EditBox,
        editbox_simpol:cc.EditBox,
        editbox_difficult:cc.EditBox,
        
        propGroup:cc.Node,
        mapBg:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.curLogic = require("logic").getInstance();
        this.level =null;
        this.difficult = null;
        this.mapSize = null;
        this.value = null;
        this.simpol = null;
        this.prop = null;
        this.bindPrpoEvent();
        this.pos_dict={};
        this.itemData = [];         //道具的数据
        this.levelsData = [];       //难度1下的所有关卡
        this.mapdata = {};          //关卡N的数据
        this.difficultData = [];    //总的数据
        this.difficultItem = {};
        
        this.initMap();
    },
    start () {

    },
    //设置地图大小
    MapSize_cb(node){
        let size = node.string;
        let arr = size.split(",");
        this.mapdata.width = parseInt(arr[0])*PROPSIZE;
        this.mapdata.height = parseInt(arr[1])*PROPSIZE;
        this.setMapSize(this.mapdata.width,this.mapdata.height)
    },
    initMap(){
        this.difficultData = this.curLogic.get("difficultData");
        if(JSON.stringify( this.difficultData) == "{}")return;
        this.difficult = this.difficultData[0].difficult;
        this.levelsData = this.difficultData[0].levelsData;
        this.mapdata = this.levelsData[0];
        this.level = this.mapdata.level;
        this.itemData = this.mapdata.itemData;
        this.setMapSize(this.mapdata.width,this.mapdata.height);
        this.drawItem();
        this.inteditBoxString();
    },
    inteditBoxString(){
        this.editbox_level.string = this.mapdata.level;
        this.editbox_mapSize.string = `${this.mapdata.width/PROPSIZE},${this.mapdata.height/PROPSIZE}`;
        this.editbox_difficult.string = this.difficult;
    },
    setMapSize(width,height){
        this.mapBg.width = width;
        this.mapBg.height = height;
    },
    setDifficult(node){
        this.difficultItem = {};
        this.pos_dict = {};
        this.difficult = parseInt(node.string);
        for(let i=0; i<this.difficultData.length; i++){
            if(this.difficultData[i].difficult == this.difficult){
                for(let j=0; j<this.difficultData[i].levelsData.length; j++){
                    if(this.difficultData[i].levelsData[j].level == this.level){
                        this.levelsData = this.difficultData[i].levelsData;
                        this.mapdata = this.levelsData[j];
                        this.itemData = this.levelsData[j].itemData;
                        this.difficultItem = this.difficultData[i];
                        this.drawItem();
                        return;
                    }
                }
            }
        }
        this.difficultItem.difficult = this.difficult;
        this.difficultItem.levelsData = [];
        this.levelsData = this.difficultItem.levelsData;
        this.difficultData.push(this.difficultItem);
        this.mapBg.removeAllChildren();
    },
    //选择关卡
    setLevel(node){
        this.propID = 0;
        this.itemData = [];
        this.mapdata = {};
        this.pos_dict = {};
        this.level = parseInt(node.string);
        for(let i=0; i<this.levelsData.length; i++){       //如果有这个关卡数据，则根据关卡数据画地图
            if(this.levelsData[i].level ==  this.level){
                this.itemData = this.levelsData[i].itemData;
                this.mapdata = this.levelsData[i];
                this.drawItem();
                return;
            }
        }
        this.mapdata.level = this.level;            //如果没有，则
        this.mapdata.itemData = this.itemData;
        this.mapdata.height = this.mapBg.height;
        this.mapdata.width = this.mapBg.width;
        let push = false;
        for (let key in this.levelsData) {
            if (this.levelsData[key].level > this.level) {
                this.levelsData.splice(key, 0, this.mapdata);
                push = true;
            }
        }
        if (!push) {
            this.levelsData.push(this.mapdata);
        }
        this.drawItem();
    }, 
    //绘制关卡
    drawItem() {
        this.mapBg.removeAllChildren();
        this.setMapSize(this.mapdata.width, this.mapdata.height);
        this.propID = this.itemData.length;
        for (let i = 0; i < this.itemData.length; i++) {
            this.prop = cc.instantiate(this.propGroup.children[this.itemData[i].obj.type]);
            this.prop.name = `${this.itemData[i].id}_${this.itemData[i].obj.type}`;
            this.prop.parent = this.mapBg;
            this.prop.width = PROPSIZE;
            this.prop.height = PROPSIZE;
            this.prop.x = this.itemData[i].obj.x;
            this.prop.y = this.itemData[i].obj.y;
            this.pos_dict[`${this.prop.x},${this.prop.y}`] = this.prop.position;
            this.prop.on("touchstart", this.clickProp, this);
            this.updateViewValue();
        }
    },
    setvalue(node){
        let arr = this.prop.name.split("_");
        let type = arr[1];
        let id =arr[0];
        if(type =="0"||type =="1"||type =="2"
            ||type =="3"||type =="4"||type =="5"){
            for(let i=0;i<this.itemData.length; i++){
                if(this.itemData[i].id == parseInt(id)){
                    this.itemData[i].obj.value = parseInt(node.string);
                }
            }
        }
        this.updateViewValue();
    },

    setsimpol(node) {
        let arr = this.prop.name.split("_");
        let id = arr[0];
        for(let i=0;i<this.itemData.length; i++){
            if(this.itemData[i].id == parseInt(id)){
                this.itemData[i].obj.simpol =parseInt(node.string);
            }
        }
        this.updateViewValue();
    },

    updateViewValue(){
        let arr = this.prop.name.split("_");
        let id = arr[0];
        let value,type,simpol;
        let prop = this.prop.getChildByName("value").getComponent(cc.Label);
        for(let i=0;i<this.itemData.length; i++){
            if(this.itemData[i].id == parseInt(id)){
                value = this.itemData[i].obj.value;
                type = this.itemData[i].obj.type;
                simpol = this.itemData[i].obj.simpol;
            }
        }
        switch (type) {
            case 0:
            case 1: prop.string = value.toString(); break;
            case 2:
            case 4:prop.string = this.getSimopl(simpol) + value.toString(); break;
            case 3:
            case 5:prop.string = value.toString() + this.getSimopl(simpol); break;
            case 8:prop.string = simpol == 1 ? "→" : "←";break;
            default:
                break;
        }
    },

    getSimopl(simpol){
        let string;
        switch(simpol){
            case 1:string = "+";break;
            case 2:string = "-";break;
            case 3:string = "x";break;
            case 4:string = "/";break;
            case 5:string = ">";break;
            case 6:string = "<";break;
            case 7:string = "=";break;
            case 8:string = "≠";break;
            default: string ="";break;
        }
        return string;
    },
    bindPrpoEvent(){
        for(let i=0; i<this.propGroup.childrenCount; i++){
            let node = this.propGroup.children[i];
            node.on("touchstart", this.clickCallBack, this);
            node.on("touchmove", this.moveCallBack, this);
            node.on("touchend", this.moveEndCallBack, this);
            node.on("touchcancel", this.moveCancelCB, this);
        }
    },

    clickCallBack(event){
        this.prop =  cc.instantiate(event.target);
        this.prop.on("touchstart", this.clickProp, this);
        this.prop.parent = this.mapBg;
        this.prop.width = PROPSIZE;
        this.prop.height = PROPSIZE;
        cc.log("eventevent",event.target,this.prop);
    },

    moveCallBack(event){ 
        let newvec2 = this.mapBg.convertToNodeSpaceAR(event.touch.getLocation())
        this.prop.setPosition(newvec2);
        cc.log("eventevent",this.prop.position);
    },

    moveEndCallBack(event){
        this.setPropPosition(this.prop,this.prop.position);
    },

    //itemlist =[{id:1, obj:null}]
    moveCancelCB(event) {
        this.setPropPosition(this.prop, this.prop.position);
        let itemData = {};
        itemData.id = this.propID;
        itemData.obj = {},
        itemData.obj.x = this.prop.x;
        itemData.obj.y = this.prop.y;
        itemData.obj.type = parseInt(this.prop.name);
        itemData.obj.value = parseInt(this.editbox_value.string);
        if(itemData.obj.type == 1){
            itemData.obj.simpol = 2;
        }else{
            itemData.obj.simpol = parseInt(this.editbox_simpol.string);
        }
        this.prop.name = `${this.propID}_${parseInt(this.prop.name)}`;
        this.itemData.push(itemData);
        this.updateViewValue();
        this.propID++;
    },
    clickProp(event){
        this.prop = event.target;
    },
    setPropPosition(node,pos){
        if(pos.x<0||pos.y<0){               //出界
            node.destroy();
            return;
        }
        let bool = this.checkSameProp(node);    //检测唯一道具是否唯一
        if(!bool){
            node.destroy();
            return;
        } 
        let y = parseInt(pos.y / PROPSIZE)
        let x = parseInt(pos.x / PROPSIZE);
        let OffsetY = pos.y % PROPSIZE;
        y = OffsetY > PROPSIZE/2 ? y + 1 : y;
        let OffsetX = pos.x % PROPSIZE;
        x = OffsetX > PROPSIZE/2 ? x + 1 : x;
        let pos1 = cc.p(x*PROPSIZE,y*PROPSIZE);
        let str = `${x*PROPSIZE},${y*PROPSIZE}`
        node.setPosition(pos1);
        if(this.pos_dict[str]){            //位置是否唯一
            node.destroy();
        }else{
            this.pos_dict[str] = pos1;
        }
    },

    checkSameProp(node){
        let mycount = 0 ;
        let starcount = 0 ;
        if(node.name == "0"){
            for(let i=0; i<this.mapBg.childrenCount; i++){
                let arr = this.mapBg.children[i].name.split("_");
                let type = parseInt(arr[1]);
                if (type == 0) {
                    mycount++;
                    if (mycount > 0) {
                        return false;
                    }
                }
            }
        }else if(node.name == "7"){
            for(let i=0; i<this.mapBg.childrenCount; i++){
                let arr = this.mapBg.children[i].name.split("_");
                let type = parseInt(arr[1]);
                if (type == 7) {
                    starcount++;
                    if (starcount > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    },

    save_cb(){

    },
    delete_cb(){
        let arr = this.prop.name.split("_");
        let id = arr[0];
        for(let i=0; i<this.itemData.length; i++){
            if(this.itemData[i].id == id){
                let str = `${this.itemData[i].obj.x},${this.itemData[i].obj.y}`
                this.itemData.splice(i,1);
                delete this.pos_dict[str];
            }
        }
        this.prop.destroy();
        cc.log("this.mapdata",this.mapdata)
    },
    deleteLevel_cb(){
        for(let key in this.levelsData){
            if(this.levelsData[key].level == this.level){
                this.levelsData.splice(key,1);
                this.initMap();
                return;
            }
        }
    },
    reset_cb(){
        this.pos_dict={};
        this.propID = 0;
        this.mapBg.removeAllChildren();
        for(let i=0;i<this.levelsData.length; i++){
            if(this.levelsData[i].level == this.level){
                this.levelsData.splice(i,1);
            }
        }
        this.mapdata.level = this.level;            //如果没有，则
        this.mapdata.itemData = [];
        this.mapdata.height = this.mapBg.height;
        this.mapdata.width = this.mapBg.width;
        this.levelsData.push(this.mapdata);            //要导出的数据
    },
    //导出
    put_cb(){
        console.log(this.difficultData);
        this.curLogic.PSOT("http://192.168.1.117:8081/upfd",{fn:"mapdata.json",fd:JSON.stringify(this.difficultData)}, (data) =>{
            console.log(data);
        })
    },
    back_cb(){
        cc.director.loadScene("palza");
    },
    Copy(str) {
        var save = function (e) {
            e.clipboardData.setData('text/plain', str);
            e.preventDefault();
        }
        document.addEventListener('copy', save);
        document.execCommand('copy');
        document.removeEventListener('copy', save);
    },

  


    // update (dt) {},
});

