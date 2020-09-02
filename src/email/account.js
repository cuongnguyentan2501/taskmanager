const sendGrid=require("@sendgrid/mail")
sendGrid.setApiKey(process.env.GRIDSEND_API_KEY)
sendGrid.send({
    from:"1610373@hcmut.edu.vn",
    to:"cuongnguyenbku1998@gmail.com",
    subject:"Hello send grid",
    text:"I hope eerything will be easy to be passed"
})
