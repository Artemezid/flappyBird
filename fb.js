const imgURL = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const start = document.querySelector('.start');
const restart = document.querySelector('.restart');
const img = new Image();
img.src = imgURL;

//звуки
const audio = new Audio();
audio.src = './audio/point-101soundboards.mp3';
const Background_Audio = new Audio();
Background_Audio.src = './audio/5-track-5-101soundboards.mp3'; 
const HITandDIE_Audio = new Audio();
HITandDIE_Audio.src = './audio/flappy-bird-hit-sound-101soundboards.mp3'
const FLY_Audio = new Audio();
FLY_Audio.src = './audio/flap-101soundboards.mp3'

//основные параметры
let gamePlaying = false

const gravity = .4,
speed = 4.2,
size = [51, 36],
jump = - 10,
cTenth = canvas.width / 10

let index = 0,
bestScore = 0,
flight,
flyHeight,
currentScore = 0,
pipe,
pipes

//параметры труб
const pipeWidth = 78,
pipeGap = 270,
pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth

const setup = () => {
    
    flight = jump

    flyHeight = (canvas.height / 2) - ([size[1]] / 2)

    //массив  - 3 трубы
    pipes = Array(3).fill().map((a, i) => [
        canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()
    ])
}

const render = () => {
    index++

    //первая часть фона
    ctx.drawImage(
        img,
        0,
        0,
        431,
        canvas.height,
        -((index*(speed/2))%canvas.width) + canvas.width,
        0,
        canvas.width,
        canvas.height
        )

    //вторая часть фона
    ctx.drawImage(
        img,
        0,
        0,
        431,
        canvas.height,
        -(index*(speed/2))%canvas.width,
        0,
        canvas.width,
        canvas.height
    )

    if(gamePlaying){
        start.classList.remove('active')
        pipes.map(pipe => {
            //движение
            pipe[0] -= speed

            //верхняя
            ctx.drawImage(
                img,
                432,
                588 - pipe[1],
                pipeWidth,
                pipe[1],
                pipe[0],
                0,
                pipeWidth,
                pipe[1]
            )

            //нижняя
            ctx.drawImage(
                img,
                432 + pipeWidth,
                108,
                pipeWidth,
                canvas.height - pipe[1] + pipeGap,
                pipe[0],
                pipe[1] + pipeGap,
                pipeWidth,
                canvas.height - pipe[1] + pipeGap
            )

            //очко и новая труба
            if(pipe[0] <= -pipeWidth){
                currentScore++
                audio.play()
              
                //проверка на лучший результат
                bestScore = Math.max(bestScore, currentScore)

                //удалить и создать новую
                pipes = [
                    ...pipes.slice(1),
                    [pipes.at(-1)[0] + pipeGap + pipeWidth,pipeLoc()]
                ]
            }

            //попадание по трубе 
            if([
                pipe[0] <= cTenth + size[0],
                pipe[0] + pipeWidth >= cTenth,
                pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
                ].every(elem => elem)
            ){
                HITandDIE_Audio.play()
                gamePlaying = false
            }
        })
        //птица
        ctx.drawImage(
            img,
            432,
            Math.floor((index % 9) / 3) * size[1],
            ...size,
            cTenth,
            flyHeight,
            ...size
        )
        flight += gravity
        flyHeight = Math.min(flyHeight + flight, canvas.height + size[1])
        Background_Audio.play()
    }

    if(!gamePlaying){
        start.classList.add('active')
        ctx.drawImage(
            img,
            432,
            Math.floor((index % 9) / 3) * size[1],
            ...size,
            cTenth,
            flyHeight,
            ...size
        )
        flyHeight = (canvas.height / 2) - (size[1] / 2)

        Background_Audio.pause()
        Background_Audio.currentTime = 0

        ctx.fillText("Your score :" + `${currentScore}`, 100, 100)
        ctx.fillText("Best score :" + localStorage.getItem('bestScore', `${bestScore}`), 100, 150)
        ctx.font = 'bold 30px sans-serif';
        setup()
    }


    document.getElementById('bestScore').innerHTML = `BestScore: `+ localStorage.getItem('bestScore', `${bestScore}`);
    if(localStorage.getItem('bestScore', `${bestScore}`) < currentScore){
        localStorage.setItem('bestScore', `${bestScore}`);
    }
    document.getElementById('currentScore').innerHTML = `Current: ${currentScore}` ;

    //анимация
    window.requestAnimationFrame(render)
}

setup()
img.onload = render

//старт
start.addEventListener('click', () => gamePlaying = true)
start.addEventListener('click', () => currentScore= 0)
canvas.onclick = () => {
    flight = jump;
    if(gamePlaying == true){
        FLY_Audio.play();
    }
}


