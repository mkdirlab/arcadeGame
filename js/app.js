// -----------------------------------------------------------------------------
// General
// -----------------------------------------------------------------------------

// set up initial counts for score and gems
var score = 0,
    numGemBlue = 0,
    numGemGreen = 0,
    numGemOrange = 0,
    numGemStar = 0;

// set up function for reseting all counts to initial values
var initialValues = function() {
    'use strict';
    score = 0;
    numGemBlue = 0;
    numGemGreen = 0;
    numGemOrange = 0;
    numGemStar = 0;
};

// set up function to increment ..
//... score count
var addWin = function() {
    'use strict';
    score += 10;
};
// ... gem count
var addBlue = function() {
    'use strict';
    numGemBlue += 1;
};

var addGreen = function() {
    'use strict';
    numGemGreen += 1;
};

var addOrange = function() {
    'use strict';
    numGemOrange += 1;
};

var addStar = function() {
    'use strict';
    numGemStar +=1;
};

// set up function to display
// ... score count
var displayScore = function() {
    'use strict';
    document.querySelector('.inline .score').innerHTML = score;
};
// .. gem count
var displayGems = function() {
    'use strict';
    document.querySelector('.inline .blue').innerHTML = numGemBlue;
    document.querySelector('.inline .green').innerHTML = numGemGreen;
    document.querySelector('.inline .orange').innerHTML = numGemOrange;
    document.querySelector('.inline .star').innerHTML = numGemStar;
};
// ... score & gem count
var updateDisplay = function() {
    'use strict';
    displayScore();
    displayGems();
};

// set up function to randomize array
var randomize = function(arr) {
    'use strict';
    return arr[Math.floor(Math.random()*arr.length)];
};



// -----------------------------------------------------------------------------
// Enemy Module
// -----------------------------------------------------------------------------

// enemy class
var Enemy = function() {
    'use strict';
    // set up
    var Bug = 'images/enemy-bug.png',
        Rock = 'images/enemy-rock.png';
    var potentialEnemies = [ Bug, Bug, Bug, Bug, Rock, Rock];
    this.sprite = randomize(potentialEnemies);

    // set up initial location
    var potentialxValues = [ -101, -404, -808, -1212],
        potentialyValues = [ 62, 145, 228 ];
    this.x = randomize(potentialxValues);
    this.y = randomize(potentialyValues);

    // set up speed
    var potentialSpeedVales = [ 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2 ];
    this.speed = randomize(potentialSpeedVales);
};

Enemy.prototype.update = function(dt) {
    'use strict';
    // set up difficult factor (useful for future implementation of levels)
    var factor = 101;

    // calculate movement
    var movement = (factor * this.speed * dt);

    // update location
    switch(this.speed) {
        case 1:
            this.x += movement;
            break;
        case 2:
            this.x += movement;
            break;
        case 3:
            this.x += movement;
            break;
    }
};

Enemy.prototype.reset = function() {
    'use strict';
    var potentialxValues = [ -101, -404, -808, -1212];
    this.x = randomize(potentialxValues);
};


