import $ from "./jquery.fake"
import "./css/user.css"

$(".nav-option").clicker(e=>{
    $(".nav-option").removeClass("selected");
    e.target.addClass("selected");
});