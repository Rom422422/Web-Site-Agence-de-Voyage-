// Chargement en-tête et pied de page dynamique
$(document).ready(function() {
  // Chargement de l'en-tête
  $("#header-container").load("header.html");

  // Chargement du pied de page
  $("#footer-container").load("footer.html");
})

//Fonctions qui fait apparaitre l'overlay de connexion et de filtre
function dropdown() {
  document.getElementById("connection").classList.toggle("show");
}    

function dropdownfilter() {
  document.getElementById("filter").classList.toggle("show");
}    


//Fonction qui récupère le lieu à partir de l'image sur laquelle on clique
function infos(){
  lien = new URLSearchParams(window.location.search);
  lieu = lien.get("place");
  document.getElementById("ms").textContent += " " + lieu;
  let tabDestinationJson = localStorage.getItem("Tableaux_destination")
  let tabDestination = JSON.parse(tabDestinationJson)
  for(let element of tabDestination)
  if (element._destination === lieu){
    image = element._image_src[1]
  }
  console.log(image)
  let backround_aff =  "#00000000 url("+image+") no-repeat"
  console.log(backround_aff)
  let bodyresa = document.getElementById("bodyresa")
  bodyresa.style.background = backround_aff ;
  bodyresa.style.backgroundSize = "cover";

}

//Fonction de gestion des dates Structures prises chez Maxime

function gestion_date(){
  const check_in_inpunt = document.getElementById("date_d")
  const check_out_inpunt = document.getElementById("date_r")
  const today = new Date().toISOString().split('T')[0]; 
  check_in_inpunt.min = today;
  check_in_inpunt.addEventListener("change",function(){
    const check_in_date = new Date(check_in_inpunt.value);
    const check_out_date = new Date(check_out_inpunt.value);
    check_out_inpunt.min = check_in_inpunt.value;
    if (check_out_date < check_in_date){
      check_out_inpunt.value = check_in_input.value;
    }
  });
  check_out_inpunt.min = check_in_inpunt.value;
  check_out_inpunt.addEventListener("change",function(){
    const check_in_date = new Date(check_in_inpunt.value);
    const check_out_date = new Date(check_out_inpunt.value);
    if (check_out_date < check_in_date){
      check_out_inpunt.value = check_in_input.value;
    }
  });
  check_in_inpunt.max = check_out_inpunt.value; 
};

//Fonction qui calcul le prix à partir du formulaire
function Calcul_prix(){
  console.log("calcul_prix")
  var prix_nuit = 100;
  var depart = document.getElementById("date_d").value;
  var retour = document.getElementById("date_r").value;
  var retour_date = new Date(retour)
  var depart_date = new Date(depart)
  var nb_nuit = (retour_date.getTime() -depart_date.getTime())/(1000*60*60*24)
  var nb_enfant = document.getElementById("nb_en").value;
  var nb_adultes = document.getElementById("nb_adu").value;
  var ptit_dej = document.getElementById("ptit_dej").checked;
  if (ptit_dej){
    var ptit_dej_value = 1
  } else {
    var ptit_dej_value = 0
  }
  var prix_voyage = 0.40 * nb_enfant * ( nb_nuit * (prix_nuit+ ptit_dej_value * 15 )) + nb_adultes * ( nb_nuit* (prix_nuit + ptit_dej_value * 15 ));
  document.getElementById("prix_voyage").innerHTML = prix_voyage;
}

// Fonction qui 'envoie' la réservation dans le panier (localStorage)
function envoie_reservation(){
  lien = new URLSearchParams(window.location.search);
  lieu = lien.get("place");
  localStorage.setItem(lieu,[lieu,document.getElementById("date_d").value,document.getElementById("date_r").value,document.getElementById("nb_en").value,document.getElementById("nb_adu").value,document.getElementById("ptit_dej").checked,document.getElementById("prix_voyage").value])
}

