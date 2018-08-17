let
    FileUtil = function () {},
    fileUtil = FileUtil.prototype,
    g_instance = null;

/**
 * JSON 文件读取
 * @param {String} path: config/serverCfg
 * @returns {Promise}
 */
fileUtil.readJSON = function (path) {
    return new Promise(function (resolve, reject) {
        cc.loader.loadRes(`mapdata/${path}`, function (err, data) {
            if (err) {
                console.error(`${path}.json 文件读取失败`);
                return reject(err);
            }
            console.log(`读取json文件 ${path}.json: `, data);
            resolve(data);
        })
    })
};
/**
 * 预制资源文件读取
 * @param {String} path
 * @returns {Promise}
 */
fileUtil.readPrefab = function (path) {
    // 加载单个资源的时候暂时屏蔽掉界面上所有操作
    let scene = cc.director.getScene();
    let showMask = () => {
        let visibleSize = cc.director.getVisibleSize();
        let node = new cc.Node();
        node.name = "loadmask";
        node.setContentSize(visibleSize);
        node.setPosition(new cc.Vec2(visibleSize.width/2, visibleSize.height/2));
        node.addComponent(cc.Button);
        scene.addChild(node, 1000);
    };
    if (!scene.getChildByName("loadmask")) showMask();

    return new Promise(function (resolve, reject) {
        cc.loader.loadRes(path, cc.Prefab, function (err, data) {
            if (scene.getChildByName("loadmask")) scene.getChildByName("loadmask").destroy();
            if (err) {
                console.error(`${path}.prefab 文件读取失败`);
                return reject(err);
            }
            resolve(data);
        })
    })
};
/**
 * 动画资源文件读取
 * @param path
 * @returns {Promise}
 */
fileUtil.readAnimation = function (path) {
    return new Promise((resolve, reject)=>{
        cc.loader.loadRes(path, cc.AnimationClip, (err, data) => {
            if (err) {
                console.error(`${path}.anim 文件读取失败`);
                return reject(data);
            }
            resolve(data);
        })
    })
};
module.exports = function () {
    if (!g_instance) {
        g_instance = new FileUtil();
    }
    return g_instance;
};