let tool = {

    hide_node: function(node) {
        node.active = false;
    },

    show_node: function(node) {
        node.active = true;
    },

    on_click: function(node, func) {
        node.on(cc.Node.EventType.TOUCH_END, function(ev) {
            let start = ev.getStartLocation();
            let end = ev.getLocation();
            cc.log("start = " + start.x + "," + start.y);
            cc.log("end = " + end.x + "," + end.y);

            let distance = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
            cc.log("dis= " + distance);
            if (distance < 10) {
                func();
            }
        });
    },

    enter_scene: function(name) {
        cc.director.loadScene(name);
    },

};

module.exports = tool;
