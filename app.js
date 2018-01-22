const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3030;
const Datastore = require('nedb');

// データベース初期化
const db = new Datastore({ 
  filename: 'markdown.db',
  autoload: true
});

// POSTデータを受け取れるようにする
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// HTTPリクエストを受け取る部分
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/sample1.html', function (req, res) {
  res.sendFile(__dirname + '/sample1.html');
});
app.get('/sample2.html', function (req, res) {
  res.sendFile(__dirname + '/sample2.html');
});
app.get('/sample3.html', function (req, res) {
  res.sendFile(__dirname + '/sample3.html');
});

// データを取得
app.get('/list.json', function (req, res) {
  db.find({}, function(err, docs){
    res.json({
      "error": !!err,
      "data": docs,
    })
  });
});

// データを保存
app.post('/update.json', function (req, res) {
  console.log(req.body)
  if (req.body._id) {
    // IDが存在したらデータをアップデート
    db.update({ _id: req.body._id }, req.body, {}, function (err, numReplaced) {
      res.json({
        "error": !!err,
        "data": req.body,
      })
    });    
  } else {
    // IDが存在しなかったらデータを登録
    db.insert(req.body, function (err, newDoc) {
      res.json({
        "error": !!err,
        "data": newDoc,
      })
    });
  }
});

// サーバーを起動する部分
const server = app.listen(port, function () {
  console.log('Listening at http://%s:%s', 'localhost', port);
});
