cc.Class({
    extends: cc.Component,

    properties: {
        prefab_editLevel:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let node = cc.instantiate(this.prefab_editLevel);
        node.parent = this.node;
    },

    start () {

    },

    // update (dt) {},
});
