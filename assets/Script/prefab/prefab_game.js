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
        ruleProItem:[cc.Node],
        rule_content:cc.Node,
        allPass:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.role = null;
        this.setpcount = 0;
        this.isprotective = false;
        this.prop_dic = {};
        this.roleVale = 0;
        this.curLogic = require("logic").getInstance();
        this.mapdata = this.curLogic.get("mapdata");
        this.difficult = this.curLogic.get("difficultState");   //关卡难度
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
            this.setPropBg(type,simpol,node);
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
        //渲染数值
        if(type == 0 ||type == 5){
            str.string = value.toString(); 
        }else if(type == 1){
            if(simpol == 1||simpol == 2 ||simpol == 3||simpol == 4){
                str.string = this.getSimopl(simpol) + value.toString(); 
            }else if (simpol == 5 ||simpol == 6){
                str.string = value.toString() + this.getSimopl(simpol);
            }else if(simpol == 7){
                str.string = "→";
            }
        }else if (type == 2){
            if(simpol == 1||simpol == 2 ||simpol == 3||simpol == 4){
                str.string = this.getSimopl(simpol) + value.toString(); 
            }else if (simpol == 5 ||simpol == 6){
                str.string = value.toString() + this.getSimopl(simpol);
            }else if(simpol == 7){
                str.string = "→";
            }
        }else if (type ==3){
            if(simpol == 1){
                str.string = "="+value.toString();
            }else if(simpol == 2){
                str.string = "≠"+value.toString();
            }else if(simpol == 3){
                str.string = ">"+value.toString();
            }else if(simpol == 4){
                str.string = "<"+value.toString();
            }
        }else{
            str.string ="";
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
            case 5:string = "-";break;
            case 6:string = "/";break;
            default: string ="";break;
        }
        return string;
    },
     /**
     * @param {*} type 类型
     * @param {*} node 道具节点
     */
    setPropBg(type,simpol,node){
        let sprite = node.getChildByName("bg").getComponent(cc.Sprite);
        sprite.spriteFrame = this.propbg[type];
        if(simpol == 8){
            sprite.spriteFrame = this.propbg[10];
        }
    },
    //***************触摸监听回调*****************
    clickCallBack(event){
        this.startPos = event.getLocation();
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
                this.roleMove(1);
            }else{
                this.roleMove(2);
            }
        }else{
            if(AbsoluteY<20)return;
            if(this.startPos.y>this.endPos.y){
                this.roleMove(3);
            }else{
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
            if(this.level == 8){
                this.allPass.active = true;
            }else{
                this.win.active = true;
                this.pass();
            }
        }
    },
    pass(){
        let localData = this.curLogic.readLocalData();
        if (!localData) localData = [];

        let difficultData = localData[this.difficult - 1];
        if (!difficultData) {
            localData[this.difficult - 1] = {};
            difficultData = localData[this.difficult - 1];
        }
        difficultData.difficult = this.difficult;

        let levelData = localData[this.difficult - 1].levelData;
        if (!levelData) {
            localData[this.difficult - 1].levelData = [];
            levelData = localData[this.difficult - 1].levelData;
        }

        let leveltate = levelData[this.level - 1];
        if (!leveltate){
            levelData[this.level - 1] = {};
            leveltate = levelData[this.level - 1];
        } 
        leveltate.level = this.level;
        leveltate.star = 3;

        this.curLogic.writeLocalData(localData);
        cc.log("过关之后的数据",localData);
    },
    /**
     * 碰撞后设置道具的值
     * @param {*} type 道具的类型
     * @param {*} value 道具的值
     * @param {*} simpol 道具的运算符号
     */
    setRoleValue(type, value, simpol) {
        let tempValue = this.roleVale;
        if(type == 1&&simpol == 8){
            this.isprotective = true;
                return;
        }
        if (type == 1) {                        //对主角操作
            if(this.isprotective){
                this.isprotective = false;
                return;
            }
            if(simpol == 1){
                this.roleVale = this.roleVale + value;
            }else if(simpol == 2){
                this.roleVale = this.roleVale - value;
            }else if(simpol == 3){
                this.roleVale = this.roleVale * value;
            }else if(simpol == 4){
                this.roleVale =  Math.round(this.roleVale / value);
            }else if(simpol == 5){
                this.roleVale =  value - this.roleVale;
            }else if(simpol == 6){
                this.roleVale =  Math.round(value / this.roleVale);
            }else if(simpol == 7){
                this.roleVale = this.revnum(this.roleVale);
                this.role.getChildByName("label").getComponent(cc.Label).string = this.roleVale;
                this.comparisonSymbol();
                return;   
            }
            this.ani_propString(this.role,tempValue, value, simpol,type,this.roleVale);
            this.comparisonSymbol();
        }else if (type == 2) {                       //对敌人操作
            for (let key in this.prop_dic) {
                tempValue = this.prop_dic[key].obj.value;
                if (this.prop_dic[key].obj.type == 5) {
                    if (simpol == 1) {
                        this.prop_dic[key].obj.value = this.prop_dic[key].obj.value + value;
                    } else if (simpol == 2) {
                        this.prop_dic[key].obj.value = this.prop_dic[key].obj.value - value;
                    } else if (simpol == 3) {
                        this.prop_dic[key].obj.value = this.prop_dic[key].obj.value * value;
                    } else if (simpol == 4) {
                        this.prop_dic[key].obj.value = Math.round(this.prop_dic[key].obj.value / value);
                    }else if (simpol == 5){
                        this.prop_dic[key].obj.value = Math.round(value - this.prop_dic[key].obj.value );
                    }else if (simpol == 6){
                        this.prop_dic[key].obj.value = Math.round(value / this.prop_dic[key].obj.value);
                    }else if(simpol == 7){
                        for (let key in this.prop_dic) {
                            if (this.prop_dic[key].obj.type == 5) {
                                this.prop_dic[key].obj.value = this.revnum(this.prop_dic[key].obj.value);
                                let node = this.getBreakNode(this.prop_dic[key].id);
                                node.getChildByName("label").getComponent(cc.Label).string = this.prop_dic[key].obj.value;
                            }
                        }
                        return;
                    }
                    this.prop_dic[key].obj.value < 0 ? 0 : this.prop_dic[key].obj.value;
                     //在这边做动画
                    let node = this.getBreakNode(this.prop_dic[key].id);
                    this.ani_propString(node,tempValue,value,simpol,type,this.prop_dic[key].obj.value);
                    // this.setBreakString();
                }
            }
        }else if(type == 5){
            this.roleVale = this.roleVale - value;
            this.ani_propString(this.role,tempValue, value, simpol,type,this.roleVale);
            this.comparisonSymbol();
        }
        if (this.roleVale <= 0) {                //游戏失败
            this.roleVale = 0;
            this.role.getChildByName("label").getComponent(cc.Label).string = this.roleVale;
            this.lose.active = true;        //具体表现会有延迟
            return;
        }
    },
    /**
     * map子节点类型为5：砖块
     * 且找到与prop_dic[key].id对应的值去做运算
     * 砖块值《=0，则消除 ： 当是-》道具，不适用
     */
    setBreakString() {
        for (let i = 0; i < this.map.childrenCount; i++) {
            let node = this.map.children[i];
            let arr = node.name.split("_");
            let id = parseInt(arr[0]);
            let proptype = parseInt(arr[1]);
            if (proptype != 5) continue;
            for (let key in this.prop_dic) {
                if (this.prop_dic[key].id == id) {
                    if (this.prop_dic[key].obj.value < 0) {          //当砖块的值=0；移除，这个值会在变化的时候强行设置
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
    getBreakNode(id){
        for (let i = 0; i < this.map.childrenCount; i++) {
            let node = this.map.children[i];
            let arr = node.name.split("_");
            let nodeid = arr[0];
            if(id == nodeid){
                return node;
            }
        }
    },
    /**
     * 碰撞到的道具移除
     * @param {*} type 道具类型
     * @param {*} str this.prop_dic  key
     */
    removeProp(type, str) {
        if (type == 1 || type == 2 ||type == 5 || type == 7){
            for (let i = 0; i < this.map.childrenCount; i++) {
                let arr = this.map.children[i].name.split("_");
                let id = parseInt(arr[0]);
                if (this.prop_dic[str]) {
                    if (id == this.prop_dic[str].id) {
                        this.map.children[i].destroy();
                        delete this.prop_dic[str];
                    }
                }
            }
        }
    },
    /**
     * 遍历所有的道具，更改><=≠的状态，如果透明度为1，不能经过
     */
    comparisonSymbol() {
        for (let i = 0; i < this.map.childrenCount; i++) {
            for (let key in this.prop_dic) {
                let item = this.prop_dic[key]
                if (item.obj.type == 3) {     //|| item.obj.type == 3
                    let node = this.map.getChildByName(`${item.id}_${item.obj.type}`);
                    if (item.obj.simpol == 1) {
                        if (this.roleVale == item.obj.value) {
                            node.opacity = 125;
                        } else {
                            node.opacity = 255;
                        }
                    } else if (item.obj.simpol == 2) {
                        if (this.roleVale != item.obj.value) {
                            node.opacity = 125;
                        } else {
                            node.opacity = 255;
                        }
                    } else if (item.obj.simpol == 3) {
                        if (this.roleVale > item.obj.value) {
                            node.opacity = 125;
                        } else {
                            node.opacity = 255;
                        }
                    } else if (item.obj.simpol == 4) {
                        if (this.roleVale < item.obj.value) {
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
        let legal = false;                  //移动是否合法
        if (this.prop_dic[key]) {
            if (this.prop_dic[key].obj.type == 3) {
                if (this.prop_dic[key].obj.simpol == 1) {
                    if (this.roleVale == this.prop_dic[key].obj.value) {
                        legal = true;
                    }
                } else if (this.prop_dic[key].obj.simpol == 2) {
                    if (this.roleVale != this.prop_dic[key].obj.value) {
                        legal = true;
                    }
                } else if (this.prop_dic[key].obj.simpol == 3) {
                    if (this.roleVale > this.prop_dic[key].obj.value) {
                        legal = true;
                    }
                }else if (this.prop_dic[key].obj.simpol == 4) {
                    if (this.roleVale < this.prop_dic[key].obj.value) {
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
    //*************点击事件的回调****************
    help_cb() {
        this.rule_content.removeAllChildren();
        this.help.active = true;
        let itemdata = JSON.parse(JSON.stringify(this.mapdata.itemData));
        let dic_node = {};
        for(let i=0; i<itemdata.length; i++){
            if(dic_node[itemdata[i].obj.type])continue;
            dic_node[itemdata[i].obj.type] = itemdata[i].obj.type;
            let node = cc.instantiate(this.ruleProItem[itemdata[i].obj.type])
            node.parent = this.rule_content;
            node.active = true;
        }
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

    //*********Ani************ 
    ani_propString(_node, value1, value2, _simpol, type, calculationvalue) {
        let simpol = this.getSimopl(_simpol);
        let node = _node.getChildByName("label");
        node.stopAllActions();
        node.scaleX = 1;
        if (type == 1 || type == 2 ||type == 5) {
            if (_simpol == 1 || _simpol == 2 || _simpol == 3 || _simpol == 4) {
                node.getComponent(cc.Label).string = `${value1}${simpol}${value2}`;
                cc.log("node.getComponent(cc.Label).string",node.getComponent(cc.Label).string)
            } else if (_simpol == 5 || _simpol == 6) {
                node.getComponent(cc.Label).string = `${value2}${simpol}${value1}`;
                cc.log("node.getComponent(cc.Label).string",node.getComponent(cc.Label).string)
            }
            let actionTo = cc.scaleTo(0.3, 0, 1);
            let DTY = cc.delayTime(0.25);
            let callfunc = cc.callFunc(() => {
                node.scaleX = 1;
                node.getComponent(cc.Label).string = calculationvalue;
                cc.log("shuaxin l ")
            })
            node.runAction(cc.sequence(actionTo, DTY, callfunc));
        } 
    }
    // update (dt) {},
});
