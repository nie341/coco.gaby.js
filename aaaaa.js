let tool = require("tool");

cc.Class({
    extends: cc.Component,

    properties: {

        touch_node: cc.Node,
        scrollview_node: cc.Node,
        test_node: cc.Node,

        direct: null,
    },

    onLoad: function() {
        let self = this;

        // 关闭
        self.scrollview_node.horizontal = false;
        self.scrollview_node.vertical = false;

        tool.on_click(self.test_node, function(ev) {
            cc.log(" ========= 测试按钮被点击 =========");
        });

        self.touch_node.on(cc.Node.EventType.TOUCH_START, function(ev) {
            cc.log("top start");
        });


        self.touch_node.on(cc.Node.EventType.TOUCH_MOVE, function(ev) {
            cc.log("top move");
            let start = ev.getStartLocation();
            let end = ev.getLocation();
            let xspan = Math.abs(start.x - end.x);
            let yspan = Math.abs(start.y - end.y);
            let dx = (end.x - start.x);
            let dy = (end.y - start.y);

            // 如果是第一次移动
            if (self.direct === null && xspan + yspan > 20) {
                // 已经移动超过距离了
                if (self.moved !== true) {
                    self.moved = true;
                }

                // 横向距离更大
                if (xspan >= yspan) {
                    // 标志为横向
                    self.direct = 1;
                } else {
                    // 标志为纵向移动
                    self.direct = 2;
                }
            }
            // self.move_node.x += (end.x - start.x);
            // self.move_node.y += (end.y - start.y);

            if (self.direct !== null) {
                cc.log("self.direct = " + self.direct);

                if (self.direct === 1) {
                    self.scrollview_node.horizontal = true;
                } else if (self.direct === 2) {
                    self.scrollview_node.vertical = true;
                }
                cc.log("func=", self.scrollview_node);
                self.scrollview_node.scrollToOffset(cc.p(dx, dy), 0);
            }
        });
        self.touch_node.on(cc.Node.EventType.TOUCH_END, function(ev) {
            cc.log("top end");

            self.direct = null;
            self.scrollview_node.horizontal = false;
            self.scrollview_node.vertical = false;
        });
        self.touch_node.on(cc.Node.EventType.TOUCH_CANCEL, function(ev) {
            cc.log("top cancel");

            self.direct = null;
            self.scrollview_node.horizontal = false;
            self.scrollview_node.vertical = false;
        });


    },
});
