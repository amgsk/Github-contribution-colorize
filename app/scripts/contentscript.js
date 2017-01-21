// Enable chromereload by uncommenting this line:
//import 'chromereload/devonly';

let currentHighlightLevel = null;

const HIGHLIGHT_COLOR = '#bb102e';

const toArray = (elements) => {
  return Array.prototype.slice.call(elements);
};

const isValidPage = () => {
  return document.getElementsByClassName('js-contribution-graph').length > 0;
};

const getLevels = () => {
  return toArray(document.getElementsByClassName('legend')[0].children);
};

const getRects = () => {
  return toArray(document.getElementsByTagName('rect'));
};

const convertRGBToHex = (rgb) => {
  const ret = eval(rgb.replace(/rgb/,"((").replace(/,/ig,")*256+")).toString(16);
  return "#" + (("000000" + ret).substring( 6 + ret.length - 6));
};

const getOriginalColor = (element) => {
  return element.getAttribute('originalColor');
};

const setOriginalColor = (element, color) => {
  element.setAttribute('originalColor', color);
};

const removeOriginalColor = (element) => {
  element.removeAttribute('originalColor');
};

const setColor = (element, color) => {
  if (element.tagName === 'rect') {
    element.setAttribute('fill', color);
  } else {
    element.style['background-color'] = color;
  }
};

const getColor = (element) => {
  let color = null
  if (element.tagName === 'rect') {
    color = element.getAttribute('fill');
  } else {
    color = element.style['background-color'];
  }
  return color.indexOf('rgb') === 0 ? convertRGBToHex(color) : color;
};

const resetHighlightLevel = () => {
  getLevels().forEach((element) => {
    const originalColor = getOriginalColor(element);
    if (originalColor) {
      setColor(element, originalColor);
    }
    removeOriginalColor(element);
  });
};

const highlightLevelElement = (element, originalLevelColor, selectedLevelHexColor) => {
  if (originalLevelColor) {
    removeOriginalColor(element);
    setColor(element, originalLevelColor);
    currentHighlightLevel = null;
  } else {
    setOriginalColor(element, selectedLevelHexColor);
    setColor(element, HIGHLIGHT_COLOR);
    currentHighlightLevel = selectedLevelHexColor;
  }
};

const colorizeContribution = (element) => {

  const originalLevelColor = getOriginalColor(element);
  const selectedLevelColor = originalLevelColor || getColor(element);

  resetHighlightLevel();

  // colorize Contribution Graph
  getRects().forEach((rect) => {
    const currentColor  = getColor(rect);
    const originalColor = getOriginalColor(rect);

    if (selectedLevelColor === currentColor) {
      setOriginalColor(rect, currentColor);
      setColor(rect, HIGHLIGHT_COLOR);

    } else {
      if (originalColor) {
        setColor(rect, originalColor);
        removeOriginalColor(rect);
      }
    }
  });

  // colorize Contribution Level
  highlightLevelElement(element, originalLevelColor, selectedLevelColor);
};

if (isValidPage()) {

  const target = document.querySelectorAll('.js-repo-filter > div')[0];
  new MutationObserver((mutations) => {
    getLevels().forEach((element) => {
      element.addEventListener('click', () => {
        colorizeContribution(element);
      });
    }, false);

    if (currentHighlightLevel) {
      getLevels().forEach((element) => {
        if (getColor(element) === currentHighlightLevel) {
          colorizeContribution(element);
        }
      });
    }
  }).observe( target, {childList: true} );
}

