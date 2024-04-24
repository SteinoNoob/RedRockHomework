import $ from "./jquery.fake"
import "./css/songs.css"

$(".like").clicker(a => a.target.toggle("liked"));
