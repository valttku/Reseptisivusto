## Projektityön esittely

Tämä projektityö on reseptisivusto, jossa käyttäjä voi luoda oman käyttäjätunnuksen. Sivustolla on valmiiksi yli 500 eri reseptiä, joita käyttäjä voi hakea hakupalkin kautta eri hakusanoilla. Lisäksi käyttäjä voi kirjauduttuaan sisään lisätä sivustolle omia reseptejä sekä muokata ja poistaa niitä. Projektityön tarkoituksena on, että mahdollisimman moni käyttäjä innostuisi lisäämään omia reseptejä, jotta aineiston määrä kasvaisi ja monipuolistuisi ja näin sivusto olisi käyttäjille entistä houkuttelevampi. 

Projektityö oli osa Metropolia-ammattikorkeakoulun toteuttamaa Web-projekti -nimistä kurssia osana ohjelmistotuotannon opintosuunnitelmaa. Projektityöt suoritettiin 2-4 hengen ryhmissä. Tässä projektityössä olivat mukana Tuuli Kivisaari, Valtteri Kuitula ja Jhon Rastrojo López.


## Yleisesti tietokannasta ja ohjeet tietokannan perustamiselle

Reseptisivusto hyödyntää paikallista tietokantaa, joten ennen sovelluksen käynnistämistä käyttäjän tulee omalle tietokoneelleen luoda tietokanta nimellä “recipes”, jonka sisältä löytyy kaksi taulua: “users” ja “recipes”. Sovellus olettaa, että tietokanta luodaan käyttämällä root-sanaa käyttäjätunnuksena ja salasanana, mutta käyttäjätunnuksen ja salasanan voi päivittää server.js-tiedostoon, jos käyttää toista käyttäjätunnusta ja salasanaa. Server.js-tiedostossa on myös skripti, joka kirjoittaa senhetkiset reseptit tietokantaan, niin kannattaa varmistaa, että kyseinen skripti ei ole kommentoituna pois serveriä käynnistettäessä ensimmäistä kertaa. Skriptin voi kommentoida pois käynnistämisen jälkeen.

Paikallisen tietokannan lisäksi sovellus hyödyntää käyttäjä- ja reseptitietojen tallentamiseen kahta eri JSON-tiedostoa. Reseptit tallentuvat recipes.json-nimiseen tiedostoon ja käyttäjätiedot userDetails.json-nimiseen tiedostoon. Joissakin kohdissa tietoa käytetään suoraan json-tiedostosta käytännöllisistä syistä; koska projektityössä oli kolme tekijää ja jokaisella oma paikallinen tietokanta, oli tärkeää voida testata sovelluksen toimintoja keskenään samalla datalla. Tästä syystä JSON-tiedostojen käyttö projektityössä oli tärkeää, eikä kaikilla välilehdillä välttämättä haeta tietoa suoraan tietokannasta.

Tietokannan taulut saa luotua seuraavilla komennoilla:

CREATE TABLE recipes (
   id INT NOT NULL AUTO_INCREMENT,
   name VARCHAR(255),
   ingredients TEXT,
   category VARCHAR(255),
   author VARCHAR(255),
   url VARCHAR(255),
   image VARCHAR(255),
   cookTime TEXT,
   recipeYield TEXT,
   date TEXT,
   prepTime TEXT,
   description TEXT,
   PRIMARY KEY (id)
);

sekä

CREATE TABLE users ( id INT PRIMARY KEY AUTO_INCREMENT,
username VARCHAR(50) NOT NULL,
email VARCHAR(100) NOT NULL,
password VARCHAR(255) NOT NULL );


## REST-rajapinnan käyttö

Projektityössä on käytössä REST-rajapinta ja siinä hyödynnetään kutsuja datan hakemiseksi (get), poistamiseksi (delete) sekä muokkaamiseksi (put) ja lisäämiseksi (post). Tässä kuvaillaan delete-metodin käyttöä filessä Userpage.js sekä server.js:

HTTP-pyynnöt toimivat projektityössä niin, että esimerkiksi tiedostossa Userpage.js on määritelty deleteRecipe -funktio, joka käyttää axios-kirjastoa tekemään HTTP DELETE -pyynnön palvelimelle osoitteessa "http://localhost:3001/recipes/${recipeName}", jossa recipeName on poistettavan reseptin nimi. Axios.delete() -metodi lähettää HTTP DELETE -pyynnön ja palauttaa lupauksen, joka ratkeaa palvelimen vastausdatalla, jos pyyntö onnistuu. Jos pyyntö epäonnistuu, lupaus hylätään virheellä.

Kun axios.delete() -metodin palauttama lupaus ratkeaa onnistuneesti, deleteRecipe -funktio suodattaa filteredRecipes -taulukon poistaakseen reseptin määritetyllä nimellä. Sen jälkeen se päivittää komponentin tilan kutsumalla setFilteredRecipes() -funktiota uudella suodatetulla taulukolla. Jos DELETE-pyyntöön tapahtuu virhe, funktio kirjoittaa virheen konsoliin.

Tiedostossa server.js on määritelty HTTP DELETE -metodi osoitteessa '/recipes/:name'. Tämä reitti hyväksyy reittiparametrin nimeltä 'name', joka edustaa poistettavan reseptin nimeä. Reittiparametri välitetään serverille request bodyssa. Kun palvelin vastaanottaa HTTP DELETE -pyynnön tähän reittiin, se suorittaa SQL DELETE -kyselyn, joka poistaa määritellyllä nimellä olevan reseptin tietokannan 'recipes' taulusta. Palvelin lähettää HTTP-vastauksen, jossa on onnistumiskoodi ja JSON-objekti, joka sisältää viestin, joka osoittaa, että resepti on poistettu onnistuneesti, tai virhekoodeja ja JSON-objektin, joka sisältää virheviestin, jos tapahtui virhe.

Tämän koodin REST-metodit käyttävät JSON-muotoa tietojen vaihtomuotona. Palvelin vastaanottaa nimi-parametrin merkkijonona HTTP DELETE -pyynnön URL-osoitteessa ja palauttaa JSON-objektin HTTP-vastauksen rungossa onnistumis- tai virheviestillä. Samoin axios.delete() -metodi lähettää recipeName-parametrin URL-osoitteen osana HTTP DELETE -pyyntöä.

Samalla periaatteella toimivat myös projektityössä esiintyvät REST-rajapinnan muut metodit eli post, get ja put. Delete-metodissa ei ole varsinaista request bodya, mutta sellainen löytyy esimerkiksi projektin post-metodista, jossa kyseinen request body on nimenomaan json-muodossa.


## Jatkokehitysideoita

Projektityö sisältää kaikki kurssin vaaditut ominaisuudet, mutta määrittelyvaiheessa syntyi useita ideoita, jotka voitaisiin toteuttaa projektityöhön jatkokehitysvaiheessa. Esimerkiksi reseptejä olisi hyvä voida kommentoida ja arvioida käyttäjien toimesta. Hakupalkkia voisi parannella siten, että reseptejä voitaisiin hakea myös kategorian, ainesosien tai sen suosion (riippuen arvosteluista) perusteella. Lisäksi projektityössä voi nykyhetkenä muuttaa vain reseptin nimeä sen lisäämisen jälkeen, mutta käyttäjälle mieluisampi ratkaisu olisi se, että reseptin kaikkia tietoja (reseptin kuvaa, ainesosia jne.) voitaisiin muokata. Käyttöliittymän ulkonäön puolesta tumma tila olisi myös hyvä lisä.

