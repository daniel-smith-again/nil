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
    Primitives =
    /*
    Primitive types are 
    Modules, Functions, Constructors, Types, Lists, Quotes, Numbers, Symbols
    */
    {
      Module(use, define, data)
      {
        this.type = "Module"
        this.using = use
        this.definitions = define
        this.datatypes = data
        return this
      },
      Function(parameters, effects, body)
      {
        this.type = "Function"
        this.parameters = parameters
        this.effects = effects
        this.body = body
        return this
      },
      Data(family, constructors)
      {
        this.type = "Data"
        this.family = family
        this.constructors = constructors
        return this
      },
      Type(members)
      {
        this.type = "Type"
        this.members = members
        return this
      },
      List(elements)
      {
        this.type = "List"
        this.elements = elements
        return this
      },
      Quote(structure)
      {
        this.type = "Quote"
        this.structure = structure
        return this
      },
      Number(value)
      {
        this.type = "Number"
        this.value = value
        return this
      },
      Symbol(value)
      {
        this.type = "Symbol"
        this.value = value
        return this
      }
    }
    AST = 
    {
      Define(src)
      {

      },
      Data(src)
      {

      },
      Use(src)
      {

      },
      Let(src)
      {

      },
      Conditional(src)
      {

      },
      Control(src)
      {

      },
      Module(src)
      {

      },
      Function(src)
      {

      },
      Type(src)
      {

      },
      List(src)
      {

      },
      Symbol(src)
      {

      },
      Quote(src)
      {

      },
      Application(src)
      {

      },
      Constructor(src)
      {

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
    SECD(stack, environment, control, dump)
    {
      let primitive = control.shift()

      for (let atom of control)
      {
        if (atom instanceof Array)
        {
          this.SECD()
        }
        else
        {

        }
      }
    }
    Expand(src)
    {
      for (let s in src)
      {

      }
      return src
    }
    Compute(src)
    {

    }
    Eval(src)
    {
      let tree = this.parse(src)
      let program = this.Expand(tree)
      let result = this.Compute(program)
      
      if (tree != undefined)
      {
        tree = JSON.stringify(
                      tree,
                      (k, v) => v instanceof Array && ! v.some((i) => i instanceof Array) ? JSON.stringify(v) : v,
                      2
                    ) .replace(/\\/g, '')
                      .replace(/\"\[/g, '[')
                      .replace(/\]\"/g,']')
                      .replace(/\"\{/g, '{')
                      .replace(/\}\"/g,'}');
      }
      return tree
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
            dispatchEvent(new this.Error("Parentheses are not balanced", undefined))
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
    parenify(src)
    {
      src = '\n' + src
      //if (!this.checkbalanced(src)) return undefined

      //split according to line breaks
      let lines = src.split(/(\n.*)/)
      //drop any extraneous empty lines
      lines = lines.filter((l) => !(l == "\n" || l == "" || l == "\n\u200b"))

      //lines that begin with white space are joined with the previous line
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
      if (text.source == undefined) return
      let lists = []
      let atom = ''
      let string = ''
      let nesting = 0
      let insidestring = false
      let pushAtom = () => 
      {
        if (atom.length > 0)
        {
          let l = lists.pop()
          l.push(atom)
          lists.push(l)
          atom = ''
        }
      }
      for (let c of text.source)
      {
        if (insidestring)
        {
          switch(c)
          {
            case '"':
              insidestring = false;
              let l = lists.pop()
              l.push(string)
              lists.push(l)
              string = ''
              break;
            default:
              string += c
          }
        }
        else
        {
          switch(c)
          {
            case '(':
              pushAtom()
              lists.push([])
              nesting++
              break
            case ')':
              pushAtom()
              if (lists.length > 1)
              {
                let l1 = lists.pop()
                let l2 = lists.pop()
                l2.push(l1)
                lists.push(l2)
              }
              nesting--
              break
            case '"':
              pushAtom()
              insidestring = true
              break;
            case '\n': case '\t': case ' ':
              pushAtom()
              break
            default:
              atom += c
          }
        }
      }
      if (nesting != 0) dispatchEvent(new this.Error("Parentheses are not balanced", undefined));
      return lists[0]
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
    #dialog;
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
      this.#NIL.Attach(
        (e) => {
          output.textContent = e.data
        },
        (e) => {
          output.textContent = e.message
        } )
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