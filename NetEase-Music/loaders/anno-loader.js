module.exports = function deleteAnnotation(srcCode){
    // delete annotations except docs
    return srcCode.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/|\/\/.*/g,"");
}