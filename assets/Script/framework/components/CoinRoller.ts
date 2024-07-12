import Gloab from "../../Gloab";

const { ccclass, property } = cc._decorator;

/**
 * 滚动的效果
 */
@ccclass
export default class CoinRoller extends cc.Component {
    @property(cc.Label)
    coinLabel: cc.Label = null;

    @property
    duration: number = 2; // 滚动持续时间

    private currentNumber: number = 0;
    private targetNumber: number = 100;
    private elapsedTime: number = 0;

    start() {
        this.currentNumber = 0;
        this.coinLabel.string = "0";
        //this.startRollingTo(this.targetNumber, this.duration);
    }

    startRollingTo(target: number, duration: number) {
        this.targetNumber = target;
        this.duration = duration;
        this.elapsedTime = 0;
        this.schedule(this.updateRolling, 0);
    }

    public cleanLabel() {
        this.coinLabel.string = "0";
    }

    updateRolling(dt: number) {
        this.elapsedTime += dt;
        if (this.elapsedTime >= this.duration) {
            this.elapsedTime = this.duration;
            this.unschedule(this.updateRolling);
        }

        
        const progress = this.elapsedTime / this.duration;
        const newNumber = Math.floor(progress * this.targetNumber);
        this.coinLabel.string = Gloab.Utils.formatNumberWithCommas(newNumber);
    }
}
