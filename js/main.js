"use strict";

var TempData = document.cookie;
var api_url = 'https://xuanyuanchi.glitch.me'; // 上传数据的url

var container = document.querySelector(".container");
var zindex = 1;

// -+--+--+--+--+--+-
// -+--+--+--+--+--+-
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("?");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
}

//传入html字符串源码，进行转码
function htmlEscape(text) { return text.replace(/[<>"&'/]/g, function (match, pos, originalText) { switch (match) { case "<": return "&lt;"; case ">": return "&gt;"; case "&": return "&amp;"; case "\"": return "&quot;"; case "'": return "&#x27;"; case "/": return "&#x2F;" } }) }

//将临时储存的数据放出
function addCookieData() {
    if (getCookieLength() === 0) { return; }
    //没有数据  

    //拆分 cookie 字符串
    var cookieArr = document.cookie.split(";");

    // 循环遍历数组元素
    for (var i = 0; i < cookieArr.length; ++i) {
        var cookiePair = cookieArr[i].split("=");

        // 检查cookie名称是否以data开头
        if (cookiePair[0].startsWith("data")) {
            // 是否有重复数据
            let IsR = false;
            for (let j = 0; j < wishes.length; ++j) { // 注意这里将变量名i改为j避免冲突
                if (decodeURIComponent(cookiePair[1]) === wishes[j].content) {
                    // 有重复数据
                    IsR = true;
                    break;
                }
            }
            if (!IsR) creatWish(decodeURIComponent(cookiePair[1]), 0);
        }
    }
}

document.addEventListener('touchmove', function (event) {
    event.preventDefault();
}, { passive: false });
// 创建一个愿望
function creatWish(words, ty) {
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
                }
            }
        });

    console.log("数据 \"", words, "\" 添加成功，该数据type为：", ty);

    // 将数据发送至服务器
    if (ty == 1) {
        submitData(words);
        return;
    }
}

// 发送数据到服务器
function submitData(words) {
    fetch(api_url + "/api/post", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: words }),
    })
        .then(response => response.text())
        .then(data => {
            console.log('Success:', data);
            // 加cookie
            document.cookie = "data" + getCookieLength().toString() + "=" + words;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

//产生随机数
function getRandom(min, max) { var dec = (max - min); return Math.floor(Math.random() * dec + min) }

// 生成默认愿望
function init(Callback = () => { }) {
    $.ajax(
        {
            url: api_url + "/api/getBoxs",
            type: "GET",
            success: function (data, r) {
                wishes = [];
                for (let i = data.length - 1; i >= 0; --i) {
                    wishes.push(data[i]);
                    creatWish(data[i].content, 0)
                }
                addCookieData()
                Callback();
            },
            error: function (err) { Callback(); },
            dataType: "json"
        });
}

// 检测权限，执行不同方式
function updateWords(words) {
    // 因为要跳转，所以有makeloading
    makeloading();
    let VerifyData = getCookie("authentication_answer") ? getCookie("authentication_answer") : "{}";
    if (VerifyData == "{}") {
        window.location = "https://ming-14.github.io/cardwall-pages/authentication.html?notifications=2&notifications_content=%E8%AF%B7%E8%BF%9B%E8%A1%8C%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81&__from__=" + escape(window.location) + "&__value__=" + escape(txt.value);
        return;
    }
    $.ajax({
        url: "https://cardwall-api.glitch.me/" + "/api/check",
        data: unescape(VerifyData),
        type: "POST",
        contentType: "application/json",
        success: function (response, status) {
            if (response.code === 200) {
                removeloading();
                if (!response.data) {
                    window.location = "https://ming-14.github.io/cardwall-pages/authentication.html?notifications=2&notifications_content=%E8%AF%B7%E8%BF%9B%E8%A1%8C%E8%BA%AB%E4%BB%BD%E9%AA%8C%E8%AF%81&__from__=" + escape(window.location) + "&__value__=" + escape(txt.value);
                } else {
                    // 删掉输入框原有内容
                    document.getElementById("wish").value = "";
                    creatWish(words + "/add", 1);
                }
            }
        },
        error: function (err) {
            removeloading();
        }
    });
}

//文本框的回车事件
var txt = document.querySelector(".txt");
txt.onkeydown = function (e) {
    if (e.keyCode !== 13) { //判断是否回车
        return;
    } else
        if (txt.value) {
            updateWords(txt.value);
        }
}

// 删除Cookie处理函数
function handleClearCookies() {
    var cookieLength = getCookieLength();
    clearAllCookie();
    if (document.cookie === '')
        alert('Ok，' + '删除了' + cookieLength.toString() + '个Cookie');
    else
        alert('Error');
}

// 添加音乐播放器处理函数
function addMusicPlayer() {
    var body = document.getElementsByTagName('body')[0];
    var div = document.createElement('div');
    div.innerHTML = '<iframe frameborder=\'no\' border=\'0\' marginwidth=\'0\' marginheight=\'0\' width=330 height=86 src=\'https://music.163.com/outchain/player?type=2&id=492390949&auto=1&height=66\'></iframe>';
    body.appendChild(div);
    window.setInterval(function () { document.getElementById('addMusic').style.display = 'none'; }, 350);
}

// 刷新盒子，BoxLock是防重刷锁
var BoxLock = false;
function reloadBox() {
    if (BoxLock) return;
    BoxLock = true;

    // 删除document.querySelector(".container")里面的所有内容
    var container = document.querySelector(".container");
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // 重新加载数据
    init(() => { BoxLock = false; });
}

// 进入界面是检测用户是否有权限上传语录
// 如果有，把提示词改成当前可以上传语录
// 如果没有，就改成上传语录（需要验证权限）
(function () {
    let VerifyData = getCookie("authentication_answer") ? getCookie("authentication_answer") : "{}";
    if (VerifyData == "{}") {
        document.getElementById("wish").placeholder = "上传语录（需要验证权限）";
        return;
    }
    $.ajax({
        url: "https://cardwall-api.glitch.me" + "/api/check",
        data: unescape(VerifyData),
        type: "POST",
        contentType: "application/json",
        success: function (response, status) {
            if (response.code === 200) {
                removeloading();
                if (!response.data) {
                    document.getElementById("wish").placeholder = "上传语录（需要验证权限）";
                } else {
                    document.getElementById("wish").placeholder = "当前可以上传语录";
                }
            }
        },
        error: function (err) {
        }
    });
})();

(function () {
    // if(getQueryVariable("__value__"))
    // document.getElementById("wish").value = decodeURIComponent(getQueryVariable("__value__"));
})();