// 
// .then((response)=>response.json())
// .then(data=>console.log(data))

const searchBtn = document.getElementById('search-btn');
const imagesSection = document.getElementById("images-section");
// const noSearchMsgSpan = document.getElementById("no-search-msg");
const showMoreBtn = document.getElementById("show-more-btn");
const accessKey = "594ycZhOVU7QspSLw6iK_wGZyfLaxmujSQG3v-qdhrU";
let query = "";
let page = 1;

function displayImages(dataArray){
    showMoreBtn.style.display = "";
    dataArray.forEach((eachData)=>{
        // console.log(eachData);
        let eachImageContainer = document.createElement('div');
        eachImageContainer.className = "aspect-square p-2 relative";
        eachImageContainer.innerHTML = `
                <div class="w-full h-full">
                    <img src="${eachData.urls.small}" alt="" class="object-contain w-full h-full">
                    <button id="download-btn" class="bg-transparent backdrop-blur-2xl absolute right-0 left-0 bottom-0  rounded-md px-6 py-1 text-black font-semibold cursor-pointer">Download</button>
                </div>`;
        imagesSection.appendChild(eachImageContainer);
        eachImageContainer.querySelector('#download-btn').addEventListener('click',async ()=>{
            // This concept got From Chatgpt, but got to know some facts like convert to blob
            // and then creating blob URL
            const downloadResponse = await fetch(`${eachData.links.download_location}?client_id=${accessKey}`);
            const downloadData = await downloadResponse.json();
            const imageUrl = downloadData.url; 
            
            const response = await fetch(imageUrl);
            console.log(response);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

        
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = eachData.alt_description || 'downloaded-image.jpg';
            link.click();
            URL.revokeObjectURL(blobUrl);
        });
    })
    showMoreBtn.style.display = "block";
}

async function fetchImages(){
    if(page==1) imagesSection.innerHTML = "";
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&page=${page}&client_id=${accessKey}`);
    const data = await response.json();
    if(data.results.length===0){
        return;
    }
    console.log(data.results);
    displayImages(data.results);
}


showMoreBtn.addEventListener('click',()=>{
    page++;
    fetchImages();
});

searchBtn.addEventListener('click',()=>{
    showMoreBtn.style.display = "";
    let searchInput = document.getElementById("search-input");
    query = searchInput.value.trim(); 
    page=1;
    if(query!==""){
        fetchImages();
    }
    else{
        window.location.reload();
    } 
})