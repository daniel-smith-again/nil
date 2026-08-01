export class NIL
{
  Result = class extends Event
  {
    #result
    constructor(output) 
    { super('nil-result'); this.#result = output; }
    get data() 
    { return this.#result; }
  }
  constructor(result)
  { addEventListener('nil-result', result) }
  Input(src)
  {
    let result = this.Evaluate(src)
    //e = new this.Result(this.PrettyPrint(result))
    let e = new this.Result("result")
    dispatchEvent(e)
  }
  Evaluate(src)
  {
    return this.evaluate_(this.expand_(this.parse_(src)))
  }
  TopLevel = 
  {}
  parse_(src)
  {
    src = '\n' + src
    let lines = src.split(/(\n.*)/)
    lines = lines.filter((l) => !(l == "\n" || l == "" || l == "\n\u200b"))
    for (let n in lines)
    {
      if (lines[n][1] == ' ')
      {
        if (n > 0)
        { lines.splice(n, 1) }
      }
    }
    let indentcount = []
    for (let l of lines)
    {
      let count = 0
      for (let c of l)
      { if (c == '\t') count++ }
      indentcount.push(count)
    }
    let ordinality = []
    for (let n of indentcount)
    { if (!ordinality.includes(n)) ordinality.push(n) }
    ordinality.sort((a, b) => a - b)
    for (let i in indentcount)
    { indentcount[i] = ordinality.indexOf(indentcount[i]) }
    for (let n in lines)
    {
      let chunks = lines[n].split(/(\n\t*)/)
      if (n > 0)
      {
        let i = indentcount[n] - indentcount[n - 1]
        if (i > 0)
        { lines[n] = chunks[1] + '('.repeat(i) + chunks[2] }
        else if (i < 0)
        {
          lines[n - 1] += ')'.repeat(indentcount[n - 1])
          lines[n] = chunks[1] + '(' + chunks[2]
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
    let text = 
    {
      source : lines,
      pos : 0,
      next()
      { return this.pos < this.source.length ? this.source[this.pos++] : undefined },
      peek()
      { return n ? this.source[this.pos + n] : this.source[this.pos] }
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
            break
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
            nesting --
            break
          case '"':
            pushAtom()
            insidestring = true
            break
          case '\n':
          case '\t':
          case ' ':
            pushAtom()
            break
          case '\u200b':
            break
          default:
            atom += c
        }
      }
    }
    if (nesting != 0) dispatchEvent(new this.Result("Parentheses are not balanced"))
    console.log(structuredClone(lists[0]))
    return lists[0]
  }
  expand_(form)
  {
    let match = (pattern, form) =>
    {
      return true
    }
  }
  evaluate_(form)
  {

  }
  Primitives =
  {
    module_constructor(list)
    {

    },
    function_constructor(list)
    {

    },
    list_constructor(list)
    {

    },
    type_constructor(list)
    {

    },
    symbol_constructor(list)
    {

    },
    unique_symbol_constructor(list)
    {

    },
    define_declaration(list)
    {

    },
    data_declaration(list)
    {

    },
    use_declaration(list)
    {

    },
    in_command(list)
    {

    },
    leave_command(list)
    {

    },
    display_command(list)
    {

    },
    format_operation(list)
    {

    },
    type_query(list)
    {

    },
    expand_operation(list)
    {

    },
    quote_operation(list)
    {

    },
    evaluate_operation(list)
    {

    },
    conditional_evaluation(list)
    {

    },
  }
  Default = 
  {
    Bindings: 
    {
      Nil : {type : this.Type, value : this.Nil},
      Any : {type : this.Type, value : this.Nil},
      Symbol : {type : this.Type, value : this.Nil},
      List : {type : this.Type, value : this.Nil},
      Type : {type : this.Type, value : this.Nil},
      Function : {type : this.Type, value : this.Nil},
      Quote : {type : this.Type, value : this.Nil},
      nil : (program, environment, context) =>
      {
        return this.Nil
      },
      symbol : (program, environment, context) =>
      {
        let s = String(program.shift())
        return {type : this.Symbol, value: s}
      }
      
    },
    Syntax:
    //template variables are prefixed 
    //with a space to mark them as non-keywords
    [
      [["module", " contents"], (form) => {

      }],
      [["in", " module"], ["in", " module", " body"], (form) => {}],
      [["leave"], (form) => {}],
      [["use", " includes"], (form) => {}],
      [["define", " name", " value"], ["define", [" keywords"], " templates"], (form) => {}],
      [["data", [" family"], " constructors"], (form) => {}],
      [["list", " elements"], (form) => {}],
      [["let", " bindings"], (form) => {}],
      [[" parameters", "->", " body"], (form) => {}],
      [["?", " value"], (form) => {}],
      [["describe", " value"], (form) => {console.log("matched Describe syntax")}],
      [["display", " value"], (form) => {}],
      [["expand", " quote"], (form) => {}],
      [["evaluate", " quote"], (form) => {}],
      [[" subject", "?", " cases"], (form) => {}]
    ],
  }
}