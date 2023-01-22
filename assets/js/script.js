const randomTitle = document.getElementById("random-title");
const randomImg = document.getElementById("random-img");
const randomInstruction = document.getElementById("random-instruction");

const randomSection = document.getElementById("random-section");
const resultSection = document.getElementById("result-section");
const detailsSection = document.getElementById("details-section");

const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input")
const closeBtn = document.getElementById("close-btn");

const mealList = document.getElementById("meal");
const seeRecipe = document.getElementById("see-recipe");
const mealDetailsContent = document.querySelector(".details__content");

// event listeners
closeBtn.addEventListener("click", () => {
  detailsSection.classList.add("hide");
});
searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getMealRecipe);

//render random meal
randomMeal();
function randomMeal() {
  resultSection.classList.add("hide");
  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((response) => response.json())
    .then((data) => {
      if (data.meals) {
        data.meals.forEach((meal) => {
          randomTitle.textContent = meal.strMeal;
          randomImg.src = meal.strMealThumb;
          randomInstruction.textContent = meal.strInstructions;
        });
      }
    });
}
// meal list
function getMealList() {
  randomSection.classList.add("hide");
  resultSection.classList.remove("hide");
  let searchText = searchInput.value.trim();
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchText}`)
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
            <div class="result__meal-item" data-id="${meal.idMeal}">
                <div class="result__meal-img img">
                    <img src="${meal.strMealThumb}" alt="">
                </div>
                <div class="result__meal-name">
                    <h3 class="result__meal-title">${meal.strMeal}</h3>
                    <a href="#" class="result__meal-link btn" id="see-recipe">See Recipe</a>
                </div>
            </div>
            `;
        });
        mealList.classList.remove("notFound");
      } else {
        html = `Sorry, we didn't find any meal!`;
        mealList.classList.add("notFound");
      }
      mealList.innerHTML = html;
    });
}

function getMealRecipe(event) {
  event.preventDefault();
  if (event.target.classList.contains("result__meal-link")) {
    let mealItem = event.target.parentElement.parentElement;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
    .then((response) => response.json())
    .then((data) => mealRecipeModal(data.meals));
  }
}

function mealRecipeModal(meal) {
  detailsSection.classList.remove("hide");
  meal = meal[0];
  let html = `
    <div class="details__content-name">
        <div class="details__content-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="details__content-desc">
            <h3 class="details__content-title">${meal.strMeal}</h3>
            <p class="details__content-category">${meal.strCategory}</p>
            <a href="${meal.strYoutube}" target = "_blank" class="details__content-link btn">watch video</a>
        </div>
    </div>
    <div class="details__content-instruction">
        <h2 class="details__content-instruction-title">Instruction:</h2>
        <p>${meal.strInstructions}</p>
    </div>`;
    mealDetailsContent.innerHTML = html;
}
