module.exports = function(database, data, callback){
    var collection = database.collection('testCollection');
    collection.insertOne(data, function(err, result){
        callback(err, result);
    });
}