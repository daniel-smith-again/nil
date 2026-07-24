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
    let tree = this.parse_(src)
    let tree_ = structuredClone(tree)
    let result = this.Evaluate(tree)
    e = new this.Result(this.PrettyPrint(result))
    dispatchEvent(e)
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
      
    }
  }
}