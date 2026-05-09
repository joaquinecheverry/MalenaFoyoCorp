// ================== shared modal ==================

function setupNavClickHandlers() {

  const aboutNav = document.getElementById('place');
  const cartNav = document.getElementById('year');

  if (aboutNav) {

    aboutNav.style.cursor = 'pointer';

    aboutNav.onclick = () => {

      showModal();
      showTab('about');

    };

  }

  if (cartNav) {

    cartNav.style.cursor = 'pointer';

    cartNav.innerHTML = 'CART';

    cartNav.onclick = () => {

      showModal();
      showTab('cart');

    };

  }

}

function createModal() {

  // prevent duplicate modal
  if (document.getElementById('star-modal')) return;

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

  modal.onclick = (e) => {

    if (e.target === modal) {

      hideModal();

    }

  };

  const content = document.createElement('div');

  content.style.cssText = `
    background: white;
    padding: 10px;
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
    color: #BD9B46;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: url('cursor2_imresizer.png') 16 16, auto;
  `;

  closeBtn.onclick = hideModal;

  const nav = document.createElement('div');

  nav.style.cssText = `
    display: flex;
    gap: 30px;
    margin-bottom: 0;
  `;

  ['About', 'Cart'].forEach(name => {

    const tab = document.createElement('button');

    tab.innerHTML = name;

    tab.className = 'modal-tab';

    tab.style.cssText = `
      background: none;
      border: none;
      padding: 0;
      font-size: 18pt;
      border-bottom: 3px solid transparent;
      color: #BD9B46;
      transition: all .1s;
      cursor: url('cursor2_imresizer.png') 16 16, auto;
    `;

    tab.onmouseenter = () => {

      tab.style.opacity = '0.6';
      tab.style.borderBottomColor = '#BD9B46';

    };

    tab.onmouseleave = () => {

      if (tab.innerHTML.toLowerCase() === currentModalTab) {

        tab.style.opacity = '1';
        tab.style.borderBottomColor = '#BD9B46';

      } else {

        tab.style.opacity = '1';
        tab.style.borderBottomColor = 'transparent';

      }

    };

    tab.onclick = () => showTab(name.toLowerCase());

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

    document.addEventListener('keydown', handleEscapeKey);

  }

}

function hideModal() {

  const modal = document.getElementById('star-modal');

  if (modal) {

    modal.style.display = 'none';

    document.removeEventListener('keydown', handleEscapeKey);

  }

}

function handleEscapeKey(e) {

  if (e.key === 'Escape') {

    hideModal();

  }

}

let currentModalTab = 'about';

function showTab(tabName) {

  currentModalTab = tabName;

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

  if (!contentArea) return;

  switch (tabName) {

    case 'about':

      contentArea.innerHTML = `
        <p>
          Malena Foyo is a fashion designer, artist and co-founder of WiG,
          a creative platform where fashion, art, and design converge.
        </p>

        <p>
          m@malenafoyo.com
        </p>

        <p>
          @malenafoyo
        </p>
      `;

      break;

    case 'cart':

      contentArea.innerHTML = '<p>Loading…</p>';

      if (typeof renderCartIntoModal === 'function') {

        renderCartIntoModal();

      }

      break;

  }

}

function openCartModal() {

  showModal();

  showTab('cart');

}