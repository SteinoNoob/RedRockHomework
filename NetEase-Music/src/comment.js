import $ from "./jquery.fake"
import "./css/comment.css"


$(".comment-icon>input").clicker(() => {
    let t = new Date();
    let node = $(`
        <div class="comment-box">
            <div id="user-avatar">
                <img src="" alt="" />
            </div>
            <div id="comment-word">
                <div style="color: #0c73c2;">游客</div>
                <div>${$("input[type='text']")[0].val()}</div>
                <div id="date">${t.getFullYear().toString()}/${(t.getMonth()+1).toString()}/${t.getDate().toString()}</div>
            </div>
            <div id="comment-fn">
                <input type="button" value="&#xf164;" id="thumb">
                <input type="button" value="&#xf064;">
                <input type="button" value="&#xf4ad;">
            </div>
        </div>`);
    $("#hot-comment").apd(node);
    $("input[type='text']").val("");
});