// 默认封面图片
var img = new Image();
img.src = host_name + "/pictures/logo-original.svg";
$("#album img")[0].src = host_name + "/pictures/logo-original.svg";

// 方法和变量
var frame = {
    hashArray: ["recommend", "comment", "user", "search-result", "songs", "edit-info"],
    recommend: 0,
    comment: 1,
    user: 2,
    searchResult: 3,
    songs: 4,
    editInfo: 5,
    open: (index) => {
        $("iframe").removeClass("selected");
        $("iframe")[index].addClass("selected");
    }
};
/** 搜索页曲目加载异步方法
 * @param {String} src 请求口
 */
songLoadForSearchPage = (src) => {
    frame.open(frame.searchResult);
    let { body } = $("iframe.selected")[0].contentDocument;
    while ($(".list-item", body).length > 0) {
        $(body).removeChild($(".list-item", body)[0]);
    }
    ne.request(src).then(json => {
        // 填DOM
        let { songs } = json.result;
        for (let i = 0; i < (songs.length >= 30 ? 30 : songs.length); ++i) {
            const each = songs[i];
            let index = (i + 1 < 10) ? "0" + (i + 1) : i + 1,
                { name } = each,
                singer = each.artists[0].name,
                albumName = each.album.name,
                { id } = each,
                song = new Song(index, "", name, singer, albumName, ne.format(each.duration, true), id);
            $(".like", song.node).clicker((a) => a.target.toggle("liked"));
            song.add(body);
        }
        $("strong", body).ins($("#top-searchbox").val());
        $("strong~span", body).ins(String(json.result.songCount));
        $("#top-searchbox").val("");
        return json;
    }).then(json => {
        // 加载图片
        const { songs } = json.result;
        for (let i = 0; i < (songs.length >= 30 ? 30 : songs.length); ++i) {
            const each = songs[i];
            ne.request(addCommand(ports.songDetail, { ids: String(each.id) })).then((detail) => {
                let imgsrc = detail.songs[0].al.picUrl;
                $("img", body)[i].src = imgsrc;
            });
        }
        return json;
    }).then((json) => {
        $(".list-item", body).each((item, i) => {
            // 点击事件分为：换歌曲信息，改播放源，加载歌词，加载评论数量
            item.on("dblclick", () => {
                let singl = json.result.songs[i];
                // 1st 换源
                ne.request(addCommand(ports.songUrl, { id: singl.id.toString(), level: "higher" })).then(urlJson => {
                    $("source")[0].src = urlJson.data[0].url;
                    player.audio.pause();
                    player.audio.load();
                });
                // 2nd DOM操作
                $("span#title").ins(singl.name);
                $("span#author").ins(singl.album.name);
                $("#album img")[0].src = $("img", item)[0].src;
                $("#song-name").ins(singl.name);
                $("#inf span")[0].ins(`专辑：${singl.album.name}`);
                $("#inf span")[1].ins(`歌手：${singl.artists[0].name}`);
                $("#play-pg").css({ background_image: `url("${$("#album img")[0].src}")` });
                img.src = $("#album img")[0].src;
                // 3rd 请求歌词
                ne.request(addCommand(ports.lyric, { id: singl.id.toString() })).then((lrcJson) => {
                    let str = lrcJson.lrc.lyric,
                        lrcReg = /^\[(\d\d:\d\d.\d\d)\d*.*\]\s*(.+)/g,
                        points = [],
                        wordsLrc = str.split("\n").map((i) => i.replace(lrcReg, ($0, $1, $2) => { points.push(ne.lrcMark($1)); return $2; }));
                    // let interval=setInterval(()=>{
                    //     for(let i=0;i<points.length;++i){
                    //         // 秒数相等
                    //         if(player.audio.currentTime.exFixed(1)===points[i].exFixed(1)){
                    //             let ly=$("#lyrics");
                    //             ly.scrollTop=i*50.8;
                    //         }
                    //     }
                    // },200);
                    $("#lyrics").ins("");
                    wordsLrc.forEach((i) => $("#lyrics").plus(`<span class="single-line">${i}</span>`));
                });
                //4rd get评论数量，加载评论
                ne.request(addCommand(ports.comment, { id: singl.id.toString() })).then((json) => {
                    $(".fn-icon sup")[0].ins(json.total.toString());
                    let { body } = $("iframe")[frame.comment].contentDocument,
                        cmts = json.hotComments.length ? json.hotComments : json.comments;
                    while ($("#hot-comment .comment-box", body).length > 0) {
                        $("#hot-comment", body).removeChild($("#hot-comment .comment-box", body)[0]);
                    }
                    cmts.forEach((everyC) => {
                        let nodeForComment = $(
                            `<div class="comment-box">
                                    <div id="user-avatar">
                                        <img src="${everyC.user.avatarUrl}" alt="" />
                                    </div>
                                    <div id="comment-word">
                                        <div style="color: #0c73c2;">${everyC.user.nickname}</div>
                                        <div>${everyC.content}</div>
                                        <div id="date">${everyC.timeStr}</div>
                                    </div>
                                    <div id="comment-fn">
                                        <input type="button" value="&#xf164;" id="thumb">
                                        <input type="button" value="&#xf064;">
                                        <input type="button" value="&#xf4ad;">
                                    </div>
                                </div>`
                        );
                        $("#thumb", nodeForComment).clicker((a) => { a.target.toggle("clicked"); });
                        $("#head p", body).ins($("#song-name").ins());
                        // 0专辑，1歌手
                        $("#head span", body)[0].ins($("#inf span")[0].ins());
                        $("#head span", body)[1].ins($("#inf span")[1].ins());
                        $("#head img", body)[0].src = $("#album img")[0].src;
                        $("#hot-comment", body).apd(nodeForComment);
                    });
                })
            });
        });
    });
};

