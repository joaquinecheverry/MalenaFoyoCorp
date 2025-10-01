const stars = [];
const kRestitution = 0.98;
let navHeight = 0;

function setup() {
  const navElement = document.getElementById('nav');
  navHeight = navElement ? navElement.offsetHeight : 50;
  
  createCanvas(windowWidth, windowHeight);
  
  const canvas = document.querySelector('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '-1'; 
  canvas.style.pointerEvents = 'none'; 
  canvas.style.cursor = 'default';

  initStars();
  createModal();
}

function initStars() {
  stars.length = 0;
  
  for (let i = 0; i < 3; i++) {
    const star = {
      position: { 
        x: random(50, width - 50), 
        y: random(navHeight + 50, height - 50) 
      },
      velocity: { 
        x: random(-8, 8), 
        y: random(-8, 8) 
      },
      size: 30,
      baseSize: 30, 
      targetSize: 30, 
      color: 'white',
      borderColor: 'rgb(231, 74, 231)',
      rotation: 0,
      rotationSpeed: random(-0.1, 0.1),
      isHovered: false,
      frozenVelocity: { x: 0, y: 0 } 
    };
    
    if (abs(star.velocity.x) < 2) star.velocity.x = star.velocity.x > 0 ? 2 : -2;
    if (abs(star.velocity.y) < 2) star.velocity.y = star.velocity.y > 0 ? 2 : -2;
    
    stars.push(star);
  }
}

function draw() {
  clear(); 
  
  const navElement = document.getElementById('nav');
  navHeight = navElement ? navElement.offsetHeight : 50;
  
  checkHover();
  
  for (const star of stars) {
    updateStarSize(star);
    if (!star.isHovered) {
      stepStar(star);
    }
    drawStar(star);
  }
}

function checkHover() {
  let anyStarHovered = false;
  const mousePos = { x: mouseX, y: mouseY };
  
  for (const star of stars) {
    const distance = dist(mousePos.x, mousePos.y, star.position.x, star.position.y);
    const wasHovered = star.isHovered;
    
    star.isHovered = distance < star.size / 2;
    
    if (star.isHovered) {
      anyStarHovered = true;
    }
    
    if (star.isHovered && !wasHovered) {
      star.frozenVelocity.x = star.velocity.x;
      star.frozenVelocity.y = star.velocity.y;
      star.velocity.x = 0;
      star.velocity.y = 0;
      star.targetSize = star.baseSize * 1.3; 
    }
    
    if (!star.isHovered && wasHovered) {
      star.velocity.x = star.frozenVelocity.x;
      star.velocity.y = star.frozenVelocity.y;
      star.targetSize = star.baseSize; 
    }
  }
  
  if (anyStarHovered) {
    document.body.style.cursor = 'pointer';
  } else {
    document.body.style.cursor = 'default';
  }
}

function updateStarSize(star) {
  const sizeDiff = star.targetSize - star.size;
  star.size += sizeDiff * 0.15; 
}

function stepStar(star) {
  star.position.x += star.velocity.x;
  star.position.y += star.velocity.y;
  
  star.rotation += star.rotationSpeed;
  
  const radius = star.size / 2;
  
  if (star.position.x - radius < 0) {
    star.velocity.x = abs(star.velocity.x) * kRestitution;
    star.position.x = radius;
  }
  
  if (star.position.x + radius > width) {
    star.velocity.x = -abs(star.velocity.x) * kRestitution;
    star.position.x = width - radius;
  }
  
  if (star.position.y - radius < navHeight) {
    star.velocity.y = abs(star.velocity.y) * kRestitution;
    star.position.y = navHeight + radius;
  }
  
  if (star.position.y + radius > height) {
    star.velocity.y = -abs(star.velocity.y) * kRestitution;
    star.position.y = height - radius;
  }
  
  if (!star.isHovered) {
    checkPhotoCollisions(star, radius);
  }
}

function checkPhotoCollisions(star, radius) {
  const photodivs = document.querySelectorAll('.photodiv');
  
  photodivs.forEach(photodiv => {
    const rect = photodiv.getBoundingClientRect();
    
    const left = rect.left;
    const right = rect.right;
    const top = rect.top;
    const bottom = rect.bottom;
    
    const starLeft = star.position.x - radius;
    const starRight = star.position.x + radius;
    const starTop = star.position.y - radius;
    const starBottom = star.position.y + radius;
    
    if (starRight > left && starLeft < right && starBottom > top && starTop < bottom) {
      const overlapLeft = starRight - left;
      const overlapRight = right - starLeft;
      const overlapTop = starBottom - top;
      const overlapBottom = bottom - starTop;
      
      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
      
      if (minOverlap === overlapLeft) {
        star.velocity.x = -abs(star.velocity.x) * kRestitution;
        star.position.x = left - radius;
      } else if (minOverlap === overlapRight) {
        star.velocity.x = abs(star.velocity.x) * kRestitution;
        star.position.x = right + radius;
      } else if (minOverlap === overlapTop) {
        star.velocity.y = -abs(star.velocity.y) * kRestitution;
        star.position.y = top - radius;
      } else if (minOverlap === overlapBottom) {
        star.velocity.y = abs(star.velocity.y) * kRestitution;
        star.position.y = bottom + radius;
      }
    }
  });
}

function drawStar(star) {
  push();
  translate(star.position.x, star.position.y);
  rotate(star.rotation);
  
  const outerRadius = star.size / 2;
  const innerRadius = outerRadius * 0.4;
  
  fill(star.borderColor);
  noStroke();
  drawRoundedStar(outerRadius + 6, innerRadius + 5);
  
  fill(star.color);
  noStroke();
  drawRoundedStar(outerRadius, innerRadius);
  
  pop();
}

function drawRoundedStar(outerRadius, innerRadius) {
  const points = [];
  
  for (let i = 0; i < 10; i++) {
    const angle = (i * PI) / 5;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    points.push({
      x: cos(angle) * radius,
      y: sin(angle) * radius
    });
  }
  
  beginShape();
  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const prev = points[(i - 1 + points.length) % points.length];
    
    if (i % 2 === 0) {
      const toPrev = createVector(prev.x - current.x, prev.y - current.y);
      const toNext = createVector(next.x - current.x, next.y - current.y);
      
      toPrev.normalize().mult(3);
      toNext.normalize().mult(3);
      
      const cp1 = { x: current.x + toPrev.x, y: current.y + toPrev.y };
      const cp2 = { x: current.x + toNext.x, y: current.y + toNext.y };
      
      if (i === 0) {
        vertex(cp1.x, cp1.y);
      }
      quadraticVertex(current.x, current.y, cp2.x, cp2.y);
    } else {
      vertex(current.x, current.y);
    }
  }
  endShape(CLOSE);
}

