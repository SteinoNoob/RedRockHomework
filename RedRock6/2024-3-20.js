"use strict";

/**
 * 防抖优化input:text 基于时间戳
 * @param {Function} fn 
 * @param {number} ms 
 * @returns {Function}
 */

const input_debounce = function (fn,ms){
    let timer = null;
    let unix = 0;    
    return function (...args) {
        if(Date.now() - unix < ms && unix != 0) { // 未触发事件且非第一次
            unix = Date.now();
            clearTimeout(timer);
        }
        unix = unix || Date.now();
        timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
            unix = Date.now();
        },ms);
    }
};

/**
 * 节流优化input:text 基于时间戳 
 * @param {Function} fn 
 * @param {number} ms 
 * @returns {Function}
 */

const input_throttle = function (fn, ms = 1000) {
    let inited = true, unix = 0, timer = null;
    return function (...args) {
        if (inited) {
            unix = Date.now();
            fn.apply(this, args);
            timer = setTimeout(() => {
                unix = 0;
                inited = true;
                clearTimeout(timer);
            }, ms);
            return inited = false;
        }
        if (Date.now() - unix < ms) {
            return false;
        }
    }
};

const input_action = function () {
    console.log("hello");
};

// DOM部分

$("input").css({
    width: "70vw",
    height: "30px",
    border_radius: "6px",
    display: "block",
    margin: "50px auto 0 auto",
    font_size: "large"
});

$("input")[0].on("keydown", input_debounce(input_action, 2000));

$("input")[1].on("keydown", input_throttle(input_action, 2000));