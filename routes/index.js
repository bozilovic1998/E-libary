var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');


const con = mysql.createConnection({ host: 'localhost', port: '3308', user: 'root', password: '', database: 'e_biblioteka' });


/* -----------------------------------> Administrator <-------------------------------------------------------------- */

router.post('/a_bibliotekari', (req, res) => { //Administrator - dodavanje bibliotekara

        let sql = 'INSERT INTO bibliotekari (b_ime_prezime, b_korisnicko_ime, b_email, b_lozinka) VALUES (';
        sql += "'" + req.body.b_ime_prezime + "', ";
        sql += "'" + req.body.b_korisnicko_ime + "', ";
        sql += "'" + req.body.b_email + "', ";
        sql += "'" + req.body.b_lozinka + "');";

        con.query(sql, (err, result) => {
            if (req.session.a_ulogovan) {
                res.redirect('a_bibliotekari');
            } else {
                req.session.a_ulogovan = false;
                res.redirect('/a_prijava');
            }
        });
});

router.get('/a_bibliotekari', function(req, res) { //Administrator - Prikaz svih bibliotekara

    let sql = "SELECT * FROM bibliotekari";
    con.query(sql, function(err, result) {
        if (req.session.a_ulogovan) {
            res.render('administrator_bibliotekari', { data: result });
        } else {
            req.session.a_ulogovan = false;
            res.redirect('/a_prijava');
        }
    });
});

router.post('/a_bibliotekari/izmeni/:id', function(req, res, next) { //Administrator - Izmena bibliotekara
    var bibliotekar = {
        "b_ime_prezime":req.body.b_ime_prezime,
        "b_korisnicko_ime": req.body.b_korisnicko_ime,
        "b_email": req.body.b_email,
        "b_lozinka":req.body.b_lozinka
    }

        con.query("UPDATE bibliotekari SET  ? WHERE id = " + req.params.id +";", bibliotekar, function(err, results,fields) {
            if (req.session.a_ulogovan) {
                return res.redirect(req.get('referer'));
            } else {
                req.session.a_ulogovan = false;
                res.redirect('/a_prijava');
            }
    });
});

router.get('/a_bibliotekari/izbrisi/:id', function(req, res) { //Administrator - brisanje bibliotekara
    let sql = "DELETE FROM bibliotekari WHERE id =" + req.params.id + ";";
    con.query(sql, function(err, result) {
        if (req.session.a_ulogovan) {
            return res.redirect('/a_bibliotekari');
        } else {
            req.session.a_ulogovan = false;
            res.redirect('/a_prijava');
        }
    });
});

router.get('/a_korisnici', function(req, res, next) { //Administrator - Prikaz svih korisnika
    let sql = "SELECT * FROM korisnici";
    con.query(sql, function(err, result) {
        if (req.session.a_ulogovan) {
            res.render('administrator_korisnici', { data: result });
        } else {
            req.session.a_ulogovan = false;
            res.redirect('/a_prijava');
        }
    });
});

router.post('/a_korisnici', (req, res) => { //Administrator - dodavanje korisnika
    let sql = 'INSERT INTO korisnici (k_ime_prezime, k_korisnicko_ime, k_email, k_lozinka) VALUES (';
    sql += "'" + req.body.k_ime_prezime + "', ";
    sql += "'" + req.body.k_korisnicko_ime + "', ";
    sql += "'" + req.body.k_email + "', ";
    sql += "'" + req.body.k_lozinka + "');";

    con.query(sql, (err, result) => {
        if (req.session.a_ulogovan) {
            res.redirect('a_korisnici');
        } else {
            req.session.a_ulogovan = false;
            res.redirect('/a_prijava');
        }
    });
});

router.post('/a_korisnici/izmeni/:id', function(req, res, next) { //Administrator - Izmena korisnika
    var korisnik = {
        "k_ime_prezime":req.body.k_ime_prezime,
        "k_korisnicko_ime": req.body.k_korisnicko_ime,
        "k_email": req.body.k_email,
        "k_lozinka":req.body.k_lozinka
    }

    con.query("UPDATE korisnici SET  ? WHERE id = " + req.params.id +";", korisnik, function(err, results,fields) {
        if (req.session.a_ulogovan) {
            return res.redirect(req.get('referer'));
        } else {
            req.session.a_ulogovan = false;
            res.redirect('/a_prijava');
        }
    });
});

