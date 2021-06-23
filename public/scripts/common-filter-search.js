
import { recipes } from "./recipes.js";
// litéral template for automatic cards creation

let displayedProduct = []
let nbTagActive = 0;

// mise à jour du DOM pour l'affichage des proguits
function updateAllDisplayedProduct() {
    let idOfElement = "recipesList"
    //document.getElementById(idOfElement).classList.remove("displayed")
    //document.getElementById("loader").classList.add("displayed")
    // Ici on supprime tous les produits dans notre "idOfElement"
    document.getElementById(idOfElement).textContent = "";
    //displayedProduct.forEach(oneProductToDisplay => {
    //    document.getElementById(idOfElement).appendChild("<div>" + oneProductToDisplay.name +"</div>")
    //})
    //document.getElementById(idOfElement).classList.add("displayed")
    //document.getElementById("loader").classList.remove("displayed")
    let resultTemplate;
    if (displayedProduct.length > 0) {
        resultTemplate = `
        ${displayedProduct.map(result => `
            <div class="card">
                <a class="card__link--color" href="#" title="">
                    <div class="card__img">
                    </div>
                    <div class="card__txt">
                        <div class="card__header">
                            <h3>${result.name}</h3>
                            <span class="card__header__time bold">${result.time} min
                                <i class="far fa-clock"></i>
                            </span>
                        </div>
                        <div class="card__body">
                            <ul class="card__body__list">
                            ${result.ingredients.map(element => `
                                <li><span class="bold">${element.name} : </span>${element.quantity} ${element.unit}</li>`).join("")}
                            </ul>
                            <p class="card__body__description"><span> ${result.description}</span></p>
                        </div>
                    </div>
                </a>
            </div>
            `).join("")
            }`;
    } else {
        resultTemplate = `<article> Aucune recette ne correspond à vootre critère... vous pouvez chercher "tarte aux pommes", "poisson", ect</article>`

    }
    document.getElementById(idOfElement).innerHTML = resultTemplate;
}

function checkFilterElementOnAllProduct(elementName, filterType) {
    console.log("Le", elementName, "est coché");
    // allProducts.forEach(oneProduct => {
    // oneProduct._checkFilterElement(elementName , filterType)
    // })
    displayedProduct.forEach(oneProduct => {
        oneProduct._checkFilterElement(elementName, filterType);
    })

}

function UnCheckFilterElement(elementName, type) {
    console.log("Le", elementName, "est décoché");
    displayedProduct.forEach(oneProduct => {
        oneProduct._UnCheckFilterElement(elementName, type);
    })
}

function checkProductOnAllProduct(regEx) {
    displayedProduct.forEach(oneProduct => {
        oneProduct._checkProduct(regEx);
    })
}

function unCheckProductOnAllProduct() {
    displayedProduct.forEach(oneProduct => {
        oneProduct._unCheckProduct();
    })
}

function logAllProductWithTag(tagType, nbFilterActive) {
    // purge the displayedProduct table before update with the new selection content
    console.log(nbTagActive);
    let tempProduct = displayedProduct;
    displayedProduct = [];
    if (nbTagActive > 0) {
        tempProduct.forEach(oneProduct => {
            oneProduct._isConcernedByFilter(tagType);
        });
    } else {
        allProducts.forEach(oneProduct => {
            oneProduct._isConcernedByFilter(tagType);
        });
    }
}

function RemoveTag(event) {
    let attr = this.getAttribute("filtertype");
    let tagName = this.innerText;
    this.remove();
    nbTagActive--;
    UnCheckFilterElement(tagName, attr);
    mainSearch(event.type, mainSearchString);
}

function addSelectedTag(selectedTag, filterName) {
    let tag = document.getElementById("tagList");
    // create new span element
    let filter = document.createElement('span');
    // create text node to add to span element
    filter.appendChild(document.createTextNode(selectedTag));
    // set inner text property of span and add filterActive class
    filter.classList.add("filterActive", "tag__" + filterName + "--color");
    filter.setAttribute("filterType", filterName);
    //creat new icon close element
    let icon = document.createElement('i');
    icon.classList.add('far', 'fa-times-circle');
    filter.appendChild(icon);
    tag.insertBefore(filter, tag.lastChild);
    //add event listenner at tag creation for tag removing
    filter.addEventListener('click', RemoveTag);
}

