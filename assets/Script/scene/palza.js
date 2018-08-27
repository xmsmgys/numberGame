
cc.Class({
    extends: cc.Component,

    properties: {
        prefab_palza:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let node = cc.instantiate(this.prefab_palza);
        node.parent = this.node;
    },

    start () {

    },

    // update (dt) {},
});
