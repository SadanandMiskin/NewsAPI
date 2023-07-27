const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()


var articles = []
var date = new Date()
 
    date = date.toDateString()

async function fetchArticles() {
    articles = []
   

await  axios.get('https://indianexpress.com/todays-paper/')
    .then((response)=>{
    const $ = cheerio.load(response.data)
     $('.ev-meter-content ul li.evan ').each(function() {
        var image = $(this).find('img').attr('src')
        var title = $(this).find('strong a').text()
        var url = $(this).find('a').attr('href')
        var source = 'indianexpress'
        articles.push({title,image,url,source})
     })
      
    })

await axios.get('https://timesofindia.indiatimes.com/news')
    .then((response)=>{
        const $ = cheerio.load(response.data)
        $('.main-content .listing4.clearfix ul.cvs_wdt.clearfix li').each(function() {
            var image = $(this).find('a img').attr('src')
            var title = $(this).find('span.w_tle').text()
            var url = 'https://timesofindia.indiatimes.com/news'
             url += $(this).find('a').attr('href')
            var description = $(this).find('span.w_desc').text()
            var source = 'timesofindia'
            // articles.push({title,description ,image,url,source})
            if(description == '') articles.push({title,image,url,source})
            else articles.push({title,description ,image,url,source})
        })
       
    })
    
await axios.get('https://zeenews.india.com/')
        .then((response)=>{
            const $ = cheerio.load(response.data)
            $('.small-thumb-list ,.medium-thumb-list').each(function(){
                var url = 'https://zeenews.india.com/'
                var image = url+$(this).find('a').attr('href')
                var title = $(this).find('.w-100 .news_description,.story_news_description a').text()
                var url = 'https://zeenews.india.com/'
                url+= $(this).find('.w-100 .news_description a,.story_news_description a').attr('href')
                source = "zeenews"
                articles.push({title,image,url,source})
            })
            
        })

await axios.get('https://www.hindustantimes.com/')
            .then((response)=>{
                const $ = cheerio.load(response.data)
                $('.cartHolder').each(function(){
                    var url = 'https://www.hindustantimes.com'
                    var image = $(this).find('figure span a img').attr('src')
                    var title = $(this).find('h3 a').text()
                     url += $(this).find('h3 a').attr('href')
                    source = 'hindustantimes'
                    if (url.includes('ottplay.com')) {
                        url = $(this).find('h3 a').attr('href');
                    }
                    
                    articles.push({title,image,url,source})
                })
            })
await axios.get('https://www.thehindu.com/latest-news/')
            .then((response)=>{
                const $ = cheerio.load(response.data)
                $('.timeline-with-img li').each(function () {
                 const image = $(this).find('.picture img').attr('src');
                 const title = $(this).find('.title a').text();
                const url = $(this).find('.title a').attr('href');
                var source = 'thehindu'
                articles.push({title,image,url,source})
                })
                
            })
            
await axios.get('https://www.bhaskar.com/')
            .then((response) => {
                const $ = cheerio.load(response.data)
                $('ul').find('div:has(h3 span)').each((index, element) => {
                    const title = $(element).find('h3 span').text().trim();
                    const image = $(element).find('img').attr('src');
                    var url = 'https://www.bhaskar.com/'
                     url+= $(element).find('a').attr('href');
                    const source = 'dainikbhaskar'
                    articles.push({title,image,url,source})
                })
            })
    .catch((err)=> console.log(err))
}


// app.get('/news/:newspaperId',(req,res)=>{
//     const nId = req.params.newspaperId
   
//     var articlesByName = [] 
//     articlesByName = articles.filter(article=> nId === article.source)
    
// console.log({nId,articlesByName})

//     res.json({nId,articlesByName})
    
// })




// app.get('/news',async (req,res)=>{
//     res.json({date, articles})
// })

async function fecthApiMiddleware(req,res,next){
  if(articles.length == 0){
    try{
        await fetchArticles()
        req.articles = articles
        next()
    }
    catch(err){
        console.log(err)
    }

  }
  else{
    req.articles = articles
    next()
  }
}

module.exports = fecthApiMiddleware
