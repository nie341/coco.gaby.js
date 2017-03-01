let tool = require("tool");
let DIRECT_VERTICAL = 1;
let DIRECT_HORIZONTAL = 2;
let DIRECT_NULL = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        top_node: cc.Node,
        direction: DIRECT_NULL,
        horizontal_node: cc.Node,
        vertical_node: cc.Node,
    },

    onLoad: function() {
        let self = this;
        self.top_node.on(cc.Node.EventType.TOUCH_START, function(ev) {
            cc.log(1);
        });

        self.t.on(cc.Node.EventType.TOUCH_MOVE, function(ev) {
            let start = ev.getStartLocation();
            let end = ev.getLocation();

            // 如果是第一次移动
            if (self.direction == DIRECT_NULL) {
                // 横向距离更大
                if (Math.abs(start.x - end.x) >= Math.abs(start.y - end.y)) {
                    // 标志为横向
                    self.direction = DIRECT_HORIZONTAL;
                } else {
                    // 标志为纵向移动
                    self.direction = DIRECT_VERTICAL;
                }
            }

            cc.log(2);
        });
        self.t.on(cc.Node.EventType.TOUCH_END, function(ev) {
            cc.log(3);
        });
        self.t.on(cc.Node.EventType.TOUCH_CANCEL, function(ev) {
            cc.log(4);
        });


    },
});
