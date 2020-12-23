const Discord = require("discord.js");
const radiobot = new Discord.Client();
const ytdl = require("ytdl-core");

const token = process.env.BOT_TOKEN;
const queue = new Map();

radiobot.once("ready", () => {
  console.log("Ready!");
});

radiobot.once("reconnecting", () => {
  console.log("Reconnecting!");
});

radiobot.once("disconnect", () => {
  console.log("Disconnect!");
});

radiobot.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send("You need to enter a valid command!");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.radiobot.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    
  if (!serverQueue)
    return message.channel.send("There is no song that I could stop!");
    
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

radiobot.login(token);


// const Discord = require("discord.js");
// const radiobot = new Discord.radiobot();
// const ytdl = require("ytdl-core");

// const prefix = process.env.PREFIX;
// const token = process.env.BOT_TOKEN;

// let ytpl = [
//   "https://www.youtube.com/watch?v=Zzyfcys1aLM&list=PLZyqOyXxaVETqpHhT_c5GPmAPzhJpJ5K7",
//   "https://www.youtube.com/watch?v=fyIcQ1Xl-rs&list=PLxhnpe8pN3TlMilD9JLcwNmjqf2J47cRU",
//   "https://www.youtube.com/watch?v=fPO76Jlnz6c&list=PLGBuKfnErZlDSR8vN4nse7MI_bQqYvopq",
//   "https://www.youtube.com/watch?v=kEGuHdKn0Lc&list=PLZKgz45z8N33pvyfu5RmtRSQG5TMo3RC-",
//   "https://www.youtube.com/watch?v=YdW5-uJqCVY&list=PLLH8sgqaTeYpfT3sb2BVDlgrsoRWj6Mxd",
//   "https://www.youtube.com/watch?v=owft9ZlQFUQ&list=RDowft9ZlQFUQ",
//   "https://www.youtube.com/watch?v=50hSld2HTs8&list=PL3D9DEC41F77E5AEF",
//   "https://www.youtube.com/watch?v=1c7dMmtLYV4&list=PLGgxbfGpTdLkWpmdhSoqycC7sdfX1B1Tp",
//   "https://www.youtube.com/watch?v=EV95Yu6gZSY&list=PL3ABE2FBA2900C03E",
//   "https://www.youtube.com/watch?v=U8H3yxNnaG4&list=PLv1udYiEW0AOpmk4KOiVxlhOpMIZQKBUm",
// ];

// radiobot.on("ready", async () => {
//   console.log(`${radiobot.user.username} is online!`);
//   radiobot.user.setActivity("Brody...", { type: "WATCHING" });
// });

// function getRandomInt(max) {
//   return Math.floor(Math.random() * Math.floor(max));
// }

// radiobot.on("message", async (message) => {
//   // Voice only works in guilds, if the message does not come from a guild,
//   // we ignore it
//   if (!message.guild) return;

//   if (message.content === "!play") {
//     let i = getRandomInt(8);
//     // Only try to join the sender's voice channel if they are in one themselves
//     if (message.member.voice.channel) {
//       const connection = await message.member.voice.channel.join();
//       connection.play(ytdl(ytpl[i], { filter: "audioonly" }));
//     } else {
//       message.reply("You need to join a voice channel first!");
//     }
//   }

//   if (message.content === "!play 1") {
//     if (message.member.voice.channel) {
//       const connection = await message.member.voice.channel.join();
//       connection.play(ytdl(ytpl[0], { filter: "audioonly" }));
//     } else {
//       message.reply("You need to join a voice channel first!");
//     }
//   }

//   if (message.content === "!play 2") {
//     if (message.member.voice.channel) {
//       const connection = await message.member.voice.channel.join();
//       connection.play(ytdl(ytpl[1], { filter: "audioonly" }));
//     } else {
//       message.reply("You need to join a voice channel first!");
//     }
//   }

//   if (message.content === "!play 3") {
//     if (message.member.voice.channel) {
//       const connection = await message.member.voice.channel.join();
//       connection.play(ytdl(ytpl[2], { filter: "audioonly" }));
//     } else {
//       message.reply("You need to join a voice channel first!");
//     }
//   }

//   if (message.content === "!play 4") {
//     if (message.member.voice.channel) {
//       const connection = await message.member.voice.channel.join();
//       connection.play(ytdl(ytpl[3], { filter: "audioonly" }));
//     } else {
//       message.reply("You need to join a voice channel first!");
//     }
//   }

//   if (message.content === "!play 5") {
//     if (message.member.voice.channel) {
//       const connection = await message.member.voice.channel.join();
//       connection.play(ytdl(ytpl[4], { filter: "audioonly" }));
//     } else {
//       message.reply("You need to join a voice channel first!");
//     }
//   }

//   if (message.content === "!play 6") {
//     if (message.member.voice.channel) {
//       const connection = await message.member.voice.channel.join();
//       connection.play(ytdl(ytpl[5], { filter: "audioonly" }));
//     } else {
//       message.reply("You need to join a voice channel first!");
//     }
//   }

//   if (message.content === "!play 7") {
//     if (message.member.voice.channel) {
//       const connection = await message.member.voice.channel.join();
//       connection.play(ytdl(ytpl[6], { filter: "audioonly" }));
//     } else {
//       message.reply("You need to join a voice channel first!");
//     }
//   }

//   if (message.content === "!play 8") {
//     if (message.member.voice.channel) {
//       const connection = await message.member.voice.channel.join();
//       connection.play(ytdl(ytpl[7], { filter: "audioonly" }));
//     } else {
//       message.reply("You need to join a voice channel first!");
//     }
//   }

//   if (message.content === "!play 9") {
//     if (message.member.voice.channel) {
//       const connection = await message.member.voice.channel.join();
//       connection.play(ytdl(ytpl[8], { filter: "audioonly" }));
//     } else {
//       message.reply("You need to join a voice channel first!");
//     }
//   }

//   if (message.content === "!play 10") {
//     if (message.member.voice.channel) {
//       const connection = await message.member.voice.channel.join();
//       connection.play(ytdl(ytpl[9], { filter: "audioonly" }));
//     } else {
//       message.reply("You need to join a voice channel first!");
//     }
//   }
// });

// radiobot.on("message", async (message) => {
//   if (message.author.bot) return;

//   if (
//     message.content === "!Music" ||
//     message.content === "!music"
//   ) {
//     message.channel.send(
//       `
//       Music Options:
//       !play: If user is in a voice channel, Toona will stream one of the playlists from the following options.
//       !play 1: Toona will stream a 90's playlist.
//       !play 2: Toona will stream a Hip-Hop playlist.
//       !play 3: Toona will stream a 90's Rap playlist.
//       !play 4: Toona will stream a Led Zeppelin playlist.
//       !play 5: Toona will stream the Red Dead Redemption 2 Soundtrack playlist.
//       !play 6: Toona will stream a lo-fi Video Game playlist.
//       !play 7: Toona will stream a Legend of Zelda Symphony playlist.
//       !play 8: Toona will stream a Super Smash Bros playlist.
//       !play 9: Toona will stream a Blade-Runner Soundtrack playlist.
//       !play 10: Toona will stream a Blade-Runner 2049 Soundtrack playlist.
//       `
//     );
//   }
// })

// radiobot.on('message', msg => {
//   if (msg.content === "Radio?") {
//     msg.channel.send({ files: ["./Assets/kirby_hi.gif"] });
//   }
// });

// radiobot.login(token);