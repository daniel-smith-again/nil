export const Editor = 
{

}

const initEdit = (node) => 
{
  var input = document.createElement("textarea")
  var editor = document.createElement("nil-display")

  input.id = "NIL Input " + String(Math.random())
  input.setAttribute('NILEditor', 'true')
  input.autocapitalize = false
  input.autocomplete = false
  input.spellcheck = false
  input.style.cssText =   `resize:none;
                          overflow:auto;
                          white-space:pre;
                          border:none;
                          outline:none;
                          display:none;
                          position:absolute;
                          top:0;
                          height:1ch;
                          width:1ch;`
  input.oninput = (e) =>
  {
    e.preventDefault()
    console.log(e)
  }
  window.onclick = (e) => {input.click(); input.focus(); console.log("focused ", input);}
  node.appendChild(input)
  node.appendChild(editor)
  input.click()
  input.focus()
}

console.log("initializing NIL editor environments")

for (var x of document.querySelectorAll("[nil]"))
{
  console.log(x)
  initEdit(x)
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