var player = {
    audio: $("audio")[0],
    bar: $("#progress"),
    loop: () => {
        var interval = setInterval(() => {
            if (!player.audio.paused) {
                player.bar.val(Math.round(player.audio.currentTime).toString());
            } else {
                clearInterval(interval);
            }
        }, 1000);
    },
};

// 绘制唱片
function draw(img) {
    let canvas = $("#canvas");
    let ctx = canvas.getContext("2d");
    let border_w = 20;

    canvas.width = canvas.height = 400;

    let a = canvas.width;
    ctx.translate(a / 2, a / 2);
    ctx.clearRect(-a / 2, -a / 2, a, a);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.save();

    ctx.beginPath();
    ctx.arc(0, 0, a / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.save();

    ctx.beginPath();
    ctx.arc(0, 0, a / 2 - border_w, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    for (let i = 1; i <= 10; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, a / 2 - border_w - i * 5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(0, 0, a / 2 - border_w - 70, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, -a / 2, -a / 2, a, a);

};

// 热搜加载
(function () {
    let hotData = ne.request(ports.hot_search);
    hotData.then((json) => {
        json.result.hots.forEach((item, index) =>
            $("#hint-box").plus(`<div><span>${index + 1}</span>${item.first}</div>\n`)
        );
    }).then(() => {
        $("#hint-box div").each((i) => {
            i.on("mouseover", () =>
                $("#top-searchbox").val(i.childNodes[1].data)
            )
        })
    });
})();

/* 自此开始，批量给DOM添加事件 */
// 检查登录状态
// $(document).ready(()=>{
//     ne.request(ports.login_status).then()
// });

// 唱片刷新
$(img).on("load", (e) => draw(e.target));

// 播放页面上升动画
$("#album").clicker(() => $("#play-pg").toggle("animated"));

// player部分
player.audio.on("loadedmetadata", () => {
    let len = player.audio.duration;
    player.bar.max = len;
}).on("play", () => {
    $(".playbtn")[2].val("\uf04c");
    $("#canvas").addClass("animated");
}).on("pause", () => {
    $(".playbtn")[2].val("\uf04b");
    $("#canvas").removeClass("animated");
});

player.bar.on("change", () => {
    if (!player.audio.paused) {
        player.audio.pause();
        player.audio.currentTime = player.bar.val();
        player.audio.play();
    } else {
        player.audio.currentTime = player.bar.val();
    }
});

$(".playbtn")[2].clicker(() => {
    (!player.audio.paused) ? player.audio.pause() : player.audio.play();
    player.loop();
});
// 音量
$("#volume").on("input", () => {
    let icon = $("span.fn-icon")[0];
    player.audio.volume = $("#volume").val();
    if (player.audio.volume == 0) {
        icon.ins("\uf6a9");
    } else {
        icon.ins("\uf6a8");
    }
});

$("span.fn-icon")[0].clicker(() => {
    let bar = $("#vol-box");
    let display = bar.style.display;
    if (display == "flex") {
        bar.hide();
    } else {
        bar.css("d", "flex");
    }
});
// 评论按钮
$(".fn-icon")[1].clicker(() => {
    let f = $("iframe")[frame.comment];
    if (!f.classList.contains("selected")) {
        f.addClass("selected");
    } else {
        f.removeClass("selected");
    }
});
// 右侧边栏曲目卡
$(".side-card").each((ele) =>
    ele.clicker(() => {
        $(".side-card").removeClass("selected");
        ele.addClass("selected");
    })
);

$(".fn-icon")[2].clicker(() => $("#side-bar").toggle("selected"));
// 收藏
$("a.select.sideico")[0].clicker(() => {
    frame.open(frame.songs);
    ne.request(ports.login_status).then((json) => {
        console.log(json);
    })
});
// 搜索
$("#top-searchbox")
    .on("focus", () => $("#hint-box").addClass("selected"))
    .on("blur", () => $("#hint-box").removeClass("selected"))
    .on("keypress", e => {
        if (e.keyCode === 13) {
            $("#hint-box").removeClass("selected");
            $("#top-searchbox").blur();
            let src = addCommand(ports.search, { keywords: e.target.val() });
            songLoadForSearchPage(src);
        }
    });

// 左侧边栏
$(".select")[0].clicker(() => frame.open(frame.recommend));

$(".select").each((i) => {
    i.clicker(() => {
        $(".select").removeClass("selected");
        i.addClass("selected");
    })
});

