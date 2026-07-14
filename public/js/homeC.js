document.addEventListener("DOMContentLoaded",()=>{

    const images = document.querySelectorAll(".hero-img");

    console.log(images.length);


    let current = 0;


    setInterval(()=>{

        images[current].classList.remove("active");


        current++;

        if(current >= images.length){
            current = 0;
        }


        images[current].classList.add("active");


    },4000);

});