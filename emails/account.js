const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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'
sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email,name)=>
{
    sgMail.send
    (
        {
            to:email,
            from:"sakalley.yash@gmail.com",
            subject:"Thanks for Joining in",
            text:`Welcome to the app ${name}`
        }
    )
}

const sendDeleteEmail = (email,name)=>
{
    sgMail.send
    (
        {
            to:email,
            from:"sakalley.yash@gmail.com",
            subject:"User Deletion",
            text:`Please let us the know the reason ${name}`
        }
    )
}
module.exports = {
    sendWelcomeEmail,
    sendDeleteEmail
}