router.get('/a_korisnici/izbrisi/:id', function(req, res) { //Administrator - brisanje korisnika
    let sql = "DELETE FROM korisnici WHERE id =" + req.params.id + ";";
    con.query(sql, function(err, result) {
        if (req.session.a_ulogovan) {
            return res.redirect('/a_korisnici');
        } else {
            req.session.a_ulogovan = false;
            res.redirect('/a_prijava');
        }
    });
});

/* -----------------------------------> Prijava i Registracija <----------------------------------------------------- */

router.post('/k_registracija', (req, res) => { //Registracija korisnika
    let sql = 'INSERT INTO korisnici (k_ime_prezime, k_korisnicko_ime, k_email, k_lozinka) VALUES (';
    sql += "'" + req.body.k_ime_prezime + "', ";
    sql += "'" + req.body.k_korisnicko_ime + "', ";
    sql += "'" + req.body.k_email + "', ";
    sql += "'" + req.body.k_lozinka + "');";

    con.query(sql, (err, result) => {
        return res.redirect('/k_knjige');
    });
});

router.get('/k_registracija', function(req, res, next) {
    res.render('korisnik_registracija');
});

router.get('/', function(req, res, next) { //Prijavljivanje korisnika
    res.render('korisnik_prijava');
});

router.post('/korisnik', function(req, res) {
    var k_korisnicko_ime = req.body.k_korisnicko_ime;
    var k_lozinka = req.body.k_lozinka;
    if (k_korisnicko_ime && k_lozinka) {
        con.query('SELECT * FROM korisnici WHERE k_korisnicko_ime = ? AND k_lozinka = ?', [k_korisnicko_ime, k_lozinka], function(error, results, fields) {
            if (results.length > 0) {
                req.session.k_ulogovan = true;
                req.session.k_korisnicko_ime = k_korisnicko_ime;
                return res.redirect('/k_knjige');
            } else {
                res.send('Pogrešno korisničko ime ili lozinka.');
            }
            res.end();
        });
    }
});

router.get('/b_prijava', function(req, res, next) { //Prijavljivanje bibliotekara
    res.render('bibliotekar_prijava');
});

router.post('/bibliotekar', function(req, res) {
    var b_korisnicko_ime = req.body.b_korisnicko_ime;
    var b_lozinka = req.body.b_lozinka;
    if (b_korisnicko_ime && b_lozinka) {
        con.query('SELECT * FROM bibliotekari WHERE b_korisnicko_ime = ? AND b_lozinka = ?', [b_korisnicko_ime, b_lozinka], function(error, results, fields) {
            if (results.length > 0) {
                req.session.b_ulogovan = true;
                req.session.b_korisnicko_ime = b_korisnicko_ime;
                return res.redirect('/b_knjige');
            } else {
                res.send('Pogrešno korisničko ime ili lozinka.');
            }
            res.end();
        });
    }
});

router.get('/a_prijava', function(req, res, next) { //Prijavljivanje administratora
    res.render('administrator_prijava');
});

router.post('/administrator', function(req, res) {
    var a_korisnicko_ime = req.body.a_korisnicko_ime;
    var a_lozinka = req.body.a_lozinka;
    if (a_korisnicko_ime && a_lozinka) {
        con.query('SELECT * FROM administrator WHERE a_korisnicko_ime = ? AND a_lozinka = ?', [a_korisnicko_ime, a_lozinka], function(error, results, fields) {
            if (results.length > 0) {
                req.session.a_ulogovan = true;
                req.session.a_korisnicko_ime = a_korisnicko_ime;
                return res.redirect('/a_korisnici');
            } else {
                res.send('Pogrešno korisničko ime ili lozinka.');
            }
            res.end();
        });
    }
});