// function qui mets à jour la liste de filtre en fonction des produits qui sont afficées
function updateAllFilter() {
    if (displayedProduct.length != 0) {
        // on vide la contenu de tout les filtres
        ingredientFilter.data = [];
        ustensiltFilter.data = [];
        applianceFilter.data = [];
        //on recupère les 3 filtres
        let filterLists = document.querySelectorAll(".dropdown ul");
        //pour chaue filtre on suprime tous les elements du DOM
        filterLists.forEach(filter => {
            if (filter.hasChildNodes) {
                while (filter.firstChild) {
                    filter.removeChild(filter.firstChild);
                }
            }
        });
        //reconstruit les listes de filtre à partir des produits qui sont affichées sur le DOM.
        displayedProduct.forEach(oneProduct => {
            oneProduct.ingredients.forEach(oneIngredient => {
                if (oneIngredient.isChecked === false) {
                    ingredientFilter._addFilter(oneIngredient.name);
                }
            });
            oneProduct.ustensils.forEach(oneUstensil => {
                if (oneUstensil.isChecked === false) {
                    ustensiltFilter._addFilter(oneUstensil.name);
                }
            });
            oneProduct.appliances.forEach(oneUstensil => {
                if (oneUstensil.isChecked === false) {
                    applianceFilter._addFilter(oneUstensil.name);
                }
            });
        });
        // mise à jour du DOM
        ingredientFilter._createFilterOnDom();
        ustensiltFilter._createFilterOnDom();
        applianceFilter._createFilterOnDom();
    }
}

function udateResultNumber(number) {
    let test = document.getElementById("resultsNumbers");
    if (test.childNodes.length > 1) {
        test.childNodes[1].replaceWith(number);
    } else {
        test.insertAdjacentText('beforeend', number);
    }

}

function normalize(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase();
  }

class Filter {
    constructor(name) {
        this.name = name;
        this.data = [];
        this._createTagChoiseEvent();
        this._createTagListDisplayEvent();
        this._searchTagEvent();
        //this._RemoveTagEvent()
        //this._createTagListHiddenEvent()
    }

    _addFilter(newElement) {
        if (this.data.includes(newElement) === false) {
            this.data.push(newElement);
        }
    }

    _createFilterOnDom() {
        let sel = document.getElementById(this.name + "-list");
        this.data.sort().forEach(function (element) {
            // create new li element
            let list = document.createElement('li');
            // create text node to add to li element (list)
            list.appendChild(document.createTextNode(element));
            // set inner text property of li and add filtTag class
            list.classList.add('tag__filter');
            // add list to end of list (sel)
            sel.appendChild(list);
        })
    }

    // methode qui recupère l'élément qui à été cliqué par l'utilisateur dans la liste de filtre l'ajoute sous forme de Tag
    //mets à jour et affiche la liste des rectees qui contiennent ce tag.
    _createTagChoiseEvent() {
        let that = this;
        let idList = that.name + "-list";
        document.getElementById(idList).addEventListener("click", function (element) {
            if (element.target.nodeName === "LI") {
                let tagName = element.target.innerText;
                nbTagActive++;
                addSelectedTag(tagName, that.name);
                checkFilterElementOnAllProduct(tagName, that.name);
                logAllProductWithTag(that.name, nbTagActive);
                updateAllDisplayedProduct();
                updateAllFilter();
                udateResultNumber(displayedProduct.length);
            }
        });
    }

    _createTagListDisplayEvent() {
        let listToDisplay = document.getElementById(this.name + "-list");
        document.getElementById(this.name).addEventListener("click", function (event) {
            listToDisplay.classList.toggle("displayedList");
            event.stopPropagation();
        });
    }

    _searchTagEvent() {
        document.getElementById(this.name + "-search").addEventListener("input", (event) => {
            const list = document.querySelectorAll("#" + this.name + "-list" + "> .tag__filter");
            let normalizeInputSearch = normalize(event.target.value.trim());
            let regEx = new RegExp("(" + normalizeInputSearch + ")", 'gi');
            list.forEach((element) => {
                if (normalize(element.innerText).match(regEx) || event.target.value === "") {
                    element.style.display = 'list-item';
                } else {
                    element.style.display = 'none';
                }
            });
        });
    }
}

class Ingredient {
    constructor(name, quantity, unit) {
        this.name = name;
        this.quantity = this._validData(quantity);
        this.unit = this._shortenUnit(unit);
        this.isChecked = false;
        this._shortenUnit();
    }

    _validData(data) {
        if (typeof data === "undefined") {
            return data = "";
        } else {
            return data;
        }
    }

    _shortenUnit(data) {
        let string = this._validData(data);
        if (string.length > 2) {
            return string.substring(2, 0);
        } else {
            return string;
        }
    }
}
class Appliance {
    constructor(name) {
        this.name = name;
        this.isChecked = false;
    }
}
class Ustensil {
    constructor(name) {
        this.name = name;
        this.isChecked = false;
    }
}

class Product {
    constructor(name, ingredients, ustensils, appliances, description, time) {
        this.name = name;
        this.ingredients = ingredients;
        this.ustensils = ustensils;
        this.appliances = appliances;
        this.description = description;
        this.time = time;
        this.nbFilterActive = 0;
        // Test check with main research
        this.isChecked = false;
        console.log("Initialisation du produit", name);
        console.log("Voici la liste des ingrédients :", ingredients);
    }