// Fonction qui affiche le panier (affiche chaque réservation contenu dans le local storage)
function affiche_panier(){
  console.log("appeler")
  let tabDestinationJson = localStorage.getItem("Tableaux_destination")
  let tabDestination = JSON.parse(tabDestinationJson)
  let template = document.querySelector('#panier_template')
  let info = document.getElementsByClassName('info')[0]
  let form = document.getElementById("formulaire_confirmation_panier")
  console.log(tabDestination)
  for (let element of tabDestination){
    let destination_storage = localStorage.getItem(element._destination)
    console.log(element._destination)
    console.log(destination_storage)
    if (destination_storage != null){
        info.style.display = "none"
        form.style.display = "contents"
        destination_storage =destination_storage.split(",")
        let lieu = destination_storage[0];
        let depart = destination_storage[1];
        let retour = destination_storage[2];
        let nb_enfant = destination_storage[3];
        let nb_adultes = destination_storage[4];
        let petit_dej = "sans";
        let prix_voyage = destination_storage[6];
        if ( destination_storage[5]==true){
          petit_dej = "avec";
        }
        let clone = document.importNode(template.content, true);
        newContent = clone.firstElementChild.innerHTML
        .replace(/{{lieu}}/g,lieu)
        .replace(/{{date_d}}/g,depart)
        .replace(/{{date_r}}/g,retour)
        .replace(/{{nb_adultes}}/g,nb_adultes)
        .replace(/{{nb_enfant}}/g,nb_enfant)
        .replace(/{{petit_dej}}/g,petit_dej)
        .replace(/{{prix_voyages}}/g,prix_voyage)
        clone.firstElementChild.innerHTML = newContent;
        document.getElementById("grid_container_panier").appendChild(clone);   
  }}}

// Function qui vide le local storage et donc supprime le panier 
function supprimer_panier(){
  let tabDestinations_Json = localStorage.getItem("Tableaux_destination")
  localStorage.clear();
  localStorage.setItem("Tableaux_destination",JSON.stringify(tabDestinations_Json));
}

//Fonction qui permet de filtrer les destinations
function filter(){
  rangeInput =document.querySelectorAll(".range-input input"),
  priceInput = document.querySelectorAll(".price-input input")
  progress = document.querySelector(".slider .progress")
  let priceGape = 50; //Ecart entre les slider 'min' et 'max'
  rangeInput.forEach(input =>{ // Si on modifie les curseurs
    input.addEventListener("input", decalage=>{
      let minVal = parseInt(rangeInput[0].value),
      maxVal = parseInt(rangeInput[1].value);
      if(maxVal - minVal < priceGape){
        if(decalage.target.className === "range-min"){ // Si le slider actif est le 'min'
          rangeInput[0].value = maxVal - priceGape;
        }else{
          rangeInput[1].value = minVal + priceGape;
        }
      }else{
        priceInput[0].value = minVal;
        priceInput[1].value = maxVal;   
        progress.style.left = (((minVal-100) / (rangeInput[0].max - 100)) * 100) +"%";
        progress.style.right = 100 - (((maxVal-100)/ (rangeInput[1].max-100)) * 100) +"%";
      }   
   });
  });
  
  priceInput.forEach(input =>{ // Si on modifie les inputs de 'type nombre'
    input.addEventListener("input", decalage=>{
      let minVal = parseInt(priceInput[0].value),
      maxVal = parseInt(priceInput[1].value);
      if((maxVal - minVal >= priceGape) && maxVal <= 900){
        if(decalage.target.className === "input-min"){ // Si la case actif est le 'min'
          rangeInput[0].value = minVal;
          progress.style.left = (minVal / rangeInput[0].max) * 100 +"%";
        }else{
          rangeInput[1].value = maxVal;
          progress.style.right = (100 - ((minVal / rangeInput[1].max) * 100)) +"%"; 
        }
      }   
   });
  });

  //On récupère les prix et variables des checkbox (filtres)
  let max_price = document.getElementById("price_max").value;
  let min_price = document.getElementById("price_min").value;
  let ptit_dej = document.getElementById("filter_ptit_dej").checked;
  let animals = document.getElementById("filter_animals").checked;

  //On récupère le tableau de destination
  let tabDestinationJson = localStorage.getItem("Tableaux_destination")
  let tabDestination = JSON.parse(tabDestinationJson) 
  tabDestinations_copy = []

  // On vérifie que chaque élément du tableau correspond aux filtres
  for (let element of tabDestination){ 
    if (((element._prix_nuit) <= max_price) && ((element._prix_nuit) >= min_price ) && ((element._ptit_dej == (ptit_dej)) || (element._ptit_dej == true)) && ((element._animaux == (animals)) || (element._animaux == true))){
      tabDestinations_copy.push(element)
  }}
  // On génère la copie modifié du tableau
  generate_template(tabDestinations_copy) 
}
// Fonction qui genere un template pour afficher la description des different pays. Elle appele le tableau tabdestination qui est stocké dans le localstorage 
function afficher_description(){
  let template = document.querySelector('#template_description')
  let tabDestinationJson = localStorage.getItem("Tableaux_destination")
  let tabDestination = JSON.parse(tabDestinationJson)
  lien = new URLSearchParams(window.location.search);
  lieu = lien.get("place");
  for (let element of tabDestination){
    if (element._destination === lieu){
      let description = element._description
      let clone = document.importNode(template.content, true);
      newContent = clone.firstElementChild.innerHTML
      .replace(/{{description}}/g,description)
      clone.firstElementChild.innerHTML = newContent;
      document.getElementById("grid_container_description").appendChild(clone);

    }
  }
}


