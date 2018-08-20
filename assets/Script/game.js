cc.Class({
    extends: cc.Component,

    properties: {
        map :cc.Node,
        propItem :cc.Node,
        touchLayer:cc.Node,
        gameMenu:cc.Node,
        win:cc.Node,
        lose:cc.Node,
        help:cc.Node,
        info:cc.Node,
        propbg:[cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.role = null;
        this.setpcount = 0;
        this.prop_dic = {};
        this.roleVale = 0;
        this.curLogic = require("logic").getInstance();
        this.mapdata = this.curLogic.get("mapdata");
        this.difficult = this.curLogic.get("difficultState");
        this.difficultData = this.curLogic.get("difficultData");
        this.levelsData = this.difficultData[i].levelsData;
        this.level = this.mapdata.level;
        cc.log("mapdata",this.mapdata);
        this.initMap();
        this.initInfo();
        this.comparisonSymbol();
        this.bindTouchLayer();
    },
    start () {
       
    },
    //初始化地图
    initMap(){
        this.map.width = this.mapdata.width;
        this.map.height = this.mapdata.height;
        this.map.x = -(this.map.width/2);
        this.map.y = -(this.map.height/2);
        this.map.removeAllChildren();
        let itemdata = JSON.parse(JSON.stringify(this.mapdata.itemData));
        for(let i=0; i<itemdata.length; i++){
            let node =cc.instantiate(this.propItem);
            node.parent = this.map;
            node.active = true;
            node.zIndex =1;
            node.x = itemdata[i].obj.x;
            node.y = itemdata[i].obj.y;
            node.name = `${itemdata[i].id}_${itemdata[i].obj.type}`;
            let type = itemdata[i].obj.type;
            let value = itemdata[i].obj.value;
            let simpol = itemdata[i].obj.simpol;
            this.setPropLaebl(type,node,value,simpol);
            this.setPropBg(type,node);
            if(type==0){
                this.role = node;
                this.roleVale = value;
                this.role.zIndex = 10;
                continue;
            }
            let str = `${node.x},${node.y}`
            this.prop_dic[str]=itemdata[i]; //位置对应
        }
    },
    initInfo(){
        let info_level = this.info.children[0].getChildByName("level");
        let info_difficult = this.info.children[0].getChildByName("difficult");
        let info_setpCount = this.info.children[1].getChildByName("count");
        let info_gold = this.info.children[2].getChildByName("coin");
        info_difficult.getComponent(cc.Label).string = this.curLogic.CONST.difficult[this.difficult];
        info_level.getComponent(cc.Label).string = `-${this.level}`;
        info_setpCount.getComponent(cc.Label).string = this.setpcount;
    },
    updataSetpCount(){
        this.setpcount ++;
        let info_setpCount = this.info.children[1].getChildByName("count");
        info_setpCount.getComponent(cc.Label).string = this.setpcount;
    },
    //绑定点击层
    bindTouchLayer(){
        this.touchLayer.on("touchstart", this.clickCallBack, this);
        this.touchLayer.on("touchmove", this.moveCallBack, this);
        this.touchLayer.on("touchend", this.moveEndCallBack, this);
        this.touchLayer.on("touchcancel", this.moveEndCallBack, this);
    },
    /**
     * @param {*} type 道具类型
     * @param {*} node 道具节点
     * @param {*} value 值
     * @param {*} simpol 符号
     */
    setPropLaebl(type,node,value,simpol){
        let str = node.getChildByName("label").getComponent(cc.Label);
        switch (type) {
            case 0:
            case 1: 
                    str.string = value.toString();break;
            case 2:
            case 4:
                    str.string = this.getSimopl(simpol) +value.toString() ; break;
            case 3:
            case 5:
                    str.string = value.toString() + this.getSimopl(simpol); break;
            case 8:str.string = simpol==1?"→":"←";break;
            default:node.getChildByName("label").active = false;
                break;
        }
    },
    /**
     * @param {*} simpol 运算符号
     */
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
            default: string ="";break;
        }
        return string;
    },
     /**
     * @param {*} type 类型
     * @param {*} node 道具节点
     */
    setPropBg(type,node){
        let sprite = node.getChildByName("bg").getComponent(cc.Sprite);
        switch(type){
            case 0:sprite.spriteFrame = this.propbg[0];break;
            case 1:sprite.spriteFrame = this.propbg[1];break;
            case 2:sprite.spriteFrame = this.propbg[2];break;
            case 3:sprite.spriteFrame = this.propbg[3];break;
            case 4:sprite.spriteFrame = this.propbg[4];break;
            case 5:sprite.spriteFrame = this.propbg[5];break;
            case 6:sprite.spriteFrame = this.propbg[6];break;
            case 7:sprite.spriteFrame = this.propbg[7];break;
            default: 
            break;
        }
    },
    //触摸监听回调
    clickCallBack(event){
        this.startPos = event.getLocation();
        cc.log("star",this.startPos);
    },
    moveCallBack(event){

    },
    moveEndCallBack(event){
        this.endPos = event.getLocation();
        let AbsoluteX = Math.abs(this.startPos.x  - this.endPos.x);
        let AbsoluteY = Math.abs(this.startPos.y  - this.endPos.y);
        if(AbsoluteX>AbsoluteY){
            if(AbsoluteX<20)return;
            if(this.startPos.x>this.endPos.x){
                cc.log("向左",this.endPos)
                this.roleMove(1);
            }else{
                cc.log("向右",this.endPos)
                this.roleMove(2);
            }
        }else{
            if(AbsoluteY<20)return;
            if(this.startPos.y>this.endPos.y){
                cc.log("向下",this.endPos)
                this.roleMove(3);
            }else{
                cc.log("向上",this.endPos)
                this.roleMove(4);
            }
        }
    },
    /**
     * 判断位置是否出界
     * 判断碰撞的物体类型
     * @param {*} dir 移动的方向 
     */
    roleMove(dir) {
        let pos = this.role.position;
        switch (dir) {
            case 1: pos.x -= 100; break;
            case 2: pos.x += 100; break;
            case 3: pos.y -= 100; break;
            case 4: pos.y += 100; break;
        }

        if (pos.x < 0 || pos.x > (this.map.width - this.role.width)
            || pos.y < 0 || pos.y > (this.map.height - this.role.height)) {
            return;
        }

        let type,value,simpol;
        let str = `${pos.x},${pos.y}`
        if (this.prop_dic[str]) {
            type = this.prop_dic[str].obj.type;
            value = this.prop_dic[str].obj.value;
            simpol = this.prop_dic[str].obj.simpol;
        }else{          
            this.role.position = pos;                            //没碰到障碍物
            this.updataSetpCount();
            return;
        }
        if (type == 6) return                       //碰到无穷
        let legal = this.checkMove(str);            //移动非法
        if(!legal)return;
        
        this.role.position = pos;
        this.updataSetpCount();
        this.setRoleValue(type,value,simpol);       //设置砖块或者主角的值
        this.removeProp(type,str);                  //移除道具
        if (type == 7) {
            this.win.active = true;
        }
    },
    /**
     * 碰撞后设置道具的值
     * @param {*} type 道具的类型
     * @param {*} value 道具的值
     * @param {*} simpol 道具的运算符号
     */
    setRoleValue(type, value, simpol) {
        if(type == 1){
            this.roleVale = this.roleVale - value;
            this.comparisonSymbol();                    //改变><=的砖块的状态
        }
        else if (type == 2) {                          //主角-道具
            if (simpol == 1) {
                this.roleVale = this.roleVale + value;
            } else if (simpol == 2) {
                this.roleVale = this.roleVale - value;
            } else if (simpol == 3) {
                this.roleVale = this.roleVale * value;
            }
            else if (simpol == 4) {
                this.roleVale = parseInt(this.roleVale / value);
            }
            this.comparisonSymbol();                    //改变><=的砖块的状态
        } 
        else if (type == 3) {                        //道具-主角
            if (simpol == 1) {
                this.roleVale = value + this.roleVale;
            } else if (simpol == 2) {
                this.roleVale = value - this.roleVale;
            } else if (simpol == 3) {
                this.roleVale = value * this.roleVale;
            }
            else if (simpol == 4) {
                this.roleVale = parseInt(value / this.roleVale);
            }
            this.comparisonSymbol();                    //改变><=的砖块的状态
        } 
        else if (type == 4) {                        //砖块 - 道具
            for (let key in this.prop_dic) {
                if (this.prop_dic[key].obj.type == 1) {
                    if (simpol == 1) {
                        this.prop_dic[key].obj.value = this.prop_dic[key].obj.value + value;
                    } else if (simpol == 2) {
                        this.prop_dic[key].obj.value = this.prop_dic[key].obj.value - value;
                    } else if (simpol == 3) {
                        this.prop_dic[key].obj.value = this.prop_dic[key].obj.value * value;
                    } else if (simpol == 4) {
                        this.prop_dic[key].obj.value = parseInt(this.prop_dic[key].obj.value / value);
                    }
                    this.prop_dic[key].obj.value < 0 ? 0 : this.prop_dic[key].obj.value;
                }
            }
            this.setBreakString();
        } 
        else if (type == 5) {                     //道具 - 砖块 
            for (let key in this.prop_dic) {
                if (this.prop_dic[key].obj.type == 1) {
                    if (simpol == 1) {
                        this.prop_dic[key].obj.value = value + this.prop_dic[key].obj.value;
                    } else if (simpol == 2) {
                        this.prop_dic[key].obj.value = value - this.prop_dic[key].obj.value;
                    } else if (simpol == 3) {
                        this.prop_dic[key].obj.value = value * this.prop_dic[key].obj.value;
                    } else if (simpol == 4) {
                        this.prop_dic[key].obj.value = parseInt(value / this.prop_dic[key].obj.value);
                    }
                }
            }
            this.setBreakString();
        }
        else if (type == 8) {
            if (simpol == 1) {            //改变我的值
                this.roleVale = this.revnum(this.roleVale);
                this.comparisonSymbol();                            //改变><=的砖块的状态
            } else if (simpol == 2) {      //改变砖块的值
                for (let key in this.prop_dic) {
                    if (this.prop_dic[key].obj.type == 1) {
                        this.prop_dic[key].obj.value =this.revnum(this.prop_dic[key].obj.value);
                    }
                }
                this.setBreakString();
            }
        }
        if(this.roleVale<=0){                //游戏失败
            this.roleVale = 0;
            this.role.getChildByName("label").getComponent(cc.Label).string = this.roleVale;
            this.lose.active = true;        //具体表现会有延迟
            return;
        }
        this.role.getChildByName("label").getComponent(cc.Label).string = this.roleVale;
    },
    /**
     * map子节点类型为1：砖块
     * 且找到与prop_dic[key].id对应的值去做运算
     * 砖块值《=0，则消除 ： 当是-》道具，不适用
     */
    setBreakString(){
        for(let i=0; i<this.map.childrenCount; i++){
            let node = this.map.children[i];
            let arr = node.name.split("_");
            let id = parseInt(arr[0]);
            let type =parseInt(arr[1]);
            if(type!=1)continue;
            for (let key in this.prop_dic) {
                if(this.prop_dic[key].id ==id){
                    if(this.prop_dic[key].obj.value == 0){          //当砖块的值=0；移除，这个值会在变化的时候强行设置
                        node.destroy();
                        delete this.prop_dic[key];          
                        continue;
                    }
                    node.getChildByName("label").getComponent(cc.Label).string = this.prop_dic[key].obj.value;
                    break;
                }
            }
        }
    },
    /**
     * 碰撞到的道具移除
     * @param {*} type 道具类型
     * @param {*} str this.prop_dic  key
     */
    removeProp(type, str) {
        if(type ==2){       //><=
            if (this.prop_dic[str].obj.simpol==5||this.prop_dic[str].obj.simpol==6||this.prop_dic[str].obj.simpol==7){
                return;
            }
        }
        if (type == 1 || type == 2 || type == 3 || type == 4 || type == 5||type ==7||type ==8) {
            for (let i = 0; i < this.map.childrenCount; i++) {
                let arr = this.map.children[i].name.split("_");
                let id = parseInt(arr[0]);
                if (this.prop_dic[str]) {
                    if (id == this.prop_dic[str].id) {
                        this.map.children[i].destroy();
                        delete this.prop_dic[str];
                        cc.log("[this.prop_dic]", this.prop_dic)
                    }
                }
            }
        }
    },
    /**
     * 遍历所有的道具，更改><=的状态，如果透明度为1，不能经过
     */
    comparisonSymbol() {
        for (let i = 0; i < this.map.childrenCount; i++) {
            for (let key in this.prop_dic) {
                let item = this.prop_dic[key]
                if (item.obj.type == 2) {     //|| item.obj.type == 3
                    let node = this.map.getChildByName(`${item.id}_${item.obj.type}`);
                    if (item.obj.simpol == 5) {
                        if (this.roleVale > item.obj.value) {
                            node.opacity = 125;
                        } else {
                            node.opacity = 255;
                        }
                    } else if (item.obj.simpol == 6) {
                        if (this.roleVale < item.obj.value) {
                            node.opacity = 125;
                        } else {
                            node.opacity = 255;
                        }
                    } else if (item.obj.simpol == 7) {
                        if (this.roleVale == item.obj.value) {
                            node.opacity = 125;
                        } else {
                            node.opacity = 255;
                        }
                    }
                }
            }
        }
    },
    /**
     * 检测是否能通过><=的道具
     * @param {*} key  主角将要移动的位置的道具
     */
    checkMove(key) {
        let legal = false;
        if (this.prop_dic[key]) {
            if (this.prop_dic[key].obj.type == 2) {
                if (this.prop_dic[key].obj.simpol == 5) {
                    if (this.roleVale > this.prop_dic[key].obj.value) {
                        legal = true;
                    }
                } else if (this.prop_dic[key].obj.simpol == 6) {
                    if (this.roleVale < this.prop_dic[key].obj.value) {
                        legal = true;
                    }
                } else if (this.prop_dic[key].obj.simpol == 7) {
                    if (this.roleVale == this.prop_dic[key].obj.value) {
                        legal = true;
                    }
                }else{
                    legal = true;
                }
            }else{
                legal = true;
            }
        } else {
            legal = true;
        }
        return legal;
    },
    //数字反转
    revnum(num) {
        let bool = false;
        if (num < 0) {
            num = Math.abs(num);
            bool = true
        }
        num = num.toString().split("").reverse();
        num = num.join("");
        num = Number(num);
        num = bool ? -num : num;
        return num;
    },
    //=======点击事件的回调
    help_cb() {
        this.help.active = true;
    },
    //重新开始
    reStart_cb(){
        this.onLoad();
    },
    //游戏失败的重新开始和菜单的重新开始
    gameMenuRestatr_cb(event){
        event.target.parent.active= false;
        this.onLoad();
    },
    //免费提示
    freeTip_cb(){

    },
    //好友帮助
    helpforfriend_cb(){

    },
    //设置
    set_cb(){
        this.gameMenu.active = true;
    },
    //关闭
    close_cb(event){
        event.target.parent.active= false;
    },
    //退出当前关卡
    exitCurLevel_cb(){
        cc.director.loadScene("palza");
    },
    //点击头像
    head_cb(){

    },
    //继续
    continue_cb(event){
        for(let i=0; i<this.levelsData.length; i++){
            if(this.levelsData[i].level == this.level+1){
                let mapdata = this.levelsData[i]
                this.curLogic.set("mapdata",mapdata);
                event.target.parent.active= false;
                this.onLoad();
                return;
            }
        }
       //解锁新刮关卡，跳到相应的关卡选择界面
    },
    // update (dt) {},
});
