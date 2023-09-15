import "./styles.css";

const BASE_URL = "https://staging.iamdave.ai"
const headers = {
  "Content-Type":"application/json",
  "X-I2CE-ENTERPRISE-ID": "dave_vs_covid",
  "X-I2CE-USER-ID": "ananth+covid@i2ce.in",
  "X-I2CE-API-KEY": "0349234-38472-1209-2837-3432434"
}

document.addEventListener( "DOMContentLoaded", ()=>{
  getFilter('channel');
  getFilter('state');
  getFilter('category');  
  getSuppliers(1)
  document.getElementById('next').addEventListener('click',()=> getNextPage())
  document.getElementById('prev').addEventListener('click',()=> getPrevPage())
  document.getElementById('sort').addEventListener('click',()=> getSortedSuppliers())
  document.getElementById('channel').addEventListener('change',()=> getSuppliers(1,`&channel=${document.getElementById('channel').value}`))
  document.getElementById('state').addEventListener('change',()=> getSuppliers(1,`&state=${document.getElementById('state').value}`))
  document.getElementById('category').addEventListener('change',()=> getSuppliers(1,`&category=${document.getElementById('category').value}`))

});

function getFilter(filterName) {
  fetch(BASE_URL+ '/unique/supply/'+ filterName,{
    method: "GET",
    headers: headers
  }).then(response => response.json()) 
  .then(json => {
    let filterCode = ``;
    json && json.data && Object.keys(json.data).map(item=>{
      if(item.trim()) filterCode = filterCode + `<option value='${item}'>${item}</option>`
    })
    const filter = document.getElementById(filterName)
    filter.innerHTML = filterCode;
 
  })
}

function getSuppliers(page_number, params) {
  const url = params? BASE_URL+ '/list/supply?_page_number='+ page_number + params
                :BASE_URL+ '/list/supply?_page_number='+ page_number

  fetch(url,{
    method: "GET",
    headers: headers
  }).then(response => response.json()) 
  .then(json => {
  let cardsCode = ``;
  json&& json.data &&json.data.map((item) =>{
  cardsCode =  cardsCode +
    `<div class="card">
	  <div class="container">
		Category: ${item.category}
    <br/>
    Channel: ${item.channel}
    <br/>
    Description: ${item.request_description}
    <br/>
    Contact Numbers: ${item.contact_numbers}
    <br/>
    State: ${item.state}
    <br/>
    District: ${item.district}
    <br/>Source Time: ${item.source_time}
	  </div>
	</div>
  `
})
  const suppliers = document.getElementById("suppliers")
  suppliers.innerHTML = cardsCode;
 
  const pageSize = `${(json.page_number-1)*json.page_size} - ${json.page_number*json.page_size}`;
  document.getElementById("pageSize").innerHTML = pageSize;

  const prev = document.getElementById('prev');
  prev.disabled = json.is_first;

  const next = document.getElementById('next');
  next.disabled = json.is_last;    

  localStorage.setItem('pageNumber', json.page_number);
}) 
.catch(err => console.log(err))
}

function getPrevPage() {
  getSuppliers(parseInt(localStorage.getItem('pageNumber'))-1)
}

function getNextPage() {
  getSuppliers(parseInt(localStorage.getItem('pageNumber'))+1)
}

function getSortedSuppliers() {
  let SORT_URL = '&_sort_by=source_time&_sort_reverse=true';
  getSuppliers(1, SORT_URL)
}