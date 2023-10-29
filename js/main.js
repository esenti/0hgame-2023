(function() {
  const canvas = document.getElementById('draw');
  canvas.width = 800;
  canvas.height = 600;

  const ctx = canvas.getContext('2d');

  let delta = 0;
  let now = 0;

  let before = Date.now();

  let elapsed = 0;
  let loading = 0;

  const DEBUG = false;
  // const DEBUG = true;

  const keysDown = {};
  let keysPressed = {};

  const images = [];
  const audios = [];

  let framesThisSecond = 0;
  let fpsElapsed = 0;
  let fps = 0;

  const particles = []

  let controls;
  let colors;

  window.addEventListener("keydown", function(e) {
    return keysDown[e.keyCode] = true;
  }, false);

  window.addEventListener("keyup", function(e) {
    keysPressed[e.keyCode] = true;
    return delete keysDown[e.keyCode];
  }, false);

  const setDelta = function() {
    now = Date.now();
    delta = (now - before) / 1000;
    return before = now;
  };

  if (!DEBUG) {
    console.log = function() {
      return null;
    };
  }

  let ogre = false;

  const init = function() {
    elapsed = 0;

    score = 0;
    highScore = 0;

    controls = {
      a: 65,
    }

    colors = {
      bg: "#000000",
      score: "#ffffff",
      highScore: "#aaaaaa",
      particles: "#aaaaaa",
    }

    document.getElementsByTagName("html")[0].style.background = colors.bg;
    document.getElementById("instructions").style.color = colors.score;
    document.getElementById("instructions").textContent = "Aaaaaaaa!";

    particles.splice(0, particles.length);

    ogre = false;
  }

  const explode = (x, y, maxTtl) => {
    for(var k = 0; k < 30; k++) {
      particles.push({
        x: x,
        y: y,
        w: Math.random() * 4 + 1,
        h: Math.random() * 4 + 1,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 2 - 1,
        ttl: Math.random() * maxTtl + 0.1,
        speed: 400,
      })
    }
  }

  const tick = function() {
    setDelta();
    elapsed += delta;
    update(delta);
    draw(delta);
    keysPressed = {};
    click = null;
    return window.requestAnimationFrame(tick);
  };

  const update = function(delta) {

     framesThisSecond += 1;
     fpsElapsed += delta;

     if(fpsElapsed >= 1) {
        fps = framesThisSecond / fpsElapsed;
        framesThisSecond = fpsElapsed = 0;
     }

    if(keysPressed[controls.a] && ogre == false)
    {
      score += 1;
    }

    score -= delta * (4 + 0.1 * score);
    score = Math.max(score, 0);

    highScore = Math.max(score, highScore);

    if (score > 10 && Math.random() < 0.05)
    {
      explode(Math.random() * 800, Math.random() * 600, score * 0.01);
    }

    if (score > 20 && Math.random() < 0.1)
    {
      explode(Math.random() * 800, Math.random() * 600, score * 0.05);
    }

    if (score > 30 && Math.random() < 0.15)
    {
      explode(Math.random() * 800, Math.random() * 600, score * 0.2);
    }

    if (score > 40 && Math.random() < 0.2)
    {
      explode(Math.random() * 800, Math.random() * 600, score * 0.5);
    }

    for(var i = particles.length - 1; i >= 0; i--) {
      particles[i].ttl -= delta;

      if(particles[i].ttl <= 0) {
        particles.splice(i, 1)
        continue;
      }

      particles[i].x += particles[i].dx * particles[i].speed * delta;
      particles[i].y += particles[i].dy * particles[i].speed * delta;
      particles[i].a += delta * Math.random();
    }
 };

  const draw = function(delta) {
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colors.particles;
    particles.forEach(function(particle) {
      ctx.fillStyle = colors.particles;
      ctx.font = `${particle.w * particle.h}px Visitor`;
      ctx.fillText("A", particle.x, particle.y);
    })

    ctx.fillStyle = "#fafafa";
    const fontSize = Math.floor(score * 12);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${fontSize}px Visitor`;
    ctx.fillText("A", 400, 300);

    if (score >= 0) {
      ctx.fillStyle = colors.score;
      ctx.textAlign = "center";
      ctx.font = "40px Visitor";
      ctx.fillText(Math.round(score * 1000), 400, 50);
    }

    if (highScore >= 0) {
      ctx.fillStyle = colors.highScore;
      ctx.textAlign = "center";
      ctx.font = "20px Visitor";
      ctx.fillText(Math.round(highScore * 1000), 400, 70);
    }

     if(ogre) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "80px Visitor";
        ctx.fillText("oh no", 400, 350);
     }
 };

 (function() {
  var targetTime, vendor, w, _i, _len, _ref;
  w = window;
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  vendor = _ref[_i];
  if (w.requestAnimationFrame) {
  break;
  }
  w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
  }
  if (!w.requestAnimationFrame) {
  targetTime = 0;
  return w.requestAnimationFrame = function(callback) {
  var currentTime;
  targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
  return w.setTimeout((function() {
          return callback(+(new Date));
          }), targetTime - currentTime);
  };
  }
 })();

  const loadImage = function(name, callback) {
    var img = new Image()
    console.log('loading')
    loading += 1
    img.onload = function() {
        console.log('loaded ' + name)
        images[name] = img
        loading -= 1
        if(callback) {
            callback(name);
        }
    }

    img.src = 'img/' + name + '.png'
 }

  const load = function() {
     if(loading) {
         window.requestAnimationFrame(load);
     } else {
         window.requestAnimationFrame(tick);
     }
 };

 init();
 load();

}).call(this);
