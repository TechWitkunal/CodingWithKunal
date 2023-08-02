// assigning element form document
let rightSide = document.querySelector(".right-side");
let searchBox = document.querySelector(".search-photo");
let bgBlack = document.querySelector(".bg-black");
let inputValueBox = document.querySelector(".input-search");
let cartItemButtom = document.querySelector(".cart-item");
let cartSection = document.querySelector(".cart-section");
let clearCartButton = document.querySelector(".cart-button");
let shortcutButton = document.querySelector(".side-bar footer");
let shortcut = document.querySelector(".wapper .shortcut");

// variable for photo fatching data
const apiKey = "bE0GUVnbbD6MJicY6JqQ6tFjUfrxpWiqpBUayIq2PLlvR3ACVdZsd1qV";
let perPage = 15;
let currentPage = 1;
let searchTerm = null;
let cartActive = false;

const generateHTML = (images) => {
    rightSide.innerHTML += images.map(img => `
    <div class="box-wapper">
    <header class="column">
    <h6>${img.photographer}</h6>
    <p>Images fatch form Pexel.com</p>
    </header>
    <main>
    <img src="${img.src.large2x}" alt="">
    </main>
    <footer class="flex justify-spaceBetween">
    <div class="flex">
    <i class="fa-regular fa-heart"></i>
    <i class="fa-regular fa-comment"></i>
    <a href="${img.src.large2x}" target="_blank"><i class="fa-solid fa-file-arrow-down"></i></a>
    </div>
    <i class="fa-regular fa-bookmark"></i>
    </footer>
    </div>`
    ).join("");
}

const getImages = (apiURL) => {
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        generateHTML(data.photos);
        heartClickFunc();
        bookmarkClickFunc();
    }).catch(() => {
        delete heartClickFunc();
        delete bookmarkClickFunc();
        alert("Failed to load images!");
    });
}

const loadSearchImages = (e) => {
    currentPage = 1;
    searchTerm = inputValueBox.querySelector("input").value;
    inputValueBox.querySelector("input").value = "";
    rightSide.innerHTML = "";
    bgBlack.style.cssText = `
        width: 0px;
        height: 0px;
        opacity: 0;
    `;
    inputValueBox.style.cssText = `
        width: 0;
        height: 0;
        opacity: 0;
    `;
    getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=1&per_page=${perPage}`);
}

const searchData = () => {
    let inputValue = inputValueBox.querySelector("input");
    bgBlack.style.cssText = `
        width: 100%;
        height: 100vh;
        opacity: 1;
    `;
    inputValueBox.style.cssText = `
        width: 500px;
        height: 50px;
        opacity: 1;
    `;
    inputValue.focus();
    bgBlack.addEventListener("click", () => {
        bgBlack.style.cssText = `
        width: 0px;
        height: 0px;
        opacity: 0;
    `;
        inputValueBox.style.cssText = `
        width: 0;
        height: 0;
        opacity: 0;
    `;
        return;
    })

    inputValue.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            if (inputValue.value == " ") {
                alert("Please enter prompt to get search");
                // return;
            } else {
                loadSearchImages();
                inputActive = true;
            }
        }
    })
}

searchBox.addEventListener("click", searchData)
window.addEventListener("load", () => {
    currentPage = (Math.floor(Math.random() * 10) + 1);
    for (let i = 1; i <= 10; i++) {
        getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
        currentPage++;
    }

    cartSection.innerHTML = localStorage.cartData;
    if (cartActive == true) {
        cartItemButtom.classList.add("active");
        cartSection.classList.add("active");
    }

    if (cartSection.innerHTML == "") {
        document.querySelector(".cart-button").classList.remove("data");
        // console.log("No Data")
    } else {
        document.querySelector(".cart-button").classList.add("data");
        // console.log("Has Data")
    }

})


cartItemButtom.addEventListener("click", () => {
    cartItemButtom.classList.toggle("active");
    cartSection.classList.toggle("active");
    if (cartActive == false) {
        cartItemButtom.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        cartActive = true;
    } else {
        cartItemButtom.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>`;
        cartActive = false;
    }
})

let heartClick = false;
function heartClickFunc() {
    document.querySelectorAll(".fa-heart").forEach(function (element) {
        element.addEventListener("click", () => {
            if (heartClick == false) {
                if (element.classList.contains("fa-regular")) {
                    element.classList.add("fa-solid");
                    element.classList.remove("fa-regular");
                    element.style.color = "red !important";
                }
                heartClick = true;
            } else {
                if (element.classList.contains("fa-solid")) {
                    element.classList.add("fa-regular");
                    element.classList.remove("fa-solid");
                    element.stlye.color = "white";
                }
                heartClick = false;
            }
        })
    })
}

