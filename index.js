const object = document.getElementById("rocket");
const name_pole = document.getElementById("player-name");
const difficulty = document.getElementById("difficulty");
const btn_start = document.getElementById("start-game");
const start_menu = document.getElementById("main-menu");
const game_window = document.getElementById("game-screen");
const end_window = document.getElementById("end-screen");
const btn_exit = document.getElementById("exit-end-game");
const btn_reload = document.getElementById("restart-game");
const fuel_bar = document.getElementById("fuel-bar");
const hp_bar = document.getElementById("health-bar");
const gameCanvas = document.getElementById('game-canvas');

let player_name = '';
let game_mode = '';
let score = 0;

let fuel = 100;
let hp = 100;
    
let posX = 0;
let posY = 0;
let speed = 5;

let statusInterval;
let meteorInterval;
let fuelInterval;
let hpInterval;
let dieAnimationFrame;
let isGameRunning = false;

let currentKeyHandler = null;
let currentExitHandler = null;
let currentReloadHandler = null;

const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Настройки сложности
const difficultySettings = {
    'Лёгкий': {
        fuelConsumption: 1,
        meteorInterval: 1000,
        hpSpawnInterval: 1000,
        fuelSpawnInterval: 1000
    },
    'Средний': {
        fuelConsumption: 1.5,
        meteorInterval: 700,
        hpSpawnInterval: 1500,
        fuelSpawnInterval: 1500
    },
    'Сложный': {
        fuelConsumption: 2,
        meteorInterval: 500,
        hpSpawnInterval: 2000,
        fuelSpawnInterval: 2000
    }
};

async function start_game() {
    clearGame();
    
    // Применяем настройки сложности
    const settings = difficultySettings[game_mode] || difficultySettings['лёгкий'];;
    
    isGameRunning = true;
    document.getElementById('current-player').textContent = player_name;
    document.getElementById('end-player-name').textContent = player_name;
    document.getElementById('end-difficulty').textContent = game_mode;
    document.getElementById('current-difficulty').textContent = game_mode;
    game_window.style.display = 'block';

    const keyDownHandler = (event) => {
        if (keysPressed.hasOwnProperty(event.key)) {
            keysPressed[event.key] = true;
        }
    };

    const keyUpHandler = (event) => {
        if (keysPressed.hasOwnProperty(event.key)) {
            keysPressed[event.key] = false;
        }
    };
    
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    
    currentKeyDownHandler = keyDownHandler;
    currentKeyUpHandler = keyUpHandler;

    const moveRocket = () => {
        if (!isGameRunning) return;
        
        if (keysPressed.ArrowUp && posY !== -300) posY -= speed;
        if (keysPressed.ArrowDown && posY !== 80) posY += speed;
        if (keysPressed.ArrowLeft && posX !== -300) posX -= speed;
        if (keysPressed.ArrowRight && posX !== 280) posX += speed;
        
        object.style.transform = `translate(${posX}px, ${posY}px)`;
        moveAnimationFrame = requestAnimationFrame(moveRocket);
    };
    
    moveAnimationFrame = requestAnimationFrame(moveRocket);

    await status_game(settings);
    await meteor(settings);
    await fuel_span(settings);
    await hp_span(settings);
    die();
};

let currentKeyDownHandler = null;
let currentKeyUpHandler = null;
let moveAnimationFrame = null;

function clearGame() {
    if (currentKeyDownHandler) {
        document.removeEventListener("keydown", currentKeyDownHandler);
        currentKeyDownHandler = null;
    }
    if (currentKeyUpHandler) {
        document.removeEventListener("keyup", currentKeyUpHandler);
        currentKeyUpHandler = null;
    }
    
    cancelAnimationFrame(moveAnimationFrame);
    clearInterval(statusInterval);
    clearInterval(meteorInterval);
    clearInterval(fuelInterval);
    clearInterval(hpInterval);
    cancelAnimationFrame(dieAnimationFrame);
    
    const asteroids = document.querySelectorAll('.asteroid');
    asteroids.forEach(asteroid => asteroid.remove());
    
    const fuels = document.querySelectorAll('.fuel_item');
    fuels.forEach(fuel => fuel.remove());
    
    const hps = document.querySelectorAll('.hp_item');
    hps.forEach(hp => hp.remove());
    
    Object.keys(keysPressed).forEach(key => {
        keysPressed[key] = false;
    });
    
    isGameRunning = false;
}