Enemy.prototype.render = function() {
    'use strict';
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// set up function to create new Enemies
var newEnemies = function () {
    'use strict';
    var numEnemies = allEnemies.length;
    for(var i = 0; i < numEnemies; i++) {
        allEnemies[i].reset();
    }
};



// -----------------------------------------------------------------------------
// Gem Module
// -----------------------------------------------------------------------------

// gem class (enemy sub-class)
var Gem = function() {
    'use strict';
    // set up
    var GemBlue = 'images/gem-blue.png',
        GemGreen = 'images/gem-green.png',
        GemOrange = 'images/gem-orange.png',
        GemStar = 'images/gem-star.png';
    var potentialGems = [GemBlue, GemBlue, GemBlue, GemBlue, GemBlue, GemBlue,
                         GemGreen, GemGreen, GemGreen, GemGreen,
                         GemOrange, GemOrange,
                         GemStar];
    this.sprite = randomize(potentialGems);

    // set up initial location
    var potentialxValues = [ -151, -454, -858 ],
        potentialyValues = [ 62, 145, 228 ];
    this.x = randomize(potentialxValues);
    this.y = randomize(potentialyValues);

    // set up speed
    var potentialSpeedVales = [ 1, 2, 3, 4 ];
    this.speed = randomize(potentialSpeedVales);
};

Gem.prototype = Object.create(Enemy.prototype);
Gem.prototype.constructor = Gem;

// set up function for creating new gems
var newGems = function () {
    'use strict';
    for(var i = 0; i < allGems.length; i++) {
        allGems[i].reset();
    }
};



// -----------------------------------------------------------------------------
// Player Module
// -----------------------------------------------------------------------------

// player class
var Player = function() {
    'use strict';
    this.x = 303;
    this.y = 394;
};

Player.prototype.update = function() {
    'use strict';
    this.collide();
};

Player.prototype.handleInput = function(key) {
    'use strict';
    switch(key) {
        case "left":
            if (this.x > 0) { this.x -= 101 };
            break;
        case "right":
            if (this.x < 606) { this.x += 101 };
            break;
        case "up":
            (this.y > 83) ? (this.y -= 83) : this.victory();
            break;
        case "down":
            if (this.y < 394) { this.y += 83 };
            break;
    }
};

Player.prototype.reset = function() {
    'use strict';
    this.x = 303;
    this.y = 394;
};

Player.prototype.collide = function () {
    'use strict';
    for(var i = 0; i < allEnemies.length; i++) {
        if (this.x < allEnemies[i].x + 50 &&
            this.x + 50 > allEnemies[i].x &&
            this.y < allEnemies[i].y + 30 &&
            this.y + 30 > allEnemies[i].y) {
                var conqueror = allEnemies[i].sprite;
                this.defeat(conqueror);
            }
        }

    for(var z = 0; z < allGems.length; z++) {
        if (this.x < allGems[z].x + 50 &&
            this.x + 50 > allGems[z].x &&
            this.y < allGems[z].y + 30 &&
            this.y + 30 > allGems[z].y) {
                var treasur = allGems[z].sprite;
                this.reward(treasur);
                allGems[z].reset();
        }
    }
};

Player.prototype.defeat = function(conqueror) {
    'use strict';
    var consequences = function() {
        initialValues();
        updateDisplay();
        newEnemies();
    };

    var defeatSound = new Audio('audio/defeat.wav');

    switch(conqueror) {
        case 'images/enemy-bug.png':
            defeatSound.play();
            consequences();
            this.reset();
            break;
        case 'images/enemy-rock.png':
            defeatSound.play();
            consequences();
            this.reset();
            break;
    }
};

Player.prototype.reward = function(treasur) {
    'use strict';
    var rewardSound = new Audio('audio/coins.wav');

    switch(treasur) {
        case 'images/gem-blue.png':
            rewardSound.play();
            addBlue();
            updateDisplay();
            break;
        case 'images/gem-green.png':
            rewardSound.play();
            addGreen();
            updateDisplay();
            break;
        case 'images/gem-orange.png':
            rewardSound.play();
            addOrange();
            updateDisplay();
            break;
        case 'images/gem-star.png':
            rewardSound.play();
            addStar();
            updateDisplay();
            break;
    }
};

Player.prototype.victory = function() {
    'use strict';
    var victorySound = new Audio('audio/victory.wav');
    victorySound.play();
    addWin();
    updateDisplay();
    this.reset();
    newEnemies();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// player sub-classes
var BugSlayer = function () {
    this.sprite = 'images/char-boy.png';
    Player.call(this);
};
BugSlayer.prototype = Object.create(Player.prototype);
BugSlayer.prototype.constructor = BugSlayer;

var PrincessLeila = function () {
    this.sprite = 'images/char-princess-girl.png';
    Player.call(this);
};
PrincessLeila.prototype = Object.create(Player.prototype);
PrincessLeila.prototype.constructor = PrincessLeila;

var LadyHornfield = function () {
    this.sprite = 'images/char-horn-girl.png';
    Player.call(this);
};
LadyHornfield.prototype = Object.create(Player.prototype);
LadyHornfield.prototype.constructor = LadyHornfield;

var CatGirl = function () {
    this.sprite = 'images/char-cat-girl.png';
    Player.call(this);
};
CatGirl.prototype = Object.create(Player.prototype);
CatGirl.prototype.constructor = CatGirl;

var PinkHorror = function () {
    this.sprite = 'images/char-pink-girl.png';
    Player.call(this);
};
PinkHorror.prototype = Object.create(Player.prototype);
PinkHorror.prototype.constructor = PinkHorror;



// -----------------------------------------------------------------------------
// Game Module
// -----------------------------------------------------------------------------

// set up enemies
var allEnemies = [
                    new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(),    // 5
                    new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(),    // 10
                    new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(),    // 15
                    new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(),    // 20
                    new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(),    // 25
                    new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(),    // 30
                    new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(),    // 35
                    new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(),    // 40
                    new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(),    // 45
                    new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy(),    // 50
                 ];

// -------- why does this not work instead ?
                 // var numEnemies = 100;
                 // var allEnemies = function (numEnemies) {
                 //     var array = [];
                 //     for ( var i = 0; i < numEnemies; i++ ) {
                 //         var newEnemy = new Enemy();
                 //         array.push( new Enemy() );
                 //     }
                 //     return array;
                 // };

// set up gems
var allGems = [
                new Gem(), new Gem(), new Gem(), new Gem(), new Gem(),    // 5
                new Gem(), new Gem(), new Gem(), new Gem(), new Gem(),    // 10
              ];

// set up player
var newPlayer = function() {
    var assignHero = function() {
        var input = prompt("Choose your Hero:\n> BugSlayer,\n> PrincessLeila,\n> LadyHornfield,\n> CatGirl, \n> PinkHorror");

        switch(input) {
            case "BugSlayer":
                player = new BugSlayer();
                break;
            case "PrincessLeila":
                player = new PrincessLeila();
                break;
            case "LadyHornfield":
                player = new LadyHornfield();
                break;
            case "CatGirl":
                player = new CatGirl();
                break;
            case "PinkHorror":
                player = new PinkHorror();
                break;

            default:
                alert(input + " does not live in the realm of Heroes!");
                assignHero();
        }
    };
    assignHero();
};
newPlayer();

// set up function to display new enemies, gems and player
var newEntities = function() {
    newPlayer();
    newEnemies();
    newGems();
};

// set up function creating new game
var newGame = function() {
    initialValues();
    updateDisplay();
    newEntities();
};

// set up function creating a new round
var newRound = function() {
    newEnemies();
    newGems();
};

// set up function changing hero
var changeHero = function() {
    newEntities();
};



// -----------------------------------------------------------------------------
// Other
// -----------------------------------------------------------------------------

// handle input keyboard
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
