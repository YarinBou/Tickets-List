import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath, (req, res) => {
  // @ts-ignore
  const page: number = req.query.page || 1;
  let orderData = tempData.slice(0);
  if (req.query.orderBy === "None") {
    orderData = orderData;
  } else if (req.query.orderBy === "Title") {
    orderData.sort((a, b) => { return a.title.localeCompare(b.title) })
  } else if (req.query.orderBy === "Date") {
    orderData.sort((a, b) => { return a.creationTime - b.creationTime })
  }
  else if (req.query.orderBy === "ID") {
    orderData.sort((a, b) => {  return a.id.localeCompare(b.id) })
  }
  orderData = orderData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  res.send(orderData);
});

app.get(APIPath + '/:search', (req, res) => {
  // @ts-ignore
  const page: number = req.query.page || 1;
  let searchData = tempData.slice(0);
  searchData = searchData.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(req.params.search.toLowerCase()));
  searchData = searchData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  if (req.query.orderBy === "None") {
    searchData = searchData;
  } else if (req.query.orderBy === "Title") {
    searchData.sort((a, b) => { return a.title.localeCompare(b.title) })
  } else if (req.query.orderBy === "Date") {
    searchData.sort((a, b) => { return a.creationTime - b.creationTime })
  }
  res.send(searchData);

});

app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