router.get('/k_logout',(req,res) => {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        } res.end();
    });
});

router.get('/b_logout',(req,res) => {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }else{

            res.redirect('/b_prijava');
        } res.end();
    });
});

router.get('/a_logout',(req,res) => {
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/a_prijava');
        } res.end();
    });
});

/* -----------------------------------> Bibliotekar <---------------------------------------------------------------- */

router.post('/b_nova_knjiga', (req, res) => { //Bibliotekar - dodavanje knjige

    let sql = 'INSERT INTO knjige (autor_id, naziv, zanr, izdavac, godina_izdavanja, jezik, broj_strana) VALUES (';
    sql += "'" + req.body.autor_id + "', ";
    sql += "'" + req.body.naziv + "', ";
    sql += "'" + req.body.zanr + "', ";
    sql += "'" + req.body.izdavac + "', ";
    sql += "'" + req.body.godina_izdavanja + "', ";
    sql += "'" + req.body.jezik + "', ";
    sql += "'" + req.body.broj_strana + "');";

    con.query(sql, (err, result) => {
        if (req.session.b_ulogovan) {
            return res.redirect('/b_knjige');
        } else {
            req.session.b_ulogovan = false;
            res.redirect('/b_prijava');
        }

    });
});

router.get('/b_nova_knjiga', function(req, res, next) { //Bibliotekar - dodavanje knjige - prikaz svih autora u padajucoj listi
    let sql = "SELECT id, ime_prezime FROM autori";
    con.query(sql, function(err, result) {
        if (req.session.b_ulogovan) {
            res.render('bibliotekar_nova_knjiga', { result: result });
        } else {
            req.session.b_ulogovan = false;
            res.redirect('/b_prijava');
        }

    });
});

router.get('/b_knjige', function(req, res, next) { //Bibliotekar - prikaz knjiga
    let sql = "SELECT * FROM knjige";
    con.query(sql, function(err, result) {
        if (req.session.b_ulogovan) {
            res.render('bibliotekar_knjige', { data: result });
        } else {
            req.session.b_ulogovan = false;
            res.redirect('/b_prijava');
        }


    });
});

router.post('/b_knjige/izmeni/:id', function(req, res) { //Bibliotekar - izmena knjige
    var knjige = {
        "naziv":req.body.naziv,
        "zanr":req.body.zanr,
        "izdavac": req.body.izdavac,
        "broj_strana":req.body.broj_strana,
        "godina_izdavanja": req.body.godina_izdavanja,
        "jezik":req.body.jezik
    }

    con.query("UPDATE knjige SET  ? WHERE knjige.id = " + req.params.id +";", knjige, function(err, results,fields) {
        if (req.session.b_ulogovan) {
            res.redirect(req.get('referer'));
        } else {
            req.session.b_ulogovan = false;
            res.redirect('/b_prijava');
        }


    });
});

router.get('/b_knjige/izbrisi/:id', function(req, res) { //Bibliotekar - brisanje knjige
    let sql = "DELETE FROM knjige WHERE knjige.id =" + req.params.id + ";";
    con.query(sql, function(err, result) {
        if (req.session.b_ulogovan) {
            return res.redirect('/b_knjige');
        } else {
            req.session.b_ulogovan = false;
            res.redirect('/b_prijava');
        }

    });
});

router.get('/b_knjiga/:id', function(req, res, next) { //Bibliotekar - prikaz izabrane knjige
    const con = mysql.createConnection({ host: 'localhost', port: '3308', user: 'root', password: '', database: 'e_biblioteka' });

    con.connect(function(err) {
        if (err) {
            res.status(500);
            res.end(err.message);
        }
        let sql = "SELECT * FROM knjige, autori WHERE knjige.autor_id = autori.id AND knjige.id = " + req.params.id + ";";
        con.query(sql, function (err, result) {
            if (req.session.b_ulogovan) {
                res.render('bibliotekar_knjiga', {data: result, citanje: result, result: result});
            } else {
                req.session.b_ulogovan = false;
                res.redirect('/b_prijava');
            }
        });
    });
});

