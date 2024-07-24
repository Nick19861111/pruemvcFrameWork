import SZProto from "../SZProto";

export default class SZLogic {

    private static cards = [];
    public static init() {
        this.cards = [];
    }

    /**
     * 洗牌
     */
    public static washCards() {
        this.cards = [
            0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,
            0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d,
            0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d,
            0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x3b, 0x3c, 0x3d,
        ];

        for (let i = 0; i < this.cards.length; ++i) {
            let random = Math.floor(Math.random() * this.cards.length);
            let tmp = this.cards[i];
            this.cards[i] = this.cards[random];
            this.cards[random] = tmp;
        }
    }

    /**
     * 获取牌的类型
     */
    public static getCardsType(cards) {
        console.log('获取牌的类型');
        return SZProto.cardsType.DANZHANG;
    }
}
