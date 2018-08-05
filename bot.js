const Discord = require('discord.js');
const client = new Discord.Client();
 const prefix = "!";
client.on('ready', () => {
    client.user.setStatus("dnd");
 
 });
client.login(process.env.BOT_TOKEN);
//test

client.on('message', msg => {

    if (msg.content == '!join') {
        if (msg.member.voiceChannel) {

     if (msg.member.voiceChannel.joinable) {
         msg.member.voiceChannel.join();
     }
    }
}
});

client.on('message',async message => {
  if(message.content.startsWith(prefix + "setvoice")) {
  if(!message.guild.member(message.author).hasPermissions('MANAGE_CHANNELS')) return message.reply(':x: **ليس لديك الصلاحيات الكافية**');
  if(!message.guild.member(client.user).hasPermissions(['MANAGE_CHANNELS','MANAGE_ROLES_OR_PERMISSIONS'])) return message.reply(':x: **ليس معي الصلاحيات الكافية**');
  message.channel.send(':white_check_mark:| **تم عمل الروم بنجاح**');
  message.guild.createChannel(`Voice Online : ${message.guild.members.filter(m => m.voiceChannel).size}.` , 'voice').then(c => {
    console.log(`Voice online channel setup for guild: \n ${message.guild.name}`);
    c.overwritePermissions(message.guild.id, {
      CONNECT: false,
      SPEAK: false
    });
    setInterval(() => {
      c.setName(`Voice Online : ${message.guild.members.filter(m => m.voiceChannel).size}.`)
    },1000);
  });
  }
});

client.on('message', async message => {
  let args = message.content.split(" ");
  if(message.content.startsWith(prefix + "mute")) {
    if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply('أنت لا تملك الخصائص اللازمة . يجب توفر خاصية `Manage Roles`').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });

    if(!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return message.reply('أنا لا املك الخصائص الكافية . يلزم خصائص `Manage Roles` للقيام بهذا الامر').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });

    let mention = message.mentions.members.first();
    if(!mention) return message.reply('الرجاء منشن شخص لاعطأه ميوت كتآبي').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });

    if(mention.highestRole.position >= message.guild.member(message.author).highestRole.positon) return message.reply('**لا يمكنك اعطاء لميوت شخص رتبته اعلى منك**').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });
    if(mention.highestRole.positon >= message.guild.member(client.user).highestRole.positon) return message.reply('**لا يمكنني اعطاء ميوت لشخص رتبته اعلى مني**').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });
    if(mention.id === message.author.id) return message.reply('لا يمكنك اعطاء ميوت  لنفسك').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });

    let duration = args[2];
    if(!duration) return message.reply('حدد وقت زمني لفك الميوت عن الشخص').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });

    if(isNaN(duration)) return message.reply('حدد وقت زمني صحيح').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });

    let reason = message.content.split(" ").slice(3).join(" ");
    if(!reason) reason = "غير محدد";

    let thisEmbed = new Discord.RichEmbed()
    .setAuthor(mention.user.username, mention.user.avatarURL)
    .setTitle('تم اعطائك ميوت بسيرفر')
    .setThumbnail(mention.user.avatarURL)
    .addField('# - السيرفر',message.guild.name,true)
    .addField('# - تم اعطائك ميوت بواسطة',message.author,true)
    .addField('# - السبب',reason)

    let role = message.guild.roles.find('name', 'Muted') || message.guild.roles.get(r => r.name === 'Muted');
    if(!role) try {
      message.guild.createRole({
        name: "Muted",
        permissions: 0
      }).then(r => {
        message.guild.channels.forEach(c => {
          c.overwritePermissions(r , {
            SEND_MESSAGES: false,
            READ_MESSAGES_HISTORY: false,
            ADD_REACTIONS: false
          });
        });
      });
    } catch(e) {
      console.log(e.stack);
    }
    mention.addRole(role).then(() => {
      mention.send(thisEmbed);
      message.channel.send(`${mention.user.username} Muted!`);
      mention.setMute(true);
    });
    setTimeout(() => {
      if(duration === 0) return;
      if(!mention.has.roles(role)) return;
      mention.setMute(false);
      mention.removeRole(role);
      message.channel.send(`${mention.user.username} **Unmuted!**`);
    },duration * 60000);
  } else if(message.content.startsWith(prefix + "unmute")) {
    let mention = message.mentions.members.first();
    let role = message.guild.roles.find('name', 'Muted') || message.guild.roles.get(r => r.name === 'Muted');
    if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply('أنت لا تملك الخصائص اللازمة . يجب توفر خاصية `Manage Roles`').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });

    if(!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return message.reply('أنا لا املك الخصائص الكافية . يلزم خصائص `Manage Roles` للقيام بهذا الامر').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });

    if(!mention) return message.reply('منشن الشخص لفك الميوت عنه').then(msg => {
      msg.delete(3500);
      message.delete(3500);
    });

      mention.removeRole(role);
      mention.setMute(false);
      message.channel.send(`${mention.user.username} **Unmuted!**`);
  }
});