    _checkFilterElement(elementName, type) {

        this[type].forEach(oneElement => {
            if (oneElement.name == elementName) {
                oneElement.isChecked = true;
                this.nbFilterActive++;
            }
        });
        console.log("Voici les ingrédients mis à jours sur le produit", this.name, "avec le nouvel algo");
        console.table(this[type]);
        console.log("Voici le nombre de filtre Actif sur le produit", this.name, "avec le nouvel algo", this.nbFilterActive);

    }
    _UnCheckFilterElement(elementName, type) {
        this[type].forEach(oneElement => {
            if (oneElement.name == elementName) {
                oneElement.isChecked = false;
                this.nbFilterActive--;
            }
        });
        console.log("Voici les ingrédients mis à jours sur le produit", this.name, "avec le nouvel algo");
        console.table(this[type]);
    }
    /////////////////////test main search////////////////////
    _checkProduct(regEx) {
        let ingredientFound = false;
        this.ingredients.forEach(oneIngredient => {
            if (regEx.test(normalize(oneIngredient.name))) {
                ingredientFound = true;
            }
        });
        if (regEx.test(normalize(this.name)) || regEx.test(normalize(this.description)) || ingredientFound) {
            console.log("le produit", this.name, "est valable");
            this.isChecked = true;
        } else {
            this.isChecked = false;
        }
    }
    _unCheckProduct() {
        this.isChecked = false;
    }
    ///////////////////////////////////////////////////////////
    _isConcernedByFilter(type) {
        //let isDisplayableProduct = false;
        console.log("nombre de filtre avtif dans le produit", this.name, ":", this.nbFilterActive);
        console.log("nombre de Tag actif sur le DOM :", nbTagActive);
        //this[type].forEach(oneElement => {
        //     if (oneElement.isChecked){
        //         isDisplayableProduct = true;
        //     }
        //});
        let mainSearchLength = document.getElementById("search-bar").value.length
        if (nbTagActive > 0) {
            if (mainSearchLength > 2) {
                if ((this.nbFilterActive === nbTagActive) && this.isChecked) {
                    displayedProduct.push(this)
                    console.log("Tag Search : Le produit", this.name, "est un produit valable");
                }
            } else if (this.nbFilterActive === nbTagActive) {
                displayedProduct.push(this);
                console.log("Tag Search : Le produit", this.name, "est un produit valable");
            }
        } else if (this.isChecked) {
            displayedProduct.push(this);
            console.log("Main Search : Le produit", this.name, "est un produit valable");
        }

    }
}
//********************************INIT********************************************************/
//création des 3 filtres qui contiendrons les objets associés "indredient" "ustensil" "appliance".
let ingredientFilter = new Filter("ingredients");
let applianceFilter = new Filter("appliances");
let ustensiltFilter = new Filter("ustensils");
// creation du tableau de produit qui contiendra toutes les recettes sous forme d'objet.
let allProducts = [];

recipes.forEach(oneProduct => {
    let allIngredients = [], allUstensils = [], allAppliances = [];
    oneProduct.ingredients.forEach(oneIngredient => {
        allIngredients.push(new Ingredient(oneIngredient.ingredient, oneIngredient.quantity, oneIngredient.unit));
        ingredientFilter._addFilter(oneIngredient.ingredient);
    });
    oneProduct.ustensils.forEach(oneUstensil => {
        allUstensils.push(new Ustensil(oneUstensil));
        ustensiltFilter._addFilter(oneUstensil);
    });
    allAppliances.push(new Appliance(oneProduct.appliance));
    applianceFilter._addFilter(oneProduct.appliance);
    allProducts.push(new Product(oneProduct.name, allIngredients, allUstensils, allAppliances, oneProduct.description, oneProduct.time));
});
//on affiche les filtres à l'initialisation
ingredientFilter._createFilterOnDom();
ustensiltFilter._createFilterOnDom();
applianceFilter._createFilterOnDom();

// init display all products
displayedProduct = allProducts;
udateResultNumber(displayedProduct.length);
updateAllDisplayedProduct();

//*****************************************MAIN RESEARCH******************************** */
let mainSearchString = ""
document.getElementById('search-bar')
    .addEventListener("input", (event) => {
        let type = event.target.id;
        mainSearchString = event.target.value;
        mainSearch(type, mainSearchString);
    });

function mainSearch(type, mainSearchInput) {
    console.time('MainSearch')
    let normalizeMainSearchInput = normalize(mainSearchInput.trim());
    let mainSearchLength = normalizeMainSearchInput.length;
    if (mainSearchLength > 2) {
        console.log("main search start");
        let regEx = new RegExp("(" + normalizeMainSearchInput + ")", 'gi');
        console.log("RegEx :", regEx);
        checkProductOnAllProduct(regEx);
        logAllProductWithTag(type, mainSearchLength);
        udateResultNumber(displayedProduct.length);
        updateAllDisplayedProduct();
        updateAllFilter();
        console.timeEnd('MainSearch');
    } else if (mainSearchLength === 0) {
        if (nbTagActive === 0) {
            displayedProduct = allProducts;
            unCheckProductOnAllProduct();
            udateResultNumber(displayedProduct.length);
            updateAllDisplayedProduct();
            updateAllFilter();
            console.timeEnd('MainSearch');
        } else {
            logAllProductWithTag(type, mainSearchLength);
            udateResultNumber(displayedProduct.length);
            updateAllDisplayedProduct();
            updateAllFilter();
            console.timeEnd('MainSearch');
        }
    }
}

