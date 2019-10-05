var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const hex2ascii = require('hex2ascii');
const { exec } = require('child_process');

var urlencodedParser = bodyParser.urlencoded({ extended: true });


// Running Server Details.
var server = app.listen(8082, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at %s:%s Port", host, port)
});


app.get('/', function (req, res) {
  var html='';
  html +="<!DOCTYPE html>";
  html +="  <html>";
  html +="    <head>";
  html +="      <link rel='stylesheet' type='text/css' href='./public/style.css'>";
  html +="    </head>";
  html +="        <body>";
  html += "<form action='/thank'  method='post' name='form1'>";
  html += "<center>Transaction ID:<br>";
  html += "<input type= 'text' name='txid' style='background-color: #3CBC8D; color: white; size: 150px;'> <br>";
  html += "<input type='submit' value='submit' style='background-color: #3CBC8D; color: white;'></center>";
  html += "</form>";
  html += "</body>";
  res.send(html);
});

app.get('/:id', function(req, res) {
  exec(`pandacoind gettransaction ${req.params.id.replace(';', 'X')}`, (err, stdout, stderr) => {
    console.log(req.params.id.replace(';', 'x'));
    if (err) {
      return;
    }
    var reply='';
    var obj = JSON.parse(stdout);
    reply +="<!DOCTYPE html>";
    reply +="  <html>";
    reply +="    <head>";
    reply +="      <link rel='stylesheet' type='text/css' href='./public/style.css'>";
    reply +="    </head>"
    reply +="        <body>";
    reply += "<b>Transaction Information</b> <br>" + stdout;
    reply += "<br><br><br><b>Message on Blockchain</b><br>";
  if (obj.vout.length > 1) {
    reply += hex2ascii(JSON.stringify(obj.vout[1].scriptPubKey.asm));
  }
  else {
    reply += "No Message on the Blockchain"
  }
    res.send(reply);
}) });

app.post('/thank', urlencodedParser, function (req, res){
  exec(`pandacoind gettransaction ${req.body.txid.replace(';', 'X')}`, (err, stdout, stderr) => {

    if (err) {
      return;
    }
    var reply='';
    var obj = JSON.parse(stdout);
    reply +="<!DOCTYPE html>";
    reply +="  <html>";
    reply +="    <head>";
    reply +="      <link rel='stylesheet' type='text/css' href='./public/style.css'>";
    reply +="    </head>"
    reply +="        <body>";
    reply += "<b>Transaction Information</b> <br>" + stdout;
    reply += "<br><br><br><b>Message on Blockchain</b><br>";
    if (obj.vout.length > 1) {
      reply += hex2ascii(JSON.stringify(obj.vout[1].scriptPubKey.asm));
    }
    else {
      reply += "No Message on the Blockchain"
    }
    res.send(reply);

}) });
