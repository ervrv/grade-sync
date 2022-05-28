### json mock сервер

[используется json-server](https://www.npmjs.com/package/json-server)

добавьте список дисциплин в db.json/groups и запустите:

``` bash
cd cabinet_mock
json-server --watch db.json
curl http://localhost:3000/groups
```

http://localhost:3000/groups нужно использвать в app.js/office/url 






