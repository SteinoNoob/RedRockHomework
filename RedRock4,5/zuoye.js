//解构
const obj={
    name: "ZHW",
    age: 10000,
    nb_value: Infinity
}
let {name}=obj;
let {nb_value}=obj;
let {log}=console;

//阶乘
Math.fact=function (num) {
	if (num===0||num===1) return 1;
	else if (num<0) throw new Error("计算无效");
	else return num*this.fact(num-1);		
};
//阶乘（2）
Math.fact_new=function(num){
    if (num===0||num===1) return 1;
    else if (num<0) throw new Error("计算无效");
    else{
        for(let i=num-1;i>0;--i){
            num*=i;
        }
        return num;
    }
}
log(name,nb_value,Math.fact(5),Math.fact_new(5));
//方差（旧语法）
Array.prototype.avg=function () {
	var x=0;
	for (var u=0;u<this.length;u++) { x+=this[u]; }
	return (Math.abs(Math.round(x)-x)<1e-16) ? Math.round(x)/this.length : x/this.length;
};
Math.variance=function () {
	var number=0,arr=[];
	for (var t=0;t<arguments.length;t++) { arr.push(arguments[t]); }
	for (var i=0;i<arr.length;i++) { number+=Math.pow(arr[i]-arr.avg(),2); }
	return number/arguments.length;		
};
//方差（新语法）
let nums=[1,2,3,4,5];
Math.variance_new=(...args)=>{
	let number=0,arr=[],t=0,len=args.length;
    for(t of args){ arr.push(t); }
    for(t of arr){ number+=Math.pow(t-arr.avg(),2); }
    return number/len;
}
log(Math.variance_new(...nums),Math.variance(1,2,3,4,5));
//Analog JQuery's Grammar
function Person(name,age){
    return Person.prototype.init(name,age);
}
Person.prototype={
    init: function(name,age){
        this.name=name;
        this.age=age;
    },
    getName: function(){log(this.age);}
}
Person.prototype.init.prototype=Person.prototype;
/**flattening array
 * @return {Array} */
Array.prototype.flatten=function(){
    let arr=this.join().replace(/(\[|\])+/g,"").split(",");
    for(let i=0;i<arr.length;i++){arr[i]=parseInt(arr[i]);}
    return arr;
}
log([1,[2,3]].flatten());