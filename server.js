//zmienne, stałe

var express = require("express")
var app = express()
var path = require("path")
var adminlogged = false;
var logins_table = [
    { id: 1, login: "Radek", password: "zaq1@WSX", uczen: true, wiek: 18, sex: true },
    { id: 2, login: "AAAA", password: "papiesh", uczen: false, wiek: 10, sex: true },
    { id: 3, login: "BBBBB", password: "tynojaniewiem", uczen: true, wiek: 15, sex: false }
]
var next_id = 4;
const PORT = process.env.PORT || 3000;

//Parse'owanie 

var bodyParser = require("body-parser");
const { normalize } = require("path");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
app.use(bodyParser.urlencoded({ extended: true }));


//Spis stron
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/sites/main.html"))
})
app.get("/admin", function (req, res) {
    if (adminlogged == false) {
        res.sendFile(path.join(__dirname + "/static/sites/admin_denied.html"))
    }
    else {
        res.sendFile(path.join(__dirname + "/static/sites/admin_granted.html"))
    }
})
app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/sites/register.html"))
})
app.post("/register", function (req, res) {
    console.log(req.body)
    let repeat = false;
    if (req.body.login != undefined && req.body.password != undefined) {
        for (let i = 0; i < logins_table.length; i++) {
            if (req.body.login == logins_table[i].login) {
                repeat = true;
            }
        }
        if (repeat) {
            res.send(" Login się powtórzył ")
        }
        else {
            if (req.body.uczen == undefined) {
                req.body.uczen = false
            }
            if (req.body.sex == "male") {
                req.body.sex = true
            }
            else {
                req.body.sex = false
            }
            logins_table.push({ id: next_id, login: req.body.login, password: req.body.password, wiek: req.body.wiek, uczen: req.body.uczen, sex: req.body.sex })
            res.send(" Zarejestrowano ")
            next_id++
            console.log(logins_table)
            console.log(next_id)
        }
    }
    else {
        res.send(" Nie Zarejestrowano")
    }
})
app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/sites/login.html"))
})
app.post("/login", function (req, res) {
    console.log(logins_table)
    var wrong = true;
    for (let j = 0; j < logins_table.length; j++) {
        if (req.body.login == logins_table[j].login && req.body.password == logins_table[j].password) {
            adminlogged = true;
            wrong = false;
            break;
        }
    }
    if (wrong) {
        res.send('Nieporawne logowanie')
    }
    else {
        res.redirect("/admin")
    }
})
app.get("/admin_granted_sort", function (req, res) {
    if (adminlogged == false) {
        res.sendFile(path.join(__dirname + "/static/sites/admin_denied.html"))
    }
    else {
        res.send(admin_sort_create('decrease'))
    }
})
app.post("/admin_granted_sort", function (req, res) {
    // var order = req.body.kolejnosc
    if (adminlogged == false) {
        res.sendFile(path.join(__dirname + "/static/sites/admin_denied.html"))
    }
    else {
        res.send(admin_sort_create(req.body.kolejnosc))
    }
})
app.get("/admin_granted_list", function (req, res) {
    if (adminlogged == false) {
        res.sendFile(path.join(__dirname + "/static/sites/admin_denied.html"))
    }
    else {
        res.send(admin_list_create())
    }
})
app.get("/admin_granted_gender", function (req, res) {
    if (adminlogged == false) {
        res.sendFile(path.join(__dirname + "/static/sites/admin_denied.html"))
    }
    else {
        res.send(admin_gender_create())
    }
})
app.get("/logout", function (req, res) {
    if (adminlogged) {
        adminlogged = false;
        res.send("Zostałeś wylogowany")
    }
    else {
        res.send("Najpierw sie zaloguj")
    }
})
//nasłuch na określonym porcie

app.use(express.static("static"))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

