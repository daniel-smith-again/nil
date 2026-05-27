export const NIL = 
{
  List : (...items) => {return {type : "List", data : items}},
  Symbol : (atom) => {return {type : "Symbol", data : String(atom)}},
  Submit : (src) => 
  {
    this.Check(src)
    this.Compile(src)
    this.Compute(src)
  },
  Check : (src) => {},
  Compile : (src) => {},
  Compute : (src) => {}
}

export const Submit = (src) => 
{

}








const machine =
{
  stack : [],
  environment : [],
  control : undefined,
  dump : undefined,
  operations : 
  {
    Bits : (e) => {return {type : "bits", value : e}},
    Num : (e) => {return {type : "number", value : e}},
    Symbol : (e) => {return {type : "symbol", value : e}},
    List : (e) => {return {type : "list", value : e}},
    Function : (e) => {return {type : "function", value : e}},

  }
}


const machine = 
{
  control : undefined,
  environment : [],
  continuation : undefined,
  operations : 
  {
    compare : () => {} 
  },
}


const compute =
{
  control : undefined,
  environment : [],
  continuation : undefined,
  Any : () => {return {type : "type", value : "any"}},
  Nil : () => {return {type : "type", value : "nil"}},
  start : (program, bindings) =>
  {
    control = program
    environment.push(bindings)
    continuation = undefined
    for(;;)
    {
      switch(control[0])
      {
        case "compare":
          if (control[1].value == control[2].value)
          {
            
          }
          else
          {

          }
      }
    }
  }
}




