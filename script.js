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
                this.apiEndpoint = 'https://api.chucknorris.io/jokes/random'
                this.loader = document.querySelector('.loader')
                this.form = document.forms[0]



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
                    this.form.addEventListener('submit', function(e){e.preventDefault()}.bind(this))

                    this.update()

                }

                handleTargetFontValueChange(e) {

                  function setDataSet(id, value) {
                     document.querySelectorAll(`input[data-${id}]`).forEach(el => {
                        el.dataset.fontUnit = value
                        console.log(el.dataset.fontUnit)
                     })

                  }

                  e.target.checked ? setDataSet('font-unit', 'rem') : setDataSet('font-unit', 'px')

                 

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

                handleMinAndMaxViewPortUnitValueChange(e) {

                  function setDataSet(id, value) {
                     document.querySelectorAll(`input[data-${id}]`).forEach(el => {
                        el.dataset.fontUnit = value
                     })

                  }

                  e.target.checked ? setDataSet('viewportUnit', 'rem') : setDataSet('viewportUnit', 'px')
                  
                    
                }

                handleTargetViewportUnitChange(e) {
                    e.target.checked ? this.targetVwUnitValue = 'rem' : this.targetVwUnitValue = 'px'
                    document.querySelectorAll('.vw-unit').forEach(element => {
                        element.innerText = this.targetVwUnitValue
                    })

                    e.target.checked ? this.handleMinAndMaxViewPortUnitValueChange('rem') : this.handleMinAndMaxViewPortUnitValueChange('px')


                }


                handleMinFontSizeChange(e) {

                  if (e.target.dataset.fontUnit === 'px') {
                    this.minFontSizeValue = +e.target.value
                  }

                  if (e.target.dataset.fontUnit === 'rem') {
                    this.minFontSizeValue = this.convertRemToPx(e.target.value)
                  }

                 
                    this.update()
                    this.print()
                }

                handleMaxFontSizeChange(e) {
                     
                  if (e.target.dataset.fontUnit === 'px') {
                    this.maxFontSizeValue = +e.target.value
                  }

                  if (e.target.dataset.fontUnit === 'rem') {
                    this.maxFontSizeValue = this.convertRemToPx(e.target.value)
                  }
                   
                    
                    this.update()
                    this.print()
                    
                 }

                 handleMinViewPortChange(e) {
                  console.log(e.target.dataset.viewportUnit)

                    e.target.dataset.viewportUnit === "rem" ? 
                    this.minViewPortValue = +this.convertRemToPx(e.target.value) : 
                    this.minViewPortValue = +e.target.value

                    this.minViewPort.value = this.minViewPortValue
                    

                    
                    this.update()
                    this.print()
                    
                 }

                 handleMaxViewPortChange(e) {
                     e.target.dataset.viewportUnit === "rem" ?
                     this.maxViewPortValue = +this.convertRemToPx(e.target.value) :
                     this.maxViewPortValue = +e.target.value

                     this.maxViewPort.value = this.maxViewPortValue

                    
                   
                    
                    this.update()
                    this.print()
                 }

                 getBaseFontSize() {
                    // this is coming from the stylesheet :root var --base-font-size
                    const computedStyle = window.getComputedStyle(document.body)
                    const baseFontSize = computedStyle.getPropertyValue('--base-font-size')
                    let getBaseFontSize = parseInt(baseFontSize.split('px')[0])
                    return getBaseFontSize
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
                    
                   
                    let preferredValue = parseFloat(this.yAxisIntersection).toFixed(4)+'rem' + ' + ' + parseFloat((this.slope*100)).toFixed(4)+'vw'
                   
                    this.preferredValue = preferredValue
                 }

                 constructClampValue() {
                    this.calculateSlope()
                    this.calculateYAxis()
                    this.calculatePreferredValue()
                    
                    let minFont = this.convertPxToRem(this.minFontSizeValue) % 2 !== 0 ? parseFloat(this.convertPxToRem(this.minFontSizeValue)).toFixed(4) : this.convertPxToRem(this.minFontSizeValue)
                    let maxFont = parseFloat(this.convertPxToRem(this.maxFontSizeValue)).toFixed(4)
                    this.cssClampValue = 'clamp('+minFont+'rem, '+this.preferredValue+', '+maxFont+'rem)'
                   
                 }

                 displayClampValue() {
                    this.clampResult.innerText = this.cssClampValue

                    this.fontSizeResult.innerText = `font-size: ${this.cssClampValue};`

                    this.clampExample.style.fontSize = this.cssClampValue

                    this.fetchJoke()


                    
                 }

                 fetchJoke() {
                  const xhr = new XMLHttpRequest()

                  this.clampExample.childNodes.forEach(el => {
                     this.clampExample.removeChild(el)
                  })
                  this.clampExample.appendChild(this.loader)
                  
                  xhr.open('GET', this.apiEndpoint)

                  xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                      if (xhr.status === 200) {
                        const data = JSON.parse(xhr.responseText)
                        const textNode = document.createTextNode(data?.value)
                        this.clampExample.removeChild(this.loader)
                        this.clampExample.appendChild(textNode)
                      }
                    }
                  }

                  xhr.send()
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
       