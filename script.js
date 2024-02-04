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
                clampExample,
                remBaseUnit,
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
                this.remBaseUnit = document.getElementById(remBaseUnit)

                // values
                this.baseFontSizeValue = this.getBaseFontSize()
                this.allowedTargetFontUnitValues = ['px', 'rem']
                this.targetFontUnitValue = 'px'  
                this.minFontSizeValue = +this.minFontSize.value || 0
                this.maxFontSizeValue = +this.maxFontSize.value || 0
                this.minViewPortValue = +this.minViewPort.value || 0
                this.maxViewPortValue = +this.maxViewPort.value || 0
                this.remBaseUnitValue = +this.remBaseUnit.value || 0
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
                    this.remBaseUnit.addEventListener('change', this.handleBaseUnitChange.bind(this))

                    this.update()

                }

                handleTargetFontValueChange(e){
                  e.target.checked ? this.targetFontUnitValue = 'rem' : this.targetFontUnitValue = 'px'
                  document.querySelectorAll('input[data-font-unit]').forEach(el => {
                    
                    el.dataset.fontUnit === 'px' ? el.dataset.fontUnit = 'rem' : el.dataset.fontUnit = 'px'
                   
                    el.dataset.fontUnit === 'px' ? el.previousElementSibling.querySelector('span').innerText = 'px': el.previousElementSibling.querySelector('span').innerText = 'rem'

                    let event = new Event('change', {
                      bubbles: true,
                      cancelable: true
                    })

                    if (el.dataset.fontUnit === 'px') {
                     el.value = this.convertRemToPx(el.value)
                    } else {
                      el.value = this.convertPxToRem(el.value)
                    }

                    el.dispatchEvent(event)

                    e.target.checked ? e.target.nextElementSibling.innerText = "rem" : e.target.nextElementSibling.innerText = "px"

                  })
                }

                handleTargetViewportUnitChange(e){
                  e.target.checked ? this.targetVwUnitValue = 'rem' : this.targetVwUnitValue = 'px'
                  document.querySelectorAll('input[data-viewport-unit]').forEach(el => {
                    el.dataset.viewportUnit === 'rem' ? el.dataset.viewportUnit = 'px' : el.dataset.viewportUnit = 'rem'
                    el.dataset.viewportUnit === 'rem' ? el.value = this.convertPxToRem(el.value) : el.value = this.convertRemToPx(el.value)
                    el.dataset.viewportUnit === 'px' ? el.previousElementSibling.querySelector('span').innerText = 'px': el.previousElementSibling.querySelector('span').innerText = 'rem'
                    let event = new Event('change', {
                      bubbles: true,
                      cancelable: true
                    })
                    el.dispatchEvent(event)
                  })
                  e.target.checked ? e.target.nextElementSibling.innerText = "rem" : e.target.nextElementSibling.innerText = "px"
                }

                handleMinFontSizeChange(e) {
                  
                 this.minFontSizeValue = +e.target.value
                 
                  this.update()
                  this.print()
                  
                }

                handleMaxFontSizeChange(e) {

                  this.maxFontSizeValue = +e.target.value
                  
                  this.update()
                  this.print()
                }

                handleMinViewPortChange(e) {
                 

                  this.minViewPortValue = +e.target.value
                  
                  this.update()
                  this.print()

                }

                handleMaxViewPortChange(e) {

                  this.maxViewPortValue = +e.target.value
                  
                  this.update()
                  this.print()

                }

                handleBaseUnitChange(e) {
                  const root = document.documentElement

                  root.style.setProperty('--base-font-size', `${this.remBaseUnitValue}px`)
                  
                  this.baseFontSizeValue = e.target.value
                  
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

                  let fontSizeMin, fontSizeMax, screenSizeMin, screenSizeMax = null

                  if (this.targetFontUnitValue === 'px') {
                     fontSizeMin = this.convertPxToRem(this.minFontSizeValue)
                     fontSizeMax = this.convertPxToRem(this.maxFontSizeValue)
                  } else {
                     fontSizeMin = this.minFontSizeValue
                     fontSizeMax = this.maxFontSizeValue
                  }

                  if (this.targetVwUnitValue === 'px') {
                     screenSizeMin = this.convertPxToRem(this.minViewPortValue)
                     screenSizeMax = this.convertPxToRem(this.maxViewPortValue)
                  } else {
                     screenSizeMin = this.minViewPortValue
                     screenSizeMax = this.maxViewPortValue
                  }

                    this.slope = (fontSizeMax - fontSizeMin) / (screenSizeMax - screenSizeMin)
                    
                 }

                 calculateYAxis() {

                  let minVW, minFont

                  if (this.targetVwUnitValue === 'px') {
                     minVW = this.convertPxToRem(this.minViewPortValue)
                     
                  }

                  if (this.targetVwUnitValue === 'rem') {
                     minVW = this.minViewPortValue
                  }

                  if (this.targetFontUnitValue === 'px') {
                     minFont = this.convertPxToRem(this.minFontSizeValue)
                  }

                  if (this.targetFontUnitValue === 'rem') {
                     minFont = this.minFontSizeValue
                  }

                 

                    this.yAxisIntersection = -minVW * this.slope + minFont

                  

                    

                 }

                 formatFloat(val) {

                  if (val % 1 === 0) {
                     return parseInt(val)
                  } else {
                     // this hack allows you to have 4 decimal places but remove trailing zeros
                     return parseFloat(val.toFixed(4))
                  }

                 }

                 calculatePreferredValue() {

                    
                   
                    let preferredValue = parseFloat(this.yAxisIntersection).toFixed(4)+'rem' + ' + ' + parseFloat((this.slope*100)).toFixed(4)+'vw'
                   
                    this.preferredValue = preferredValue
                 }

                 constructClampValue() {
                    this.calculateSlope()
                    this.calculateYAxis()
                    this.calculatePreferredValue()

                    let minFont, maxFont

                    if (this.targetFontUnitValue === 'rem') {
                        minFont = this.minFontSizeValue
                        maxFont = this.maxFontSizeValue
                    } else {
                        minFont = this.convertPxToRem(this.minFontSizeValue)
                        maxFont = this.convertPxToRem(this.maxFontSizeValue)
                    }
                    
                    
                    this.cssClampValue = 'clamp('+this.formatFloat(minFont)+'rem, '+this.preferredValue+', '+this.formatFloat(maxFont)+'rem)'
                   
                 }

                 displayClampValue() {
                    this.clampResult.innerText = this.cssClampValue

                    this.fontSizeResult.innerText = `font-size: ${this.cssClampValue};`

                    this.clampExample.style.fontSize = this.cssClampValue

                    //this.fetchJoke()

                    let minFont, maxFont, minVW, maxVw = null


                    if (this.targetVwUnitValue === 'rem') {
                        minVW = this.convertRemToPx(this.minViewPortValue)
                        maxVw = this.convertRemToPx(this.maxViewPortValue)
                    }

                    if (this.targetVwUnitValue === 'px') {
                        minVW = this.minViewPortValue
                        maxVw = this.maxViewPortValue
                    }

                    if (this.targetFontUnitValue === 'px') {
                        minFont = this.convertPxToRem(this.minFontSizeValue)
                        maxFont = this.convertPxToRem(this.maxFontSizeValue)
                    }
                    if (this.targetFontUnitValue === 'rem') {
                        minFont = this.minFontSizeValue
                        maxFont = this.maxFontSizeValue
                    }
                    this.clampExample.innerText = 'This text will scale between '+this.formatFloat(minFont)+'rem at '+this.formatFloat(minVW)+'px and '+this.formatFloat(maxFont)+'rem at '+this.formatFloat(maxVw)+'px'


                    
                 }

                 fetchJoke() {
                  const xhr = new XMLHttpRequest()

                  this.clampExample.childNodes.forEach(el => {
                     this.clampExample.removeChild(el)
                  })
                  
                  xhr.open('GET', this.apiEndpoint)

                  xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                      if (xhr.status === 200) {
                        const data = JSON.parse(xhr.responseText)
                        const textNode = document.createTextNode(data?.value)
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
                    
                 }



}
       