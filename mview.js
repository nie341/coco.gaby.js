var tool = require("tool");
cc.Class({
    extends: cc.Component,

    properties: {
        custom_view: cc.Node,
        content: cc.Node,

        view_center: cc.Node,

        center_content: cc.Node, // 真正的内容填充区
        back: cc.Node,

        default_left: cc.Node,
        default_right: cc.Node,

        extra_left: cc.Node,
        extra_right: cc.Node,

        org_x: null,
        reset_time: 0.2,
        moved: null,
    },


    get_left_width: function() {
        let self = this;
        let w = 0;
        // 挂载额外的节点
        if (self.extra_left.childrenCount !== 0) {
            // 使用节点宽度
            w = self.extra_left.width;

        }
        // 有默认节点
        else if (self.default_left.childrenCount !== 0) {
            // 使用默认节点宽度
            w = self.default_left.width;
        }
        // 没有任何节点
        else {
            w = 0;
        }
        return w;
    },

    get_right_width: function() {
        let self = this;
        let w = 0;
        // 挂载额外的节点
        if (self.extra_right.childrenCount !== 0) {
            // 使用节点宽度
            w = self.extra_right.width;

        }
        // 有默认节点
        else if (self.default_right.childrenCount !== 0) {
            // 使用默认节点宽度
            w = self.default_right.width;
        }
        // 没有任何节点
        else {
            w = 0;
        }
        return w;
    },

    // 鼠标移动
    touch_move: function(event) {
        let self = this;

        // 当前点
        let x = event.getLocationX();
        let y = event.getLocationY();
        // 之前的点
        let xp = event.getPreviousLocation().x;
        let yp = event.getPreviousLocation().y;

        // 获取当前方向
        let dt = x - xp;

        // 判断是否有移动
        if (self.moved !== true) {
            let x1 = event.getStartLocation().x;
            let x2 = event.getLocation().x;
            self.moved = (Math.abs(x1 - x2) > 4);
        }

        // 获取左右控件的宽度
        let w_left = self.get_left_width();
        let w_right = self.get_right_width();
        // cc.log("left = " + w_left + " right = " + w_right);
        // cc.log("content.x=" + self.content.x + "dt=" + dt);

        // 移动
        self.content.x = self.content.x + dt;

        // 修复
        if (self.content.x < self.org_x - w_right) {
            self.content.x = self.org_x - w_right;
        }
        if (self.content.x > self.org_x + w_left) {
            self.content.x = self.org_x + w_left;
        }
    },

    move_any_left: function() {
        let self = this;
        let l = self.get_left_width();
        cc.log("显示左边");
        let action = cc.moveTo(self.reset_time, cc.p(self.org_x + l, self.content.y));
        self.content.runAction(action);
    },
    move_any_right: function() {
        let self = this;
        let r = self.get_right_width();
        cc.log("显示右边");
        let action = cc.moveTo(self.reset_time, cc.p(self.org_x - r, self.content.y));
        self.content.runAction(action);
    },
    move_center: function() {
        let self = this;
        cc.log("显示中间");
        let action = cc.moveTo(self.reset_time, cc.p(self.org_x, self.content.y));
        self.content.runAction(action);
    },

    // 手指放开
    touch_end: function(ev) {
        let self = this;
        let r = self.get_right_width();
        let l = self.get_left_width();
        var half_l = l / 2;
        var half_r = r / 2;
        // 如果显示右边的菜单
        if (r > 1 && self.content.x < self.org_x - half_r) {
            self.move_any_right();
            self._show();
        }
        // 如果显示左边的
        else if (l > 1 && self.content.x > self.org_x + half_l) {
            self.move_any_left();
            self._show();
        }
        // 否则中间
        else {
            self.move_center();
            self._hide();
        }

        // 清空移动过的痕迹
        self.moved = null;
    },

    // use this for initialization
    onLoad: function() {
        let self = this;

        // 隐藏背景
        self._hide();

        // 调整主界面为手机尺寸宽度
        let canvas = cc.find("Canvas");
        self.view_center.width = canvas.width;

        // 记录原始点
        if (self.org_x === null) {
            self.org_x = self.content.x;
        }

        self.view_center.on(cc.Node.EventType.TOUCH_START, function(ev) {
            cc.log("center start");
        });
        self.back.on(cc.Node.EventType.TOUCH_START, function(ev) {
            cc.log("back start");
            ev.stopPropagation();
        });

        self.view_center.on(cc.Node.EventType.TOUCH_MOVE, function(ev) {
            self.touch_move(ev);
        });
        self.back.on(cc.Node.EventType.TOUCH_MOVE, function(ev) {
            self.touch_move(ev);
            ev.stopPropagation();
        });

        self.view_center.on(cc.Node.EventType.TOUCH_CANCEL, function(event) {
            cc.log("center cancel");
            self.touch_end(event);
        });
        self.back.on(cc.Node.EventType.TOUCH_CANCEL, function(event) {
            cc.log("back cancel");
            self.touch_end(event);
            event.stopPropagation();
        });

        tool.on_click(self.view_center, function(event) {
            cc.log("center end");
            self.touch_end(event);
        });
        tool.on_click(self.back, function(event) {
            cc.log("back end");
            // 如果在蒙层上移动
            if (self.moved === true) {
                cc.log("back 转touch end");
                self.moved = null;
                self.touch_end(event);
            }
            // 如果没移动,那么回中间
            else {
                cc.log("back 中间");
                self.move_center();
                self._hide();
            }
            event.stopPropagation();
        });

        // 初始化的时候extra是关闭的
        tool.hide_node(self.extra_left);
        tool.hide_node(self.extra_right);
    },

    _hide: function() {
        cc.log("隐藏back");
        let self = this;
        tool.hide_node(self.back);
    },
    _show: function() {
        let self = this;
        cc.log("显示back");
        tool.show_node(self.back);
    },


    add_center: function(node) {
        var self = this;
        self.center_content.addChild(node);
    },

    // ====================================================================================

    // 添加默认的左边
    add_default_left: function(node) {
        var self = this;
        self.default_left.addChild(node);
        self.default_left.width = node.width;
        self.default_left.x = 0 - self.view_center.width / 2;
    },

    add_default_right: function(node) {
        var self = this;
        self.default_right.addChild(node);
        self.default_right.width = node.width;
        self.default_right.x = 0 + self.view_center.width / 2;
    },

    // ====================================================================================
    // 显示额外的左边菜单
    show_extra_left: function(node) {
        var self = this;

        // 隐藏默认的view
        tool.hide_node(self.default_left);

        // 删除原来的子节点
        self.extra_left.removeAllChildren(true);

        // 添加额外的view
        self.extra_left.addChild(node);
        self.extra_left.width = node.width;
        self.extra_left.x = 0 - self.view_center.width / 2;

        cc.log("extra_left.x = " + self.extra_left.x);
        cc.log("view_center.x = " + self.view_center.x);

        // 显示
        tool.show_node(self.extra_left);
        // 滑动到左边
        self.move_any_left();
        self._show();
    },

    show_extra_right: function(node) {
        var self = this;

        // 隐藏默认的view
        tool.hide_node(self.default_right);

        // 删除原来的子节点
        self.extra_right.removeAllChildren(true);

        // 添加额外的view
        self.extra_right.addChild(node);
        self.extra_right.width = node.width;
        self.extra_right.x = 0 + self.view_center.width / 2;

        // 显示
        tool.show_node(self.extra_right);
        // 滑动到右边
        self.move_any_right();
        self._show();
    },

    // ====================================================================================
    // 显示左边的默认菜单
    show_default_left: function() {
        let self = this;

        // 清除额外的菜单
        self.extra_left.removeAllChildren(true);
        tool.hide_node(self.extra_left);

        // 显示默认菜单
        tool.show_node(self.default_left)
        let action = cc.moveTo(self.reset_time, cc.p(self.org_x + self.get_left_width(), self.content.y));
        self.content.runAction(action);
        self._show();
    },

    show_default_right: function() {
        let self = this;

        // 清除额外的菜单
        self.extra_right.removeAllChildren(true);
        self.extra_right.width = 0;

        // 显示默认菜单
        tool.show_node(self.default_right)
        let action = cc.moveTo(self.reset_time, cc.p(self.org_x - self.get_left_width(), self.content.y));
        self.content.runAction(action);
        self._show();
    },

});