router.get('/b_knjige_autora/:id', function(req, res, next) {
    let sql = "SELECT knjige.id, knjige.naziv, knjige.zanr, autori.ime_prezime FROM knjige, autori WHERE knjige.autor_id = autori.id AND autori.id = " + req.params.id + ";";
    con.query(sql, function(err, result) {
        if (req.session.b_ulogovan) {
            res.render('bibliotekar_autor_sve_knjige', { data: result});
        } else {
            req.session.b_ulogovan = false;
            res.redirect('/b_prijava');
        }

    });
});


router.get('/b_autori', function(req, res, next) { //Bibliotekar - prikazivanje svih autora
    let sql = "SELECT * FROM autori";
    con.query(sql, function(err, result) {
        if (req.session.b_ulogovan) {
            res.render('bibliotekar_autori', { data: result });
        } else {
            req.session.b_ulogovan = false;
            res.redirect('/b_prijava');
        }

    });
});

router.post('/b_autori', (req, res) => { //Bibliotekar - dodavanje autora

    let sql = 'INSERT INTO autori (ime_prezime, godina_rodjenja, mesto_rodjenja, drzava) VALUES (';
    sql += "'" + req.body.ime_prezime + "', ";
    sql += "'" + req.body.godina_rodjenja + "', ";
    sql += "'" + req.body.mesto_rodjenja + "', ";
    sql += "'" + req.body.drzava + "');";

    con.query(sql, (err, result) => {
        if (req.session.b_ulogovan) {
            return res.redirect('/b_autori');
        } else {
            req.session.b_ulogovan = false;
            res.redirect('/b_prijava');
        }

    });
});

router.post('/b_autori/izmeni/:id', function(req, res, next) { //Bibliotekar - izmena autora
    var autor = {
        "ime_prezime":req.body.ime_prezime,
        "godina_rodjenja": req.body.godina_rodjenja,
        "mesto_rodjenja": req.body.mesto_rodjenja,
        "drzava":req.body.drzava
    }

    con.query("UPDATE autori SET  ? WHERE id = " + req.params.id +";", autor, function(err, results,fields) {
        if (req.session.b_ulogovan) {
            return res.redirect(req.get('referer'));
        } else {
            req.session.b_ulogovan = false;
            res.redirect('/b_prijava');
        }

    });
});

router.get('/b_autori/izbrisi/:id', function(req, res) { //Bibliotekar - brisanje autora
    let sql = "DELETE FROM autori WHERE id =" + req.params.id + ";";
    con.query(sql, function(err, result) {
        if (req.session.b_ulogovan) {
            return res.redirect('/b_autori');
        } else {
            req.session.b_ulogovan = false;
            res.redirect('/b_prijava');
        }

    });
});


/* -----------------------------------> Korisnik <------------------------------------------------------------------- */

router.get('/k_knjige', function(req, res, next) {
    let sql = "SELECT knjige.id, knjige.naziv, knjige.zanr, autori.ime_prezime FROM knjige, autori WHERE knjige.autor_id = autori.id";
    con.query(sql, function(err, result) {
        if (req.session.k_ulogovan) {
            res.render('korisnik_knjige', {data: result});
        } else {
            req.session.k_ulogovan = false;
            res.redirect('/');
        }


    });
});

router.get('/k_knjiga/:id', function(req, res, next) { //Bibliotekar - prikaz izabrane knjige
    let sql = "SELECT * FROM knjige, autori WHERE knjige.autor_id = autori.id AND knjige.id = "+ req.params.id +";";
    con.query(sql, function(err, result) {
        if (req.session.k_ulogovan) {
            res.render('korisnik_knjiga', {data: result});
        } else {
            req.session.k_ulogovan = false;
            res.redirect('/');
        }
    });

});

