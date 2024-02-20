const host_name = document.location.origin + "/NetEase";

addCommand = (str, json) => {
    let props = Object.getOwnPropertyNames(json);
    for (let i = 0; i < props.length; i++) {
        let symbol = (i === 0) ? "?" : "&";
        str += `${symbol}${props[i]}=${json[props[i]]}`;
    }
    return str;
};

class Song {
    constructor(index, albumImgPath, name, singer, albumName, time, id, liked = false) {
        this.index = index;
        this.albumImgPath = albumImgPath;
        this.albumName = albumName;
        this.name = name;
        this.singer = singer;
        this.time = time;
        this.id = id;
        this.liked = liked;

        let likeClass = liked ? "like liked" : "like";
        this.node =
            $(`<div class="list-layout list-item" id="${id}">
            <div>${index}</div>
            <div class="main-item">
                <img src="${albumImgPath}" class="album-pic-sm">
                <div style="display: flex; flex-direction: column;">
                    <span class="song-name">${name}</span>
                    <span class="author">${singer}</span>
                </div>
            </div>
            <div>${albumName}</div>
            <div class="${likeClass}"></div>
            <div>${time}</div>
        </div>`);
        return this;
    }
    add(dom = document.body) {
        $(dom).apd(this.node);
        return this;
    }
    setClick(fn) {
        this.node.clicker(fn);
        return this;
    }
};

let ne = {
    ports: {
        // 登录
        login_phone: "http://codeman.ink/api/login/cellphone",
        send_captcha: "http://codeman.ink/api/captcha/sent",
        check_captcha: "http://codeman.ink/api/captcha/verify",
        login_status: "http://codeman.ink/api/login/status",
        // 搜索相关
        hot_search: "http://codeman.ink/api/search/hot",
        search: "http://codeman.ink/api/search",
        // banner
        banners: "http://codeman.ink/api/banner",
        // 歌单相关
        official: "http://codeman.ink/api/personalized",
        recommend: "http://codeman.ink/api/recommend/resource",
        list_detail: "http://codeman.ink/api/playlist/detail",
        // 歌曲详情
        songDetail: "http://codeman.ink/api/song/detail",
        songUrl: "http://codeman.ink/api/song/url/v1",
        lyric: "http://codeman.ink/api/lyric",
        comment: "http://codeman.ink/api/comment/music",
    },

    /**
     * @param {Number} num 
     * @param {Boolean} code false为播放量，true为歌曲时长毫秒
     * @returns {String}
     */
    format: (num, code = false) => {
        if (code == true) {
            let durInt = Math.round(num / 1000);
            let sec = durInt % 60, min = (durInt - sec) / 60;
            let checkTime = function (x) { return (x < 10) ? "0" + x : x; };
            return `${checkTime(min)}:${checkTime(sec)}`;
        } else {
            return num > 10000 ? `${String((num / 10000).exFixed(1))}万` : String(num);
        }
    },
    /**
     * @param {String} url @returns {Promise}
     */
    request: async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    },
};

const { ports } = ne;