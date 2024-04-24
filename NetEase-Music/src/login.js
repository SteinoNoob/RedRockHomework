import $ from "./jquery.fake"
import {addCommand, Song, ne, ports} from "./net-request"
import "./css/login.css"

    $("#tick").clicker(() => $("#tick").toggle("tick2"));
    $("a")[1].clicker(() => {
        ne.request(addCommand(ports.qr_key, { timestamp: Date.now() })).then((json) => {
            let qrCode = addCommand(ports.qr_create, {
                key: json.data.unikey,
                qrimg: true,
                timestamp: Date.now()
            });
            ne.request(qrCode).then((qrJson) => {
                let qr = $("<img>").addClass("qr-code").attr("src", qrJson.data.qrimg);
                $("#mylogin>*:not(svg)").hide();
                $("#mylogin").apd(qr).plus("<div>使用网易云app扫码登录</div>");
            });
            return json;
        }).then((json) => {
            let time1 = Date.now();
            let loop = setInterval(() => {
                ne.request(addCommand(ports.qr_check, {
                    key: json.data.unikey,
                    noCookie: true,
                    timestamp: Date.now()
                })).then((resMsg) => {
                    let time2 = Date.now();
                    if ((resMsg.code === 803 || resMsg.code === 502) && time2 - time1 <= 300000) {
                        location.href = `./homepage.html`;
                        clearInterval(loop);
                    }
                }).catch(() => clearInterval(loop));
            }, 1000);
        });
    });
