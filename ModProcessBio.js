/*  Projet Web avancé
*   Modélisation d'un processus biologique - Sujet 8
*   Auteur: Céline Mathez
*   10/04/2020
*/

//////          INITIALISATION          //////

    // Setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width = window.innerWidth;     // size of canvas
const height = canvas.height = window.innerHeight;

    // Constantes
        // Membrane

const x_mb = width/4;   // coordonate x of rectangle which representing membrane
const y_mb = height/4;  // coordonate y of rectangle which representing membrane
const w_mb = width/2;   // width of rectangle which representing membrane
const h_mb = height/2;  // height of rectangle which representing membrane

        // coordonate (x,y) for neurotransmitters' position

const top_left_vertex = [x_mb,y_mb]; 
const bottom_right_vertex = [(x_mb + w_mb),(y_mb + h_mb)];

        // neurotransmitters' speed

const speed = 3;


//////          CLASS CREATION AND FUNCTIONS          //////

    // Neurotrasmitters

class Neurotransmitters {

    constructor(x, y, velx, vely, color, size) {
       this.x = x;
       this.y = y;
       this.velx = velx;        // progression on the x-axis
       this.vely = vely;        // progression on the y-axis
       this.color = color;
       this.size = size;
    }

        // function to draw a neurotransmitter

    draw_neurotransmitter() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

        // function to move a neurotransmitteur

    update() {
        
        this.x += this.velx;
        this.y += this.vely;
      
    }

        // function to determine if a neurotransmitter is outside of the canvas

    out_of_canvas() {
        if (this.x > width || this.y > height){
            return true;
        }
        if (this.x <0 || this.y <0) {
            return true;
        }
        else{
            return false;
        }
    }

        // function to detect a collision between a neurotransmitter ans a closed receptor

    collision_detect() {
        for (let j = 0; j < receptors.length; j++) {

            const dx = this.x - (receptors[j].x1 + 20);  // add 20 to have coordonates of receptor's center
            const dy = this.y - (receptors[j].y1 + 20);
            const distance = Math.sqrt(dx * dx + dy * dy);
      
            if (this.size !=0 && distance <= (this.size + 20)) {    // if collison: change closed receptor in opened receptor
                receptors[j].velx1 = this.velx;                     // and neurotransmitter disappears
                receptors[j].color1 = 'rgb( 61, 150, 0)'; 
                receptors[j].vely1 = this.vely;
                receptors[j]._width1=60;
                this.size=0;
            
            }
        }
    }
    
}

    // Receptors

class Receptors {

    constructor(x1, y1, velx1, vely1, color1, _width1, _height1) {
        this.x1 = x1;
        this.y1 = y1;
        this.velx1 = velx1;         // progression on the x-axis
        this.vely1 = vely1;         // progression on the y-axis
        this.color1 = color1;
        this._width1 = _width1;
        this._height1 = _height1;
    }

        // function to draw a closed receptor

    draw_closed_receptor() {
    ctx.beginPath();
    ctx.fillStyle = this.color1;
    ctx.fillRect(this.x1, this.y1, this._width1, this._height1);
    }

        // function to move a receptor (usefull when it changes in opened receptor)

    update() {
        
        this.x1 += this.velx1;
        this.y1 += this.vely1;
      
    }

}

    // Functions

        // function to get a random integer between min and ma

function get_random_number(min,max) {
    const num = Math.floor(Math.random()*(max-min)) + min;
    return num;
 }

        // function to get a random float number between min and max

function get_random_float_number(min,max) {
    const num = (Math.random()*(max-min)) + min;
    return num;
}

        // function to get random coordonate(x,y) for closed receptors

function getxy(){
    let side = get_random_number(1,5); 
    let x;
    let y;
    if(side===1){       // each number correspond to a side of the membrane
        x = get_random_number((x_mb+30),(x_mb+w_mb-55));
        y = y_mb-20;
    }
    if(side===2){
        x = x_mb + w_mb - 20;
        y = get_random_number((y_mb+30),(y_mb+h_mb-55));
    }
    if(side===3){
        x = get_random_number((x_mb+30),(x_mb+w_mb-55));
        y = y_mb + h_mb -20;
    }
    if(side===4){
        x = x_mb - 20;
        y = get_random_number((y_mb+30),(y_mb+h_mb-55));
    }
    return [x,y];
} 


//////          OBJECTS CREATION          //////

    // Neurotransmitters

var neurotransmitters = [];             // creation of a list to put into neurotransmitters
var nb_neurotransmitters = get_random_number(20,30);

while (neurotransmitters.length < nb_neurotransmitters) {
    const size=15;
    let vertex = get_random_number(0,2); // choose position for a neurotransmitter
    let x;
    let y;
    let velx;
    let vely;
    if (vertex===0){
        x = top_left_vertex[0];
        y = top_left_vertex[1];
        velx = get_random_float_number(0,3);
        vely = Math.sqrt(speed *speed - (velx * velx));

    }
    else{
        x = bottom_right_vertex[0];
        y = bottom_right_vertex[1];
        velx = get_random_float_number(0,-3);
        vely = - Math.sqrt(speed * speed - (velx * velx));
        
    }

    let  neurotransmitter= new Neurotransmitters(  // creation of a neurotransmitter
      x,
      y,
      velx,
      vely,
      'rgb( 240, 195, 0)',
      size
   );

  neurotransmitters.push(neurotransmitter);
}
    // Receptors

var receptors = [];                     // creation of a list to put into receptors
var nb_receptors = get_random_number(12,18);
while (receptors.length < nb_receptors){
    let coordonate = getxy();           // creation of random positions on sides of membrane
    let x = coordonate[0];
    let y = coordonate[1];
    let receptor = new Receptors(       // creation of a receptor
        x,
        y,
        0,
        0,
        'rgba(0, 139, 204, 1)',
        40,
        40
    );
    receptors.push(receptor); 

}

//////          START SIMULATION          //////


function loop() {

        // design of canvas

    ctx.fillStyle = 'rgba(250, 250, 250, 1)';   
    ctx.fillRect(0, 0, width, height);

        // design of membrane

    ctx.strokeStyle= 'rgba(0, 0, 0, 1)';        
    ctx.strokeRect(x_mb, y_mb, w_mb, h_mb);

        // text in the canvas
    ctx.font = "20px serif";
    ctx.fillStyle='rgb(50,50,50)';
    ctx.fillText("Espace pré-synaptique", 50, 50);

    ctx.font = "20px serif";
    ctx.fillStyle='rgb(50,50,50)';
    ctx.fillText("Espace post-synaptique", x_mb+100, y_mb + 100);

        // receptors' conception 

    for(let r=0;r < receptors.length; r++){
        receptors[r].draw_closed_receptor();
        receptors[r].update();
    }

        // neurotransmitters

    if(neurotransmitters.length===0){  // stop simulation when neurotransmitters' list is empty
        cancelAnimationFrame(loop);
    }

    else{
        for (let i = 0; i < neurotransmitters.length; i++) { // draw all neurotransmitters
        neurotransmitters[i].draw_neurotransmitter();
        }
        
        neurotransmitters[0].update();              // only one neurotransmitter move
        neurotransmitters[0].collision_detect();    // detection of colision
        if(neurotransmitters[0].out_of_canvas()){   // if neurotransmitter outside of canvas
        neurotransmitters.shift();                  // it is deleted of the list
        }
    }
 
    requestAnimationFrame(loop);        // execute animation

}

    // function call for simulation
    
loop();