//funkcje tworzace listy dla admina na podstrony
function admin_list_create() {
    var listcopy = [...logins_table]
    console.log(logins_table)
    var everything = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=\'device-width\', initial-scale=1.0"><title>List</title><link rel="stylesheet" href="../css/style.css"></head><body><div class="header"><a href="/"> main</a><a href="./register"> register</a><a href="./login"> login</a><a href="./admin"> admin</a></div><h1> To jest strona admina</h1><div class="nav"><a class="in_nav" href="./admin_granted_list"> List </a><a class="in_nav" href="./admin_granted_sort"> Sort </a><a class="in_nav" href="./admin_granted_gender"> Gender </a></div>'

    var table = "<table>";
    for (let i = 0; i < listcopy.length; i++) {
        table += "<tr>"
        table += "<td>" + listcopy[i].id + "</td>"
        table += "<td>" + listcopy[i].login + "</td>"
        table += "<td>" + listcopy[i].password + "</td>"
        table += "<td>" + listcopy[i].wiek + "</td>"
        if (listcopy[i].uczen) {
            table += '<td><label for="uczen"> Uczeń </label><input type="checkbox"name="uczen" class="list_uczen" checked><br></td>'
        }
        else {
            table += '<td><label for="uczen"> Uczeń </label><input type="checkbox"name="uczen" class="list_uczen"><br></td>'
        }
        if (listcopy[i].sex) {
            table += "<td> male </td>"
        }
        else {
            table += "<td> female </td>"
        }

        table += "</tr>"
    }
    table += "</table>"

    everything += table
    everything += "</body> </html>"
    return everything

}
function admin_sort_create(kolejnosc) {
    console.log(kolejnosc)
    var everything = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=\'device-width\', initial-scale=1.0"><title>Sort</title><link rel="stylesheet" href="../css/style.css"></head><body><div class="header"><a href="/"> main</a><a href="./register"> register</a><a href="./login"> login</a><a href="./admin"> admin</a></div><h1> To jest strona admina</h1><div class="nav"><a class="in_nav" href="./admin_granted_list"> List </a><a class="in_nav" href="./admin_granted_sort"> Sort </a><a class="in_nav" href="./admin_granted_gender"> Gender </a></div><form id="kolejnosc" onchange="this.submit()" method="POST"><label for="decrease"> Malejąco </label><input type="radio" name="kolejnosc" value="decrease" id="decrease" #checked1><label for="increase"> Rosnąco </label><input type="radio" name="kolejnosc"  value="increase" id="increase" #checked2></form> <br>'
    var table = "<table>";
    var sortcopy = [...logins_table]
    if (kolejnosc == "decrease") {
        everything = everything.replace("#checked1", "checked")
        everything = everything.replace("#checked2", "")
        sortcopy.sort(function (a, b) {
            return parseFloat(b.wiek) - parseFloat(a.wiek);
        });
    }
    else {
        everything = everything.replace("#checked2", "checked")
        everything = everything.replace("#checked1", "")
        sortcopy.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        });
    }
    for (let i = 0; i < sortcopy.length; i++) {
        table += "<tr>"
        table += "<td>" + sortcopy[i].id + "</td>"
        table += "<td>" + sortcopy[i].login + "</td>"
        table += "<td>" + sortcopy[i].password + "</td>"
        table += "<td>" + sortcopy[i].wiek + "</td>"
        if (sortcopy[i].uczen) {
            table += '<td><label for="uczen"> Uczeń </label><input type="checkbox"name="uczen" class="list_uczen" checked><br></td>'
        }
        else {
            table += '<td><label for="uczen"> Uczeń </label><input type="checkbox"name="uczen" class="list_uczen"><br></td>'
        }
        table += "<td>" + sortcopy[i].sex + "</td>"
        table += "</tr>"
    }
    table += "</table>"
    everything += table
    everything += "</body> </html>"
    return everything
}
function admin_gender_create() {
    var gendercopy = [...logins_table];
    console.log(logins_table)
    console.log(gendercopy)
    var htmlpage = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=\'device-width\', initial-scale=1.0"><title>List</title><link rel="stylesheet" href="../css/style.css"></head><body><div class="header"><a href="/"> main</a><a href="./register"> register</a><a href="./login"> login</a><a href="./admin"> admin</a></div><h1> To jest strona admina</h1><div class="nav"><a class="in_nav" href="./admin_granted_list"> List </a><a class="in_nav" href="./admin_granted_sort"> Sort </a><a class="in_nav" href="./admin_granted_gender"> Gender </a></div>'
    var table = "<table>";
    for (let i = 0; i < gendercopy.length; i++) {
        if (gendercopy[i].sex == true) {
            table += "<tr>"
            table += "<td>" + gendercopy[i].id + "</td>"
            table += "<td>" + gendercopy[i].login + "</td>"
            table += "<td>" + gendercopy[i].password + "</td>"
            table += "<td>" + gendercopy[i].wiek + "</td>"
            if (gendercopy[i].uczen) {
                table += '<td><label for="uczen"> Uczeń </label><input type="checkbox"name="uczen" class="list_uczen" checked><br></td>'
            }
            else {
                table += '<td><label for="uczen"> Uczeń </label><input type="checkbox"name="uczen" class="list_uczen"><br></td>'
            }
            table += "<td> male </td>"
            table += "</tr>"
        }
    }
    table += "</table>"
    table += "<br>"
    htmlpage += table
    var table2 = "<table>";
    for (let i = 0; i < gendercopy.length; i++) {
        if (gendercopy[i].sex == false) {
            table2 += "<tr>"
            table2 += "<td>" + gendercopy[i].id + "</td>"
            table2 += "<td>" + gendercopy[i].login + "</td>"
            table2 += "<td>" + gendercopy[i].password + "</td>"
            table2 += "<td>" + gendercopy[i].wiek + "</td>"
            if (gendercopy[i].uczen) {
                table2 += '<td><label for="uczen"> Uczeń </label><input type="checkbox"name="uczen" class="list_uczen" checked><br></td>'
            }
            else {
                table2 += '<td><label for="uczen"> Uczeń </label><input type="checkbox"name="uczen" class="list_uczen"><br></td>'
            }
            table2 += "<td> female </td>"
            table2 += "</tr>"
        }
    }
    table2 += "</table>"
    htmlpage += table2
    htmlpage += "</body> </html>"
    return htmlpage
}

