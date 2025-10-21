"use strict";

var wishes = ["Rikka 版权所有","嗯？","这道题超纲了吗，没有超纲！","英雄落泪","我计算机双学位","著名的六加一等于零理论","国考改革对你们钱班影响最大，我对你们最好了","数学（xie）就是这么难","都是你们初中的知识，哪有我高中的","晚自习70%的时间都要学数学，不是学你那个英语","数学（xie）就是螺旋式上升","（集合）只是载体而已","难道你不知道老师出这道题的本质吗","难道你不知道老师出这道题的本质吗","微笑是宏翔的语言，快乐是宏翔的生活，激情是宏翔的动力，卓越是宏翔的追求。身为一名宏翔学生，我在此庄严宣誓:学习是我的天职，报国是我的志向。牢记师长教诲，严守法律校纪。用激情点燃自我，用汗水浇灌学业，用坚韧挑战极限，用自信铸就辉煌。考上大学是去往天堂，宏翔就是我的天路。我坚信我一定能为自己创造奇迹。","课本学一半，高考考什么？考另一半，另一半干嘛，自己推","你们英语那么厚一本维词都背的下来，背几个公式很难吗？","老师安排这道题的本质，就是为了告诉你","仅供参考"];
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
