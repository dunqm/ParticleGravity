/**This class is automatically generated by LayaAirIDE, please do not make any modifications. */
import Gravity from "./script/Gravity"
import Particle from "./script/Particle/Particle"

export default class GameConfig {
    static init() {
        //注册Script或者Runtime引用
        let reg = Laya.ClassUtils.regClass;
		reg("script/Gravity.js",Gravity);
		reg("script/Particle/Particle.js",Particle);
    }
}
GameConfig.width = 640;
GameConfig.height = 1024;
GameConfig.scaleMode ="fixedwidth";
GameConfig.screenMode = "none";
GameConfig.alignV = "top";
GameConfig.alignH = "left";
GameConfig.startScene = "GravityGame.scene";
GameConfig.sceneRoot = "";
GameConfig.debug = false;
GameConfig.stat = true;
GameConfig.physicsDebug = true;
GameConfig.exportSceneToJson = true;

GameConfig.init();
