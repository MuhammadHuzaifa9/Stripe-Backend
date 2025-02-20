const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const Stripe = require('stripe')
const morgan  = require('morgan')
const cors = require('cors')
const stripe = Stripe('sk_test_51QuDf4H44ZYSFgufQkBKK9CuKSIjxcj40PTHqlxwnzdwJ1xGZF0ip1pBQiLZF5PfDJuUYnP6Ffqr6aAJxXwSEGjO00kwyPziWA')

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.post('/payment' , async (req,res) => {
    try{
          const {amount} = req.body

          const payment = await stripe.paymentIntents.create({
            amount:amount,
            currency:'usd'
          })

          res.json({clientSecret: payment.client_secret })
    }catch(err){
        console.log(err)
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

const Port  = 3000

app.listen(Port , ()=>{
    console.log('server started')
})
