const dot = require('../lib/utils/dot');

let obj = {
  t1: "top",
  foo: {
    bar: {
      baz: "hello"
    }
  }
};

console.log("t1 = " + dot.get(obj, "t1"));
console.log("baz = " + dot.get(obj, "foo.bar.baz"));

console.log("biz = " + dot.get(obj, "foo.bar.biz"));
console.log("set: " + dot.set(obj, "foo.bar.biz", "world"));
console.log("biz = " + dot.get(obj, "foo.bar.biz"));

console.log("set: " + dot.set(obj, "t2", "bottom"));
console.log("t2 = " + dot.get(obj, "t2"));

console.log("set: " + dot.set(obj, "foo.level.expand", true));
console.log("expand = " + dot.get(obj, "foo.level.expand"));
console.log("set: " + dot.set(obj, "foo.level", "II"));
console.log("expand = " + dot.get(obj, "foo.level.expand"));

let slop = "stringy";
console.log("stray = " + dot.get(slop, "foo.stray"));
console.log("set = " + dot.set(slop, "foo.stray", "drip"));

console.log(JSON.stringify(obj,null,2));


let obj2 = {
  name: "encoding",
  description: "data source engram",
  type: "engram",
  smt: {
    "model": "elasticsearch",
    "locus": "http://localhost:9200",
    "schema": "index name",
    "key": "!field1"
  },
  fields: [
    {
      "name": "field1",
      "type": "string",
      "key": 1
    },
    {
      "name": "field2",
      "type": "list",
      "fields": [
        {
          "name": "fld1",
          "type": "string"
        },
        {
          "name": "fld2",
          "type": "number"
        }
      ]
    },
    {
      "name": "field3",
      "type": "number"
    }
  ]
};

console.log("");
console.log("locus = " + dot.get(obj2, "smt.locus"));
console.log("fields = " + dot.get(obj2, "fields"));
console.log("fields2 = " + dot.get(obj2, "fields.name=field2.fields"));
console.log("fld2 = " + dot.get(obj2, "fields.name=field2.fields.name=fld2.type"));

console.log("set description = ", dot.set(obj2, "description", "this is a new description"));
console.log("set source = " + dot.set(obj2, "source", "a source reference"));
console.log("set field2 description = " + dot.set(obj2, "fields.name=field2.description", "field description"));
console.log("set field4 = " + dot.set(obj2, "fields.field4", { "name": "field4", "type": "boolean" }));
console.log("set fld3 = " + dot.set(obj2, "fields.name=field2.fields.name=fld3", { "name": "fld3", "type": "boolean" }));

console.log(JSON.stringify(obj2,null,2));
