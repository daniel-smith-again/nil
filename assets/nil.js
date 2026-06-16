export const NIL = 
{
  Constructors :
  {
    Symbol : (s) => {return {type: NIL.Constructors.Symbol, value: s}},
    List : (...l) => {return {type: NIL.Constructors.List, value: l}},
    Boolean : (b) => {return {type: NIL.Constructors.Boolean, value: b}},
    Number : (n) => {return {type: NIL.Constructors.Number, value: n}},
    Function : (parameters, effects, result, body) => {return {type: NIL.Constructors.Function, value: {parameters: parameters, result: result, effects: effects, body: body}}},
    Type : (...t) => {return {type: NIL.Constructors.Type, value: t}},
    Abstract : (...constructors) => {return {type: NIL.Constructors.Abstract, value: constructors}},
  },
  Operators :
  {
    Binding :
    {
      Let : () => {},
      Define : () => {},
      Data : () => {}
    },
    Control :
    {
      If : () => {},
      Provide : () => {},
    },
    Arithmetic :
    {
      Summation : () => {},
      Difference  : () => {},
      Product : () => {},
      Quotient : () => {},
      Remainder : () => {},
      Conjunction : () => {},
      Disjunction : () => {},
      Negation : () => {},
    },
    Reflection :
    {
      Size : () => {},
      Typeof : () => {},
      Describe : () => {},
      Quote : () => {},
    }
  },
  Eval :
  {

  }
}