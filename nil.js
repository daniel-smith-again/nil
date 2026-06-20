export class NIL 
  {
    #model
    constructor()
    {
      this.#model = undefined
    }
    Result = class extends Event 
    {
      #result
      constructor(output)
      {
        super('nil-result')
        this.#result = output
      }
      get data()
      {
        return this.#result
      }
    }
    Error = class extends Event
    {
      #message
      #data
      constructor(message, data)
      {
        super('nil-error')
        this.#message = message
        this.#data = data
      }
      get message()
      {
        return this.#message
      }
      get data()
      {
        return this.#data
      }

    }
    Attach(result, error)
    {
      addEventListener('nil-result', result)
      addEventListener('nil-error', error)
    }
    Input(src)
    {
      let e = new this.Result(this.Eval(src))
      if (e.data != undefined) dispatchEvent(e)
    }
    Eval(src)
    {
      let tree = this.parse(src)
      return JSON.stringify(
        tree,
        (k, v) => v instanceof Array && ! v.some((i) => i instanceof Array) ? JSON.stringify(v) : v,
        2
      ) .replace(/\\/g, '')
        .replace(/\"\[/g, '[')
        .replace(/\]\"/g,']')
        .replace(/\"\{/g, '{')
        .replace(/\}\"/g,'}');

      
    }
    checkbalanced(src)
    {
      let nesting = 0
      let spaceindent = false
      let insidestring = false
      let insidestringescape = false
      let insidestringembed = false
      let escapenesting = 0
      for (let c of src)
      {
        if (!insidestring)
        {
          if (c == '(') nesting++
          if (c == ')') nesting--
          if (nesting < 0) 
          {
            dispatchEvnet(new this.Error("Parentheses are not balanced", undefined))
            return false
          }
          if (insidestringembed && nesting == escapenesting) 
          {
            insidestring = true
            insidestringembed = false
          }
          if (c == '"') insidestring = true
        }
        else
        {
          if (c == '"') insidestring = false
          if (insidestringescape)
          {
            if (c == '(') 
            {
              insidestringembed = true
              insidestring = false
              escapenesting = nesting
              nesting++
            }
          }
          else
          {
            if (c == '\\') insidestringescape = true
          }
        }
      }
      if (nesting > 0)
      {
        dispatchEvent(new this.Error("Parentheses are not balanced", undefined))
        return false
      }
      return true
    }

    parenifyparens(src)
    {

    }
    parenify(src)
    {
      src = '\n' + src
      if (!this.checkbalanced(src)) return undefined
      console.log(src)

      let lines = src.split(/(\n.*)/)
      lines = lines.filter((l) => !(l == "\n" || l == "" || l == "\n\u200b"))
      for (let n in lines)
      {
        if (lines[n][1] == ' ')
        {
          if (n > 0)
          {
            lines[n - 1] += ' ' + lines[n].split(/\n */)[1]
            lines.splice(n, 1)
          }
        }
      }
      let indentcount = []
      for (let l of lines)
      {
        let count = 0
        for (let c of l)
        {
          if (c == '\t') count++
        }
        indentcount.push(count)
      }
      let ordinality = []
      for (let n of indentcount)
      {
        if (!ordinality.includes(n)) ordinality.push(n)
      }
      ordinality.sort((a, b) => a - b)
      for (let i in indentcount)
      {
        indentcount[i] = ordinality.indexOf(indentcount[i])
      }
      for (let n in lines)
      {
        let chunks = lines[n].split(/(\n\t*)/)
        if (n > 0)
        {
          let i = indentcount[n] - indentcount[n - 1]
          if (i > 0)
          {
            lines[n] = chunks[1] + '('.repeat(i) + chunks[2]
          }
          else if (i < 0)
          {
            lines[n - 1] += ')'.repeat(i * -1)
          }
          else if (i == 0 && indentcount[n] > 0)
          {
            lines[n - 1] += ')'
            lines[n] = chunks[1] + '(' + chunks[2]
          }
        }
        else
        {
          let i = indentcount[n]
          lines[n] = chunks[1] + '('.repeat(i) + chunks[2]
        }
      }
      lines[lines.length - 1] += ')'.repeat(indentcount[indentcount.length - 1])
      let chunks = lines[0].split(/(\n\t*)/)
      chunks[1] = chunks[1].slice(1)
      lines[0] = chunks[1] + '(' + chunks[2]
      lines = lines.reduce((o, l) => o + l, '')
      lines = lines + ')'
      return lines
    }
    parse(src)
    {
      console.log(src)
      let text = 
      {
        source : this.parenify(src),
        pos : 0,
        next()
        {
          return this.pos < this.source.length ? this.source[this.pos++] : undefined
        },
        peek(n)
        {
          return n ? this.source[this.pos + n] : this.source[this.pos]
        }
      }
      console.log(text.source)
      const read = () =>
      {
        while(/\s/.test(text.peek()) && text.peek() != undefined)
        {
          text.next()
        }
        let atom = undefined
        switch(text.peek())
        {
          case '(':
            atom = []
            text.next()
            while(text.peek() != ')' && text.peek() != undefined)
            {
              atom.push(read())
            }
            text.next()
            return atom
            break;
          case '"':
            let stringlist = []
            text.next()
            atom = ''
            while(text.peek() != '"' && text.peek() != undefined)
            {
              if (text.peek() == '\\')
              {
                text.next()
                switch(text.peek())
                {
                  case '\\':
                  case '"':
                    atom += text.next()
                    break;
                  case '(':
                    stringlist.push(atom)
                    atom = ''
                    stringlist.push(read())
                    break;
                  default:
                    atom += text.next()
                }
              }
              else
              {
                atom += text.next()
              }
            }
            text.next()
            let returnlist = ["string"]
            for (let a of stringlist) returnlist.push(a);
            returnlist.push(atom)
            return returnlist
            break;
          default:
            atom = text.next()
            while(!/\s|\(|\)/.test(text.peek()) && text.peek() != undefined)
            {
              atom += text.next()
            }
            while(/\s/.test(text.peek()) && text.peek() != undefined)
            {
              text.next()
            }
            return atom
            break;
        }
      }
      return read()
    }
  }

  
  class NilInstance extends HTMLElement
  {
    static formAsasociated = true;
    #shadow
    #internals;
    #value;
    #input;
    #output;
    #NIL = new NIL()
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
      this.#NIL.Attach()
    }

    

    connectedCallback()
    {
      const placeholder = this.getAttribute('placeholder')

      const shadow = this.#shadow = this.attachShadow({mode : 'closed', delegatesFocus : true}); 

      const input = this.#input = document.createElement('div')
      input.setAttribute('part', 'input')
      input.setAttribute('contenteditable', 'plaintext-only')
      shadow.appendChild(input)
      if (placeholder != '')
      {
        input.textContent = placeholder + '\n\u200b'
        let s = shadow.getSelection()
        s.setPosition(input.childNodes[0], input.textContent.length)
      }

      input.spellcheck = false

      this.#internals.role = 'textbox'
      this.#internals.ariaMultiLine = 'true'

      const output = this.#output = document.createElement('div')
      output.style.cssText = `
      display:min-height:3lh;min-width:7ch;tab-size:2;color:var(--diminished);margin-top:2lh
      `
      this.#NIL.Attach(
        (e) => {
          output.textContent = e.data
        },
        (e) => {
          output.textContent = e.message
        } )
      shadow.appendChild(output)

      this.addEventListener('input', () => {})
      this.addEventListener('beforeinput', () => {})
      this.addEventListener('keydown', this.editorInput)
      this.addEventListener('selectionchange', this.selectionChanged)

      const style = document.createElement('style')
      style.textContent = `
      :host{display:inline-block;background:Field;white-space:pre;white-space-collapse:preserve;font-family:monospace;width:fit-content;min-width:7ch;min-height:7lh;margin-top:5lh;caret-color:var(--foregroundsecond);}
      :host(:focus){outline:none;}
      :host::part(input){min-height:3lh;min-width:7ch;tab-size:2;}
      :host::part(input):focus{outline:none;}
      `

      shadow.appendChild(style)
    }

    selectionChanged(e)
    {
      console.log(e)
    }

    insertCharacter(c) 
    {
      let selection = this.#shadow.getSelection()
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
      selection.setPosition(selection.anchorNode, start + 1)
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
      //console.log(e)
      let k = e.key
      //console.log(k)
      switch(k)
      {
        case 'Tab':
          e.preventDefault()
          this.insertCharacter('\t')
          break;
        case 'Enter':
          e.preventDefault()
          if (e.shiftKey)
          {
            this.#NIL.Input(this.#input.textContent)
          }
          else
          {
            this.insertCharacter('\n')
          }
          break;
        case 'Backspace':
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
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