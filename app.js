var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db = require('mongoose');
db.connect('mongodb://localhost/book_db');

var Book = db.model('book',{
    imgUrl:{type:String,default:''},
    bookName:{type:String,default:''},
    author:{type:String,default:''},
    cate:{type:String,default:''}
})

var Crawler = require('crawler');
var url = require('url');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var index = 1;
var c = new Crawler({
    maxConnections:10,
    callback:function(err,res,$){
        // console.log(res)
        $('.inner .list .o').each(function(index,item){
            item = $(item)
            var imgUrl = item.find('.o-img img').attr('src')
            var bookName = item.find('.o-name a').text()
            var author = item.find('.o-author a').text()
            var cate = item.find('.o-cate a').text()
            var bookObj = {
                imgUrl:imgUrl,
                bookName:bookName,
                author:author,
                cate:cate
            }
            var book = new Book(bookObj);
            book.save((err) => {
                if(err){
                    console.log(err);
                }
            })
        })
    }
})

// // Queue using a function
// var googleSearch = function(search) {
//   return 'http://www.google.fr/search?q=' + search;
// };
// c.queue({
//   uri: googleSearch('cheese')
// });
for(var i=1;i<101;i++){
    if(i == 1){
        c.queue('http://kankandou.com/');
    }else{
        c.queue('http://kankandou.com/book/page/' + i);
    }
}

app.listen(3000,(req,res,next) => {
    console.log('Server is running now!')
})

