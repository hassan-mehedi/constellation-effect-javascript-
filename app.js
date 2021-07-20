const canvas = document.getElementsByClassName("canva")[0];
const brush = canvas.getContext("2d");
let ballsArray = [];
let distanceArray = [];
const mouse = {
    x: null,
    y: null,
    size: 100,
};

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});

canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Balls {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.mainX = this.x;
        this.mainY = this.y;
        this.size = 5;
        this.color = "white";
        this.weightOfBall = Math.random() * 20 + 1;
    }
    draw() {
        brush.fillStyle = this.color;
        brush.beginPath();
        brush.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        brush.fill();
    }
    moveBalls(obj) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let goToX = dx / distance;
        let goToY = dy / distance;

        let maxDistance = mouse.size;
        let speed = (maxDistance - distance) / maxDistance;
        if (speed < 0) {
            speed = 0;
        }
        let speedX = speed * goToX * this.weightOfBall;
        let speedY = speed * goToY * this.weightOfBall;

        if (distance < mouse.size) {
            this.x -= speedX;
            this.y -= speedY;
        }
        if (distance > 50 && distance < 100) {
            distanceArray.push(obj);
        } else {
            if (this.x !== this.mainX) {
                let x = this.x - this.mainX;
                this.x -= x / 10;
            }
            if (this.y !== this.mainY) {
                let y = this.y - this.mainY;
                this.y -= y / 10;
            }
        }
    }
}

brush.fillStyle = "white";
brush.font = "3vw Poppins";
brush.fillText("M", 10, 30);
const imageData = brush.getImageData(0, 0, 200, 100);

function createBalls() {
    for (let i = 0; i < imageData.height; i++) {
        for (let j = 0; j < imageData.width; j++) {
            if (imageData.data[i * 4 * imageData.width + j * 4 + 3] > 128) {
                let x = j;
                let y = i;
                ballsArray.push(new Balls(x * 20, y * 20));
            }
        }
    }
}

createBalls();

function connectDots() {
    for (let i = 0; i < ballsArray.length; i++) {
        for (let j = i; j < ballsArray.length; j++) {
            let dx = ballsArray[i].x - ballsArray[j].x;
            let dy = ballsArray[i].y - ballsArray[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 30) {
                brush.strokeStyle = "white";
                brush.lineWidth = 0.5;
                brush.beginPath();
                brush.moveTo(ballsArray[i].x, ballsArray[i].y);
                brush.lineTo(ballsArray[j].x, ballsArray[j].y);
                brush.stroke();
                brush.closePath();
            }
        }
    }
    if (distanceArray.length > 1) {
        for (let i = 0; i < distanceArray.length; i++) {
            for (let j = i; j < distanceArray.length; j++) {
                let dx = distanceArray[i].x - distanceArray[j].x;
                let dy = distanceArray[i].y - distanceArray[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    brush.strokeStyle = "#37FA21";
                    brush.lineWidth = 0.5;
                    brush.beginPath();
                    brush.moveTo(distanceArray[i].x, distanceArray[i].y);
                    brush.lineTo(distanceArray[j].x, distanceArray[j].y);
                    brush.stroke();
                    brush.closePath();
                }
            }
        }
    }
}

function animate() {
    brush.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < ballsArray.length; i++) {
        ballsArray[i].draw();
        ballsArray[i].moveBalls(ballsArray[i]);
    }
    connectDots();
    distanceArray = [];
    requestAnimationFrame(animate);
}
animate();
