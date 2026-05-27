import { submit } from "./nil.js"



const createEditor = (node) =>
{
  console.log("Setting Up NIL")
  console.log(node)
  node['nil editor'] = 
  {
    element : node,
    model : undefined,
    cursor : undefined,
    sample : undefined,
    sequences : sequences,
  }
  var t = document.createElement("textarea")
  t['nil editor'] = node 
  t.id = "NIL Editor" + String(Math.random())
  t.style.cssText = "autocapitalize:false;autocomplete:off;spellcheck:false;resize:none;overflow:auto;position:absolute;left:-100vw;top:-100vh;"
  t.oninput = function(e)
  {
    if (e['nil editor'])
    {
      e.preventDefault()
      console.log(e, e.target['nil editor'])
      t.value = "##\n##\n##"
      switch(e.inputType)
      {
        case 'insertText':
        case 'insertCompositionText':
        case 'deleteContentBackward':
        case 'insertLineBreak':
      }
      t.selectionEnd = 4
      t.selectionStart = 4
    }
  }
  node.appendChild(t)
  t.focus()
  t.click()
}

createEditor(document.querySelector("[NIL]"))

const makeAtom = (type, parent, previous, next, data) =>
{
  return {
    type : type,
    parent : parent,
    previous : previous,
    next : next,
    data : data
  }
}

const cursor = (editor, atom) =>
{
  if (atom)
  {
    if (editor.cursor.type == "atom")
    {
      if (editor.sequences[editor.cursor.data])
      {
        editor.cursor.data = editor.sequences[editor.cursor.data]
      }
    }
    editor.cursor = atom
  }
  if (editor.model == undefined)
  {
    editor.model = makeAtom(undefined, undefined, undefined, undefined, undefined)
    editor.model.next = editor.model
    editor.model.previous = editor.model
    editor.cursor = editor.model
  }
  return editor.cursor
}

const insertAtom = (editor) =>
{
  var atom = focus(editor)

}

var sequences = 
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
}