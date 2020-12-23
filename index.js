const Discord = require("discord.js");
const radiobot = new Discord.Client();
const ytdl = require("ytdl-core");

const prefix = process.env.PREFIX;
const token = process.env.BOT_TOKEN;

radiobot.on("ready", async () => {
  console.log(`${radiobot.user.username} is online!`);
  radiobot.user.setActivity("Brody...", { type: "WATCHING" });
});

radiobot.on("message", async (message) => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content === `${prefix}` + "play") {
    let i = getRandomInt(8);
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      connection.play(ytdl(ytpl[i], { filter: "audioonly" }));
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }

  if (message.content === `${prefix}` + "play 1") {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      connection.play(ytdl(ytpl[0], { filter: "audioonly" }));
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }

  if (message.content === `${prefix}` + "play 2") {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      connection.play(ytdl(ytpl[1], { filter: "audioonly" }));
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }

  if (message.content === `${prefix}` + "play 3") {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      connection.play(ytdl(ytpl[2], { filter: "audioonly" }));
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }

  if (message.content === `${prefix}` + "play 4") {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      connection.play(ytdl(ytpl[3], { filter: "audioonly" }));
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }

  if (message.content === `${prefix}` + "play 5") {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      connection.play(ytdl(ytpl[4], { filter: "audioonly" }));
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }

  if (message.content === `${prefix}` + "play 6") {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      connection.play(ytdl(ytpl[5], { filter: "audioonly" }));
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }

  if (message.content === `${prefix}` + "play 7") {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      connection.play(ytdl(ytpl[6], { filter: "audioonly" }));
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }

  if (message.content === `${prefix}` + "play 8") {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      connection.play(ytdl(ytpl[7], { filter: "audioonly" }));
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }

  if (message.content === `${prefix}` + "play 9") {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      connection.play(ytdl(ytpl[8], { filter: "audioonly" }));
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }

  if (message.content === `${prefix}` + "play 10") {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      connection.play(ytdl(ytpl[9], { filter: "audioonly" }));
    } else {
      message.reply("You need to join a voice channel first!");
    }
  }
});

radiobot.on("message", async (message) => {
  if (message.author.bot) return;

  if (
    message.content === `${prefix}` + "Music" ||
    message.content === `${prefix}` + "music"
  ) {
    message.channel.send(
      `
      Music Options:
      !play: If user is in a voice channel, Chalooby-Bot will stream a random playlist from the following options.
      !play 1: Chalooby-Bot will stream a 90's playlist.
      !play 2: Chalooby-Bot will stream a Hip-Hop playlist.
      !play 3: Chalooby-Bot will stream a 90's Rap playlist.
      !play 4: Chalooby-Bot will stream a Led Zeppelin playlist.
      !play 5: Chalooby-Bot will stream the Red Dead Redemption 2 Soundtrack playlist.
      !play 6: Chalooby-Bot will stream a lo-fi Video Game playlist.
      !play 7: Chalooby-Bot will stream a Legend of Zelda Symphony playlist.
      !play 8: Chalooby-Bot will stream a Super Smash Bros playlist.
      !play 9: Chalooby-Bot will stream a Blade-Runner Soundtrack playlist.
      !play 10: Chalooby-Bot will stream a Blade-Runner 2049 Soundtrack playlist.
      `
    );
  }
})

radiobot.on('message', msg => {
  if (msg.content === "Radio?") {
    msg.channel.send({ files: ["./Assets/kirby_hi.gif"] });
  }
});

radiobot.login(token);