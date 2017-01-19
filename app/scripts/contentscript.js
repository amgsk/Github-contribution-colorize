// Enable chromereload by uncommenting this line:
//import 'chromereload/devonly';

const isValidPage = () => {
  return document.getElementsByClassName('js-contribution-graph').length > 0;
};

const convertRGBToHex = (rgb) => {
  const ret = eval(rgb.replace(/rgb/,"((").replace(/,/ig,")*256+")).toString(16);
  return "#" + (("000000" + ret).substring( 6 + ret.length - 6));
};

const colorizeCntributionRect = (selectedLevel) => {
  const contributionRects = document.getElementsByTagName('rect');
  Array.prototype.forEach.call(contributionRects, (rect) => {
    const highlightColor    = '#bb102e';
    const currentFillColor  = rect.getAttribute('fill');
    const originalFillColor = rect.getAttribute('fill-org');

    if (selectedLevel === currentFillColor) {
      rect.setAttribute('fill-org', currentFillColor)
      rect.setAttribute('fill', highlightColor);
    } else {
      if (originalFillColor) {
        rect.setAttribute('fill', originalFillColor);
        rect.removeAttribute('fill-org');
      }
    }
  });
};

if (isValidPage()) {
  Array.prototype.forEach.call(document.getElementsByClassName('legend')[0].children, (element) => {
    element.addEventListener('click', () => {
      colorizeCntributionRect(convertRGBToHex(element.style['background-color']));
    }, false);
  });
}
