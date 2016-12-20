module.exports = function blankPromiser(listing){
    return new Promise(function(resolve, reject){
        resolve(listing);
    });
};
