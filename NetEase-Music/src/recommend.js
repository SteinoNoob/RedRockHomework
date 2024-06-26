import {addCommand, Song, ne, ports} from "./net-request"
import $ from "./jquery.fake"
import "./css/recommend.css"

/** 歌单页曲目加载异步方法
 * @param {String} src 请求口
 */
function songLoadForListPage (src) {
    parent.frame.open(parent.frame.songs);
    let { body } = $("iframe.selected", parent.document)[0].contentDocument;
    while ($(".list-item", body).length > 0) {
        $(body).removeChild($(".list-item", body)[0]);
    }
    ne.request(src).then(json => {
        // 填DOM
        let { tracks: songs } = json.playlist;
        for (let i = 0; i < (songs.length >= 30 ? 30 : songs.length); ++i) {
            const each = songs[i];
            let index = (i + 1 < 10) ? "0" + (i + 1) : i + 1,
                { name } = each,
                singer = each.ar[0].name,
                albumName = each.al.name,
                { id } = each,
                song = new Song(index, "", name, singer, albumName, ne.format(each.dt, true), id);
            $(".like", song.node).clicker((a) => a.target.toggle("liked"));
            song.add(body);
        }
        $("#songs-top img", body)[0].src = json.playlist.coverImgUrl;
        $("#topic span", body)[0].ins(json.playlist.name);
        $("#topic a", body)[0].ins(`<img src="${json.playlist.creator.avatarUrl}" alt="">${json.playlist.creator.nickname}`);
        return json;
    }).then(json => {
        // 加载图片
        const { tracks: songs } = json.playlist;
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
            let $outer = (a) => $(a, parent.document.body);
            // 点击事件分为：换歌曲信息，改播放源，加载歌词，加载评论数量
            item.on("dblclick",() => {
                let singl = json.playlist.tracks[i];
                // 1st 换源
                ne.request(addCommand(ports.songUrl, { id: singl.id.toString(), level: "higher" })).then(urlJson => {
                    $outer("source")[0].src = urlJson.data[0].url;
                    parent.player.audio.pause();
                    parent.player.audio.load();
                });
                // 2nd DOM操作
                $outer("span#title").ins(singl.name);
                $outer("span#author").ins(singl.al.name);
                $outer("#album img")[0].src = $("img", item)[0].src;
                $outer("#song-name").ins(singl.name);
                $outer("#inf span")[0].ins(`专辑：${singl.al.name}`);
                $outer("#inf span")[1].ins(`歌手：${singl.ar[0].name}`);
                $outer("#play-pg").css({ background_image: `url("${$outer("#album img")[0].src}")` });
                parent.img.src = $outer("#album img")[0].src;
                // 3rd 请求歌词
                ne.request(addCommand(ports.lyric, { id: singl.id.toString() })).then((lrcJson) => {
                    let str = lrcJson.lrc.lyric;
                    let wordsLrc = str.split("\n").map((i) => i.replace(/\[\d\d:\d\d.\d+\]\s*/, ""));
                    $outer("#lyrics").ins("");
                    wordsLrc.forEach((i) => $outer("#lyrics").plus(`<span class="single-line">${i}</span>`));
                });
                //4rd 加载评论
                ne.request(addCommand(ports.comment, { id: singl.id.toString() })).then((json) => {
                    $outer(".fn-icon sup")[0].ins(json.total.toString());
                    let { body } = $outer("iframe")[parent.frame.comment].contentDocument,
                        cmts = json.hotComments.length ? json.hotComments : json.comments;
                    while ($("#hot-comment .comment-box", body).length > 0) {
                        $("#hot-comment",body).removeChild($("#hot-comment .comment-box", body)[0]);
                    }
                    cmts.forEach((everyC) => {                                
                        let nodeForComment = $(`
                        <div class="comment-box">
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
                        </div>`);
                        $("#thumb", nodeForComment).clicker((a) => { a.target.toggle("clicked"); });
                        $("#head p", body).ins($outer("#song-name").ins());
                        // 0专辑，1歌手
                        $("#head span", body)[0].ins($outer("#inf span")[0].ins());
                        $("#head span", body)[1].ins($outer("#inf span")[1].ins());
                        $("#head img", body)[0].src = $outer("#album img")[0].src;
                        $("#hot-comment", body).apd(nodeForComment);
                    });
                });
            });
        });
    });
};

function start() {
    let indexArr = [], posters = $(".slides");
    for (let i = 0; i < posters.length; i++) { indexArr[i] = i; }
    /**
     * @param {Boolean} bool true左false右
     * @return {number[]}*/
    let turn = (bool, num = 2) => {
        if (!bool) {
            for (let i = 0; i < num; ++i)
                indexArr.push(indexArr.shift());
        } else {
            for (let i = 0; i < num; ++i)
                indexArr.unshift(indexArr.pop());
        }
        return indexArr;
    }
    $("#pref").clicker(() => {
        let newArr = turn(1);
        for (let n = 0; n < newArr.length; n++) {
            if (n < 2) {
                posters[newArr[n]].css("d", "flex");
            } else {
                posters[newArr[n]].hide();
            }
            $("#slider-box>div")[0].appendChild(posters[newArr[n]]);
        }
    });

    $("#next").clicker(() => {
        let newArr = turn();
        for (let n = 0; n < newArr.length; n++) {
            if (n < 2) {
                posters[newArr[n]].css("d", "flex");
            } else {
                posters[newArr[n]].hide();
            }
            $("#slider-box>div")[0].appendChild(posters[newArr[n]]);
        }
    });

    let initSlides = () => {
        $(".slides")[0].css("d", "flex");
        $(".slides")[1].css("d", "flex");
    }

    initSlides();
};

// banner加载
(function () {
    let promise = ne.request(ports.banners);
    promise.then((json) => {
        json.banners.forEach(pic => {
            let img = $("<img>").addClass("slides").attr("src", pic.imageUrl).clicker(() => {

            });
            $("#slider-box div")[0].apd(img);
        });
    }).then(start);
})();

// 加载歌单
(function () {
    let promise = ne.request(ports.official);
    promise.then((json) => {
        json.result.forEach(detail => {
            let node =
                $(`<div class="list-card">
        <span>
            <span class="view-count">&#xf04b; ${ne.format(detail.playCount)}</span>
        </span>
        <div>${detail.name}</div>
    </div>`).css({ background_image: `url('${detail.picUrl}')` }).clicker(() => {
                    let src = addCommand(ports.list_detail, { id: `${detail.id.toString()}` });
                    songLoadForListPage(src);
                });
            $("#list-official").apd(node);
        });
    })
})();
