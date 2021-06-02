import {recipes} from "./recipes.js";
// tag list creation from recipes table
let ingredients = [];
let ustensils = [];
let sortIngedients = [];
let sortUstensils = [];


class Filters {
    constructor(name) {
        this.name = name;
        this.elements = [];
    }
    _normalize(str) {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    } 
  
    _addFilter(newElement) {
        if (this.elements.includes(this._normalize(newElement)) === false) {
            this.elements.push(this._normalize(newElement));
        }
    }
    _delFilter(nameFilter){
        this.elements.splice(this.elements.indexOf(nameFilter),1);
    }

    _displayFilterOnDom(identifier) {
        let sel = document.getElementById(identifier);
        this.elements.sort().forEach(function (element) {
            // create new li element
            let list = document.createElement('li');
            // create text node to add to li element (list)
            list.appendChild(document.createTextNode(element));
            // set inner text property of li and add filtTag class
            list.classList.add('tag__filter')
            // add list to end of list (sel)
            sel.appendChild(list);
        })
    }
    _modifieFilterOnDom(identifier){
        let list = document.getElementById(identifier);
        while(list.firstChild){
            list.removeChild(list.firstChild);
        }
        this._displayFilterOnDom(identifier);

    }
}
class Product {

    constructor(name) {
        this.name = name
        this.ingredients = []
        this.ustensils = []
    }

    _addIngredients(ingredients) {
        this.ingredients = ingredients
    }

    _addUstensils(ustencils) {
        this.ustensils = ustencils
    }

    _hasIngredients(ingredientName) {
        return this.ingredients.includes(ingredientName)
    }
}


let ingredientFilter = new Filters("ingredient")
let ustensilsFilter = new Filters("ustensils")
let allProducts = []
recipes.forEach(element => {
    // initialisation
    let oneProduct = new Product(element.name)
    let allProductIngredients = []
    let allProductUstensils = []

    // On parcours et rempli les élements
    element.ingredients.forEach(element => {
        ingredientFilter._addFilter(element.ingredient)
        allProductIngredients.push(element.ingredient)
    })
    element.ustensils.forEach(element => {
        ustensilsFilter._addFilter(element)
        allProductUstensils.push(element)
    });

    // On stocke
    oneProduct._addIngredients(allProductIngredients)
    oneProduct._addUstensils(allProductUstensils)
    allProducts.push(oneProduct)
});



//******************************DOM************************

//affichage de la liste complete de tag à l'initialisation de la page
ingredientFilter._displayFilterOnDom("myIngredientsList")
//ustensilsFilter._displayFilterOnDom("myUstensilsList")

//supression des tag précédemment sélectionné par l'utilisateur et mise à jour de la liste de filtres
document.getElementById('filterTag').addEventListener('click',function(event){
    if(event.target.className == "filterActive"){
        ingredientFilter._addFilter(event.target.innerText)
        ingredientFilter._modifieFilterOnDom("myIngredientsList");
        event.target.remove();
    }
});




//ajoute du filtre selectionné par l'utilisateur sous forme de tag au dessus du champ de recherche
let tagFilter = document.getElementById("filterTag");
function addSelectedTag(elt, selectedTag) {
    // create new span element
    let filter = document.createElement('span');
    // create text node to add to span element
    filter.appendChild(document.createTextNode(selectedTag));
    // set inner text property of span and add filterActive class
    filter.classList.add('filterActive')
    //filter.innerText = selectedTag;
    tagFilter.insertBefore(filter, tagFilter.firstChild)

    //creat new icon close element
    let icon = document.createElement('i');
    icon.classList.add('far', 'fa-times-circle');
    filter.appendChild(icon);
}


//event to display tag list on input search event
let myIngredientsList = document.getElementById("myIngredientsList");
let myIngredient = document.getElementById("mySearchIngredient");
myIngredient.addEventListener('click', function () {
    myIngredientsList.classList.toggle("displayed");
});
myIngredient.addEventListener('input',SearchIngredient);
function SearchIngredient(event){
    let regEx = new RegExp("^("+event.target.value+")",'i');
    let result = [];
    console.log(regEx);
    ingredientFilter.elements.forEach(element => {
        if(element.match(regEx) != null){
        result.push(element.match(regEx).input);
        ingredientFilter._delFilter(element.match(regEx).input);
        ingredientFilter._modifieFilterOnDom("myIngredientsList");
        }
    });
    

}

// function to get the user filter choise
document.querySelector("ul").addEventListener('click', getDataTag);
function getDataTag(event) {
    event.target.classList.toggle("selected");
    ingredientFilter._delFilter(event.target.innerText);
    ingredientFilter._modifieFilterOnDom("myIngredientsList");
    addSelectedTag(event.target.parentNode, event.target.innerText);
    // en admettons ceci : let results contient les choix utilisateurs
    let results = ["creme fraiche", "sel"]
    let productThatContainsAllResults = []
    allProducts.forEach(oneProduct => {
        let hasProductAllResult = true
        results.forEach(oneResult => {
            if (oneProduct._hasIngredients(oneResult) === false) {
                hasProductAllResult = false
            }
        })
        if (hasProductAllResult) {
            productThatContainsAllResults.push(oneProduct.name)
        }

    })
}




