$("#user-icon").click((e) => {
  e.stopPropagation();
  $("#dropdown-menu").toggleClass("hidden");
});

$("#dropdown-menu #manageMyAccount").click((e) => {
  checkLogin()
});

$("#dropdown-menu #logOut").click((e) => {
  window.location.href = "login.html"
})

$("#basket-shopping").click((e) => {
  ClearCookies()
  window.location.href = "basket.html"
})

$("#viewBtn").click((e) => {
  $("#main").addClass("h-full");
  setPage(2);
  viewBtn.disabled = true
});

$("#arrowUp").click((e) => {
  $('html, body').animate({ scrollTop: 0 }, 'fast');
})

$(document).on('click', '#addToBasket', (e) => {
  addToBasket()
})
const LoginPost = async () => {
  const response = await fetch("http://localhost:3000/api/auth/login ", {
    method: "POST",
    headers: {
      "Content-Type": `application/json`,
      "Accept": "application/json"
    },
    body: JSON.stringify({
      email: String,
      password: String
    })
  })
  const data = await response.json()
}

const checkLogin = () => {
  const cookies = document.cookie.split('; ')
  const accessToken = cookies.find(cookie => cookie.startsWith('accessToken='))
  if (accessToken) {
    window.location.href = "edit.html"
  }
  else {
    window.location.href = "login.html"
  }
}
const ClearCookies = () => {
  Cookies.remove('accessToken', { path: '/' })
  alert("Deleted token")
}
const addItemsForProduct = async (productData) => {
  productData.map(item => {
    const productHtml = `
        <div class="bg-[#F5F5F5] w-[270px] h-[350px] object-cover object-contain rounded-lg shadow-md relative group">
          <img class="w-full h-[250px] object-scale-down object-cover object-contain rounded-t-lg" src="${item.gallery[0]}" alt="">
          <h3 class="font-medium text-base mt-4">${item.title}</h3>
          <p class="font-medium text-base text-[#DB4444] mt-2">${item.currency}${item.price}</p>
          <button id="addToBasket" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[150px] h-[40px] bg-[#DB4444] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Add to Basket
          </button>
        </div>
      `;
    $("#main").append(productHtml);
  });
}

const addToBasket = async () => {
  const response = await fetch("http://localhost:3000/api/baskets/add", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      productId: String,
      quantity: Number
    })
  })
  const data = await response.json()
}
const getAllProductForPageSize = async (itemCount) => {
  const response = await fetch(`http://localhost:3000/api/products?pageSize=${itemCount}}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  })
  const data = await response.json()
  console.log(data)
  addItemsForProduct(data.products)
}

const setPage = async (pageNumber) => {
  const response = await fetch(`http://localhost:3000/api/products?page=${pageNumber}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  })
  const data = await response.json()
  console.log(data)
  addItemsForProduct(data.products)
}
const getAllProducts = async () => {
  const response = await fetch("http://localhost:3000/api/products", {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  })
  const data = await response.json()
  addItemsForProduct(data.products)
}
getAllProducts()




  
$(document).ready(function () {
  
  $("input[type='text']").on("input", function () {
    const searchTerm = $(this).val().trim();
    getAllProducts({ searchTerm });
  });

  $("#categories div").on("click", function () {
    const categoryId = $(this).attr("id").replace("-category", ""); 

    $("#categories div").css("background-color", "white");
    $(this).css("background-color", "#DB4444"); 

   
    getAllProducts({ category: categoryId });
  });

  
  $("#categories div").hover(
    function () {
      if (!$(this).hasClass("active")) {
        $(this).css("background-color", "#FCE4E4"); 
      }
    },
    function () {
      if (!$(this).hasClass("active")) {
        $(this).css("background-color", "white");
      }
    }
  );


  const addItemsForProduct = (productData) => {
    $("#main").empty(); 
    productData.forEach(item => {
      const productHtml = `
        <div class="bg-[#F5F5F5] w-[270px] h-[350px] object-cover object-contain rounded-lg shadow-md relative group">
          <img class="w-full h-[250px] object-scale-down object-cover object-contain rounded-t-lg" src="${item.gallery[0]}" alt="${item.title}">
          <h3 class="font-medium text-base mt-4">${item.title}</h3>
          <p class="font-medium text-base text-[#DB4444] mt-2">${item.currency}${item.price}</p>
          <button id="addToBasket" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[150px] h-[40px] bg-[#DB4444] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Add to Basket
          </button>
        </div>
      `;
      $("#main").append(productHtml);
    });
  };

  
  const getAllProducts = async (params = {}) => {

    const url = "http://localhost:3000/api/products?" + new URLSearchParams(params).toString();

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

   
    const data = await response.json();
    console.log(data);  
    if (data.products) {
      addItemsForProduct(data.products);  
    } else {
      console.error("Error fetching products:", data); 
    }
  };

 
  getAllProducts();

});


$(document).ready(function () {
  let searchTerm = '';  
  let category = '';  


  $("input[type='text']").on("input", function () {
    searchTerm = $(this).val().trim(); 
    if (searchTerm === "") {
      getAllProducts({ category });  
    } else {
      getAllProducts({ searchTerm, category });  
    }
  });


  $("#categories div").on("click", function () {
    category = $(this).attr("id").replace("-category", ""); 
    $("#categories div").removeClass("active").css("background-color", "white"); 
    $(this).addClass("active").css("background-color", "#DB4444");  

    
    getAllProducts({ searchTerm, category });
  });


  $("#categories div").hover(
    function () {
      if (!$(this).hasClass("active")) {
        $(this).css("background-color", "#FCE4E4");  
      }
    },
    function () {
      if (!$(this).hasClass("active")) {
        $(this).css("background-color", "white");  
      }
    }
  );

 
  const addItemsForProduct = (productData) => {
    $("#main").empty(); 
    if (productData.length === 0) {
      $("#main").html("<p>No products found for this search or category.</p>");
    } else {
      productData.forEach(item => {
        const productHtml = `
          <div class="bg-[#F5F5F5] w-[270px] h-[350px] object-cover object-contain rounded-lg shadow-md relative group">
            <img class="w-full h-[250px] object-scale-down object-cover object-contain rounded-t-lg" src="${item.gallery[0]}" alt="${item.title}">
            <h3 class="font-medium text-base mt-4">${item.title}</h3>
            <p class="font-medium text-base text-[#DB4444] mt-2">${item.currency}${item.price}</p>
            <button id="addToBasket" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[150px] h-[40px] bg-[#DB4444] text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Add to Basket
            </button>
          </div>
        `;
        $("#main").append(productHtml);
      });
    }
  };


  const getAllProducts = async (params = {}) => {
    const url = "http://localhost:3000/api/products?" + new URLSearchParams(params).toString();
    console.log(url);  

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); 

        if (data.products && data.products.length > 0) {
          addItemsForProduct(data.products);  
        } else {
          $("#main").html("<p>No products found for this search or category.</p>");
        }
      } else {
        console.error("API hatası:", response.status);
      }
    } catch (error) {
      console.error("Ağ hatası:", error);
    }
  };

 
  getAllProducts({});
});

