const mongoose=require("./src/db/mongoose")
const validator=require("validator")
var schematest = new mongoose.Schema({
    email: {
        type: String,
        minlength:[5,"Co loi ngan qua"],
        required: true,
        unique: [true,'Bi trung'],
        lowercase: true,
        validate: (value) => {
          if(!validator.isEmail(value)){
              throw new Error("Co loi gi do")
          }
        }
      },
      age:{
          type:Number,
          min:[5,"Lon hon"],
          max:[20,"Nho hon"]
      }
  });
const test=mongoose.model("test",schematest)
var testInc = new test({
    email:"abcd@gmail.com",
    age:12
  });

  testInc.save()
  .then(doc => {
    console.log(doc)
  })
  .catch(err => {
    console.error(err)
  })