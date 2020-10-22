const Discord = require('discord.js');
const { setTimeout } = require('timers');
const ytdl = require('ytdl-core');
const fs = require('fs');


const client = new Discord.Client();
client.login('Put Token Here');

//used as buffers to make sure it doesn't over ride any the current request wit ha new request
music_buffer = [];
jokes = [];

music_buffer = [];
jokes = [];

//plays music
  client.on('message', async message =>
  {
      if(message.content.includes("?play"))
      {
        message.delete();
        //joins if a member is present 
        if(message.member.voice.channel)
        {
          music_buffer.push(" ")
          
          if(music_buffer.length <=1)
            {
              const connection = await message.member.voice.channel.join()
              const dispatcher = connection.play(ytdl(message.content.substring(6),{filter:'audioonly', highWaterMark: 1<<25 }));
              //pops the buffer so another song can be played when current song is finished 
              dispatcher.on('finish', () => 
              {
                  for(var i = music_buffer.length; i >= 0; i--)
                  {
                    music_buffer.pop();
                  }
              })
            }    
        }
        else
        {
          message.reply("join a voice channel you gonagaga ass")
        }
      }

//rolls dice
    if(message.content.includes('?roll'))
    {
      //used to add up all the die results in teh dice_rolled array
      roll = 0;
      //array used for multiple die storage
      dice_rolled = [];
      //gets the number of die rolled 
      dice_type_loc = message.content.search('d');
      dice_type = message.content.slice(dice_type_loc);
      //turns dice type into and int for the random function
      dice_type_num = parseInt(message.content.slice(dice_type_loc + 1));
      //turns dice count into a number that'll be used in a for loop
      dice_count = parseInt(message.content.substring(6,dice_type_loc));
      
      
      if(dice_count > 99999){message.reply("why")} else 
        {
          
          if(message.content.includes("p"))
            {
              //find the location of the mod number 
              dice_mod = parseInt(message.content.substring(message.content.search('p') + 1));
            
            //gets the dice count that's wanting to be rolled 
            if(dice_count >=1)
            {
              for(var x = 0; x < dice_count;x++)
            {
              dice_roller = Math.floor((Math.random() * dice_type_num) + 1);
              dice_rolled.push(dice_roller)
            }
            //rolls the dice and adds it to the dice_rolled array 
            for(var i = 0; i < dice_rolled.length; i++)
            {
              roll = roll += dice_rolled[i]
            
            }
            //adds the mutliple dice roll and the modifers to the new variable rolled and outputs it 
            if(i = dice_rolled.length){rolled =0; rolled = roll + dice_mod}
            message.reply(rolled);
          }
          else 
          {
            //if there were no multiple die rolled it just rolls one dice and adds the modifier 
            dice_roller = Math.floor((Math.random() * dice_type_num) + 1) + dice_mod;
            message.reply(dice_roller);
          }
        } 
        //used for megative modifiers 
        else if (message.content.includes("m"))
        {
          //find the location of the mod number 
          dice_mod = parseInt(message.content.substring(message.content.search('m') + 1));
           //gets the dice count that's wanting to be rolled
          if(dice_count >=1)
        {
          for(var x = 0; x < dice_count;x++)
        {
          dice_roller = Math.floor((Math.random() * dice_type_num) + 1);
          dice_rolled.push(dice_roller)
        }
        //rolls the dice and adds it to the dice_rolled array 
        for(var i = 0; i < dice_rolled.length; i++)
        {
          roll = roll += dice_rolled[i]
        
        }
        //adds the mutliple dice roll and subtracts modifers to the new variable rolled and outputs it 
        if(i = dice_rolled.length){rolled =0; rolled = roll - dice_mod}
     
            message.reply(rolled);
      }
      else 
      {
         //if there were no multiple die rolled it just rolls one dice and subtracts the modifier 
        dice_roller = Math.floor((Math.random() * dice_type_num) + 1) - dice_mod;
        
        message.reply(dice_roller);
      }
      }
      //used for rolls with no modifiers 
      else if (message.content != 'p' || message.content != 'm')
      {
        //gets the multiple die count
        if(dice_count >=1)
        {
          for(var x = 0; x < dice_count;x++)
        {
          dice_roller = Math.floor((Math.random() * dice_type_num) + 1);
          dice_rolled.push(dice_roller)
        }
        for(var i = 0; i < dice_rolled.length; i++)
        {
          roll = roll += dice_rolled[i]
        
        }
        //adds the total die roll
        if(i = dice_rolled.length){rolled =0; rolled = roll}
        message.reply(rolled);
      }
      else 
      {
        //outputs the die that was rolled once
        dice_roller = Math.floor((Math.random() * dice_type_num) + 1) ;
        message.reply(dice_roller);
      }
      }
    }
    }

//allows you to search any data on wikipedia or dndbeyond
    lookup = message.content.substring(8);
    if(message.content.includes('?search',lookup))
      {
        message.delete()
        lookups = lookup.split(" ").join("_")
        wiki = 'https://en.wikipedia.org/wiki/';
        message.reply(wiki.concat(lookups));
      }   
    
    dnd_lookup = message.content.substring(5);
    if(message.content.includes('?dnd'))
    {
      message.delete()
      dnd_lookups = dnd_lookup.split(" ").join("%20")
      dnd = 'https://www.dndbeyond.com/search?q='
      message.reply(dnd.concat(dnd_lookups))
    }
 
//series of one word commands
    switch(message.content)
    {
      case '?joke':
        //tells a random joke from .txt files 
        message.delete();
        const data_joke_q = fs.readFileSync('joke_q.txt', 'UTF-8');
        const data_joke_a = fs.readFileSync('joke_a.txt', 'UTF-8');
        //pushes each line of the .txt file into an array to be read and randomized 
        let lines_q = data_joke_q.split(/\r?\n/);
        let lines_a = data_joke_a.split(/\r?\n/);
        jokes.push(' ')
        if(jokes <= 1)
        {
          rand_num = Math.floor((Math.random() * lines_q.length));
          message.reply(lines_q[rand_num])
          setTimeout(function(){message.reply(lines_a[rand_num])},7500)
          setTimeout(function(){for(var x = jokes.length; x >= 0; x--) jokes.pop()},9750)
        }
      break;
      //pops the buffer so another song can be played 
      case '?stop': 
        message.delete();
        message.member.voice.channel.leave();
        for(var i = music_buffer; i >= 0; --i)
          {  
            music_buffer.pop()
          }
      break;
      //takes the channel id where the the message was sent and renames the new text channel to that
      case '?clean':
          message.channel.delete()
          message.guild.channels.create(message.channel.name)
      break;
      //similar to the joke function
      case '?motivate':
          message.delete();
          const motivation = fs.readFileSync('motivate.txt', 'UTF-8');
          let motivate = motivation.split(/\r?\n/);
          motivates_num = Math.floor((Math.random() * motivate.length));
          message.reply(motivate[motivates_num])
      break;

      case '?help':
          message.delete()
          message.reply(fs.readFileSync('help.txt', 'UTF-8'))
      break;
      //checks to see if there's any voice channels named "Shadow Realm", gets the id of the channel if named that, and them joins it and plays a video
      case '?perish':
          message.delete()
          if(message.member.hasPermission('ADMINISTRATOR'))
          {
            await message.member.client.channels.cache.get(message.guild.channels.cache.find(channel => channel.name === "Shadow Realm").id).join().then(connection => { const dispatcher = connection.play(ytdl('https://www.youtube.com/watch?v=xkzL8ts1PG0',{filter:'audioonly', highWaterMark: 1<<25 }));});
            for(var i = music_buffer; i >= 0; --i)
            {  
              music_buffer.pop()
            }
          }
      break;
    }
  })
