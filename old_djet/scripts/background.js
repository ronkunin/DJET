let particle_container = document.querySelector("#particle_container");
let particle_arr = [];
let particle_num = 20;

for (let i = 0 ; i < particle_num ; i++) {

    this.phase_angle = Math.floor(Math.random() * -100);
    this.x = Math.floor(Math.random() * window.innerWidth);
    this.y = Math.floor(Math.random() * window.innerHeight);
    this.r = Math.floor(Math.random() * 90 + 10);
    this.hue = Math.floor(Math.random() * 150 + 140);

    particle_container.innerHTML += `
    <div class="particle" style="
    left:${this.x}px;
    top:${this.y}px;
    width:${this.r}px;
    height:${this.r}px;
    background: linear-gradient(45deg, hsl(${205}deg, 75%, 60%),hsl(${235}deg, 75%, 60%));
    /*box-shadow: 0 0 9px -1px hsl(${220}deg, 75%, 60%);*/
    animation-delay: ${this.phase_angle}s;
    "></div>`;
}