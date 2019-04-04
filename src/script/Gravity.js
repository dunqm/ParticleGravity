

export default class Gravity extends Laya.Script{
    /** @prop {name:Particle, tips:"粒子", type:Prefab}  */
    constructor(){super();}

    onEnable(){

    }

    /**
     * 鼠标点击创建粒子
     */
    onClick(){
        let particle = Laya.Pool.getItemByCreateFun("Particle", this.Particle.create, this.Particle);
        particle.pos(this.owner.mouseX, this.owner.mouseY);
        this.owner.addChild(particle);
    }

}