
import ClampTool from "./script.js";

const bodyText = `
  <input id="minFontSize" />
  <input id="maxFontSize" />
  <input id="minViewPort" />
  <input id="maxViewPort" />
  <input id="targetFontUnit" />
  <input id="targetVwUnit" />
  <div id="clampResult"></div>
  <div id="fontSizeResult"></div>
  <div id="clampExample"></div>
  <input id="remBaseUnit" />
  <button id="clampCopyID"></button>
  <button id="fontsizeCopyID"></button>
  <dialog id="dialogID">
    <button id="closeDialog"></button>
    <div id="dialogText"></div>
  </dialog>
`


test('calculateSlope with targetFontUnitValue and targetVwUnitValue both as px', () => {
  
document.body.innerHTML = bodyText

const instance = new ClampTool(
'minFontSize',
'maxFontSize',
'minViewPort',
'maxViewPort',
'targetFontUnit',
'targetVwUnit',
'clampResult',
'fontSizeResult',
'clampExample',
'remBaseUnit',
'clampCopyID',
'fontsizeCopyID',
'dialogID');


  instance.targetFontUnitValue = 'px';
  instance.targetVwUnitValue = 'px';
  instance.remBaseUnitValue = 16;
  instance.baseFontSizeValue = 16
  instance.minFontSizeValue = 16;
  instance.maxFontSizeValue = 32;
  instance.minViewPortValue = 320;
  instance.maxViewPortValue = 640;
  instance.calculateSlope();
  console.log(instance)
  expect(instance.slope).toBe(0.05);
});

test('calculateSlope with targetFontUnitValue as px and targetVwUnitValue not as px', () => {
  document.body.innerHTML = bodyText

const instance = new ClampTool(
'minFontSize',
'maxFontSize',
'minViewPort',
'maxViewPort',
'targetFontUnit',
'targetVwUnit',
'clampResult',
'fontSizeResult',
'clampExample',
'remBaseUnit',
'clampCopyID',
'fontsizeCopyID',
'dialogID');

  instance.targetFontUnitValue = 'px';
  instance.targetVwUnitValue = 'rem';
  instance.remBaseUnitValue = 16;
  instance.baseFontSizeValue = 16
  instance.minFontSizeValue = 16;
  instance.maxFontSizeValue = 32;
  instance.minViewPortValue = 20;
  instance.maxViewPortValue = 40;
  instance.calculateSlope();
  expect(instance.slope).toBe(0.05);
});

test('calculateSlope with targetFontUnitValue not as px and targetVwUnitValue as px', () => {
  document.body.innerHTML = bodyText

const instance = new ClampTool(
'minFontSize',
'maxFontSize',
'minViewPort',
'maxViewPort',
'targetFontUnit',
'targetVwUnit',
'clampResult',
'fontSizeResult',
'clampExample',
'remBaseUnit',
'clampCopyID',
'fontsizeCopyID',
'dialogID');
  instance.targetFontUnitValue = 'rem';
  instance.targetVwUnitValue = 'px';
  instance.remBaseUnitValue = 16;
  instance.baseFontSizeValue = 16
  instance.minFontSizeValue = 1;
  instance.maxFontSizeValue = 2;
  instance.minViewPortValue = 320;
  instance.maxViewPortValue = 640;
  instance.calculateSlope();
  expect(instance.slope).toBe(0.05);
});

test('calculateSlope with targetFontUnitValue and targetVwUnitValue both not as px', () => {
  document.body.innerHTML = bodyText

const instance = new ClampTool(
'minFontSize',
'maxFontSize',
'minViewPort',
'maxViewPort',
'targetFontUnit',
'targetVwUnit',
'clampResult',
'fontSizeResult',
'clampExample',
'remBaseUnit',
'clampCopyID',
'fontsizeCopyID',
'dialogID');
  
  instance.targetFontUnitValue = 'rem';
  instance.targetVwUnitValue = 'rem';
  instance.remBaseUnitValue = 16;
  instance.baseFontSizeValue = 16
  instance.minFontSizeValue = 1;
  instance.maxFontSizeValue = 2;
  instance.minViewPortValue = 20;
  instance.maxViewPortValue = 40;
  instance.calculateSlope();
  expect(instance.slope).toBe(0.05);
});


describe('ClampTool.calculateYAxis', () => {
  document.body.innerHTML = bodyText;
  let clampTool;

  beforeEach(() => {
    // Set up your instance of ClampTool before each test
    clampTool = new ClampTool(
      'minFontSize',
      'maxFontSize',
      'minViewPort',
      'maxViewPort',
      'targetFontUnit',
      'targetVwUnit',
      'clampResult',
      'fontSizeResult',
      'clampExample',
      'remBaseUnit',
      'clampCopyID',
      'fontsizeCopyID',
      'dialogID'
    );
    

    // Mock the methods used in calculateYAxis
    clampTool.convertPxToRem = jest.fn(value => value / 16); // Assuming 16 is the base font size
    clampTool.slope = 0.5; // Example slope value
  });

  test('calculates yAxisIntersection correctly when targetVwUnitValue is "px" and targetFontUnitValue is "rem"', () => {
    clampTool.targetVwUnitValue = 'px';
    clampTool.minViewPortValue = 320; // Example viewport size in pixels
    clampTool.targetFontUnitValue = 'rem';
    clampTool.minFontSizeValue = 1; // Example font size in rem

    clampTool.calculateYAxis();

    expect(clampTool.convertPxToRem).toHaveBeenCalledWith(320);
    expect(clampTool.yAxisIntersection).toBe(-320 / 16 * 0.5 + 1);
  });

  test('calculates yAxisIntersection correctly when targetVwUnitValue and targetFontUnitValue are both "rem"', () => {
    // Implement similar test for when both units are 'rem'
    clampTool.targetVwUnitValue = 'rem';
    clampTool.minViewPortValue = 20; // Example viewport size in rem
    clampTool.targetFontUnitValue = 'rem';
    clampTool.minFontSizeValue = 1; // Example font size in rem

    clampTool.calculateYAxis();

    expect(clampTool.yAxisIntersection).toBe(-20 * 0.5 + 1);
  });

  // Add more tests for different scenarios...
});