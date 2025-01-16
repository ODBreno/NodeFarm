const fs = require('fs');
const http = require('http')
const url = require('url')

// const slugify = require('slugify')
const replaceTemplate = require('./modules/replaceTemplate')

///////////////////////////////////////////
//FILES

// Blocking, synchronous
//const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
//console.log(textInput);
// const hello = "Hello World";
// console.log(hello);

//const textOutput = `This is what we know about the avocado: ${textInput}. \nCreated on ${Date.now()}`;
//fs.writeFileSync('./txt/output.txt', textOutput);
//console.log('File written!');

// Non-blocking, asynchronous
//fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//    if (err) return console.log("ERROR! 💥");
//    fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//        console.log(data2);
//        fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//        console.log(data3);
//        fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//                console.log('Your file has been written!');
//        })
//        })
//    })
//})
//console.log("Will read file!");

///////////////////////////////////////////
// Servidor

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// const slugs = dataObj.map(element => slugify(element.productName, {lower: true}));

const servidor = http.createServer((request, response) => {
    ///////////////////////////////////////////
    // Roteamento
    const {query, pathname} = url.parse(request.url, true)

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        response.writeHead(200, {
            'Content-type': 'text/html'
        });

        const cards = dataObj.map(element => replaceTemplate(tempCard, element)).join('');
        const output = tempOverview.replace('{%PRODUCTCARDS%}', cards);
        //console.log(cards);
        response.end(output);

    // Product page
    }else if (pathname === '/product') {
        response.writeHead(200, {
            'Content-type': 'text/html'
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product)
        response.end(output);

    // API
    }else if (pathname === '/api') {
        response.writeHead(200, {
            'Content-type': 'application/json'
        });
        response.end(data);

    // Not Found
    }else{
        response.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'pagina-nao-encontrada'
        });
        response.end("<h1>Página não encontrada!<h1>"); 
    }
});

servidor.listen(8000, 'localhost', () => {
    console.log("Servidor iniciado na porta 8000");
})