function mousePressed() {
  for (const star of stars) {
    const distance = dist(mouseX, mouseY, star.position.x, star.position.y);
    if (distance < star.size / 2) {
      showModal();
      return; 
    }
  }
}

function createModal() {
  const modal = document.createElement('div');
  modal.id = 'star-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    display: none;
    justify-content: flex-start;
    align-items: center;
    padding-left: 20px;
    box-sizing: border-box;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    background: white;
    padding: 0px;
    max-width: 900px;
    width: 100%;
    position: relative;
    color: #BD9B46;
    font-size: 18pt;
  `;
  
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '×';
  closeBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 30px;
    cursor: pointer;
    color: #BD9B46;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  closeBtn.onclick = hideModal;
  
  const nav = document.createElement('div');
  nav.style.cssText = `
    display: flex;
    gap: 30px;
    margin-bottom: 0px;
    border-bottom: 0px solid #BD9B46;
  `;
  
  const tabs = ['About', 'Contact', 'Cart'];
  tabs.forEach((tabName, index) => {
    const tab = document.createElement('button');
    tab.innerHTML = tabName;
    tab.className = 'modal-tab';
    tab.style.cssText = `
      background: none;
      border: none;
      padding: 0px 0;
      font-size: 18pt;
      cursor: pointer;
      border-bottom: 3px solid transparent;
      color: #BD9B46;
      transition: all 0.1s;
    `;
    tab.onclick = () => showTab(tabName.toLowerCase());
    nav.appendChild(tab);
  });
  
  const contentArea = document.createElement('div');
  contentArea.id = 'modal-content';
  contentArea.style.cssText = `
    min-height: 200px;
    line-height: 1.6;
  `;
  
  content.appendChild(closeBtn);
  content.appendChild(nav);
  content.appendChild(contentArea);
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  showTab('about');
}

function showModal() {
  const modal = document.getElementById('star-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function hideModal() {
  const modal = document.getElementById('star-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function showTab(tabName) {
  const tabs = document.querySelectorAll('.modal-tab');
  tabs.forEach(tab => {
    if (tab.innerHTML.toLowerCase() === tabName) {
      tab.style.color = '#BD9B46';
      tab.style.borderBottomColor = '#BD9B46';
    } else {
      tab.style.color = '#666';
      tab.style.borderBottomColor = 'transparent';
    }
  });
  
  const contentArea = document.getElementById('modal-content');
  if (contentArea) {
    switch(tabName) {
      case 'about':
        contentArea.innerHTML = `
          <p>Malena Foyo is a fashion designer, artist and co-founder of WiG, a creative platform where fashion, art, 
          and design converge. Her work spans clothing, jewelry, furniture, and contemporary art, always driven by a 
          vision of empowered femininity that is at once sexy, chic, and bold.</p>
          <p>
          With a design language rooted in sensuality, confidence, and experimentation, Malena creates pieces that blur
          boundaries between disciplines. Through WiG and her independent projects, she continues to build a space where 
          objects, fashion, and art exist side by side—inviting community, dialogue, and new ways of experiencing creativity
          </p>
        `;
        break;
      case 'contact':
        contentArea.innerHTML = `
          <p>m@malenafoyo.com</p>
          <p>@malenafoyo</p>
        `;
        break;
      case 'cart':
        contentArea.innerHTML = `
          <p>Your cart is currently empty.</p>
          <p>Browse our collection and add items to see them here. We'll keep track of your selections and make checkout simple and secure.</p>
          <div style="background: #f9f9f9; border-radius: 5px;">
            <p style="margin: 0; color: #666; font-style: italic;">Items you add will appear here with pricing and quantity options.</p>
          </div>
        `;
        break;
    }
  }
}
