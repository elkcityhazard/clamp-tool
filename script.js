"use strict"

export default class ClampTool {
    constructor(minFontSize, 
                maxFontSize, 
                minViewPort, 
                maxViewPort,
                targetFontUnit,
                targetVwUnit,
                clampResult,
                fontSizeResult,
                clampExample
                ) {
                // constructors
                this.minFontSize = document.getElementById(minFontSize)
                this.maxFontSize = document.getElementById(maxFontSize)
                this.minViewPort = document.getElementById(minViewPort)
                this.maxViewPort = document.getElementById(maxViewPort)
                this.targetFontUnit = document.getElementById(targetFontUnit)
                this.targetVwUnit = document.getElementById(targetVwUnit)
                this.clampResult = document.getElementById(clampResult)
                this.fontSizeResult = document.getElementById(fontSizeResult)
                this.clampExample = document.getElementById(clampExample)

                // values
                this.baseFontSizeValue = this.getBaseFontSize()
                this.allowedTargetFontUnitValues = ['px', 'rem']
                this.targetFontUnitValue = 'px'  
                this.minFontSizeValue = +this.minFontSize.value || 0
                this.maxFontSizeValue = +this.maxFontSize.value || 0
                this.minViewPortValue = +this.minViewPort.value || 0
                this.maxViewPortValue = +this.maxViewPort.value || 0
                this.targetVwUnitValue = this.targetVwUnit.checked ? 'rem' : 'px'
                this.slope = 0
                this.yAxisIntersection = 0
                this.preferredValue = null
                this.cssClampValue = null



                // formula calcs
                this.events()


                
                }

                events() {

                    this.minFontSize.addEventListener('change', this.handleMinFontSizeChange.bind(this))
                    this.maxFontSize.addEventListener('change', this.handleMaxFontSizeChange.bind(this))
                    this.minViewPort.addEventListener('change', this.handleMinViewPortChange.bind(this))
                    this.maxViewPort.addEventListener('change', this.handleMaxViewPortChange.bind(this))
                    this.targetFontUnit.addEventListener('click', this.handleTargetFontValueChange.bind(this))
                    this.targetVwUnit.addEventListener('click', this.handleTargetViewportUnitChange.bind(this))

                }

                handleTargetFontValueChange(e) {

                   e.target.checked ? this.targetFontUnitValue = 'rem' : this.targetFontUnitValue = 'px'

                   e.target.checked ? this.handleMinAndMaxFontUnitValueChange('rem') : this.handleMinAndMaxFontUnitValueChange('px')

                   document.querySelectorAll('.css-unit').forEach(element => {
                       element.innerText = this.targetFontUnitValue
                   })

                   this.update()
                   
                }

                handleMinAndMaxFontUnitValueChange(type) {
                    console.log("-------font changed")
                  switch (type) {
                    case "rem":
                    this.targetFontUnitValue = 'rem'
                    this.minFontSize.value = this.convertPxToRem(this.minFontSizeValue)
                    this.maxFontSize.value = this.convertPxToRem(this.maxFontSizeValue)
                    break;

                    case "px":

                    this.targetFontUnitValue = 'px'
                    this.minFontSize.value = this.minFontSizeValue
                    this.maxFontSize.value =  this.maxFontSizeValue

                    break;

                    default:


                  }

                  console.log("current val", this.minFontSize.value)

                }

                handleMinAndMaxViewPortUnitValueChange(type) {
                  switch (type) {
                    case "rem":

                    this.minViewPort.value = this.convertPxToRem(this.minViewPortValue)
                    this.maxViewPort.value = this.convertPxToRem(this.maxViewPortValue)

                    break;
                    case "px":


                    this.minViewPort.value = this.minViewPortValue
                    this.maxViewPort.value =  this.maxViewPortValue

                    
                    break
                    default:

                  }
                    
                }

                handleTargetViewportUnitChange(e) {
                    e.target.checked ? this.targetVwUnitValue = 'rem' : this.targetVwUnitValue = 'px'
                    document.querySelectorAll('.vw-unit').forEach(element => {
                        element.innerText = this.targetVwUnitValue
                    })

                    e.target.checked ? this.handleMinAndMaxViewPortUnitValueChange('rem') : this.handleMinAndMaxViewPortUnitValueChange('px')


                }


