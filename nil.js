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
    Evaluate(program)
    {
      const Primitives = this.Primitives
      function evaluate_(program, context)
      {
        if (program.constructor && program.constructor == String)
        {
          if (program[0] =='\'')
          {
            return Primitives.Symbol(program.slice(1))
          }
          else
          {
            console.log(program)
            return resolve_(program, context)
          }
        }
        let operation = program.shift()
        console.log(operation)
        switch(operation)
        {
          case 'symbol':
            return Primitives.Symbol(program.shift())
          case 'list':
            let elements = []
            for (let atom of program)
            {
              elements.push(evaluate_(atom, context))
            }
            return Primitives.List(...elements)
            break
          /*
          case 'data':
            let family = program.shift()
            let elements = []
            for (let atom of program)
            {
              elements.push(evaluate_(atom, context))
            }
            return this.Primitives.Data(family, elements)
            break
          */
          case 'let':
            let c = {parent : context, bindings : {}}
            let locals = []
            while (program.length > 1)
            {
              locals.push(program.shift())
            }
            let result = program.shift()
            for (let binding of locals)
            {
              if (binding[1].constructor && binding[1].constructor == Array)
              {
                if (binding[1].length == 1)
                {
                  binding[1] = evaluate_(binding[1])
                }
                else
                {
                  let value = Primitives.List()
                  for (let atom of binding[1])
                  {
                    let v = evaluate_(atom, c)
                    if (v.type == "List")
                    { value.value.concat(v.value) }
                    else
                    { value.value.push(v) }
                  }
                  binding[1] = value
                }
              }
              else
              {
                binding[1] = evaluate_(binding[1])
              }
              if (binding[0].constructor == Array)
              {
                for (let b of destructure_(binding[0], binding[1]))
                {
                  c.bindings[b[0]] = b[1]
                }
              }
              else
              { c.bindings[binding[0]] = binding[1] }
            }
            console.log(c)
            return evaluate_(result, c)
            break
          case 'function':
            let parameters = program.shift()
            let body = program.shift()
            console.log(parameters, body)
            return Primitives.Function(parameters, body)
            break
          case 'conditional':
            let subject = evaluate_(program.shift())
            let matches = []
            let tail = undefined
            while(program.length > 1)
            {
              matches.push([evaluate_(program.shift(), context), program.shift()])
            }
            if (program.length == 1)
            { tail = program.shift() }
            for (let test of matches)
            {
              if (subtype_(subject, test[0]))
              {
                return evaluate_(test[1], context)
              }
            }
            if (tail)
            {
              return evaluate_(tail, context)
            }
            else
            {
              return Primitives.Nil()
            }
            break
          case '\'':

            break
          case 'display':
            return "PRIMTING"
            break
          case 'describe':
            return "DESCRIMBING"
            break
          default: 
            if (operation.type == 'Function')
            {
              console.log("Applying Function")
              let c = {parent : context, bindings : {}}
              for (let parameter of operation.value.parameters)
              {
                c.bindings[parameter] = program.shift()
              }
              return evaluate_(operation.value.body, c)
            }
            else
            { return evaluate_(operation, context) }
        }
      }
      function resolve_(atom, context)
      {
        console.log("resolving ", atom, " inside ", context)
        return context.bindings[atom]
      }
      function destructure_(bindings, list)
      {
        let bindings_ = []
        for (let binding of bindings)
        {
          bindings_.push([binding, list.value.shift()])
        }
        bindings_.at(-1).concat(list.value)
      }
      function subtype_(a, b)
      {
        if (a === b) { return true }
        if (a.type == 'Nil') { return true }
        switch(b.type)
        {
          case 'Nil': 
            return false 
            break
          case 'Any':
            if (a.type == 'Any')
            {
              if (a.value == b.value)
              { return true }
            }
            if (a.type == b.value)
            { return true }
            break
          case 'Symbol':
            if (a.value == b.value)
            { return true }
            else
            { return false }
            break
          case 'List':
            return false
            break
          case 'Type':
            if (a.type == 'Type')
            {
              for (let member of a.value)
              {
                let included = false
                for (let othermember of b.value)
                {
                  if (subtype_(member, othermember))
                  {
                    included = true
                    break
                  }
                }
                if (included)
                { return true }
                else
                { return false }
              }
            }
            else
            {
              for (let member of b.value)
              {
                if (subtype_(a, member))
                {
                  return true
                }
              }
              return false
            }
            break
          case 'Data':
            break
          case 'Function':
           return false
            break
          case 'Quote':
            return false
            break
        }
      }
      const initialContext = 
      {
        parent : undefined,
        bindings : {
          "Nil" : this.Primitives.Nil(),
          "Any" : this.Primitives.Any("Any"),
          "Symbol" : this.Primitives.Any("Symbol"),
          "List" : this.Primitives.Any("List"),
          "Type": this.Primitives.Any("Type"),
          "Data" : this.Primitives.Any("Data"),
          "Function" : this.Primitives.Any("Function"),
          "Quote" : this.Primitives.Any("Quote")
        }
      }
      
      return evaluate_(program, initialContext)
    }
    Primitives =
    {
      Nil()                          { return { type : "Nil", value : undefined } },
      Any(type)                     { return { type : "Any", value : type } },
      Symbol(value)                 { return { type : "Symbol", value : String(value) } },
      List(...elements)             { return { type : "List", value : elements } },
      Type(...members)              { return { type : "Type", value : members } },
      Data(family, ...elements)     { return { type : "Data", value : {family : family, elements : elements} } },
      Function(parameters, body)    { return { type : "Function", value : {parameters : parameters, body : body} } },
      Quote(value)                  { return { type : "Quote", value : value}},
    }
    Attach(result, error)
    {
      addEventListener('nil-result', result)
      addEventListener('nil-error', error)
    }
    Input(src)
    {
      console.log(src)
      let tree = this.parse(src)
      let tree_ = structuredClone(tree)
      console.log(tree_)
      let result = this.Evaluate(tree)
      console.log(result)
      let e = undefined
      let string = ""
      if (result != undefined)
      {
        string = JSON.stringify(
          result,
          (k, v) => v instanceof Array && ! v.some((i) => i instanceof Array) ? JSON.stringify(v) : v,
          2
        ) .replace(/\\/g, '')
          .replace(/\"\[/g, '[')
          .replace(/\]\"/g, ']')
          .replace(/\"\{/g, '{')
          .replace(/\"\}/g, '}');
      }

      e = new this.Result(this.PrettyPrint(result))
      console.log(e.data)
      if (e.data != undefined) dispatchEvent(e)
    }
    PrettyPrint(entity)
    {
      if (entity.constructor)
      {
        if (entity.constructor == Array)
        {
          let arraystring = '('
          for (let atom of entity)
          {
            arraystring += this.PrettyPrint(atom)
            arraystring += ' '
          }
          return arraystring.slice(0, arraystring.length - 1) + ')'
        }
        else if (entity.constructor == String)
        {
          return entity
        }
      
        switch(entity.type)
        {
          case 'Nil':
            return 'Nil'
            break
          case 'Any':
            return entity.value
            break
          case 'Symbol':
              return '\'' + entity.value
            break
          case 'List':
              let liststring = '(list '
              for (let atom of entity.value)
              {
                liststring += this.PrettyPrint(atom)
                liststring += ' '
              }
              return liststring.slice(0, liststring.length - 1) + ')'
            break
          case 'Type':
            break
          case 'Data':
            break
          case 'Function':
            let funcstring = '(function ('
            for (let p of entity.value.parameters)
            {
              funcstring += String(p)
              funcstring += ' '
            }
            funcstring = funcstring.slice(0, funcstring.length - 1) + ')\n\t'
            funcstring += this.PrettyPrint(entity.value.body)
            return funcstring
            break
          case 'Quote':
            break
        }
      }
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
            case '\u200b':
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