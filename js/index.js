function getEle(ele){
    return document.querySelector(ele);
}
var main = getEle("#main");
var oLis = document.querySelectorAll("#list>li");
//设备高度
var winW = document.documentElement.clientWidth;
var winH = document.documentElement.clientHeight;
//shejigao gaodu
var desW = 640;
var desH = 960;
if(winW/winH<desW/desH){
    main.style.webkitTransform = "scale("+winH/desH+")";
}else{
    main.style.webkitTransform = "scale("+winW/desW+")";
}
//var music = getEle("#music");
[].forEach.call(oLis,function(){
    //music.play();
    var oLi = arguments[0];
    oLi.index = arguments[1];
    oLi.addEventListener("touchstart",start,false);
    oLi.addEventListener("touchmove",move,false);
    oLi.addEventListener("touchend",end,false);
})
function start(e){

    this.startY = e.changedTouches[0].pageY;
}
function move(e){
    this.flag = true;
    e.preventDefault();
    //pageX,pageY是页面上的包括隐藏滑动
    var moveTouch = e.changedTouches[0].pageY;//move时的坐标
    var movePos = moveTouch-this.startY;//移动的距离
    var index = this.index;
    [].forEach.call(oLis,function(){
        arguments[0].className = "";
        if(arguments[1]!=index){
            arguments[0].style.display = "none";
        }
        //给当前那张也就是缩小那张去掉动画
        arguments[0].firstElementChild.id="";
    })
    if(movePos>0){/*↓*/
        var pos = -winH+movePos;
        this.prevsIndex = (index ==0?oLis.length-1:index-1);//上一张索引
    }else if(movePos<0){/*↑*/
        var  pos = winH+movePos;
        this.prevsIndex = (index == oLis.length-1?0:index+1);//下一张的索引

    }
    //如果不设zindex下一张永远在下面，覆盖不了上边那一张
    oLis[this.prevsIndex].className = "zIndex";
    //是让对象成为块级元素(比如a，span等),一般都是用display:none和display:block来控制层的显示
    oLis[this.prevsIndex].style.display = "block";
    //下一张的移动"translate(0,"+pos+"px)";x方向不动，y轴方向动
    oLis[this.prevsIndex].style.webkitTransform = "translate(0,"+pos+"px)";
    //当前这一张要往小缩，
    this.style.webkitTransform = "scale("+(1-Math.abs(movePos)/winH*1/2)+")  translate(0,"+movePos+"px)";


}
function end(e){
    if(this.flag){
        //不管往上划还是往下划，都会回到顶部，
        oLis[this.prevsIndex].style.webkitTransform = "translate(0,0)";
        //增加平滑过渡的效果
        oLis[this.prevsIndex].style.webkitTransition = "0.7s";
        //增加平滑过渡的效果后相当于增加了动画，有动画就会有积累，所以的清一下
        /*
        清动画的
        * function(e){
         if(e.target.tagName == "LI"){
         this.style.webkitTransition = "";
         }
        * */
        oLis[this.prevsIndex].addEventListener("webkitTransitionEnd",function(e){
            if(e.target.tagName == "LI"){
                this.style.webkitTransition = "";
            }
            //给下一张增加li里面的小动画
            this.firstElementChild.id="a"+(this.index+1);
        },false)
    }

}
/*
document.addEventListener("touchmove",function(e){
    console.log(e.target.id);
},false)
*/

window.addEventListener("load", function () {
    //init music
    var music = document.querySelector(".music");
    var musicAudio = music.querySelector("audio");

    //canplay:音频资源文件已经加载一部分,可以播放了
    //canplaythrough:音频文件已经全部加载完成,播放不会出现卡顿
    musicAudio.addEventListener("canplay", function () {
        music.style.display = "block";
        music.className = "music move";
    }, false);
    musicAudio.play();

    $t.tap(music, {
        end: function () {
            if (musicAudio.paused) {
                musicAudio.play();
                music.className = "music move";
                return;
            }
            musicAudio.pause();
            music.className = "music";
        }
    });
}, false);