client.on(`message`, message => {
    var args = message.content.split(/[ ]+/)
    if(message.content.includes(`discord.gg`)){
    message.delete()
    return message.reply(`ممنوع ذكر آسم او رابط دسكورد \ Discord.`)
}
});

  client.on('message', async message => {
  if(message.content.startsWith(prefix + "broadcast")) {
    let i = client.users.size;
    if(message.author.id !== '449506099268419595') return message.channel.send('❎ » هذا الأمر مخصص لصاحب البوت فقط');
    var args = message.content.split(' ').slice(1).join(' ');
    if(!args) return message.channel.send('❎ » يجب عليك كتابة الرسالة')
    setTimeout(() => {
      message.channel.send(`تم الارسال لـ ${i} شخص`)
    }, client.users.size * 500);
    client.users.forEach(s => {
      s.send(args).catch(e => i--);
    });
  }
});

  client.on('message', message => {
    if(message.content.startsWith(prefix + 'move all')) {
     if (!message.member.hasPermission("MOVE_MEMBERS")) return message.channel.send('لايوجد لديك صلاحية سحب الأعضاء');
       if(!message.guild.member(client.user).hasPermission("MOVE_MEMBERS")) return message.reply("لايوجد لدي صلاحية السحب");
    if (message.member.voiceChannel == null) return message.channel.send(`الرجاء الدخول لروم صوتي`)
     var author = message.member.voiceChannelID;
     var m = message.guild.members.filter(m=>m.voiceChannel)
     message.guild.members.filter(m=>m.voiceChannel).forEach(m => {
     m.setVoiceChannel(author)
     })
     message.channel.send(`تم سحب جميع الأعضاء الي الروم الصوتي حقك.`)


     }
       });

client.on('message', msg =>{
    let message=msg;
    if(message.content.startsWith("!bc")){
        var args = message.content.split(' ').slice(1).join(' ');
    msg.guild.members.forEach(m=>{
        m.send(args.replace(/[user]/g,m)).catch();
    if(message.attachments.first()){
m.sendFile(message.attachments.first().url).catch();
    }
    })    ;
    }
});

  client.on('ready', () => {
     client.user.setActivity("Special Thank You.",{type: 'WATCHING'});

});

client.on('message', msg => {
    if(msg.content === '!help') {
        
        if(!msg.channel.guild) return msg.reply("هذا الأمر للسيرفرات فقط");
       
if (msg.author.bot) return;
  const embed = new Discord.RichEmbed()
            .setColor("FFFFFF")
            .setThumbnail(msg.author.avatarURL)
                                .setTitle("-")
            .setDescription(`
Command's :
-
!mute - لأعطاء شخص ميوت كتابي
-
!unmute - لفك الميوت الكتابي
-
!setvoice - لانشاء روم عدد المتصلين بالرومات
-
!bc - لارسال رسالة لجميع الموجودين بالسيرفر
-
!join - لدخول البوت معك بالروم الصوتي


All Right are save \ جميع الحقوق محفوظه
`)


        msg.author.sendEmbed(embed)

    }

});
