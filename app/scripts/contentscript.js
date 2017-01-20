// Enable chromereload by uncommenting this line:
//import 'chromereload/devonly';

const HIGHLIGHT_COLOR = '#bb102e';

const isValidPage = () => {
  return document.getElementsByClassName('js-contribution-graph').length > 0;
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
  if (element.tagName === 'rect') {
    return element.getAttribute('fill');
  } else {
    return element.style['background-color'];
  }
};

const resetHighlightLevel = () => {
  Array.prototype.forEach.call(document.querySelectorAll('.legend > li'), function (element) {
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
  } else {
    setOriginalColor(element, selectedLevelHexColor);
    setColor(element, HIGHLIGHT_COLOR);
  }
};

const colorizeContribution = (element) => {

  const originalLevelColor = getOriginalColor(element);
  const selectedLevelColor = originalLevelColor || convertRGBToHex(getColor(element));

  resetHighlightLevel();

  // colorize Contribution Graph
  Array.prototype.forEach.call(document.getElementsByTagName('rect'), (rect) => {
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

  // add Contribution Level Click Event
  Array.prototype.forEach.call(document.getElementsByClassName('legend')[0].children, (element) => {
    element.addEventListener('click', () => {
      colorizeContribution(element);
    }, false);
  });

  // [WIP] add month click event
  const rects = Array.prototype.slice.call(document.getElementsByTagName('rect'));
  const style = `outline: thin solid ${HIGHLIGHT_COLOR};`;
  const months = Array.prototype.slice.call(document.querySelectorAll('.month'));

  var monthWithYears = [];
  rects.forEach(function(rect) {
    var mwy = rect.getAttribute('data-date').substring(0,7);
    if (monthWithYears.indexOf(mwy) < 0) {
      monthWithYears.push(mwy);
    }
  });
  months.forEach((month, i) => {
    month.setAttribute('month', monthWithYears[i]);
  });

  months.forEach((element) => {
    element.addEventListener('click', () => {

      const specifiedMonthWithYear = element.getAttribute('month');

      // Contribution Graph highlight.
      Array.prototype.forEach.call(rects, (rect) => {
        if (element.getAttribute('style')) {
          rect.removeAttribute('style');
        } else {

          if (rect.getAttribute('data-date').indexOf(specifiedMonthWithYear) >= 0 ) {
            rect.setAttribute('style', style);
          } else {
            rect.removeAttribute('style');
          }
        }
      });

      // months highlight.
      months.forEach((month) => {
        if (!month.isEqualNode(element)) {
          month.removeAttribute('style');
        } else {
          if (!month.getAttribute('style')) {
            month.setAttribute('style', style);
          } else {
            month.removeAttribute('style');
          }
        }
      })

    }, false);
  });
}

