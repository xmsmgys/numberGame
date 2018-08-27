cc.Class({
    extends: cc.Component,

    properties: {
        prefab_game:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let node = cc.instantiate(this.prefab_game);
        node.parent = this.node;
    },

    start () {

    },

    // update (dt) {},
});