function end_game(flag) {
    clearGame();
    
    game_window.style.display = 'none';
    end_window.style.display = 'block';
    document.getElementById('end-score').textContent = score;
    
    if (currentExitHandler) {
        btn_exit.removeEventListener('click', currentExitHandler);
    }
    if (currentReloadHandler) {
        btn_reload.removeEventListener('click', currentReloadHandler);
    }
    
    const exitHandler = function() {
        location.reload();
    };
    
    const reloadHandler = async function() {
        game_window.style.display = 'block';
        end_window.style.display = 'none';
        hp = 100;
        fuel = 100;
        score = 0;
        posX = 0;
        posY = 0;
        object.style.transform = `translate(${posX}px, ${posY}px)`;
        
        isGameRunning = true;
        await start_game();
    };
    
    btn_exit.addEventListener('click', exitHandler);
    btn_reload.addEventListener('click', reloadHandler);
    
    currentExitHandler = exitHandler;
    currentReloadHandler = reloadHandler;
};

async function die() {
    if (!isGameRunning) return;
    
    const rocketRect = object.getBoundingClientRect();
    
    const fuels = document.querySelectorAll('.fuel_item');
    fuels.forEach(fuel_item => {
        const fuelRect = fuel_item.getBoundingClientRect();
        
        if (rocketRect.left < fuelRect.right && 
            rocketRect.right > fuelRect.left &&
            rocketRect.top < fuelRect.bottom && 
            rocketRect.bottom > fuelRect.top) {
            fuel += 25;
            if (fuel > 100) fuel = 100;
            fuel_item.remove();
        }
    });

    const hps = document.querySelectorAll('.hp_item');
    hps.forEach(hp_item => {
        const hpRect = hp_item.getBoundingClientRect();
        
        if (rocketRect.left < hpRect.right && 
            rocketRect.right > hpRect.left &&
            rocketRect.top < hpRect.bottom && 
            rocketRect.bottom > hpRect.top) {
            hp += 25;
            if (hp > 100) hp = 100;
            hp_item.remove();
        }
    });

    const asteroids = document.querySelectorAll('.asteroid');
    asteroids.forEach(asteroid => {
        const asteroidRect = asteroid.getBoundingClientRect();
        
        if (rocketRect.left < asteroidRect.right && 
            rocketRect.right > asteroidRect.left &&
            rocketRect.top < asteroidRect.bottom && 
            rocketRect.bottom > asteroidRect.top) {
            hp -= 30;
            asteroid.remove();
        }
    });
    
    dieAnimationFrame = requestAnimationFrame(die);
} 

async function meteor(settings) {
    meteorInterval = setInterval(() => {
        if (!isGameRunning) return;
        
        const random_left = Math.round(Math.random() * 580);
        
        const asteroid = document.createElement('div');
        asteroid.className = 'asteroid';
        asteroid.style.top = '-20px';
        asteroid.style.left = `${random_left}px`;
        asteroid.textContent = '*';
        gameCanvas.appendChild(asteroid);
        setTimeout(() => {
            asteroid.remove();
        }, 4000);
    }, settings.meteorInterval);
}

async function fuel_span(settings) {
    fuelInterval = setInterval(() => {
        if (!isGameRunning) return;
        
        const random_left = Math.round(Math.random() * 580);
        
        const fuel_item = document.createElement('div');
        fuel_item.className = 'fuel_item';
        fuel_item.style.top = '-20px';
        fuel_item.style.left = `${random_left}px`;
        fuel_item.textContent = '*';
        gameCanvas.appendChild(fuel_item);
        setTimeout(() => {
            fuel_item.remove();
        }, 4000);
    }, settings.fuelSpawnInterval);
}

async function hp_span(settings) {
    hpInterval = setInterval(() => {
        if (!isGameRunning) return;
        
        const random_left = Math.round(Math.random() * 580);
        
        const hp_item = document.createElement('div');
        hp_item.className = 'hp_item';
        hp_item.style.top = '-20px';
        hp_item.style.left = `${random_left}px`;
        hp_item.textContent = '*';
        gameCanvas.appendChild(hp_item);
        setTimeout(() => {
            hp_item.remove();
        }, 4000);
    }, settings.hpSpawnInterval);
}

async function status_game(settings) {
    statusInterval = setInterval(() => {
        if (!isGameRunning) return;
        
        fuel -= settings.fuelConsumption;
        score += 1;
        document.getElementById('fuel-value').textContent = fuel;
        document.getElementById('health-value').textContent = hp;
        document.getElementById('score').textContent = score;
        fuel_bar.style.width = `${fuel}%`;
        hp_bar.style.width = `${hp}%`;

        if (fuel <= 0) {
            end_game(fuel);
            return;
        }
        if (hp <= 0){
            end_game(hp);
            return;
        };
    }, 200);
};

btn_start.addEventListener('click', async function() {
    player_name = name_pole.value.trim();
    game_mode = difficulty.value;
    
    if (!player_name) {
        alert('Введите имя');
        return;
    }

    // Проверяем, что выбран допустимый уровень сложности
    if (!difficultySettings.hasOwnProperty(game_mode)) {
        game_mode = 'лёгкий';
    }

    start_menu.style.display = 'none';
    await start_game();
});