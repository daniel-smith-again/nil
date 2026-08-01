import { NIL } from "./nil.js"

class NilInstance extends HTMLElement
{
  static formAsasociated = true;
  #shadow
  #internals;
  #value;
  #input;
  #output;
  #dialog;
  #NIL = new NIL(
    (e) => {
        this.#output.textContent += e.data + '\n'
    })
  #content = ''
  #caret = 0
  #display

  get value() { return this.#value; }
  set value(v) 
  {
    if (v !== this.#value) 
    { this.#value = v; }
    this.#internals.setFormValue(this.#value)
    if (v !== this.#input.textContent)
    { this.#input.textContent = newValue }
  }

  constructor() 
  {
    super()
    this.#internals = this.attachInternals()
    //this.#NIL.Attach()
  }

  

  connectedCallback()
  {
    const placeholder = this.getAttribute('placeholder')

    //const shadow = this.#shadow = this.attachShadow({mode : 'open', delegatesFocus : true}); 
    
    //const shadow = this.#shadow = document.createElement('div')

    const input = this.#input = document.createElement('div')
    input.setAttribute('part', 'input')
    input.setAttribute('contenteditable', 'plaintext-only')
    //shadow.appendChild(input)
    this.appendChild(input)
    if (placeholder != '')
    {
      input.textContent = placeholder
      let s = window.getSelection()
      s.setPosition(input.childNodes[0], input.textContent.length)
    }

    input.spellcheck = false

    this.#internals.role = 'textbox'
    this.#internals.ariaMultiLine = 'true'

    const output = this.#output = document.createElement('div')
    output.style.cssText = `
    display:min-height:3lh;min-width:7ch;tab-size:2;color:var(--diminished);margin-top:2lh
    `
    //this.#NIL.Attach(
    //  (e) => {
    //    output.textContent += e.data + '\n'
    //  },
    //  (e) => {
    //    output.textContent = e.message
    //  } )
    this.appendChild(output)

    input.addEventListener('input', () => {})
    input.addEventListener('beforeinput', (e) => {
      if (e.targetElement == this.input)
      {
        switch(e.inputType)
        {
          case 'insertLineBreak':
            this.insertCharacter('\n')
            e.preventDefault()
        }
      }
    })
    input.addEventListener('keydown', (e) => {if (e.target === input) { this.editorInput(e) }} )
    input.addEventListener('selectionchange', this.selectionChanged)

    const style = document.createElement('style')
    style.textContent = `
    nil-instance{display:inline-block;background-color:var(--backgroundsecond);white-space:pre;white-space-collapse:preserve;font-family:monospace;width:fit-content;min-width:7ch;min-height:7lh;margin-top:5lh;caret-color:var(--foregroundsecond);}
    nil-instance *{tab-size:2}
    nil-instance *:focus{outline:none;}
    nil-instance dialog::backdrop{background-color:#00000055;backdrop-filter:blur(5px);}
    nil-instance dialog > input {display:inline;}
    `
    this.appendChild(style)

    /*
    const dialog = this.#dialog = document.createElement('dialog')
    const charactername = document.createElement('input')
    charactername.type = 'text'
    charactername.id = 'characterSelector'
    dialog.appendChild(document.createElement('form'))
    dialog.lastChild.appendChild(charactername)
    dialog.lastChild.addEventListener('submit', (e) => {
      e.preventDefault()
      console.log(e)
      dialog.lastChild.reset()
      dialog.close()
    })

    dialog.appendChild(document.createElement('datalist'))
    for (let v of CharacterNames)
    {

    }

    input.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      dialog.showModal()
    })

    this.appendChild(dialog)
    */
    window.addEventListener('pointerdown', (e) => {
      if (!this.#input.contains(e.target))
      {
        if (e.x > window.innerWidth * 0.75)
        {
          this.insertCharacter('\n')
          e.preventDefault()
        }
        else if (e.x < window.innerWidth * 0.25)
        {
          this.insertCharacter('\t')
          e.preventDefault()
        }
        else if (e.y > window.innerHeight * 0.75)
        {
          this.#NIL.Input(this.#input.textContent)
          e.preventDefault()
        }
      }
    })

  }

  selectionChanged(e)
  {
    console.log(e)
  }

  insertCharacter(c) 
  {
    //let selection = this.#shadow.getSelection()
    let selection = document.getSelection()
    let start = selection.anchorOffset
    let end = selection.anchorOffset
    let value = this.#input.textContent
    let firstchunk = value.substring(0, start)
    let lastchunk = value.substring(end)
    let newvalue = firstchunk + c + lastchunk
    if ((value.length == end) || (value.length - 1 == end) && (value.slice(-1) != '\u200b'))
    {
      newvalue += '\u200b'
    }
    this.#input.textContent = newvalue
    selection.setPosition(this.#input.childNodes[0], start + 1)
    let range = selection.getRangeAt(0)
    let x = range.getBoundingClientRect().x
    let y = range.getBoundingClientRect().y
    window.scrollTo(x, y)
  }

  matchIndent()
  {
    let text = this.#input.textContent
    let pos = this.#shadow.getSelection().getRangeAt(0).startOffset - 2
    var tabcount = 0
    var p = pos
    for (var p = pos; p > 0 && text.charAt(p) != '\n'; p--)
    {
      if (text.charAt(p) == '\t') tabcount++
      else tabcount = 0
    }
    for (var t = 0; t < tabcount; t++)
    { this.insertCharacter('\t') }
  }
  
  editorInput(e)
  {
    let k = e.key
    switch(k)
    {
      case 'Tab':
        e.preventDefault()
        this.insertCharacter('\t')
        break;
      case 'Enter':
        if (e.shiftKey)
        {
          this.#output.textContent = ''
          this.#NIL.Input(this.#input.textContent)
          e.preventDefault()
        }
        break;
      case 'Backspace':
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Home':
      case 'End':
        break;
      default:
        if (k.length > 1)
        e.preventDefault()
    }
  }

  
}
customElements.define('nil-instance', NilInstance)
window.onkeydown = (e) => {if (e.key == "Tab") {e.preventDefault()}}
((n) => {n.focus(); n.click()})(document.getElementsByTagName('nil-instance')[0])