//viewmodel
var idCount = 0;
var Elements = [

];

document.addEventListener("keypress", function(e){
    if(e.key === "c"){
        Elements.push({
            type: "camera",
            pos: [0,0],
            scale: 1,
            id: idCount++
        });
        m.redraw();
    }
}, false);


//Types of block
var Camera = {
    view: function() {
        return m("video", {
            autoplay: "true",
            id: "videoElement",
            oncreate: function(vnode){
                var video = vnode.dom;

                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

                if (navigator.getUserMedia) {
                    navigator.getUserMedia({video: true}, handleVideo, videoError);
                }

                function handleVideo(stream) {
                    video.src = window.URL.createObjectURL(stream);
                }

                function videoError(e) {
                    // do something
                }
            }
        });
    }
};

var typeMap = {
    "camera": Camera
};





//Canvas and blocks
var Block = function(){
    var offset = [0,0];

    return {
        view: function(vnode) {
            var block = vnode.attrs;

            return m(".block", {
                style: "left: "+block.pos[0]+ "px; top: "+block.pos[1]+"px; transform: scale("+block.scale+");",
                onmousedown: function(e){
                    offset = [block.pos[0] - e.clientX, block.pos[1] - e.clientY];
                    draghandler(function(e){
                        block.pos = [offset[0] + e.clientX, offset[1] + e.clientY];
                        m.redraw();
                    });
                },
                onmousewheel: function(e){
                    block.scale -= e.deltaY/1000;
                    m.redraw();
                },
                oncontextmenu: function(e){
                    e.preventDefault();
                     Elements = Elements.filter((other)=>{
                         return block.id !== other.id;
                     });
                     m.redraw();
                }
            }, m(typeMap[block.type], block));
        }
    };
};

var Canvas = function(){
    return {
        view: function(vnode) {
            return m(".canvas", Elements.map((e)=>{
                return m(Block, e);
            }));

        }
    };
};

m.mount(document.getElementById("app"), Canvas);