router.get('/k_knjige_autora/:id', function(req, res, next) {
    let sql = "SELECT knjige.id, knjige.naziv, knjige.zanr, autori.ime_prezime FROM knjige, autori WHERE knjige.autor_id = autori.id AND autori.id = " + req.params.id + ";";
    con.query(sql, function(err, result) {
        if (req.session.k_ulogovan) {
            res.render('korisnik_autor_sve_knjige', { data: result});
        } else {
            req.session.k_ulogovan = false;
            res.redirect('/');
        }
    });
});

router.get('/k_autori', function(req, res, next) {
    let sql = "SELECT * FROM autori";
    con.query(sql, function(err, result) {
        if (req.session.k_ulogovan) {
            res.render('korisnik_autori', { data: result });
        } else {
            req.session.k_ulogovan = false;
            res.redirect('/');
        }
    });
});

router.get('/placanje', function(req, res, next) {
    res.render('placanje');
});

router.get('/knjiga/:id', function(req, res, next) {

    let sql = "SELECT * FROM knjige, autori WHERE knjige.autor_id = autori.id AND knjige.id = "+ req.params.id +";";
    con.query(sql, function(err, result) {
        if (req.session.k_ulogovan) {
            var id = req.params.id;
            if (id == 1){
                var p = path.join(__dirname, '../public/files', 'malterego.jpg');
                res.sendFile(p);
            }
            else if (id == 2){
                var p = path.join(__dirname, '../public/files', 'zimski_vojnik.jpg');
                res.sendFile(p);
            }
            else if (id == 3){
                var p = path.join(__dirname, '../public/files', 'ivo_andric.jpg');
                res.sendFile(p);
            }
            else if (id == 4){
                var p = path.join(__dirname, '../public/files', 'mesa_selimovic.jpg');
                res.sendFile(p);
            }
            else if (id == 5){
                var p = path.join(__dirname, '../public/files', 'handke.jpg');
                res.sendFile(p);
            }
            else if (id == 6){
                var p = path.join(__dirname, '../public/files', 'Praktikum.pdf');
                res.sendFile(p);
            }
            else if (id == 7){
                var p = path.join(__dirname, '../public/files', 'knjiga.pdf');
                res.sendFile(p);
            }
            else if (id == 8){
                var p = path.join(__dirname, '../public/files', 'knjiga.pdf');
                res.sendFile(p);
            }
            else if (id == 9){
                var p = path.join(__dirname, '../public/files', 'knjiga.pdf');
                res.sendFile(p);
            }
            else if (id == 10){
                var p = path.join(__dirname, '../public/files', 'knjiga.pdf');
                res.sendFile(p);
            }
            else if (id == 11){
                var p = path.join(__dirname, '../public/files', 'knjiga.pdf');
                res.sendFile(p);
            }
            else if (id == 12){
                var p = path.join(__dirname, '../public/files', 'knjiga.pdf');
                res.sendFile(p);
            }
            else if (id == 13){
                var p = path.join(__dirname, '../public/files', 'handke.jpg');
                res.sendFile(p);
            }
            else if (id == 14){
                var p = path.join(__dirname, '../public/files', 'knjiga.pdf');
                res.sendFile(p);
            }
            else if (id == 15){
                var p = path.join(__dirname, '../public/files', 'knjiga.pdf');
                res.sendFile(p);
            }
        } else {
            req.session.k_ulogovan = false;
            res.redirect('/');
        }
    });

});

router.get('/upload', function (req,res,next) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="/fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br/><br/>');
    res.write('<input type="submit" value="Sacuvaj">');
    res.write('</form>');
    res.write('<span style="font-weight: bold;">Nakon dodavanja fajla, vratite se na prethodnu stranu, da biste sacuvali knjgu.</span> &nbsp;<button onclick="goBack()">Povratak na prethodnu stranu</button> <script>\n' +
        'function goBack() {\n' +
        '  window.history.back();\n' +
        '}\n' +
        '</script>');
    return res.end();
});

router.post('/fileupload',function (req,res,next) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.path;
            var newpath = 'C:/Users/bozil/Desktop/E-libary/public/files/' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                res.write('Fajl je uspesno dodat. \n\nVratite se na prethodnu stranu.');
                res.end();
            });
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="/fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }

});


module.exports = router;