let bookmarkClick = false;
function bookmarkClickFunc() {
    document.querySelectorAll(".fa-bookmark").forEach(function (element) {
        element.addEventListener("click", () => {
            document.querySelector(".cart-button").classList.add("data");
            if (bookmarkClick == false) {
                if (element.classList.contains("fa-bookmark")) {
                    element.classList.add("fa-solid");
                    element.classList.remove("fa-regular");
                    let cartPrevData = cartSection.innerHTML;
                    cartSection.innerHTML = `<img src="${element.parentNode.querySelector("a").href}">`;
                    cartSection.innerHTML = cartSection.innerHTML + cartPrevData;
                    imgClick();
                }
                bookmarkClick = true;
            } else {
                if (element.classList.contains("fa-solid")) {
                    element.classList.add("fa-regular");
                    element.classList.remove("fa-solid");
                    let removeUrl = element.parentNode.querySelector("a").href
                    cartSection.querySelectorAll("img").forEach(function (elementRemove) {
                        if (removeUrl == elementRemove.src) {
                            elementRemove.remove();
                        }
                    })
                }
                bookmarkClick = false;
            }
        })
    })

}

function imgClick() {
    let a = document.createElement("a");
    document.body.append(a);
    cartSection.querySelectorAll("img").forEach(function (element) {
        element.addEventListener("click", () => {
            console.log(element.src);
            a.href = element.src;
            a.target = "_blank";

            a.click();
        })
    })
}

window.addEventListener("beforeunload", () => {
    localStorage.cartData = cartSection.innerHTML;
    if (cartItemButtom.classList.contains("active")) { cartActive = true }
});

clearCartButton.addEventListener("click", () => {
    cartSection.innerHTML = "";
    localStorage.cartData = "";
    if (document.querySelector(".cart-button.data")) clearCartButton.classList.remove("data");
    else clearCartButton.classList.add("data");
})

let inputActive = false;

let shortcutObj = {
    first: 'Enter',
    second: ' ',
    third: 'c'
}

window.addEventListener("keydown", (e) => {
    if (e.key == shortcutObj.first) {
        e.preventDefault();
        window.location.reload();
    }
    if (e.key == shortcutObj.second && inputActive == false) {
        e.preventDefault();
        searchBox.click();
        inputValueBox.querySelector("input").value = "";
        inputActive = true;
    }
    if (e.key == shortcutObj.third) {
        e.preventDefault();
        cartItemButtom.click();
    }
})

shortcutButton.addEventListener("click", () => {
    shortcut.classList.toggle("active");
    bgBlack.style.cssText = `
    width: 100%;
    height: 100vh;
    opacity: 1;`;
})

bgBlack.addEventListener("click", () => {
    shortcut.classList.remove("active");
    bgBlack.style.cssText = `
    width: 0%;
    height: 0vh;
    opacity: 0;
    `;
})

function showAleart(massage) {
    alert(massage);
}

let buttonClick = false;
shortcut.querySelector("button").addEventListener("click", () => {
    if (buttonClick == false) {
        buttonClick = true;
        shortcut.querySelectorAll(".key").forEach(function (element) {
            element.setAttribute("contenteditable", "true");
        })
        shortcut.querySelector("button").innerHTML = "Save";
    }


    if (shortcut.querySelector("button").innerHTML == "Save") {
        let array = []
        shortcut.querySelectorAll(".key").forEach(function (element) {
            array.push(element.innerHTML);
        })
        let satisfy = true;
        for (let i = 0; i < array.length - 1; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (array[i] === array[j]) {
                    satisfy = false;
                    break;
                }
            }
        }
        if (satisfy) {
            // if (element.id == 1) element.id = "firs"
            shortcut.querySelectorAll(".key").forEach(function (element) {
                if (element.innerHTML == "Enter") {
                    shortcutObj[element.id] = "Enter";
                    updateLocalShortcut();
                } else if (element.innerHTML == "Space Bar") {
                    shortcutObj[element.id] = " ";
                    updateLocalShortcut();
                } else if (element.innerHTML == "Shift") {
                    shortcutObj[element.id] = "Shift";
                    updateLocalShortcut();
                } else if (element.innerHTML.length > 0 && element.innerHTML.length == 1) {
                    shortcutObj[element.id] = element.innerHTML;
                    updateLocalShortcut();
                } else {
                    showAleart("Please enter only one character for shortcut: " + element.id);
                }
            })
        } else {
            showAleart("Please make different shortcut for each function");
        }
    }
})

function updateLocalShortcut() {
    const stringifiedUser = JSON.stringify(shortcutObj);
    localStorage.setItem("shortcutKey", stringifiedUser);
    console.log(JSON.parse(localStorage.getItem("shortcutKey")));
}

window.addEventListener("load", () => {
    let localobj = JSON.parse(localStorage.getItem("shortcutKey"));
    Object.entries(localobj).forEach(([key, value]) => {
        shortcutObj[key] = value;
    });
})

const generateShadesOfBlue = () => {
    const shades = [];
    for (let i = 0; i < 100; i++) {
      const hue = i / 100;
      const saturation = 1;
      const lightness = 0.5;
      const color = `rgba(${hue}, ${saturation}, ${lightness}, 1)`;
      shades.push(color);
    }
    return shades;
  };
  
  const shades = generateShadesOfBlue();
  
  console.log(shades);
  