                handleMinFontSizeChange(e) {

                  console.log("target value", this.targetVwUnitValue)

                  if (this.targetFontUnitValue === 'rem') {
                     console.log("rem change", this.convertRemToPx(e.target.value))
                     this.minFontSizeValue = +this.convertRemToPx(e.target.value);
                 } else {
                     this.minFontSizeValue = +e.target.value;
                 }
                    this.update()
                    this.print()
                }

                handleMaxFontSizeChange(e) {
                    if (this.targetFontUnitValue = 'rem') {
                     this.maxFontSizeValue = +this.convertRemToPx(e.target.value) 
                    } else {
                     this.maxFontSizeValue = +e.target.value
                    }
                   
                    
                    this.update()
                    this.print()
                    
                 }

                 handleMinViewPortChange(e) {
                    

                    if (this.targetVwUnitValue = 'rem') {
                     this.minViewPortValue = +this.convertRemToPx(e.target.value)
                    } else {
                     this.minViewPortValue = +e.target.value
                    }
                    
                    
                    this.update()
                    this.print()
                    
                 }

                 handleMaxViewPortChange(e) {
                    if (this.targetVwUnitValue = 'rem') {
                     this.maxViewPortValue = +this.convertRemToPx(e.target.value)
                    } else {
                     this.maxViewPortValue = +e.target.value
                    }
                   
                    
                    this.update()
                    this.print()
                 }

                 getBaseFontSize() {
                    // this is coming from the stylesheet :root var --base-font-size
                    const computedStyle = window.getComputedStyle(document.body)
                    const baseFontSize = computedStyle.getPropertyValue('--base-font-size')
                    let abstractBaseFontSize = parseInt(baseFontSize.split('px')[0])
                    return abstractBaseFontSize
                 }

                 convertRemToPx(remValue) {
                    return remValue * this.baseFontSizeValue
                 }

                 convertPxToRem(pxValue) {
                                            let remValue = pxValue / this.baseFontSizeValue

                       return remValue
                 }

                 calculateSlope() {

                    let fontSizeMin = this.convertPxToRem(this.minFontSizeValue)
                    let fontSizeMax = this.convertPxToRem(this.maxFontSizeValue)
                    let screenSizeMin = this.convertPxToRem(this.minViewPortValue)
                    let screenSizeMax = this.convertPxToRem(this.maxViewPortValue)

                    this.slope = (fontSizeMax - fontSizeMin) / (screenSizeMax - screenSizeMin)
                    
                 }

                 calculateYAxis() {

                    this.yAxisIntersection = -this.convertPxToRem(this.minViewPortValue) * this.slope + this.convertPxToRem(this.minFontSizeValue)

                    console.log("y axis intersection",this.yAxisIntersection)

                    

                 }

                 calculatePreferredValue() {

                    console.log("valuies",this.yAxisIntersection, this.slope)
                    
                   
                    let preferredValue = this.yAxisIntersection+'rem' + ' + ' + (this.slope*100)+'vw'
                   
                    this.preferredValue = preferredValue
                 }

                 constructClampValue() {
                    this.calculateSlope()
                    this.calculateYAxis()
                    this.calculatePreferredValue()
                    
                    let minFont = this.convertPxToRem(this.minFontSizeValue)
                    let maxFont = this.convertPxToRem(this.maxFontSizeValue) 
                    this.cssClampValue = 'clamp('+minFont+'rem, '+this.preferredValue+', '+maxFont+'rem)'
                   
                 }

                 displayClampValue() {
                    this.clampResult.innerText = this.cssClampValue

                    this.clampExample.style.fontSize = this.cssClampValue
                    this.clampExample.innerText = this.cssClampValue
                 }


                 update() {
                    this.constructClampValue()
                    this.displayClampValue()
                 }

                 print() {
                    console.log({
                        vwUnit: this.targetVwUnitValue,
                        minFontSize: this.minFontSizeValue,
                        maxFontSize: this.maxFontSizeValue,
                        minViewPort: this.minViewPortValue,
                        maxViewPort: this.maxViewPortValue
                    })
                 }



}
       