const editor = 
{
  element : undefined,
  model : undefined,
  cursor : undefined,
  sample : undefined,
  sequences : 
  {
    ",multiply" : '\u00d7',
    ",divide" : '\u00f7',
    ",neq" : '\u2260',
    ",leq" : '\u2264',
    ",geq" : '\u2265',
    ",and" : '\u2227',
    ",or" : '\u2228',
    ",not" : '\u00ac',
    ",intersection" : '\u2229',
    ",union" : '\u222a',
    ",integral" : '\u222b',
    ",function" : '\u2192',
    ",leftarrow" : '\u2190',
    ",uparrow" : '\u2191',
    ",rightarrow" : '\u2192',
    ",downarrow" : '\u2193',
    ",Leftarrow" : '\u21d0',
    ",Uparrow" : '\u21d1',
    ",Rightarrow" : '\u21d2',
    ",Downarrow" : '\u21d3',
    ",Alpha" : 'Α',
    ",alpha" : 'α',
    ",Beta" : 'Β',
    ",beta" : 'β',
    ",Gamma" : 'Γ',
    ",gamma" : 'γ',
    ",Delta" : 'Δ',
    ",delta" : 'δ',
    ",Epsilon" : 'Ε',
    ",epsilon" : 'ε',
    ",Zeta" : 'Ζ',
    ",zeta" : 'ζ',
    ",Eta" : 'Η',
    ",eta" : 'η',
    ",Theta" : 'Θ',
    ",theta" : 'θ',
    ",Iota" : 'Ι',
    ",iota" : 'ι',
    ",Kappa" : 'Κ',
    ",kappa" : 'κ',
    ",Lambda" : 'Λ',
    ",lambda" : 'λ',
    ",Mu" : 'Μ',
    ",mu" : 'μ',
    ",Nu" : 'Ν',
    ",nu" : 'ν',
    ",Xi" : 'Ξ',
    ",xi" : 'ξ',
    ",Omicron" : 'Ο',
    ",omicron" : 'ο',
    ",Pi" : 'Π',
    ",pi" : 'π',
    ",Rho" : 'Ρ',
    ",rho" : 'ρ',
    ",Sigma" : 'Σ',
    ",sigma" : 'σ',
    ",sigma-alt" : 'ς',
    ",Tau" : 'Τ',
    ",tau" : 'τ',
    ",Upsilon" : 'Υ',
    ",upsilon" : 'υ',
    ",Phi" : 'Φ',
    ",phi" : 'φ',
    ",Chi" : 'Χ',
    ",chi" : 'χ',
    ",Psi" : 'Ψ',
    ",psi" : 'ψ',
    ",Omega" : 'Ω',
    ",omega" : 'ω',
  },
  makeAtom : function(type, parent, previous, next, data)
  {
    return  { type : type,
              parent : parent,
              previous : previous,
              next : next,
              data : data
            }
  },
  focus : function(atom)
  {
    if (atom)
    {
      if (this.cursor.type == "atom")
      {
        if (this.sequences[this.cursor.data])
        {
          this.cursor.data = this.sequences[this.cursor.data]
        }
      }
      this.cursor = atom
    }
    if (this.model == undefined)
    {
      this.model = this.makeAtom(undefined, undefined, undefined, undefined, undefined)
      this.model.next = this.model
      this.model.previous = this.model
      this.cursor = this.model
    }
    return this.cursor
  },
  insertAtom : function()
  {
    var atom = this.focus()
    if (atom.type == undefined)
    {
      atom.type = "list"
    }
    else if (atom.type == "list" && atom.data == undefined)
    {
      atom.data = this.makeAtom(undefined, atom, undefined, undefined, undefined)
      atom.data.next = atom.data
      atom.data.previous = atom.data
      this.focus(atom.data)
    }
    else
    {
      if (atom.parent != undefined)
      {
        atom.next = this.makeAtom(undefined, atom.parent, atom, atom.next, undefined)
        atom.next.previous = atom
        atom.next.next.previous = atom.next
      }
      this.focus(atom.next)
    }
  },
  appendCharacter : function(character)
  {
    var atom = this.focus()
    if (atom.type == undefined)
    {
      atom.type = "atom"
      atom.data = ""
    }
    else if (atom.type == "break" || atom.type == "tab")
    {
      this.insertAtom()
      this.focus().type = "atom"
      this.focus().data = ""
    }
    else if (atom.type == "list")
    {
      if (atom.data == undefined)
      {
        atom.data = this.makeAtom("atom", atom, undefined, undefined, "")
        atom.data.next = atom.data
        atom.data.previous = atom.data
        this.focus(atom.data)
      }
      else
      {
        this.insertAtom()
        this.focus().type = "atom"
        this.foucs().data = ""
      }
    }
    this.focus().data = this.focus().data + character
  },
  deleteCharacter : function()
  {
    var atom = this.focus()
    if (atom.type == "atom" || atom.type == "tab")
    {
      if (atom.data.length > 0)
      {
        atom.data = atom.data.slice(0, atom.data.length - 1)
        if (atom.data.length == 0)
        {
          atom.type = undefined
          atom.data = undefined
        }
      }
      else
      {
        this.deleteAtom()
      }
    }
    else
    {
      this.deleteAtom()
    }
  },
  deleteAtom : function()
  {
    var atom = this.focus()
    if (atom.next === atom.previous && atom.previous === atom && atom === atom.next)
    {
      if (atom.parent != undefined)
      {
        this.focus(atom.parent)
        this.focus().data = undefined
      }
      else
      {
        this.model = undefined
        this.cursor = undefined
      }
    }
    else
    {
      atom.previous.next = atom.next
      atom.next.previous = atom.previous
      if (atom.parent.data === atom)
      {
        atom.parent.data = atom.next
        this.focus(atom.next)
      }
      else
      {
        this.focus(atom.previous)
      }
    }
  },
  insertBreak : function()
  {
    if (this.focus().parent != undefined)
    {
      this.insertAtom()
      this.focus().type = "break"
    }
    else
    {
      this.submit()
    }
  },
  insertTab : function()
  {
    if (this.focus().type == "tab")
    {
      this.focus().data = this.focus().data + " "
    }
    else
    {
      this.insertAtom()
      this.focus().type = "tab"
      this.focus().data = " "
    }
  },
  moveCursorForward : function()
  {
    this.focus(this.focus().next)
  },
  moveCursorBackward : function()
  {
    this.focus(this.focus().previous)
  },
  moveCursorInward : function()
  {
    if (this.focus().type == "list")
    {
      if (this.focus().data != undefined)
      {
        this.focus(this.focus().data)
      }
    }
  },
  moveCursorOutward : function()
  {
    if (this.focus().parent != undefined)
    {
      this.focus(this.focus().parent)
    }
  },
  sampleAtom : function()
  {
    this.sample = structuredClone(this.focus())
  },
  putAtom : function()
  {
    this.sample.next = this.focus().next
    this.sample.previous = this.focus()
    this.focus().next.previous = this.sample
    this.focus().next = this.sample
    this.sample.parent = this.focus().parent
    this.sample = undefined
  },
  spreadAtom : function()
  {
    if (this.sample.type = "list")
    {
      var head = this.sample.data
      var tail = this.sample.data.previous
      var x = head
      do
      {
        x.parent = this.focus().parent
        x = x.next
      } while (x != tail)
      tail.next = this.focus().next
      head.previous = this.focus()
      this.focus().next.previous = tail
      this.focus().next = head
      this.sample = undefined
    }
    else
    {
      this.putAtom()
    }
  },
  showModel : function()
  {
    const display = function(n)
    {
      var element = undefined
      if (n === undefined)
      {
        return undefined
      }
      switch(n.type)
      {
        case undefined:
          element = document.createElement('nil-atom')
          break;
        case "atom":
          element = document.createElement('nil-atom')
          element.appendChild(document.createTextNode(n.data))
          element.style.cursor = "pointer"
          element.onclick = (e) =>
          {
            const atom = n
            this.focus(atom)
            showModel()
          }
          break;
        case "tab":
          element = document.createElement('nil-tab')
      }
    }
  }
}