const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "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";
let isImageGenerating = false;



const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        // Set the image to ai generated image data
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImg;


        // When image loaded, remove loading class and set download attribute
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImg);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        // send a request to openai-api to generate an image
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: parseInt(userImgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
    });

    if(!response.ok) throw new Error("Couldn't generate an image");

    const { data } = await response.json(); // Get data from response
    updateImageCard([... data, userPrompt, userImgQuantity])
    } catch (error) {
        alert(error.message);
    } finally {
        isImageGenerating = false;
    }
}

const handleFormSubmisson = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;
    isImageGenerating = true;
    
    // Get input form user values from form
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = e.srcElement[1].value;


    // Create html markup for image with loading state
    const imgCardMarkup = Array.from({length: userImgQuantity}, () => `    <div class="img-card loading">
    <img src="images/loader.svg" alt="image">
    <a href="#" class="download-btn">
        <img src="images/download.svg" alt="download icon">
    </a>
</div>`
    ).join("");
    
    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}


generateForm.addEventListener("submit", handleFormSubmisson);