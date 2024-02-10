"use strict";

class ClampTool {
  /**
   * Constructor function for initializing various elements and values.
   *
   * @param {string} minFontSize - The id of the minimum font size element
   * @param {string} maxFontSize - The id of the maximum font size element
   * @param {string} minViewPort - The id of the minimum viewport element
   * @param {string} maxViewPort - The id of the maximum viewport element
   * @param {string} targetFontUnit - The id of the target font unit element
   * @param {string} targetVwUnit - The id of the target viewport unit element
   * @param {string} clampResult - The id of the clamp result element
   * @param {string} fontSizeResult - The id of the font size result element
   * @param {string} clampExample - The id of the clamp example element
   * @param {string} remBaseUnit - The id of the rem base unit element
   * @param {string} clampCopyID - The id of the clamp copy element
   * @param {string} fontsizeCopyID - The id of the font size copy element
   * @param {string} dialogID - The id of the dialog element
   */
  constructor(
    minFontSize,
    maxFontSize,
    minViewPort,
    maxViewPort,
    targetFontUnit,
    targetVwUnit,
    clampResult,
    fontSizeResult,
    clampExample,
    remBaseUnit,
    clampCopyID,
    fontsizeCopyID,
    dialogID
  ) {
    // constructors
    this.minFontSize = document.getElementById(minFontSize);
    this.maxFontSize = document.getElementById(maxFontSize);
    this.minViewPort = document.getElementById(minViewPort);
    this.maxViewPort = document.getElementById(maxViewPort);
    this.targetFontUnit = document.getElementById(targetFontUnit);
    this.targetVwUnit = document.getElementById(targetVwUnit);
    this.clampResult = document.getElementById(clampResult);
    this.fontSizeResult = document.getElementById(fontSizeResult);
    this.clampExample = document.getElementById(clampExample);
    this.remBaseUnit = document.getElementById(remBaseUnit);
    this.clampCopyID = document.getElementById(clampCopyID);
    this.fontsizeCopyID = document.getElementById(fontsizeCopyID);
    this.dialogID = document.getElementById(dialogID);
    this.dialogCloseBtn = this.dialogID.querySelector("#closeDialog");

    // values
    this.baseFontSizeValue = this.getBaseFontSize();
    this.allowedTargetFontUnitValues = ["px", "rem"];
    this.targetFontUnitValue = "px";
    this.minFontSizeValue = +this.minFontSize.value || 0;
    this.maxFontSizeValue = +this.maxFontSize.value || 0;
    this.minViewPortValue = +this.minViewPort.value || 0;
    this.maxViewPortValue = +this.maxViewPort.value || 0;
    this.remBaseUnitValue = +this.remBaseUnit.value || 0;
    this.targetVwUnitValue = this.targetVwUnit.checked ? "rem" : "px";
    this.defaultValues = {
      minFontSize: +this.minFontSizeValue,
      maxFontSize: +this.maxFontSizeValue,
      minViewPort: +this.minViewPortValue,
      maxViewPort: +this.maxViewPortValue,
      targetFontUnit: this.targetFontUnitValue,
      targetVwUnit: this.targetVwUnitValue,
      remBaseUnit: this.remBaseUnitValue,
    }
    this.slope = 0;
    this.yAxisIntersection = 0;
    this.preferredValue = null;
    this.cssClampValue = null;
    this.apiEndpoint = "https://api.chucknorris.io/jokes/random";
    this.loader = document.querySelector(".loader");
    this.form = document.forms[0];
    window.addEventListener("DOMContentLoaded", this.events.bind(this));
  }

