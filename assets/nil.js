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