class Voyage { // Classe qui contient nos voyage
  constructor(destination,prix_nuit,ptit_dej, animaux, image_src,description,temperature){
    this._destination = destination
    this._prix_nuit = prix_nuit
    this._ptit_dej = ptit_dej
    this._animaux = animaux
    this._image_src = image_src
    this._description = description
    this._temp = temperature
  }
}



//On va créer le tableau via les data Json
async function remplir_tabDestinations_async() {
  let tabDestinations_Json = []
  let response = await fetch('../js/data_base.json');
  let json= await response.json();
  for (let indice of json.tableau_Destination){
    Var_voyage = new Voyage(indice.destination, indice.prix_nuit, indice.petit_dejeuner, indice.animaux, indice.image_src,indice.description)
    tabDestinations_Json.push(Var_voyage)
  }

  generate_template(tabDestinations_Json)

  // stocker le tableau de destination dans le storage
  localStorage.setItem("Tableaux_destination",JSON.stringify(tabDestinations_Json));
}


//Fonction qui affiche le template et permet d'afficher le nom et le prix des voyages à partir de l'image
async function generate_template(tabDestinations){
  document.getElementById('grid-cont')
  grid = document.getElementById('grid-cont')
  let template = document.querySelector("#dest_city");
  let longueur = grid.children.length
  
  // On vide la grid 
  for(let i = 1; i < longueur; i++){
    grid.removeChild(grid.children[1])
  }
  
  for (let indice of tabDestinations){
    let prix = indice._prix_nuit;
    let city = indice._destination;
    let image = indice._image_src[0];
    
    //Récupéaration de la météo
  
    //let request = 'https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=_____________________'
    // let response = await fetch(request)
    // let temp = await response.json()   
    // let temperature = temp.main.temp - 273.15
    let temperature = 0
    let clone = document.importNode(template.content, true);
    newContent = clone.firstElementChild.innerHTML
    .replace(/{{prix}}/g,prix)
    .replace(/{{nom_dest}}/g,city)
    .replace(/{{image_dest}}/g,image)
    .replace(/{{temp}}/g,temperature.toFixed(1))
    clone.firstElementChild.innerHTML = newContent;
    document.getElementById("grid-cont").appendChild(clone); 
}}

