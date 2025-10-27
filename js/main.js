"use strict";

var wishes = [
    "嗯？",
    "这道题超纲了吗，没有超纲！",
    "英雄落泪",
    "计算机数学双学位",
    "著名的六加一等于零理论",
    "著名的五加一等于零理论",
    "国考改革对你们钱班影响最大...我对你们最好了",
    "数学（xie）就是这么难",
    "都是你们初中的知识，哪有我高中的",
    "这道题考的是你初中的基本功",
    "晚自习70%的时间都要学数学，不是学你那个英语",
    "数学（xie）就是螺旋式上升",
    "（集合）只是载体而已",
    "难道你不知道老师出这道题的本质吗",
    "老师出这道题的本质是",
    "微笑是宏翔的语言，快乐是宏翔的生活，激情是宏翔的动力，卓越是宏翔的追求。身为一名宏翔学生，我在此庄严宣誓:学习是我的天职，报国是我的志向。牢记师长教诲，严守法律校纪。用激情点燃自我，用汗水浇灌学业，用坚韧挑战极限，用自信铸就辉煌。--考上大学是去往天堂，宏翔就是我的天路--（存疑）。我坚信我一定能为自己创造奇迹。",
    "课本学一半，高考考什么？考另一半，另一半干嘛，自己推",
    "你们英语那么厚一本维词都背的下来，背几个公式很难吗？",
    "仅供参考",
    "平行班的老师都是单脑的...他们头发哪有我这么白啊",
    "福安一中从来不会考虑霞浦一中教到哪里！",
    "几个事情通知一下",
    "今天天气热，是你们自己的原因造成的",
    "钱班的学生应该在上课的时候把政治历史全背掉...这些东西是给你们上课的时候念的",
    "好（/来），准备一下",
    "语文，英语都是临时背的，课堂上背的...钱班晚自修至少要腾1~2小时给数学，语文、英语、生物靠边站",
    "语文，生物最高分都不一定在一、二两班，后面平行班花大量时间学语文、英语、生物",
    "化学导学案会背就好了，LJ要抓给他抓",
    "这四位同学打入冷宫！",
    "平行班十五节上完，我又要多上节...钱班没办法",
    "年轻时我也上过平行班",
    "985，211差80分，你考虑一下呐",
    "只有你适应我，没有我适应你",
    "走进来一股早（升调）餐（升调）味（降调）",
    "你是理科生，如果你在文学道路上走得远的话，那你就是牛B的理科生",
    "让你感受数学的小型综合，嗯？",
    "这个图形看起来有点不标准是不是, 嗯？——没事，我看的明白就行",
    "很简单对吧，所以这就是我教一班二班的成就感",
    "好（轻松），Ok。你看这个多好玩",
    "走进来真的是什么味道都有",
    "三班的味道跟去年三班的一样",
    "从今天开始进入解析几何，不再是小打小闹...现在，头扭过来学通性通法",
    "数学真好学",
    "（你的书）盗版的...我的书是盗版的？...我的书怎么是2026年12月版的",
    "你看，我语文多好，林菁老师都没我讲得清楚，不行你去问（自信）",
    "你们那个培尖班就应该补充这个",
    "美哉！多简单，小学生玩的",
    "（方法）任君选择",
    "这份卷子不难我不讲评，你们自己订正，明天我上新课",
    "数学就是这么快",
    "化学是最难的，卷子是乱出的",
    "语文是走江湖的，尤其是写作文",
    "抽象函数，不难只是抽象",
    "理解这个含义Yi"
];
var api_url = ''; // 上传数据的url
function isOnline() { return (typeof api_url == "undefined" || api_url == "" || api_url == "null" || api_url == null) ? false : true; }

var container = document.querySelector(".container");
var zindex = 1;

//将Cookie储存的数据放出
function addCookieData() {
    if (getCookieLength() === 0) { return; }
    //没有数据  

    //拆分 cookie 字符串
    var cookieArr = document.cookie.split(";");

    //循环遍历数组元素
    for (var i = 0; i < cookieArr.length; ++i) {
        var cookiePair = cookieArr[i].split("=");
        if (cookiePair[0][0] === ' ')
            cookiePair[0] = cookiePair[0].slice(1);

        // 跳过不是以data开头的Cookie
        if (!cookiePair[0].startsWith("data")) continue;

        // 剔除重复数据
        const wishContent = decodeURIComponent(cookiePair[1]);
        if (!wishes.some(wish => wish === wishContent)) {
            creatWish(wishContent); // 不重复再加入
        }
    }
}

// 创建一个愿望
function creatWish(words) {
    var div = document.createElement("div");
    // 设置文字
    div.innerHTML = htmlEscape(words); // 转义下，防止xss
    div.className = "item";
    // 点击事件，让下层的盒子成为第一层的盒子
    div.onclick = function () {
        div.style.zIndex = zindex;
        ++zindex;
    };
    // 关闭按钮
    var span = document.createElement("span");
    span.className = "close";
    span.innerHTML = "X";
    div.appendChild(span);
    // 颜色随机
    div.style.background = `rgb(${getRandom(150, 256)},${getRandom(150, 256)},${getRandom(150, 256)})`;
    // 位置随机
    var max_X = window.innerWidth - div.offsetWidth - 40; // 修改: 减少40像素边距
    var max_Y = window.innerHeight - div.offsetHeight - 40; // 修改: 减少40像素边距
    div.style.left = `${getRandom(0, max_X)}px`;
    div.style.top = `${getRandom(0, max_Y)}px`;
    // 关闭事件
    span.onclick = function () {
        var r = confirm("确定删除这个标签？");
        if (r === true) {
            console.log('删除了一个数据');
            container.removeChild(div);
        }
    };
    container.appendChild(div);

    // 拖动功能
    interact(div)
        .draggable({
            listeners: {
                move: function (event) {
                    var target = event.target;
                    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

                    target.setAttribute('data-x', x);
                    target.setAttribute('data-y', y);

                    div.style.zIndex = zindex;
                    ++zindex;
                }
            }
        });

    console.log("数据 \"", words, "\" 添加成功");
}

// 提交数据到服务器
function submitData(words) {
    if (!isOnline()) return;

    // 发送数据到服务器
    $.ajax({
        url: api_url + "/api/post",
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({ data: words }),
        contentType: 'application/json',
        success: function (data) {
            console.log(words + ' 提交成功');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('提交数据失败————Error:', textStatus, errorThrown);
        }
    });
}

// 从服务器获取数据
function getBoxsFromServer(Callback) {
    if (!isOnline()) { Callback(); return; }

    $.ajax(
        {
            url: api_url + "/api/getBoxs",
            type: "GET",
            success: function (data, req) {
                wishes = [];
                for (let i = data.length - 1; i >= 0; --i) {
                    wishes.push(data[i].content);
                }
                Callback();
            },
            error: function (err) {
                console.error("无法从服务器获取Box，err：" + err.statusText)
                Callback();
            },
            dataType: "json"
        });
}

// 生成愿望
function init(Callback = () => { }) {
    // 更新数据
    getBoxsFromServer(() => {
        // 添加Boxs
        wishes.forEach(wish => creatWish(wish));
        addCookieData();
        Callback();
    })
}
