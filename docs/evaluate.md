# function evaluate

```javascript
  /**
   * Get value from field(s) and/or literal values
   * @param {object} construct - the object to pick values from
   * @param {String|Number|Boolean} expression in the form "=[prop.]fieldname+'literal'+..."
   */
  function evaluate(expression, construct)
```

```javascript

 expression
   literal
   =expression-value
   /=expression-value/[flags]

 literal
   string value, with single quote ' delimiter character

 expression-value
   exp-value
   exp-value op exp-value op ...
   field-name/regexp[/flags]/replace[:padding]

 op
   + | - | * | /

 exp-value
   'string' | number | boolean | field-name[:padding]

 boolean
   "true" | "false"

 field-name
   name | dot-notation

 field-name/regexp[/flags]/replace
   field-name - a field that contains string value
   regexp - regular expression
   flags - regular expression flags, optional
   replace - replacement string using $ notation to insert capture groups

 padding
   :length,prefix
   :length,,suffix
   :decimals
   :decimals,%

 length
   desired length of string value

 prefix
   prefix character for start padding, ignored if suffix specified

 suffix
   suffix character for end padding

 decimals
   number of decimals for percentage value

```

Notes:
  An expression-value of a single field name results in underlying type, e.g. string, number, boolean.
  Concatenation will result in a string if any exp-value results in a string.
  Concatenating boolean values will have unexpected results.
  Regular expressions can not contain + characters use {1,} instead.

## example expressions

```javascript
  "literal"
  19
  true
  "=fieldname"
  "=prop.fieldname
  "=fieldname+'literal'+..."
  "='literal'+prop.fieldname+..."
  "=fieldname/regexp/replacement"
  "=fieldname:0,3
  "=fieldname:,3,0"
  "=field/_count:2,%"
  "=f1*f2-f3/f4:2,%+'%'"
  "=subObj2.subsub.izze"
  "=County+' County'"
  "=geometry.type+properties.FID"
  "=District Name/(\\d{3})/$1"
  "=STATE+'_'+LSAD+'_'+COUNTYFP+CDFP+SLDUST+SLDLST"

```
