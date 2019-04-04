export default class Particle extends Laya.Script{
    /**
     * BUG：物体的坐标并不在物体中心，而物体受力点在物体中心(2019-4-4 4:38)
     *      已解决by:QM
     * 
     * BUG：当物体超过一定数量时程序性能严重下降(2019-4-5 23:16)
     *      问题在于开启了RigidBody的bullet属性，将此属性设置为false可大幅度提高性能，但却显示效果却大大降低(2019-4-5 2:48)
     */
    constructor(){
        super();
        this._color = "#9400D3";
    }


    onEnable(){
        this._rig = this.owner.getComponent(Laya.RigidBody);
        this.owner.graphics.drawCircle(8,8,8,this._color);
        var glowFilter = new Laya.GlowFilter(this._color, 10, 0, 0);
        this.owner.filters = [glowFilter];

        //this._rig.setVelocity({x:10,y:10});
        var Me = this;
        this.owner._test = function(){
            Me.vstest();
        }
    }

    onUpdate(){
        //分别与父容器下的所有子元素计算引力
        var _Particle = this.owner._parent._children;
        var ForceAll = {x : 0, y: 0};
        for(var i = 0,len = _Particle.length; i < len; i++){
            if(_Particle[i].name != "Particle") continue;
            //求出两物体质心点坐标
            var x1 = this._rig.getWorldCenter().x,
                y1 = this._rig.getWorldCenter().y,
                x2 = _Particle[i]._components[0].getWorldCenter().x,
                y2 = _Particle[i]._components[0].getWorldCenter().y;
            var _x = x2 - x1;
            var _y = y2 - y1;
            //求出两物体质量
            var m1 = this._rig.getMass();
            var m2 = _Particle[i]._components[0].getMass();
            //求出引力
            var Force = this.Gravity( _x, _y, m1, m2 );
            if(Force != null){
                ForceAll.x += Force.x;
                ForceAll.y += Force.y;
            }
        }
        this._rig.applyForceToCenter(ForceAll);
    }


    /**
     * 测试：(此测试只针对于两物体，超过2个时程序会报错)
     * 1.模拟相对于静止物体的匀速圆周运动(半径为两物体中点到圆心距离)
     * 2.模拟二体圆周运动(半径为两物体中点到圆心距离)
     */
    vstest(type = 1){
        var _Particle = this.owner._parent._children;
        for(var i = 0,len = _Particle.length; i < len; i++){
            if(_Particle[i].name != "Particle") continue;
            var x1 = this._rig.getWorldCenter().x,
                y1 = this._rig.getWorldCenter().y,
                x2 = _Particle[i]._components[0].getWorldCenter().x,
                y2 = _Particle[i]._components[0].getWorldCenter().y;
            var _x = x2 - x1;
            var _y = y2 - y1;
            var m2 = _Particle[i]._components[0].getMass();
            if(type == 1){
                var v = this.UniformCircularMotion(_x, _y, m2);
            }else if(type == 2){
                //模拟二体圆周运动，同样用到匀速圆周运动性质
                var v = this.UniformCircularMotion(_x * 2, _y * 2, m2);
            }
            if(v != null) this._rig.setVelocity(v);
        }
    }


    /**
     * 根据两点坐标差和质量，得出匀速圆周运动所需的初速度和切线方向
     * @param {number} x 
     * @param {number} y 
     * @param {number} m 
     * @returns {any} 输出速度的二维向量坐标，例如{x:10, y:10};不合法输出null
     * @author QM
     */
    UniformCircularMotion(x, y, m){
        //万有引力常数
        var G = 1e2;
        //单位换算
        x = x / Laya.Physics.PIXEL_RATIO;
        y = y / Laya.Physics.PIXEL_RATIO;
        //此处R为两点距离r的平方
        var R = (x * x + y * y);
        if(R>0){
            //根据匀速圆周运动性质求出初速度
            var v = Math.sqrt(G*m/Math.sqrt(R));
            if( x == 0){
                return {x : (y > 0? -1 : 1) * v, y : 0};
            }else if(y == 0){
                return {x : 0, y : (x > 0? -1 : 1) * v};
            }else{
                //根据三角形性质求出切线方向
                var cv = {x: (y * y / x), y : -y };
                var k = v / Math.sqrt(cv.x * cv.x + cv.y * cv.y);
                return {x : cv.x * k, y : cv.y * k};
            }
        }
        return null;
    }


    /**
     * 根据两点坐标差值以及质量，计算出引力
     * @param {number} x x坐标差值
     * @param {number} y y坐标差值
     * @param {number} m1 质量
     * @param {number} m2 质量
     * @returns {any} 输出力的二维向量坐标，例如{x:10, y:10};不合法输出null
     * @author QM
     */
    Gravity( x, y, m1, m2){
        //万有引力常数
        var G = 1e2;
        //单位换算
        x = x / Laya.Physics.PIXEL_RATIO;
        y = y / Laya.Physics.PIXEL_RATIO;
        //此处R为两点距离r的平方
        var R = (x * x + y * y) ;
        if(R > 0){
            //根据万有引力公式得出引力F
            var F = G * m1 * m2 / R;
            var k = F / Math.sqrt(R);
            return {x : x * k, y : y * k};
        }
        return null;
    }
}