  /**
   * Listens to various events and handles them accordingly.
   */
  events() {
    this.minFontSize.addEventListener("change",this.handleMinFontSizeChange.bind(this));
    this.maxFontSize.addEventListener("change",this.handleMaxFontSizeChange.bind(this));
    this.minViewPort.addEventListener("change",this.handleMinViewPortChange.bind(this));
    this.maxViewPort.addEventListener("change",this.handleMaxViewPortChange.bind(this));
    this.targetFontUnit.addEventListener("click",this.handleTargetFontValueChange.bind(this));
    this.targetVwUnit.addEventListener("click",this.handleTargetViewportUnitChange.bind(this));
    this.form.addEventListener("submit",function (e) {e.preventDefault();}.bind(this));
    this.remBaseUnit.addEventListener("change",this.handleBaseUnitChange.bind(this));
    this.clampCopyID.addEventListener("click", this.copyClampValue.bind(this));
    this.fontsizeCopyID.addEventListener("click",this.copyFontSizeValue.bind(this));
    this.dialogID.addEventListener("click", this.openDialog.bind(this));
    this.dialogCloseBtn.addEventListener("click", this.closeDialog.bind(this));
    this.dialogID.close();

    this.form.addEventListener("keydown",
      async function (e) {
        try {
          switch (e.key) {
            case "Enter":
              e.preventDefault();

              let updateEvent = new Event("change", {
                bubbles: true,
                cancelable: true,
              });
              e.target.dispatchEvent(updateEvent);

              break;
            case "Escape":
              // reset form vals
              this.resetValues();
              break;
            // handle control c
            case "c":
              if ("ctrl") {
                let clampClickEvent = new Event("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                });

                let fontSizeClickEvent = new Event("click", {
                  bubbles: true,
                  cancelable: true,
                  view: window,
                });
                this.clampCopyID.dispatchEvent(clampClickEvent);

                this.fontsizeCopyID.dispatchEvent(fontSizeClickEvent);

                await this.copyTextToClipboard(this.clampResult.innerText);

                this.toggleCheckMark(clampClickEvent, true);

                this.toggleCheckMark(fontSizeClickEvent, true);
              }
              break;
          }
        } catch (err) {
          console.error(err.message);
          throw new Error(err);
        }
      }.bind(this)
    );

    document.addEventListener("keydown", async (e) => {
      try {
        switch (e.key) {
          case "Enter":
            if (document.activeElement === this.inputElement) {
              // Check if the desired input has focus
              e.preventDefault();

              let updateEvent = new Event("change", {
                bubbles: true,
                cancelable: true,
              });
              e.target.dispatchEvent(updateEvent);
            }
            break;
          case "Escape":
            // reset form vals

            this.resetValues();

            break;
          // handle control c
          case "c":
            if (e.ctrlKey) {
              // Ensure Ctrl key is also pressed
              let clampClickEvent = new Event("click", {
                bubbles: true,
                cancelable: true,
                view: window,
              });

              let fontSizeClickEvent = new Event("click", {
                bubbles: true,
                cancelable: true,
                view: window,
              });
              this.clampCopyID.dispatchEvent(clampClickEvent);

              this.fontsizeCopyID.dispatchEvent(fontSizeClickEvent);

              await this.copyTextToClipboard(
                this.clampResult.innerText + " " + this.fontSizeResult.innerText
              );

              this.toggleCheckMark(clampClickEvent, true);

              this.toggleCheckMark(fontSizeClickEvent, true);
            }
            break;
        }
      } catch (err) {
        console.error(err.message);
        throw new Error(err);
      }
    });

    document
      .querySelector("button[data-active]")
      .addEventListener("click", (e) => {
        const instructions = document.getElementById("instructionBox");

        let active = e.target.dataset.active;

        let activeBool;

        if (active === "true") {
          activeBool = true;
        } else {
          activeBool = false;
        }

        activeBool
          ? (e.target.dataset.active = "false")
          : (e.target.dataset.active = "true");

        activeBool
          ? e.target.classList.add("rotate-0")
          : e.target.classList.remove("rotate-0");

        activeBool
          ? instructions.setAttribute("aria-hidden", "false")
          : instructions.setAttribute("aria-hidden", "true");
        activeBool
          ? instructions.setAttribute("aria-expanded", "true")
          : instructions.setAttribute("aria-expanded", "false");

        activeBool
          ? (instructions.style.height = instructions.scrollHeight + "px")
          : (instructions.style.height = 0);
      });

    this.update();
  }

  resetValues() {
    this.minFontSize.value = this.defaultValues.minFontSize
    this.maxFontSize.value = this.defaultValues.maxFontSize
    this.minViewPort.value = this.defaultValues.minViewPort
    this.maxViewPort.value = this.defaultValues.maxViewPort
    this.targetFontUnit.value = this.defaultValues.targetFontUnit
    this.targetVwUnit.value = this.defaultValues.targetVwUnit
    this.remBaseUnitValue = 18;
    this.baseFontSizeValue = 18;
    this.minFontSizeValue = 18;
    this.maxFontSizeValue = 63;
    this.minViewPortValue = 360;
    this.maxViewPortValue = 840;
    this.calculateSlope();
    this.update();

    window.location.reload();
  }

  /**
   * openDialog function opens a dialog and adds event listeners to close the dialog when clicking outside or on the close button.
   *
   * @param {Event} e - the event object
   * @return {void}
   */
  openDialog(e) {
    this.dialogID.showModal();
    window.addEventListener(
      "click",
      function (e) {
        if (e.target == this.dialogID) {
          this.closeDialog();
          e.target.blur();
        }
        if (e.target == this.dialogCloseBtn) {
          this.closeDialog();
          e.target.blur();
        }
      }.bind(this)
    );
  }

  /**
   * Closes the dialog.
   */
  closeDialog() {
    this.dialogID.close();
  }

  /**
   * Update the dialog text.
   *
   * @param {type} text - description of parameter
   * @return {type}
   */
  updateDialogText(e, text) {
    this.dialogID.querySelector("#dialogText").innerText =
      this.clampResult.innerText + text;
    e.target.closest("svg").classList.add(show);
  }

  /**
   * A function to copy the given text to the clipboard.
   *
   * @param {string} text - the text to be copied to the clipboard
   */
  async copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return false;
    }
  }

  toggleCheckMark(e, bool) {
    const button = e.target.closest("button");
    const span = button.querySelector("span");
    const check = button.querySelector(".checkbox");
    bool ? span.classList.add("d-none") : span.classList.remove("d-none");
    bool ? check.classList.add("show") : check.classList.remove("show");

    new Promise((resolve) => setTimeout(resolve, 3000)).then(() => {
      this.resetCopyButtons();
    });
  }

  /**
   * A description of the entire function.
   */
  async copyClampValue(e) {
    try {
      const clipboardOperationResult = await this.copyTextToClipboard(
        this.clampResult.innerText
      );

      this.toggleCheckMark(e, clipboardOperationResult);
    } catch (err) {
      console.error(err.message);
      throw new Error(err);
    }
  }

  /**
   * Copies the font size value to the clipboard.
   */
  async copyFontSizeValue(e) {
    try {
      const clipboardOperationResult = await this.copyTextToClipboard(
        this.fontSizeResult.innerText
      );

      this.toggleCheckMark(e, clipboardOperationResult);
    } catch (err) {
      console.error(err.message);
      throw new Error(err);
    }
  }

  handleTargetFontValueChange(e) {
    e.target.checked
      ? (this.targetFontUnitValue = "rem")
      : (this.targetFontUnitValue = "px");
    document.querySelectorAll("input[data-font-unit]").forEach((el) => {
      el.dataset.fontUnit === "px"
        ? (el.dataset.fontUnit = "rem")
        : (el.dataset.fontUnit = "px");

      el.dataset.fontUnit === "px"
        ? (el.previousElementSibling.querySelector("span").innerText = "px")
        : (el.previousElementSibling.querySelector("span").innerText = "rem");

      let triggerUpdateEvent = new Event("change", {
        bubbles: true,
        cancelable: true,
      });

      if (el.dataset.fontUnit === "px") {
        el.value = this.convertRemToPx(el.value);
      } else {
        el.value = this.convertPxToRem(el.value);
      }

      el.dispatchEvent(triggerUpdateEvent);

      e.target.checked
        ? (e.target.nextElementSibling.innerText = "rem")
        : (e.target.nextElementSibling.innerText = "px");
    });
  }

  handleTargetViewportUnitChange(e) {
    e.target.checked
      ? (this.targetVwUnitValue = "rem")
      : (this.targetVwUnitValue = "px");
    document.querySelectorAll("input[data-viewport-unit]").forEach((el) => {
      el.dataset.viewportUnit === "rem"
        ? (el.dataset.viewportUnit = "px")
        : (el.dataset.viewportUnit = "rem");
      el.dataset.viewportUnit === "rem"
        ? (el.value = this.convertPxToRem(el.value))
        : (el.value = this.convertRemToPx(el.value));
      el.dataset.viewportUnit === "px"
        ? (el.previousElementSibling.querySelector("span").innerText = "px")
        : (el.previousElementSibling.querySelector("span").innerText = "rem");
      let triggerUpdateEvent = new Event("change", {
        bubbles: true,
        cancelable: true,
      });
      el.dispatchEvent(triggerUpdateEvent);
    });
    e.target.checked
      ? (e.target.nextElementSibling.innerText = "rem")
      : (e.target.nextElementSibling.innerText = "px");
  }

  handleMinFontSizeChange(e) {
    this.minFontSizeValue = +e.target.value;

    this.update();
    this.print();
  }

  handleMaxFontSizeChange(e) {
    this.maxFontSizeValue = +e.target.value;

    this.update();
    this.print();
  }

  handleMinViewPortChange(e) {
    this.minViewPortValue = +e.target.value;

    this.update();
    this.print();
  }

  handleMaxViewPortChange(e) {
    this.maxViewPortValue = +e.target.value;

    this.update();
    this.print();
  }

  handleBaseUnitChange(e) {
    this.baseFontSizeValue = e.target.value;

    this.update();
    this.print();
  }

  getBaseFontSize() {
    // this is coming from the stylesheet :root var --base-font-size
    const computedStyle = window.getComputedStyle(document.body);
    const baseFontSize = computedStyle.getPropertyValue("--base-font-size");
    let getBaseFontSize = parseInt(baseFontSize.split("px")[0]);
    return getBaseFontSize;
  }

  convertRemToPx(remValue) {
    let val = remValue * this.baseFontSizeValue;
    return parseInt(val);
  }

  convertPxToRem(pxValue) {
    let remValue = pxValue / this.baseFontSizeValue;

    return parseFloat(remValue.toFixed(2));
  }

  calculateSlope() {
    let fontSizeMin,
      fontSizeMax,
      screenSizeMin,
      screenSizeMax = null;

    if (this.targetFontUnitValue === "px") {
      fontSizeMin = this.convertPxToRem(this.minFontSizeValue);
      fontSizeMax = this.convertPxToRem(this.maxFontSizeValue);
    } else {
      fontSizeMin = this.minFontSizeValue;
      fontSizeMax = this.maxFontSizeValue;
    }

    if (this.targetVwUnitValue === "px") {
      screenSizeMin = this.convertPxToRem(this.minViewPortValue);
      screenSizeMax = this.convertPxToRem(this.maxViewPortValue);
    } else {
      screenSizeMin = this.minViewPortValue;
      screenSizeMax = this.maxViewPortValue;
    }

    this.slope = (fontSizeMax - fontSizeMin) / (screenSizeMax - screenSizeMin);
  }

  calculateYAxis() {
    let minVW, minFont;

    if (this.targetVwUnitValue === "px") {
      minVW = this.convertPxToRem(this.minViewPortValue);
    }

    if (this.targetVwUnitValue === "rem") {
      minVW = this.minViewPortValue;
    }

    if (this.targetFontUnitValue === "px") {
      minFont = this.convertPxToRem(this.minFontSizeValue);
    }

    if (this.targetFontUnitValue === "rem") {
      minFont = this.minFontSizeValue;
    }

    this.yAxisIntersection = -minVW * this.slope + minFont;
  }

  formatFloat(val) {
    if (val % 1 === 0) {
      return parseInt(val);
    } else {
      // this hack allows you to have 4 decimal places but remove trailing zeros
      return parseFloat(val.toFixed(4));
    }
  }

  calculatePreferredValue() {
    let preferredValue =
      parseFloat(this.yAxisIntersection).toFixed(4) +
      "rem" +
      " + " +
      parseFloat(this.slope * 100).toFixed(4) +
      "vw";

    this.preferredValue = preferredValue;
  }

  constructClampValue() {
    this.calculateSlope();
    this.calculateYAxis();
    this.calculatePreferredValue();

    let minFont, maxFont;

    if (this.targetFontUnitValue === "rem") {
      minFont = this.minFontSizeValue;
      maxFont = this.maxFontSizeValue;
    } else {
      minFont = this.convertPxToRem(this.minFontSizeValue);
      maxFont = this.convertPxToRem(this.maxFontSizeValue);
    }

    this.cssClampValue =
      "clamp(" +
      this.formatFloat(minFont) +
      "rem, " +
      this.preferredValue +
      ", " +
      this.formatFloat(maxFont) +
      "rem)";
  }

  displayClampValue() {
    this.clampResult.innerText = this.cssClampValue;

    this.fontSizeResult.innerText = `font-size: ${this.cssClampValue};`;

    this.clampExample.style.fontSize = this.cssClampValue;

    //this.fetchJoke()

    let minFont,
      maxFont,
      minVW,
      maxVw = null;

    if (this.targetVwUnitValue === "rem") {
      minVW = this.convertRemToPx(this.minViewPortValue);
      maxVw = this.convertRemToPx(this.maxViewPortValue);
    }

    if (this.targetVwUnitValue === "px") {
      minVW = this.minViewPortValue;
      maxVw = this.maxViewPortValue;
    }

    if (this.targetFontUnitValue === "px") {
      minFont = this.convertPxToRem(this.minFontSizeValue);
      maxFont = this.convertPxToRem(this.maxFontSizeValue);
    }
    if (this.targetFontUnitValue === "rem") {
      minFont = this.minFontSizeValue;
      maxFont = this.maxFontSizeValue;
    }
    this.clampExample.innerText =
      "This text will scale between " +
      this.formatFloat(minFont) +
      "rem at " +
      this.formatFloat(minVW) +
      "px and " +
      this.formatFloat(maxFont) +
      "rem at " +
      this.formatFloat(maxVw) +
      "px";
  }

  fetchJoke() {
    const xhr = new XMLHttpRequest();

    this.clampExample.childNodes.forEach((el) => {
      this.clampExample.removeChild(el);
    });

    xhr.open("GET", this.apiEndpoint);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          const textNode = document.createTextNode(data?.value);
          this.clampExample.appendChild(textNode);
        }
      }
    };

    xhr.send();
  }

  /**
   * Resets the state of the copy buttons by hiding the checkboxes and showing the spans.
   */
  resetCopyButtons() {
    const checkboxes = document.querySelectorAll(".checkbox");
    const spans = document.querySelectorAll("button span");

    checkboxes.forEach((checkbox) => {
      checkbox.classList.remove("show");
      checkbox.classList.add("d-none");
    });

    spans.forEach((span) => {
      span.classList.remove("d-none");
    });
  }

  update() {
    this.constructClampValue();
    this.displayClampValue();
    this.resetCopyButtons();
  }

  print() {}
}

export default ClampTool;
