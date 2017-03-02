let tool = require("tool");

cc.Class({
    extends: cc.Component,

    properties: {
        top_node: cc.Node,
        horizontal_node: cc.Node,
        vertical_node: cc.Node,
        click_node: cc.Node,

        tbutton: cc.Node,

        event_start: null,
        judged_node: cc.Node,
    },

    onLoad: function() {
        let self = this;

        self.tbutton.on(cc.Node.EventType.TOUCH_START, function(ev) {
            cc.log("按钮 start");
        });
        self.tbutton.on(cc.Node.EventType.TOUCH_MOVE, function(ev) {
            cc.log("按钮 move");
        });
        self.tbutton.on(cc.Node.EventType.TOUCH_END, function(ev) {
            cc.log("按钮 end");
        });


        self.top_node.on(cc.Node.EventType.TOUCH_START, function(ev) {
            cc.log("top start");
            self.event_start = ev;
            // // 停止事件传递
            // ev.stopPropagation();
        });


        self.top_node.on(cc.Node.EventType.TOUCH_MOVE, function(ev) {
            let start = ev.getStartLocation();
            let end = ev.getLocation();
            let xspan = Math.abs(start.x - end.x);
            let yspan = Math.abs(start.y - end.y);

            // 如果是第一次移动
            if (self.judged_node === null && xspan + yspan > 20) {
                // 横向距离更大
                if (xspan >= yspan) {
                    // 标志为横向
                    self.judged_node = self.horizontal_node;
                } else {
                    // 标志为纵向移动
                    self.judged_node = self.vertical_node;
                }
            }

            if (self.judged_node !== null) {
                self.judged_node.dispatchEvent(self.event_start);
                self.judged_node.dispatchEvent(ev);
                //停止事件监听
                ev.stopPropagation();
            }


        });
        self.top_node.on(cc.Node.EventType.TOUCH_END, function(ev) {
            cc.log("top end");
            // if (self.judged_node !== null) {
            //     self.judged_node.dispatchEvent(ev);
            // }
            // 如果是点击事件
            if (self.judged_node === null) {
                self.click_node.dispatchEvent(self.event_start);
                self.click_node.dispatchEvent(ev);
            }

            self.judged_node = null;
        });
        self.top_node.on(cc.Node.EventType.TOUCH_CANCEL, function(ev) {
            cc.log("top cancel");
            // if (self.judged_node !== null) {
            //     self.judged_node.dispatchEvent(ev);
            // }
            // //停止事件监听
            // ev.stopPropagation();
            self.judged_node = null;
        });


    },
});
