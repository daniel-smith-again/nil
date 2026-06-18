const colors = 
[
  { 'bg_0': '#181818',
    'bg_1': '#252525',
    'bg_2': '#3b3b3b',
    'dim_0': '#777777',
    'fg_0': '#b9b9b9',
    'fg_1': '#dedede',
    'red': '#ed4a46',
    'green': '#70b433',
    'yellow': '#d1a416',
    'blue': '#368aeb',
    'magenta': '#3b6eb7',
    'cyan': '#3fc5b7',
    'orange': '#e67f43',
    'violet': '#a580e2',
    'br_red': '#ff5e56',
    'br_green': '#83c746',
    'br_yellow': '#efc541',
    'br_blue': '#4f9cfe',
    'br_magenta': '#ff81ca',
    'br_cyan': '#56d8c9',
    'br_orange': '#fa9153',
    'br_violet': '#b891f5'
  },
  { 'bg_0': '#103c48',
    'bg_1': '#184956',
    'bg_2': '#2d5b69',
    'dim_0': '#72898f',
    'fg_0': '#fbf3db',
    'fg_1': '#ece3cc',
    'red': '#fa5750',
    'green': '#75b938',
    'yellow': '#dbb32d',
    'blue': '#4695f7',
    'magenta': '#f275be',
    'cyan': '#41c7b9',
    'orange': '#ed8649',
    'violet': '#af88eb',
    'br_red': '#ff665c',
    'br_green': '#84c747',
    'br_yellow': '#ebc13d',
    'br_blue': '#58a3ff',
    'br_magenta': '#ff84cd',
    'br_cyan': '#53d6c7',
    'br_orange': '#fd9456',
    'br_violet': '#bd96fa'
  },
  { 'bg_0': '#fbf3db',
    'bg_1': '#ece3cc',
    'bg_2': '#d5cdb6',
    'dim_0': '#909995',
    'fg_0': '#53676d',
    'fg_1': '#3a4d53',
    'red': '#d2212d',
    'green': '#489100',
    'yellow': '#ad8900',
    'blue': '#0072d4',
    'magenta': '#ca4898',
    'cyan': '#009c8f',
    'orange': '#c25d1e',
    'violet': '#8762c6',
    'br_red': '#cc1729',
    'br_green': '#428b00',
    'br_yellow': '#a78300',
    'br_blue': '#006dce',
    'br_magenta': '#c44392',
    'br_cyan': '#00978a',
    'br_orange': '#bc5819',
    'br_violet': '#825dc0'
  },
  { 'bg_0': '#ffffff',
    'bg_1': '#ebebeb',
    'bg_2': '#cdcdcd',
    'dim_0': '#878787',
    'fg_0': '#474747',
    'fg_1': '#282828',
    'red': '#d6000c',
    'green': '#1d9700',
    'yellow': '#c49700',
    'blue': '#0064e4',
    'magenta': '#dd0f9d',
    'cyan': '#00ad9c',
    'orange': '#d04a00',
    'violet': '#7f51d6',
    'br_red': '#bf0000',
    'br_green': '#008400',
    'br_yellow': '#af8500',
    'br_blue': '#0054cf',
    'br_magenta': '#c7008b',
    'br_cyan': '#009a8a',
    'br_orange': '#ba3700',
    'br_violet': '#6b40c3'
  },
]
var Theme = 3
if (localStorage.getItem('Theme'))
{
  Theme = Number(localStorage.getItem('Theme'))
}
export function setColorTheme(firstRun)
{
  if (firstRun != true)
  {
    Theme = (Theme + 1) % 4
    localStorage.setItem('Theme', Theme)
  }
  var c = colors[Theme % 4]
  var r_ = document.querySelector(':root')
  r_.style.setProperty('--background', c.bg_0)
  r_.style.setProperty('--backgroundsecond', c.bg_1)
  r_.style.setProperty('--backgroundthird', c.bg_2)
  r_.style.setProperty('--diminished', c.dim_0)
  r_.style.setProperty('--foreground', c.fg_0)
  r_.style.setProperty('--foregroundsecond', c.fg_1)
  r_.style.setProperty('--red', c.red)
  r_.style.setProperty('--green', c.green)
  r_.style.setProperty('--yellow', c.yellow)
  r_.style.setProperty('--blue', c.blue)
  r_.style.setProperty('--magenta', c.magenta)
  r_.style.setProperty('--cyan', c.cyan)
  r_.style.setProperty('--orange', c.orange)
  r_.style.setProperty('--violet', c.violet)
  r_.style.setProperty('--brightred', c.br_red)
  r_.style.setProperty('--brightgreen', c.br_green)
  r_.style.setProperty('--brightyellow', c.br_yellow)
  r_.style.setProperty('--brightblue', c.br_blue)
  r_.style.setProperty('--brightmagenta', c.br_magenta)
  r_.style.setProperty('--brightcyan', c.br_cyan)
  r_.style.setProperty('--brightorange', c.br_orange)
  r_.style.setProperty('--brightviolet', c.br_violet)
  r_.style.setProperty('--hgl', c.dim_0 + '40')
  if (Theme == 0 || Theme == 1)
  {
    r_.style.setProperty('--shadow', c.bg_0)
    r_.style.setProperty('--shadowsecond', c.bg_1)
  }
  else
  {
    r_.style.setProperty('--shadow', c.fg_0)
    r_.style.setProperty('--shadowsecond', c.fg_1)
  }
  if (firstRun == true) 
  {
    return
  }
  
}
var list = document.querySelectorAll("[ChangesTheme]")
for (var n of list)
{
  n.onclick = setColorTheme
  n.style.cursor = 'pointer';
}
setColorTheme(true)