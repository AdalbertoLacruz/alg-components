// @copyright 2017 ALG

const templateStyle = document.createElement('Style');
templateStyle.setAttribute('type', 'text/css');
templateStyle.setAttribute('id', 'styles');
templateStyle.innerHTML = `
  #container {
    display: flex;
  }

  alg-paper-button {
    font-family: 'Roboto', 'Noto', sans-serif;
    font-weight: normal;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }

  alg-paper-button.pink {
    color: var(--paper-pink-a200);
    --paper-button-ink-color: var(--paper-pink-a200);
  }
  alg-paper-button.pink:hover {
    background-color: var(--paper-pink-100);
  }

  alg-paper-button.indigo {
    background-color: var(--paper-indigo-500);
    color: white;
    --paper-button-raised-keyboard-focus: {
      background-color: var(--paper-pink-a200) !important;
      color: white !important;
    };
  }
  alg-paper-button.indigo:hover {
    background-color: var(--paper-indigo-400);
  }

  alg-paper-button.green {
    background-color: var(--paper-green-500);
    color: white;
  }
  alg-paper-button.green[active] {
    background-color: var(--paper-red-500);
  }

  alg-paper-button.disabled {
    color: white;
  }
`;

document.head.appendChild(templateStyle);
