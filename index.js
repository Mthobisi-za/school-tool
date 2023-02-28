const express = require("express");
const { engine } = require("express-handlebars");
const body = require("body-parser");
const app = express();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const fsExtra = require('fs-extra');

require('dotenv').config()
app.use(express.static("public"));
app.use(body.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
}));
app.use(body.json({ limit: '50mb' }));
app.engine(
    "handlebars",
    engine({ layoutsDir: "views/layouts", defaultLayout: "main" })
);
app.set("view engine", "handlebars");

///Get Routes
app.get('/', (req, res) => {
    res.render('Home')
});
app.get('read', (req, res) => {
    var term = 'Measurements of the Earth using modern satellite technology';
});
//Post routes
app.post('/upload', upload.array('pdfs', 12), (req, res) => {
    var files = req.files;
    var term = req.body.term;
    var name = req.body.name;
    // let data = fs.createReadStream(files[0].path, 'utf8');
    // data.end();
    // data.on('data', (data) => {
    //     console.log(data.toString());
    // });
    // console.log(data);
    // fs.readFile(files[0].path, 'utf8', (err, data) => {
    //     console.log(typeof data);
    // });
    function readData(err, data) {
        var arg = data.split('.');
        var dataa = [];
        var ps = [];
        for (let index = 0; index < arg.length; index++) {
            const element = arg[index];
            if (element.includes(term)) {
                ps.push(arg[index - 3]);
                ps.push(arg[index - 2]);
                ps.push(arg[index - 1]);
                ps.push(arg[index]);
                ps.push(arg[index + 1]);
                ps.push(arg[index + 2]);
                ps.push(arg[index + 3]);
            }

        }
        console.log(ps + ' >> ')
        arg.forEach(element => {
            if (element.includes(term)) {
                dataa.push(element);
            }
        });
        console.log(dataa);
        fsExtra.emptyDirSync('uploads');
        console.log('done');
        res.render('results', { data: dataa, name, ps });
    }

    fs.readFile(files[0].path, 'utf8', readData);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server started on " + PORT);
});