// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

/**
 * 飘逸显示数字
 */

@ccclass
export default class FloatingNumber extends cc.Component {

    @property(cc.Label)
    numberLabel: cc.Label = null; // 数字标签

    @property(cc.Vec2)
    startPos: cc.Vec2 = new cc.Vec2(0, 0); // 起始位置

    @property(cc.Vec2)
    endPos: cc.Vec2 = new cc.Vec2(0, 0); // 结束位置

    @property
    duration: number = 2; // 动画持续时间

    onLoad() {
        // 设置初始位置
        this.node.setPosition(this.startPos);
        this.node.opacity = 0; // 初始时隐藏
    }

    // 显示数字并开始动画
    showNumber(number: number) {
        this.numberLabel.string = "+" + number.toString();
        this.node.setPosition(this.startPos.x, this.startPos.y);
        this.node.opacity = 255; // 显示节点

        // 执行动画
        cc.tween(this.node)
            .to(this.duration, { position: cc.v3(this.endPos.x, this.endPos.y), opacity: 0 }, { easing: 'sineInOut' }) // 移动到结束位置并隐藏
            .call(() => {
                this.node.setPosition(this.startPos.x, this.startPos.y); // 还原到初始位置
                this.node.opacity = 0; // 隐藏节点
            })
            .start();
    }
}
