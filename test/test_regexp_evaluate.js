//let expression = "=field1"
//let expression = "='literal text'"
let expression = "=field1+'literal text'*field3/field4-field5"
console.log(expression.length);

let rx = /([\=\+\-\*\/])(\'.*?\'|\w*)/g;

let parts;
while ((parts = rx.exec(expression)) !== null) {
  //let msg = `Found ${parts[0]}. `;
  //msg += `Next match starts at ${rx.lastIndex}`;
  //console.log(msg);
  console.log(parts);
  console.log(rx.lastIndex);
  if (!parts[ 0 ])
    break;
}
