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
  }
}


export function Setup(element)
{
  editor.element = element
  var t = document.createElement("textarea")
  t.id = "nil-editor"
  t.autocapitalize = "false"
  t.autocomplete = "off"
  t.spellcheck = "false"
  t.style.resize = "none"
  t.style.overflow = "auto"
  t.style.position = "absolute"
  t.style.left = "-100vw"
  t.style.top = "-100vh"
  t.oninput = function(e)
  {
    e.preventDefault()
    t.value = "##\n##\n##"
    t.selectionEnd = 4
    t.selectionStart = 4
    switch(e.inputType)
    {
      case 'insertText':
      case 'insertCompositionText':
        switch(e.data)
        {
          case ' ':
            edit("atom")
            break
          case '(':
            edit("open")
            break
          case ')':
            edit("close")
            break
          default:
            insert(e.data)
        }        
        break;
      case 'deleteContentBackward':
        edit("delete")
        break;
      case 'insertLineBreak':
        edit("break")
        break;
    }
    t.selectionEnd = 4
    t.selectionStart = 4
  }
}

function insert(c)
{

}

function edit(which)
{
  switch(which)
  {
    case "atom":
      break
    case "open":
      break
    case "close":
      break
    case "delete":
      break
    case "break":
      break
  }
}