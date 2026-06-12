export const NIL = 
{
  Constructors :
  {
    Symbol : (s) => {return {type: NIL.Constructors.Symbol, value: s}},
    List : (...l) => {return {type: NIL.Constructors.List, value: l}},
    //Number : (n) => {return {type: NIL.Constructors.Number, value: n}},
    Function : (parameters, effects, result, body) => {return {type: NIL.Constructors.Function, value: {parameters: parameters, result: result, effects: effects, body: body}}},
    Type : (...t) => {return {type: NIL.Constructors.Type, value: t}},
    Abstract : (...constructors) => {return {type: NIL.Constructors.Abstract, value: constructors}},
  },
  Operators : 
  {
    Let : () => {},
    Concatenate : () => {},
    If : () => {},

  },
  Eval :
  {

  }
}