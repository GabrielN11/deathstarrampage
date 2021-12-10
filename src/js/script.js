let audio = true

const switchAudio = () => {
    if (audio) {
        $('#switchAudio').empty()
        $('#switchAudio').append(`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#fff" viewBox="0 0 16 16">
        <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
      </svg>`)
        $('#laserSound')[0].pause()
        $('#menuSound')[0].pause()
        audio = false
    } else {
        $('#switchAudio').empty()
        $('#switchAudio').append(`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#fff" viewBox="0 0 16 16">
        <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
        <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
        <path d="M10.025 8a4.486 4.486 0 0 1-1.318 3.182L8 10.475A3.489 3.489 0 0 0 9.025 8c0-.966-.392-1.841-1.025-2.475l.707-.707A4.486 4.486 0 0 1 10.025 8zM7 4a.5.5 0 0 0-.812-.39L3.825 5.5H1.5A.5.5 0 0 0 1 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 7 12V4zM4.312 6.39 6 5.04v5.92L4.312 9.61A.5.5 0 0 0 4 9.5H2v-3h2a.5.5 0 0 0 .312-.11z"/>
      </svg>`)
        audio = true
    }
    document.getElementById("switchAudio").blur()
}

setTimeout(() => {
    if (audio) $('#menuSound')[0].play()
    $('.intro').hide()
    $('#game').append('<div id="menu"></div>')
    $('#menu').append('<h1>Menu iniciar</h1>')
        .append('<div id="images"></div>')
        .append('<p>você deve destruir os planetas rebeldes para acumular pontos. ' +
            'Cada planeta rebelde destruído vale 10 pontos. cada planeta aliado destruído serão menos 10 pontos. ' +
            'Se você deixar um planeta rebelde fugir, também perderá 10 pontos. Não colida com os planetas ou perderá. ' +
            'você precisa 500 pontos ou mais para vencer. Clique para iniciar!</p>')
        .append('<p>comandos: w - mover para cima. a - mover para baixo. s - mover para esquerda. d - mover para direita. espaço - atirar Laser. x - ativar hyperdrive por 15 segundos.</p>')
    $('#images').append('<div><img src="../../assets/images/rebelplanet.png" alt="Planeta inimigo"/></div>')
        .append('<div><img src="../../assets/images/imperialplanet.png" alt="Planeta aliado"/></div>')
        .append('<h2>inimigo</h2>')
        .append('<h2>aliado</h2>')
    document.getElementById('menu').addEventListener('click', start)
}, 25000)

function start() {
    $('#menuSound')[0].pause()
    $('#menu').empty()
    $('#menu').hide()
    const game = $('#game')
    let points = 0;
    let boosts = 3;
    let enemyDestroyed = false
    let allieDestroyed = false
    let boostActive = false
    let speed = 10
    let playerSpeed = 10
    let hideEnemy
    let hideAllie

    game.append('<div id="player"></div>')
    game.append('<div id="enemy"></div>')
    game.append('<div id="allie"></div>')
    game.append('<div class="points" id="points"></div>')
    game.append('<div class="points" id="boosts" style="top: 50px"></div>')

    const pointsDiv = $('#points')
    const boostsDiv = $('#boosts')


    pointsDiv.append(`<p id='score'>Pontos: ${points}</p>`)
    boostsDiv.append(`<p>Hyperdrives: ${boosts}</p>`)

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
    const explosionImage = '../../assets/images/explosion.png'
    const enemyPlanet = '../../assets/images/rebelplanet.png'
    const alliePlanet = '../../assets/images/imperialplanet.png'
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
            if (!enemyDestroyed) {
                points -= 10
                scorePoints(points)
            }
            enemy.show()
            enemy.css('right', '-110px')
            enemy.css('top', enemyY)
            enemy.css('background-image', `url(${enemyPlanet})`)
            clearTimeout(hideEnemy)
            hideEnemy = null
            enemyDestroyed = false
            return
        }
        enemy.css('right', pos + (speed / 4) + speed)
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
            allie.css('background-image', `url(${alliePlanet})`)
            clearTimeout(hideAllie)
            hideAllie = null
            allieDestroyed = false
            return
        }
        allie.css('right', pos + speed)
    }

    function shootLaser() {
        if (laserCharged) {
            if (audio) $('#laserSound')[0].play()
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

    function activeBoost(){
        boosts -= 1
        boostsDiv.empty()
        boostsDiv.append(`<p>Hyperdrives: ${boosts}</p>`)
        playerSpeed = 25
        setTimeout(() => {
            playerSpeed = 10
            boostActive = false
        }, 15000)
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
            return pos - playerSpeed
        },
        S: function (pos) {
            if (pos >= 450) return '450px'
            return pos + playerSpeed
        }
    }

    const keysX = {
        D: function (pos) {
            if (pos >= 850) return '850px'
            return pos + playerSpeed
        },
        A: function (pos) {
            if (pos <= 10) return '10px'
            return pos - playerSpeed
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
        if(e.key.toUpperCase() == 'X' && !boostActive){
            boostActive = true
            activeBoost()
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

        if (playerCollisionEnemy && !enemyDestroyed) return explodeColission([player, enemy])
        if (playerCollisionAllie && !allieDestroyed) return explodeColission([player, allie])
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

    function explodeColission() {
        clearInterval(move)
        move = null
        removeEventListener('keydown', detectKey)
        arguments[0].forEach(arg => {
            arg.css('background-image', `url(${explosionImage})`)
            setTimeout(() => {
                arg.hide()
            }, 2000)
        })
        setTimeout(() => {
            endGame()
        }, 2000)
    }


    function laserHit(target) {
        $('#laser').remove()
        if (target === 'enemy') {
            enemyDestroyed = true
            enemy.css('background-image', `url(${explosionImage})`)
            points += 10
            scorePoints(points, true)
            hideEnemy = setTimeout(() => {
                enemy.hide()
            }, 1200)
        } else {
            allieDestroyed = true
            allie.css('background-image', `url(${explosionImage})`)
            points -= 10
            scorePoints(points, false)
            hideAllie = setTimeout(() => {
                allie.hide()
            }, 1200)
        }
        clearInterval(laserRoute)
        setTimeout(() => {
            laserCharged = true
        }, 2000)
    }

    function scorePoints(points, increment) {
        if (points < 0) return endGame()
        if (points % 50 === 0 && increment) speed += 1
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
        boostsDiv.remove()
        $('#menu').empty()
        $('#menu').show()
        if (points < 500) {
            $('#menu').append('<h1>você falhou com o império!</h1>')
                .append(`<img src="${failedGif}" alt='O imperador está irritado com você'/>`)
                .append('<p>você decepcionou nosso imperador. Agora o caos e desordem da rebelião tomarão conta da galáxia.</p>')
                .append('<p>Clique para reiniciar</p>')
        } else {
            $('#menu').append('<h1>você deixou seu império orgulhoso!</h1>')
                .append(`<img src="${successGif}" alt='O imperador está feliz com seu progresso'/>`)
                .append('<p>o império venceu mais uma batalha e a rebelião ficou sem esperanças. o imperador está satisfeito com seu progresso!</p>')
                .append('<p>Clique para jogar novamente</p>')
        }
    }
}