$(document).ready(function () {
  let searchTerm = '';  
  let category = '';  
  let currentPage = 1;  
  let pageSize = 5; 

  
  $("input[type='text']").on("input", function () {
      searchTerm = $(this).val().trim();  
      
      getAllProducts({ searchTerm, category, page: currentPage, pageSize });
  });

  
  $("#categories div").on("click", function () {
      category = $(this).attr("id");  
      if (category) {
          category = category.replace("-category", "");  
          console.log("Seçilen Kategori: ", category);  

          
          $("#categories div").removeClass("bg-red-500");  
          $(this).addClass("bg-red-500");  
     
          getAllProducts({ searchTerm, category, page: currentPage, pageSize });
      }
  });

  
  const addItemsForProduct = (productData) => {
      $("#main").empty(); 
      if (productData.length === 0) {
          $("#main").html("<p>No products found for this search or category.</p>");
      } else {
          productData.forEach(item => {
              const productHtml = `
                  <div class="bg-gray-100 w-[270px] h-[350px] rounded-lg shadow-md relative group">
                      <img class="w-full h-[250px] object-contain rounded-t-lg" src="${item.gallery[0]}" alt="${item.title}">
                      <h3 class="font-medium text-base mt-4">${item.title}</h3>
                      <p class="font-medium text-base text-red-500 mt-2">${item.currency}${item.price}</p>
                      <button id="addToBasket" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[150px] h-[40px] bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Add to Basket
                      </button>
                  </div>
              `;
              $("#main").append(productHtml);
          });
      }
  };

  
  const getAllProducts = async (params = {}) => {
      const url = "http://localhost:3000/api/products?" + new URLSearchParams(params).toString();
      console.log("API URL: ", url);
      try {
          const response = await fetch(url, {
              method: "GET",
              headers: {
                  Accept: "application/json"
              }
          });

          if (response.ok) {
              const data = await response.json();
              console.log("Apiden Gelen Data: ", data);  

              if (data.products && data.products.length > 0) {
                  addItemsForProduct(data.products);  
              } else {
                  $("#main").html("<p>No products found for this search or category.</p>");
              }
          } else {
              console.error("API error:", response.status);
          }
      } catch (error) {
          console.error("error:", error);
      }
  };


  getAllProducts({});
});