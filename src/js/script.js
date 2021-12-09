setTimeout(() => {
    $('.intro').hide()
    $('#game').append('<div id="menu"></div>')
    $('#menu').append('<h1>Menu iniciar</h1>')
              .append('<div id="images"></div>')
              .append('<p>você deve destruir os planetas rebeldes para acumular pontos. ' + 
              'Cada planeta rebelde destruído vale 10 pontos. cada planeta aliado destruído serão menos 10 pontos. ' + 
              'Se você deixar um planeta rebelde fugir, também perderá 10 pontos. Não colida com os planetas ou perderá. ' +
              'você precisa 200 pontos ou mais para vencer. Clique para iniciar!</p>')
              .append('<p>comandos: w - mover para cima. a - mover para baixo. s - mover para esquerda. d - mover para direita. espaço - atirar Laser.</p>')
    $('#images').append('<div><img src="../../assets/images/rebelplanet.png" alt="Planeta inimigo"/></div>')
                .append('<div><img src="../../assets/images/imperialplanet.png" alt="Planeta aliado"/></div>')
                .append('<h2>inimigo</h2>')
                .append('<h2>aliado</h2>')
    document.getElementById('menu').addEventListener('click', start)
}, 25000)

function start() {
    $('#menu').empty()
    $('#menu').hide()
    const game = $('#game')
    let points = 0;
    let enemyDestroyed = false
    let speed = 10

    game.append('<div id="player"></div>')
    game.append('<div id="enemy"></div>')
    game.append('<div id="allie"></div>')
    game.append('<div class="points"></div>')

    const pointsDiv = $('.points')

    pointsDiv.append(`<p id='score'>Pontos: ${points}</p>`)

    const enemy = $('#enemy')
    const allie = $('#allie')

    let enemyY = Math.random() * 440
    let allieY = Math.random() * 440

    while (allieY + 110 >= enemyY && allieY - 110 <= enemyY) {
        allieY = Math.random() * 440
    }

    enemy.css('top', enemyY)
    allie.css('top', allieY)

    const player = $('#player')
    const playerStandardImage = '../../assets/images/deathstar.png'
    const playerShootingImage = '../../assets/images/deathstar-laser.png'
    const failedGif = '../../assets/images/failed.gif'
    const successGif = '../../assets/images/success.gif'
    let laserCharged = true
    let laserRoute

    function moveBackground() {
        const pos = parseInt(game.css('background-position'))
        game.css('background-position', pos - 1)
    }

    function moveEnemy() {
        const pos = parseInt(enemy.css('right'))
        if (pos + 10 >= 950) {
            enemyY = Math.random() * 440
            if(!enemyDestroyed){
                points -= 10
                scorePoints(points)
            }
            enemy.show()
            enemy.css('right', '-110px')
            enemy.css('top', enemyY)
            enemyDestroyed = false
            return
        }
        enemy.css('right', pos + (speed/4) + speed)
    }

    function moveAllie() {
        const pos = parseInt(allie.css('right'))
        if (pos + 10 >= 950) {
            allieY = Math.random() * 440
            while (allieY + 110 >= enemyY && allieY - 110 <= enemyY) {
                allieY = Math.random() * 440
            }
            allie.show()
            allie.css('right', '-110px')
            allie.css('top', allieY)
            return
        }
        allie.css('right', pos + speed)
    }

    function shootLaser() {
        if (laserCharged) {
            laserCharged = false
            const top = parseInt($('#player').css('top'))
            const left = parseInt($('#player').css('left'))
            const laserY = top + 10
            const laserX = left + 75
            game.append('<div id="laser"></div>')
            $('#laser').css('top', laserY)
            $('#laser').css('left', laserX)
        }
        laserRoute = setInterval(laserPath, 30)
        function laserPath() {
            const pos = parseInt($('#laser').css('left'))
            if (pos + 10 >= 950) {
                clearInterval(laserRoute)
                laserRoute = null
                $('#laser').remove()
                return laserCharged = true
            }
            $('#laser').css('left', pos + 20)
        }
    }

    let move = setInterval(() => {
        moveBackground()
        moveEnemy()
        moveAllie()
        collision()
    }, 60)

    const keysY = {
        W: function (pos) {
            if (pos <= 10) return '10px'
            return pos - 10
        },
        S: function (pos) {
            if (pos >= 450) return '450px'
            return pos + 10
        }
    }

    const keysX = {
        D: function (pos) {
            if (pos >= 500) return '500px'
            return pos + 10
        },
        A: function (pos) {
            if (pos <= 10) return '10px'
            return pos - 10
        }
    }

    const detectKey = (e) => {
        const pos = []
        pos.push(parseInt(player.css('top')))
        pos.push(parseInt(player.css('left')))
        player.css('top', keysY[e.key.toUpperCase()] ? keysY[e.key.toUpperCase()](pos[0]) : null)
        player.css('left', keysX[e.key.toUpperCase()] ? keysX[e.key.toUpperCase()](pos[1]) : null)
        if (e.key === ' ' && laserCharged) {
            player.css('background-image', `url(${playerShootingImage})`)
            shootLaser()
            setTimeout(() => {
                player.css('background-image', `url(${playerStandardImage})`)
            }, 100)
        }
    }

    addEventListener('keydown', detectKey)

    function collision() {
        let playerCollisionEnemy = collisionDetect(player, enemy)
        let playerCollisionAllie = collisionDetect(player, allie)
        let laserCollisionEnemy
        let laserCollisionAllie
        const laser = document.getElementById('laser')
        if (laser) laserCollisionEnemy = collisionDetect($('#laser'), enemy)
        if (laser) laserCollisionAllie = collisionDetect($('#laser'), allie)

        if (playerCollisionEnemy || playerCollisionAllie) return endGame()
        if (laserCollisionAllie) return laserHit('allie')
        if (laserCollisionEnemy) return laserHit('enemy')
    }

    function collisionDetect($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }

    function laserHit(target) {
        $('#laser').remove()
        if (target === 'enemy') {
            enemyDestroyed = true
            enemy.hide()
            points += 10
            scorePoints(points, true)
        } else {
            points -= 10
            allie.hide()
            scorePoints(points , false)
        }
        clearInterval(laserRoute)
        setTimeout(() => {
            laserCharged = true
        }, 2000)
    }

    function scorePoints(points, increment) {
        if (points < 0) return endGame()
        if(points % 50 === 0 && increment) speed += 3
        $('#score').remove()
        pointsDiv.append(`<p id='score'>Pontos: ${points}</p>`)
    }

    function endGame() {
        clearInterval(move)
        move = null
        removeEventListener('keydown', detectKey)
        player.remove()
        enemy.remove()
        allie.remove()
        pointsDiv.remove()
        $('#menu').empty()
        $('#menu').show()
        if (points < 200) {
            $('#menu').append('<h1>você falhou com o império!</h1>')
                .append(`<img src="${failedGif}" alt='O imperador está irritado com você'/>`)
                .append('<p>você decepcionou nosso imperador. Agora o caos e desordem da rebelião tomarão conta da galáxia.</p>')
                .append('<p>Clique para reiniciar</p>')
        }else{
            $('#menu').append('<h1>você deixou seu império orgulhoso!</h1>')
                .append(`<img src="${successGif}" alt='O imperador está feliz com seu progresso'/>`)
                .append('<p>o império venceu mais uma batalha e a rebelião ficou sem esperanças. o imperador está satisfeito com seu progresso!</p>')
                .append('<p>Clique para jogar novamente</p>')
        }
    }
}