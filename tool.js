let tool = {

    hide_node: function(node) {
        node.active = false;
    },

    show_node: function(node) {
        node.active = true;
    },

    on_click: function(node, func) {
        node.on(cc.Node.EventType.TOUCH_END, func);
    },
    // on_click: function(node, func) {
    //     node.on(cc.Node.EventType.TOUCH_END, function(ev) {
    //         let start = ev.getStartLocation();
    //         let end = ev.getLocation();
    //         cc.log("start = " + start.x + "," + start.y);
    //         cc.log("end = " + end.x + "," + end.y);
    //
    //         let distance = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
    //         cc.log("dis= " + distance);
    //         if (distance < 10) {
    //             func();
    //         }
    //     });
    // },

    enter_scene: function(name) {
        cc.director.loadScene(name);
    },

    make_list: function(content, prefab, number, init_func){
      for (let i = 0; i < number; ++i) {
          let item = cc.instantiate(prefab);
          init_func(item);
          content.addChild(item);
      }
    },

};

module.exports = tool;
