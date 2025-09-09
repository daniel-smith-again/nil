/***************************************************************************** /

--------------------------------------------------------------------------------
|==============================================================================|
|                    The nth Programming Language Reference                    |
|==============================================================================|
|                                      by                                      |
|                                Daniel Smith                                  |
|                         daniel.smith.again@gmail.com                         |
|                                                                              |
|                                                                              |
|.................................... About ...................................|
|                                                                              |
|                 This is a fully conforming implementation of                 |
|                 the Nth Programming Language as described in                 |
|          "The nth Programming Language Interactive Specification".           |
|                                                                              |
|         Licensing information is included at the bottom of this file.        |
|                                                                              |
|                The interpreter is designed as a "header-only"                |
|                  library written in C. It is intended to be                  |
|                 incorporated into a "host" program which will                |
|                    supply some host-dependent capabilities                   |
|                          to the interpreter runtime.                         |
|                                                                              |
|                                                                              |
|.....................................API......................................|
|                                                                              |
|               Exported things are prefixed with "Nth", and begin             | 
|              with a capitol letter. Functions which are internal             |
|                      are prefixed with "_nth_internal".                      |
|______________________________________________________________________________|

/ *****************************************************************************/
#ifndef __NIL__
#define __NIL__
typedef unsigned _BitInt(8)            Byte;
typedef void*                          Value;
typedef Byte*                          String;
typedef String                         Symbol;
typedef struct {Value l; Value *n;}    List;
typedef Byte*                          Number;
typedef struct
{
  List Module;
  Value Frame;
  String(in)();
  void(out)(String);
  Value(claim)(Value);
  void(drop)(Value);
} Nil;
#endif
